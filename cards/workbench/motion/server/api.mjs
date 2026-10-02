import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync,fork} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {cardById,assetPaths} from '../src/model.mjs';
import {validateAll} from '../src/schema.mjs';
import {createDesktopBridge} from './desktop.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const output=path.join(root,'out/motion');
const uploads=path.join(root,'out/motion-uploads');
export function createApi(server){
  const jobs=new Map();let running=false;
  const desktop=createDesktopBridge(root);
  function json(res,value,status=200){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(value));}
  function sendFile(req,res,file){if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end();return;}
    const size=fs.statSync(file).size;let start=0,end=size-1;const range=req.headers.range;
    if(range){const m=/^bytes=(\d+)-(\d*)$/.exec(range);if(!m||Number(m[1])>=size){res.statusCode=416;res.end();return;}start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),size-1):size-1;if(end<start){res.statusCode=416;res.end();return;}res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);}
    res.setHeader('Accept-Ranges','bytes');res.setHeader('Content-Length',end-start+1);
    res.setHeader('Content-Type',({'.mp4':'video/mp4','.webm':'video/webm','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.wav':'audio/wav','.mp3':'audio/mpeg','.m4a':'audio/mp4','.json':'application/json','.zip':'application/zip'})[path.extname(file)]||'application/octet-stream');
    if(req.method==='HEAD')return res.end();fs.createReadStream(file,{start,end}).pipe(res);
  }
  async function readBody(req,max){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>max)throw new Error('请求超过大小限制');chunks.push(chunk);}return Buffer.concat(chunks);}
  server.middlewares.use(async(req,res,next)=>{
    const url=new URL(req.url,'http://localhost');
    try{
      if(req.method==='POST'&&url.pathname.startsWith('/api/')){
        if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`)return json(res,{error:'拒绝跨站写入'},403);
      }
      if(url.pathname==='/api/desktop'&&req.method==='GET')return json(res,desktop.capability(req));
      if(url.pathname==='/api/desktop/install'&&req.method==='POST'){
        if(req.headers['content-type']!=='application/json')return json(res,{error:'需要 JSON 安装确认'},415);
        return json(res,desktop.start(req,JSON.parse((await readBody(req,4096)).toString())),202);
      }
      const installation=/^\/api\/desktop\/install\/([a-f0-9-]{36})$/.exec(url.pathname);
      if(installation&&req.method==='GET')return json(res,desktop.status(req,installation[1]));
      if(url.pathname.startsWith('/previewlib/')&&['GET','HEAD'].includes(req.method)){
        const rel=decodeURIComponent(url.pathname.slice(12));const file=path.resolve(root,'gallery/media',rel);if(!file.startsWith(path.join(root,'gallery/media')+path.sep))return json(res,{error:'无效路径'},400);return sendFile(req,res,file);
      }
      if(url.pathname.startsWith('/uploads/')&&['GET','HEAD'].includes(req.method)){
        const name=url.pathname.slice(9);if(!/^[a-f0-9-]+\.(mp4|webm|png|jpg|jpeg|webp|wav|mp3|m4a|ogg)$/.test(name))return json(res,{error:'无效素材'},400);return sendFile(req,res,path.join(uploads,name));
      }
      const download=/^\/exports\/([a-f0-9-]{36})\/(film.mp4|delivery.zip|project.json)$/.exec(url.pathname);
      if(download&&['GET','HEAD'].includes(req.method))return sendFile(req,res,path.join(output,download[1],download[2]));
      const status=/^\/api\/export\/([a-f0-9-]{36})$/.exec(url.pathname);
      if(status&&req.method==='GET'){
        if(jobs.has(status[1]))return json(res,jobs.get(status[1]));
        const ready=path.join(output,status[1],'READY.json');if(fs.existsSync(ready))return json(res,JSON.parse(fs.readFileSync(ready)));return json(res,{error:'找不到导出任务'},404);
      }
      if(url.pathname==='/api/upload'&&req.method==='POST'){
        if(req.headers['content-type']!=='application/octet-stream')return json(res,{error:'需要二进制素材'},415);
        const ext=path.extname(url.searchParams.get('name')||'').toLowerCase();if(!['.mp4','.webm','.png','.jpg','.jpeg','.webp','.wav','.mp3','.m4a','.ogg'].includes(ext))throw new Error('不支持该文件类型');
        const data=await readBody(req,50*1024*1024);if(!data.length)throw new Error('空文件');fs.mkdirSync(uploads,{recursive:true});const name=randomUUID()+ext;const file=path.join(uploads,name);fs.writeFileSync(file,data,{flag:'wx'});
        const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type,width,height','-of','json',file],{encoding:'utf8',timeout:15000});
        if(probe.status!==0)throw new Error('素材无法解码，未加入工程');const info=JSON.parse(probe.stdout);const image=['.png','.jpg','.jpeg','.webp'].includes(ext);const type=image?'image':info.streams.some(s=>s.codec_type==='video')?'video':'audio';
        const seconds=Number(info.format?.duration);if(!image&&(!Number.isFinite(seconds)||seconds<=0))throw new Error('媒体时长无效');
        return json(res,{type,src:`uploads/${name}`,frames:image?150:Math.min(1800,Math.floor(seconds*30))});
      }
      if(url.pathname==='/api/export'&&req.method==='POST'){
        if(req.headers['content-type']!=='application/json')return json(res,{error:'需要 JSON 工程'},415);
        if(running)return json(res,{error:'已有导出正在运行，请稍后重试'},409);if(jobs.size>=20)throw new Error('本轮已到 20 次导出，请管理员检查并重启工作台。');
        const {project,kind}=JSON.parse((await readBody(req,2*1024*1024)).toString());if(!['mp4','jianying'].includes(kind))throw new Error('未知导出格式');validateAll(project);
        const id=randomUUID();const job={id,status:'rendering',progress:'准备当前多轨工程…',desktopValidated:false};jobs.set(id,job);running=true;
        const worker=fork(fileURLToPath(new URL('./worker.mjs',import.meta.url)),[],{stdio:['ignore','ignore','pipe','ipc']});
        let detail='';worker.stderr.on('data',chunk=>{detail=(detail+String(chunk)).slice(-2000);});
        worker.on('message',message=>{if(message.type==='progress')job.progress=message.progress;else if(message.type==='ready')Object.assign(job,{status:'ready',...message.result});else if(message.type==='failed')Object.assign(job,{status:'failed',error:message.error});});
        worker.once('error',error=>{Object.assign(job,{status:'failed',error:error.message});running=false;});
        worker.once('exit',code=>{if(job.status==='rendering')Object.assign(job,{status:'failed',error:`渲染进程意外退出 (${code})${detail?'；'+detail:''}`});running=false;});
        worker.send({project,kind,id,root,output,uploads});
        return json(res,job,202);
      }
      if(url.pathname.startsWith('/api/'))return json(res,{error:'未知 API'},404);
      next();
    }catch(error){json(res,{error:error.message||'操作失败'},400);}
  });
}
