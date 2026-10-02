import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {endFrame,cardById,assetPaths} from '../src/model.mjs';
import {validateAll} from '../src/schema.mjs';
const probe=file=>JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type,width,height,nb_frames','-of','json',file],{encoding:'utf8',timeout:15000}));
export async function exportProject(project,kind,id,root,output,uploads,progress){
  validateAll(project);const out=path.join(output,id);fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'project.json'),JSON.stringify(project,null,2));
  const publicDir=path.join(out,'render-public');fs.cpSync(path.join(root,'public'),publicDir,{recursive:true});
  const clips=project.tracks.filter(t=>!t.hidden).flatMap(t=>t.clips);
  const localPath=src=>src.startsWith('uploads/')?path.join(uploads,src.slice(8)):src.startsWith('previewlib/')?path.join(root,'gallery/media',src.slice(11)):path.join(root,'public',src);
  const files=new Set(clips.flatMap(c=>[...assetPaths(c.props),...(cardById[c.cardId]&&!cardById[c.cardId].native?[cardById[c.cardId].media]:[])]));
  for(const src of files){const file=localPath(src);if(!fs.existsSync(file)||!fs.statSync(file).isFile())throw new Error(`缺少本机素材 ${src}`);const dest=path.resolve(publicDir,src);if(!dest.startsWith(publicDir+path.sep))throw new Error('无效素材路径');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(file,dest);}
  for(const clip of clips){const card=cardById[clip.cardId];if(['audio','video'].includes(clip.cardId)||(card&&!card.native)){
    const src=card?.media||clip.props.src;const seconds=Number(probe(localPath(src)).format.duration);if((clip.in+clip.duration*clip.speed)/30>seconds+.04)throw new Error(`素材范围超出源视频／音频长度：${src}；请缩短时长或减小裁入。`);
  }}
  if(kind==='jianying'){
    let textSeen=false;
    for(const track of project.tracks.filter(t=>!t.hidden))for(const c of track.clips){if(c.cardId==='text')textSeen=true;else if(c.cardId!=='audio'&&textSeen)throw new Error('剪映交付要求文字轨在所有画面轨上方；请将字幕轨移到最上方后重试。');}
  }
  const browserExecutable=process.env.DATAMAGIC_RENDER_BROWSER;
  progress('编译共同的预览／渲染组件…');
  // publicDir is per-export: do not cache a bundle tied to a previous job's assets.
  const serveUrl=await bundle({entryPoint:path.join(root,'workbench/motion/src/render.tsx'),publicDir});
  const common={serveUrl,browserExecutable};
  const render=async(p,file,muted=false)=>{const inputProps={project:p};const composition=await selectComposition({...common,id:'DataMagic-Motion',inputProps});await renderMedia({...common,composition,inputProps,codec:'h264',outputLocation:file,concurrency:2,muted,onProgress:s=>progress(`渲染 ${path.basename(file)}：${Math.round(s.progress*100)}%`)});return composition;};
  const film=path.join(out,'film.mp4');const composition=await render(project,film);
  const report=probe(film);const video=report.streams.find(s=>s.codec_type==='video');if(Number(video?.nb_frames)!==endFrame(project)||video.width!==project.width||video.height!==project.height)throw new Error('输出画幅／帧数与时间线不一致');
  const result={id,status:'ready',video:`/exports/${id}/film.mp4`,project:`/exports/${id}/project.json`,desktopValidated:false,frames:endFrame(project)};
  if(kind==='jianying'){
    const pkg=path.join(out,'package');fs.mkdirSync(path.join(pkg,'media'),{recursive:true});
    const plateProject=structuredClone(project);for(const track of plateProject.tracks){track.clips=track.clips.filter(c=>!['text','audio'].includes(c.cardId));for(const c of track.clips)if(c.cardId==='video'||(cardById[c.cardId]&&!cardById[c.cardId].native))c.volume=0;}
    // Keep the original endpoint when the last clip is a caption or audio.
    const total=endFrame(project);plateProject.tracks.push({id:'plate-endpoint',name:'Endpoint',hidden:true,clips:[{...clips[0],id:'plate-endpoint-clip',start:0,duration:total}]});
    if(!clips.length)throw new Error('不能交付空工程');
    const temporary=path.join(out,'plate-render.mp4');const plateComp=await render(plateProject,temporary,true);
    const plate=path.join(pkg,'media/plate.mp4');execFileSync('ffmpeg',['-v','error','-i',temporary,'-map','0:v:0','-c:v','copy','-an','-movflags','+faststart',plate]);
    await renderStill({...common,composition:plateComp,inputProps:{project:plateProject},frame:Math.min(total-1,30),output:path.join(pkg,'cover.png')});
    const cuts=[...new Set([0,total,...clips.filter(c=>c.cardId!=='audio'&&c.cardId!=='text').flatMap(c=>[c.start,c.start+c.duration])])].sort((a,b)=>a-b);
    const manifest={version:1,recipe:'DataMagic-Multitrack',fps:30,width:project.width,height:project.height,totalFrames:total,assets:[{id:'plate',path:'media/plate.mp4',type:'video'}],shots:cuts.slice(0,-1).map((start,i)=>({id:`shot-${i+1}`,startFrame:start,endFrame:cuts[i+1],sourceStartFrame:start,asset:'plate'})),captions:[],audio:[],textStyle:{size:4.8,transformX:0,transformY:0,maxLineWidth:.9},timingAuthority:'edited-workbench-timeline',capabilities:{editable:['shot-order','shot-trim','captions','audio'],baked:['chart-data','chart-labels','chart-animation','visual-compositing']}};
    for(const [i,c] of clips.entries()){
      if(c.cardId==='text'){manifest.captions.push({startFrame:c.start,endFrame:c.start+c.duration,text:c.props.text,track:`Caption ${i+1}`,style:{size:c.props.size/10,transformX:c.x/(project.width/2),transformY:-c.y/(project.height/2),maxLineWidth:.9,color:c.props.color,opacity:c.opacity,scale:c.scale}});}
      const card=cardById[c.cardId];if(c.cardId==='audio'||c.cardId==='video'||(card&&!card.native)){
        const src=card?.media||c.props.src;const info=probe(localPath(src));if(!info.streams.some(s=>s.codec_type==='audio'))continue;
        const name=`media/audio-${i}.wav`;const audio=path.join(pkg,name);
        // Bake only this clip's trim/speed/volume into a separate audio asset; it remains an editable audio track.
        const tempo=[];let speed=c.speed;while(speed>2){tempo.push('atempo=2');speed/=2;}while(speed<.5){tempo.push('atempo=0.5');speed/=.5;}tempo.push(`atempo=${speed}`,`volume=${c.volume}`);
        execFileSync('ffmpeg',['-v','error','-ss',String(c.in/30),'-t',String(c.duration*c.speed/30),'-i',localPath(src),'-vn','-af',tempo.join(','),'-ar','48000','-ac','2',audio]);
        const frames=Math.min(c.duration,Math.floor(Number(probe(audio).format.duration)*30));if(frames<1)continue;
        const asset=`audio-${i}`;manifest.assets.push({id:asset,path:name,type:'audio'});manifest.audio.push({asset,startFrame:c.start,endFrame:c.start+frames,sourceStartFrame:0,volume:1});
      }
    }
    manifest.captions.sort((a,b)=>a.startFrame-b.startFrame);
    for(const asset of manifest.assets){const bytes=fs.readFileSync(path.join(pkg,asset.path));asset.bytes=bytes.length;asset.sha256=crypto.createHash('sha256').update(bytes).digest('hex');}
    fs.writeFileSync(path.join(pkg,'manifest.json'),JSON.stringify(manifest,null,2));fs.copyFileSync(path.join(out,'project.json'),path.join(pkg,'project.json'));fs.copyFileSync(film,path.join(pkg,'preview.mp4'));
    for(const [src,dest] of [['jianying_draft.py','draft_tool.py'],['jianying_install.py','jianying_install.py'],['jianying-requirements.txt','requirements.txt'],['Open-in-Jianying.command','Open-in-Jianying.command']])fs.copyFileSync(path.join(root,'scripts',src),path.join(pkg,dest));fs.chmodSync(path.join(pkg,'Open-in-Jianying.command'),0o755);
    fs.writeFileSync(path.join(pkg,'README.txt'),'DataMagic 多轨剪映交付包\nMac：退出剪映，双击 Open-in-Jianying.command，确认后自动生成新草稿并打开剪映。\n首次需要 Python 3.10+；依赖仅装在包内的隔离环境，之后可复用。\n系统下载安全提示可能拦截双击，必要时用右键打开或交给本机 Agent 执行，不关闭系统安全保护。\n本机工作台用户直接点击“发送到剪映”，不需要下载、解压或敲命令。\n设备字段仅在本机从可读旧草稿取得，无可读旧草稿时会中止。\n文字和音频独立可改，图表与画面图层为底片；数据在工作台修改。\n实际 Mac 剪映打开和导出尚需验收，不保证所有版本兼容。\n');
    execFileSync('python3',['-m','zipfile','-c',path.join(out,'delivery.zip'),pkg]);result.package=`/exports/${id}/delivery.zip`;
  }
  fs.writeFileSync(path.join(out,'READY.json'),JSON.stringify(result,null,2));progress('导出完成');return result;
}
