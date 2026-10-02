import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';

export function isLocalRequest(req){
  const peer=req.socket?.remoteAddress;
  let host;try{host=new URL(`http://${req.headers.host}`).hostname;}catch{return false;}
  return ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(peer)&&['localhost','127.0.0.1','[::1]'].includes(host);
}
export function desktopCapability(req,platform=process.platform){
  const local=isLocalRequest(req),canInstall=local&&platform==='darwin';
  return {platform,local,canInstall,reason:canInstall?'本机 Mac：可生成草稿并打开剪映。':!local?'这是服务器工作台，不能直接写入你的 Mac；请在 Mac 上运行本机工作台，或下载包后双击安装。':'发送到剪映目前需要在本机 Mac 工作台使用。'};
}

export function createDesktopBridge(root,{platform=process.platform,spawnProcess=spawn}={}){
  const token=randomUUID(),jobs=new Map();let busy=false;
  function capability(req){return {...desktopCapability(req,platform),token:isLocalRequest(req)?token:undefined};}
  function authorize(req,body){
    if(!isLocalRequest(req))throw new Error('只允许本机连接安装剪映草稿，不接受服务器或远程连接。');
    if(platform!=='darwin')throw new Error('请在接收者 Mac 上运行本机工作台。');
    if(req.headers.origin!==`http://${req.headers.host}`||body.token!==token||body.confirm!==true)throw new Error('需要本机页面确认后才能安装，不接受跨站或未确认的请求。');
  }
  function start(req,body){
    authorize(req,body);if(busy)throw new Error('已有剪映安装正在运行，请等待完成。');
    if(!/^[a-f0-9-]{36}$/.test(body.exportId||''))throw new Error('无效导出编号');
    const out=path.join(root,'out/motion',body.exportId),bundle=path.join(out,'package');
    if(!fs.existsSync(path.join(out,'READY.json'))||!fs.existsSync(path.join(bundle,'manifest.json')))throw new Error('需要先完成剪映包导出，未完成的包不能安装。');
    const id=randomUUID(),job={id,status:'installing',progress:'检查本机剪映与交付包…',desktopValidated:false};jobs.set(id,job);busy=true;
    const label=JSON.parse(fs.readFileSync(path.join(out,'project.json'))).name;
    const args=[path.join(root,'scripts/jianying_install.py'),'--bundle',bundle,'--runtime',path.join(root,'out/jianying-runtime'),'--label',label,'--yes','--json'];
    if(process.env.DATAMAGIC_JIANYING_DRAFT_ROOT)args.push('--draft-root',process.env.DATAMAGIC_JIANYING_DRAFT_ROOT);
    if(process.env.DATAMAGIC_JIANYING_DONOR)args.push('--donor',process.env.DATAMAGIC_JIANYING_DONOR);
    let child;try{child=spawnProcess('python3',args,{stdio:['ignore','pipe','pipe']});}catch(error){busy=false;job.status='failed';job.error=error.message;return job;}
    let pending='';child.stdout.on('data',chunk=>{pending+=String(chunk);const lines=pending.split('\n');pending=lines.pop();for(const line of lines){try{const message=JSON.parse(line);if(message.type==='progress')job.progress=message.message;else if(message.status==='installed')Object.assign(job,message);else if(message.status==='failed')Object.assign(job,{status:'failed',error:message.message});}catch{}}});
    // Never return Python stderr: it could contain recipient device fields or mirror credentials.
    child.stderr.on('data',()=>{});
    child.once('error',()=>{busy=false;Object.assign(job,{status:'failed',error:'找不到可用 Python 3.10+，请安装后重试。'});});
    child.once('exit',code=>{busy=false;if(job.status==='installing')Object.assign(job,{status:'failed',error:`剪映安装未完成 (${code})；请检查本机 Python、剪映是否退出及可读旧草稿。`});});
    return job;
  }
  function status(req,id){if(!isLocalRequest(req))throw new Error('本机草稿状态仅允许本机查看。');const job=jobs.get(id);if(!job)throw new Error('找不到安装任务');return job;}
  return {capability,start,status};
}
