import React,{useState,useEffect,useRef} from 'react';
import {Player,type PlayerRef} from '@remotion/player';
import {MotionComposition} from './Composition';
import {cards,cardById,newProject,makeClip,endFrame,splitClip,trimLeft,snap,createId} from './model.mjs';
import {validateAll,validateProps} from './schema.mjs';
import './style.css';

const KEY='datamagic-motion-project-v2';
const uid=createId;
function initial(){try{const saved=localStorage.getItem(KEY);if(saved)return validateAll(JSON.parse(saved));}catch{}const p=newProject();const card=cardById[new URLSearchParams(location.search).get('card')||''];if(card){p.tracks[0].clips=[makeClip(card)];p.width=card.width;p.height=card.height;}return p;}
function saveFile(name:string,value:any){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function textClip(start:number){return {id:uid(),cardId:'text',start,duration:90,in:0,speed:1,opacity:1,scale:1,x:0,y:300,volume:1,props:{text:'输入你的讲解字幕',size:48,color:'#ffffff'}};}
class Boundary extends React.Component<any,{error:string}>{state={error:''};static getDerivedStateFromError(error:Error){return {error:error.message};}render(){return this.state.error?<div className="preview-error">预览参数错误：{this.state.error}<p>请撤销或修正数据后重新预览。</p></div>:this.props.children;}}

function PropsEditor({clip,onChange,onError}:any){
  const card=cardById[clip.cardId];
  const properties=card?.schema?.properties||Object.fromEntries(Object.entries(clip.props).map(([key,value])=>[key,{type:typeof value==='number'?'number':'string'}]));
  const [draft,setDraft]=useState(JSON.stringify(clip.props,null,2));
  useEffect(()=>setDraft(JSON.stringify(clip.props,null,2)),[clip.props]);
  function commit(key:string,value:any){try{const props={...clip.props,[key]:value};validateProps(clip.cardId,props);onChange(props);}catch(error:any){onError(error.message);}}
  return <><div className="schema-fields">{Object.entries(properties).filter(([key])=>key in clip.props).map(([key,spec]:any)=>{
    const value=clip.props[key];const complex=typeof value==='object';
    return <label key={key}>{key}{complex?<textarea aria-label={`参数 ${key}`} key={JSON.stringify(value)} defaultValue={JSON.stringify(value,null,2)} rows={5} onBlur={e=>{try{commit(key,JSON.parse(e.target.value));}catch(error:any){onError(error.message);}}}/>:spec.enum?<select aria-label={`参数 ${key}`} value={value} onChange={e=>commit(key,e.target.value)}>{spec.enum.map((v:any)=><option key={v}>{v}</option>)}</select>:typeof value==='boolean'?<input type="checkbox" checked={value} onChange={e=>commit(key,e.target.checked)}/>:<input aria-label={`参数 ${key}`} key={String(value)} defaultValue={value} type={typeof value==='number'?'number':/^#[0-9a-f]{6}$/i.test(String(value))?'color':'text'} step="any" min={spec.minimum} max={spec.maximum} maxLength={spec.maxLength} onBlur={e=>commit(key,typeof value==='number'?Number(e.target.value):e.target.value)}/>}</label>;
  })}</div><details><summary>完整参数 JSON</summary><textarea aria-label="完整参数 JSON" value={draft} onChange={e=>setDraft(e.target.value)} rows={10}/><button onClick={()=>{try{const props=JSON.parse(draft);validateProps(clip.cardId,props);onChange(props);}catch(error:any){onError(error.message);}}}>应用参数</button></details></>;
}

export default function App(){
  const [project,setProject]=useState<any>(initial);
  const current=useRef(project);current.current=project;
  const [past,setPast]=useState<any[]>([]),[future,setFuture]=useState<any[]>([]);
  const [selected,setSelected]=useState<string|null>(null),[trackId,setTrackId]=useState('shots');
  const [frame,setFrame]=useState(0),[zoom,setZoom]=useState(3),[query,setQuery]=useState(''),[nativeOnly,setNativeOnly]=useState(true);
  const [message,setMessage]=useState('参数失焦后实时应用；上方轨道会覆盖下方轨道。'),[busy,setBusy]=useState(false),[job,setJob]=useState<any>(null);
  const [desktop,setDesktop]=useState<any>(null),[installation,setInstallation]=useState<any>(null);
  const help=useRef<HTMLDialogElement>(null);
  useEffect(()=>{fetch('/api/desktop').then(r=>r.json()).then(setDesktop).catch(()=>setDesktop({canInstall:false,reason:'无法连接本机服务，请重启工作台后重试。'}));},[]);
  const player=useRef<PlayerRef>(null);const file=useRef<HTMLInputElement>(null);const media=useRef<HTMLInputElement>(null);
  const selectedClip=project.tracks.flatMap((t:any)=>t.clips).find((c:any)=>c.id===selected);
  const duration=endFrame(project);
  const revision=JSON.stringify(project);
  function commit(next:any){try{validateAll(next);if(JSON.stringify(next)===JSON.stringify(current.current))return;const previous=structuredClone(current.current);setPast(p=>[...p.slice(-49),previous]);setFuture([]);setProject(next);setMessage('已更新工程；预览与导出使用相同数据。');}catch(error:any){setMessage(error.message);}}
  function updateClip(id:string,change:any){const next=structuredClone(current.current);for(const track of next.tracks){const i=track.clips.findIndex((c:any)=>c.id===id);if(i>=0)track.clips[i]={...track.clips[i],...change};}commit(next);}
  function undo(){if(!past.length)return;setFuture(f=>[...f,structuredClone(project)]);setProject(past.at(-1));setPast(p=>p.slice(0,-1));}
  function redo(){if(!future.length)return;setPast(p=>[...p,structuredClone(project)]);setProject(future.at(-1));setFuture(f=>f.slice(0,-1));}
  function addClip(clip:any,target=trackId){const next=structuredClone(current.current);let track=next.tracks.find((t:any)=>t.id===target)||next.tracks[0];track.clips.push(clip);commit(next);setSelected(clip.id);setTrackId(track.id);}
  function addCard(card:any,target=trackId,start=frame){addClip(makeClip(card,start),target);}
  function remove(){if(!selected)return;const next=structuredClone(current.current);for(const track of next.tracks)track.clips=track.clips.filter((c:any)=>c.id!==selected);commit(next);setSelected(null);}
  function duplicate(){if(selectedClip)addClip({...structuredClone(selectedClip),id:uid(),start:selectedClip.start+selectedClip.duration});}
  function split(){if(!selectedClip)return;try{const clips=splitClip(selectedClip,frame);const next=structuredClone(current.current);for(const track of next.tracks)track.clips=track.clips.flatMap((c:any)=>c.id===selectedClip.id?clips:[c]);commit(next);setSelected(clips[1].id);}catch(error:any){setMessage(error.message);}}
  useEffect(()=>{const timeout=setTimeout(()=>{try{localStorage.setItem(KEY,revision);}catch{setMessage('浏览器保存失败，请下载工程 JSON 备份。');}},500);return()=>clearTimeout(timeout);},[revision]);
  useEffect(()=>{const flush=()=>{try{localStorage.setItem(KEY,JSON.stringify(current.current));}catch{}};window.addEventListener('beforeunload',flush);return()=>window.removeEventListener('beforeunload',flush);},[]);
  useEffect(()=>{const ref=player.current;if(!ref)return;ref.seekTo(Math.min(frame,duration-1));const handler=(e:any)=>setFrame(e.detail.frame);ref.addEventListener('frameupdate',handler);return()=>ref.removeEventListener('frameupdate',handler);},[revision]);
  useEffect(()=>{if(!new URLSearchParams(location.search).has('parity'))return;(window as any).__datamagicMotionSeek=(value:number)=>player.current?.seekTo(value);return()=>{delete (window as any).__datamagicMotionSeek;};},[revision]);
  useEffect(()=>{const handler=(event:KeyboardEvent)=>{if((event.target as HTMLElement).closest('input,textarea,select'))return;const mod=event.metaKey||event.ctrlKey;
    if(mod&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();}
    else if(mod&&event.key.toLowerCase()==='d'){event.preventDefault();duplicate();}
    else if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();remove();}
    else if(event.key.toLowerCase()==='s'&&!mod){event.preventDefault();split();}
    else if(event.key===' '){event.preventDefault();player.current?.toggle();}
    else if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();player.current?.seekTo(Math.max(0,Math.min(duration-1,frame+(event.key==='ArrowLeft'?-1:1)*(event.shiftKey?10:1))));}
  };window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);});
  function dragClip(event:React.PointerEvent,clip:any,edge:'move'|'left'|'right'){
    event.preventDefault();event.stopPropagation();setSelected(clip.id);const x=event.clientX;const before=structuredClone(current.current);let latest=before;
    const move=(e:PointerEvent)=>{const delta=Math.round((e.clientX-x)/zoom);const next=structuredClone(before);for(const t of next.tracks){const i=t.clips.findIndex((c:any)=>c.id===clip.id);if(i<0)continue;try{
      t.clips[i]=edge==='move'?{...clip,start:snap(clip.start+delta,before,clip.id)}:edge==='left'?trimLeft(clip,snap(clip.start+delta,before,clip.id)):{...clip,duration:Math.max(1,snap(clip.start+clip.duration+delta,before,clip.id)-clip.start)};
      validateAll(next);latest=next;setProject(next);
    }catch{}}
    };
    const finish=(e:PointerEvent)=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',finish);if(edge==='move'){
      const row=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-track]') as HTMLElement;
      const dest=latest.tracks.find((t:any)=>t.id===row?.dataset.track);
      const origin=latest.tracks.find((t:any)=>t.clips.some((c:any)=>c.id===clip.id));
      if(dest&&origin&&dest.id!==origin.id){const i=origin.clips.findIndex((c:any)=>c.id===clip.id);const moved=origin.clips.splice(i,1)[0];dest.clips.push(moved);setTrackId(dest.id);}
    }
    current.current=before;if(JSON.stringify(before)!==JSON.stringify(latest))commit(latest);};
    document.addEventListener('pointermove',move);document.addEventListener('pointerup',finish,{once:true});
  }
  async function upload(event:React.ChangeEvent<HTMLInputElement>){const asset=event.target.files?.[0];if(!asset)return;try{
    const response=await fetch(`/api/upload?name=${encodeURIComponent(asset.name)}`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:asset});const body=await response.json();if(!response.ok)throw new Error(body.error);
    const clip={id:uid(),cardId:body.type,start:frame,duration:body.frames||150,in:0,speed:1,opacity:1,scale:1,x:0,y:0,volume:1,props:{src:body.src}};addClip(clip,body.type==='audio'?'audio':trackId);setMessage(`已导入 ${asset.name}；文件保存在运行工作台的电脑，不上传第三方。`);
  }catch(error:any){setMessage(error.message);}finally{event.target.value='';}}
  async function exportFilm(kind:string,sendToDesktop=false){
    if(sendToDesktop){if(!desktop?.canInstall){help.current?.showModal();return;}if(!confirm('请先用 Cmd+Q 完全退出剪映。\n将自动渲染、生成新草稿并打开剪映，不覆盖已有草稿。\n首次需要 Python 3.10+ 和联网安装隔离依赖，后续复用。\n确认继续？'))return;}
    if(sendToDesktop)setInstallation(null);setBusy(true);setMessage('正在检查并渲染当前多轨工程…');const exportRevision=revision;try{
    let status:any;
    if(sendToDesktop&&job?.package&&job.revision===revision)status=job;
    else{const response=await fetch('/api/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({project,kind})});status=await response.json();if(!response.ok)throw new Error(status.error);}
    let retries=0;const exportStarted=Date.now();
    while(status.status==='rendering'){if(Date.now()-exportStarted>20*60*1000)throw new Error('导出等待超时，请检查本机工作台日志。');setMessage(status.progress||'真实渲染中，请勿关闭工作台服务。');await new Promise(r=>setTimeout(r,1500));try{const poll=await fetch(`/api/export/${status.id}`);if(!poll.ok)throw new Error('读取导出进度失败');status=await poll.json();retries=0;}catch(error){if(++retries>5)throw error;}}
    if(status.status!=='ready')throw new Error(status.error||'渲染失败');setJob({...status,revision:exportRevision});setMessage('导出完成。修改工程后需要重新导出；剪映实际打开仍需在你的 Mac 验收。');
    if(sendToDesktop){
      const response=await fetch('/api/desktop/install',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exportId:status.id,token:desktop.token,confirm:true})});let result=await response.json();if(!response.ok)throw new Error(result.error);
      const started=Date.now();let retries=0;
      while(result.status==='installing'){if(Date.now()-started>10*60*1000)throw new Error('本机安装等待超时，请检查网络；不要重复安装同一个运行中的任务。');setMessage(result.progress||'正在安装本机剪映草稿…');await new Promise(r=>setTimeout(r,1000));try{const poll=await fetch(`/api/desktop/install/${result.id}`);if(!poll.ok)throw new Error('安装状态查询失败');result=await poll.json();retries=0;}catch(error){if(++retries>5)throw error;}}
      if(result.status!=='installed')throw new Error(result.error||'本机剪映安装未完成');setInstallation(result);setMessage(result.message);
    }
  }catch(error:any){setMessage(error.message);}finally{setBusy(false);}}
  const library=cards.filter(c=>(!nativeOnly||c.native)&&`${c.name.zh} ${c.name.en} ${c.id}`.toLowerCase().includes(query.toLowerCase()));
  const requested=cardById[new URLSearchParams(location.search).get('card')||''];
  return <><header><strong>DataMagic <span>Motion Workbench</span></strong><input aria-label="工程名称" value={project.name} onChange={e=>commit({...project,name:e.target.value})}/><button onClick={undo} disabled={!past.length}>撤销</button><button onClick={redo} disabled={!future.length}>重做</button><button onClick={()=>saveFile('datamagic-project.json',project)}>保存 JSON</button><button onClick={()=>file.current?.click()}>打开 JSON</button><button className="primary" disabled={busy} onClick={()=>exportFilm('mp4')}>导出 MP4</button><button className="primary" disabled={busy} title={desktop?.reason||'检查本机服务中'} onClick={()=>exportFilm('jianying',true)}>发送到剪映</button><button disabled={busy} onClick={()=>exportFilm('jianying')}>导出剪映包</button></header>
  <dialog ref={help} className="desktop-help"><h2>需要在你的 Mac 上发送到剪映</h2><p>{desktop?.reason||'本机服务尚未就绪。'}</p><p>在 Mac 上让编程智能体启动本机工作台，选好卡片后点“发送到剪映”。程序会自动生成并安装新草稿、尝试打开剪映，不需要下载或敲安装命令。</p><p>当前服务器页面只能导出下载包：解压后双击 <strong>Open-in-Jianying.command</strong>，按图形提示确认即可。首次需要 Python 3.10+；系统下载安全提示可能需要右键打开或由本机 Agent 执行。</p><p>新版本剪映若没有可读旧草稿，会明确停止，不能保证所有版本兼容。</p><button onClick={()=>help.current?.close()}>知道了</button></dialog>
  <input ref={file} type="file" accept="application/json" hidden onChange={async e=>{try{const input=e.target.files?.[0];if(input)commit(validateAll(JSON.parse(await input.text())));}catch(error:any){setMessage(error.message);}e.target.value='';}}/>
  <input ref={media} type="file" accept="video/mp4,video/webm,audio/*,image/png,image/jpeg,image/webp" hidden onChange={upload}/>
  <div className="workspace"><aside className="library"><h2>配方与素材</h2>{requested&&<button onClick={()=>addCard(requested)}>加入选定配方：{requested.name.zh}</button>}<input aria-label="搜索配方" placeholder="搜索卡片、用途…" value={query} onChange={e=>setQuery(e.target.value)}/><label><input type="checkbox" checked={nativeOnly} onChange={e=>setNativeOnly(e.target.checked)}/>只看可改数据的原生模板</label><p>点击卡片加入当前轨道，或拖到时间线。30 个原生模板可改参数。109 个参考预览可入轨，但图中内容已烘焙，不能直接改字。</p><div className="tools"><button onClick={()=>addClip(textClip(frame),'text')}>＋ 字幕／文字</button><button onClick={()=>media.current?.click()}>导入视频／图片／音频</button><button onClick={()=>addClip({...textClip(frame),cardId:'background',x:0,y:0,props:{color:'#172c35'}},'shots')}>＋ 背景</button></div>
    <div className="card-list">{library.map(card=><button key={card.id} className="card" draggable onDragStart={e=>e.dataTransfer.setData('application/datamagic-card',card.id)} onClick={()=>addCard(card)}><img loading="lazy" src={`/${card.poster}`} alt=""/><strong>{card.name.zh}</strong><small>{card.native?'原生 · 参数可编辑':'视频预览 · 图中内容不可编辑'} · {(card.frames/30).toFixed(1)} 秒</small></button>)}</div>
  </aside><section className="center"><div className="preview-heading"><h2>实时预览</h2><select aria-label="画幅" value={`${project.width}x${project.height}`} onChange={e=>{const [width,height]=e.target.value.split('x').map(Number);commit({...project,width,height});}}><option value="1920x1080">横屏 16:9</option><option value="1080x1920">竖屏 9:16</option></select><label>底色<input aria-label="工程底色" type="color" value={project.background} onChange={e=>commit({...project,background:e.target.value})}/></label></div>
    <div id="motion-preview"><Boundary key={revision}><Player ref={player} component={MotionComposition} inputProps={{project}} durationInFrames={duration} compositionWidth={project.width} compositionHeight={project.height} fps={30} controls={!new URLSearchParams(location.search).has('parity')} clickToPlay={false} style={{width:'100%',maxHeight:new URLSearchParams(location.search).has('parity')?undefined:520,aspectRatio:`${project.width}/${project.height}`}}/></Boundary></div>
    <div className="transport"><button onClick={()=>player.current?.seekTo(0)}>回到开头</button><button onClick={()=>player.current?.seekTo(Math.max(0,frame-1))}>前一帧</button><button onClick={()=>player.current?.seekTo(Math.min(duration-1,frame+1))}>后一帧</button><span>{(frame/30).toFixed(2)} / {(duration/30).toFixed(2)} 秒 · 30fps</span></div>
    <div className="status" role="status">{message}</div>{installation&&<div className="desktop-result"><strong>已加入剪映：{installation.draftName}</strong><p>{installation.message}实际播放、编辑和导出仍需在剪映检查。</p></div>}{job&&<div className="export-results"><strong>{job.revision===revision?'当前工程导出':'旧版本导出（工程已修改）'}</strong><a href={job.video} download>下载 MP4</a>{job.package&&<a href={job.package} download>下载剪映包</a>}<a href={job.project} download>下载导出时的工程</a><p>剪映包按时间线输出视频底片、原生文字轨和独立音频。原生图表参数仍需在工作台修改，不是剪映原生图表。</p></div>}
  </section><aside className="inspector"><h2>片段属性</h2>{selectedClip?<><h3>{cardById[selectedClip.cardId]?.name.zh||selectedClip.cardId}</h3><p>编号 {selectedClip.id.slice(0,8)}</p><div className="generic-fields">{[['start','起点（秒）'],['duration','时长（秒）'],['in','裁入（秒）'],['speed','速度'],['opacity','不透明度'],['scale','缩放'],['x','水平位移'],['y','垂直位移'],['volume','音量']].map(([key,title])=><label key={key}>{title}<input aria-label={title} type="number" step="any" value={['start','duration','in'].includes(key)?selectedClip[key]/30:selectedClip[key]} onChange={e=>{const value=Number(e.target.value);updateClip(selectedClip.id,{[key]:['start','duration'].includes(key)?Math.round(value*30):key==='in'?value*30:value});}}/></label>)}</div>
    <label>移到轨道<select aria-label="移到轨道" value={project.tracks.find((t:any)=>t.clips.some((c:any)=>c.id===selectedClip.id))?.id} onChange={e=>{const next=structuredClone(project);for(const t of next.tracks)t.clips=t.clips.filter((c:any)=>c.id!==selectedClip.id);next.tracks.find((t:any)=>t.id===e.target.value).clips.push(selectedClip);commit(next);setTrackId(e.target.value);}}>{project.tracks.map((t:any)=><option value={t.id} key={t.id}>{t.name}</option>)}</select></label>
    <h3>内容与样式</h3><PropsEditor key={selectedClip.id} clip={selectedClip} onChange={(props:any)=>updateClip(selectedClip.id,{props})} onError={setMessage}/><div className="tools"><button onClick={duplicate}>复制片段</button><button onClick={split}>播放头处分割</button><button onClick={remove}>删除片段</button></div></>:<p>点击时间线片段，编辑数据、文字、样式、时间和图层。</p>}</aside></div>
  <section className="timeline-panel"><div className="timeline-toolbar"><h2>多轨时间线</h2><button onClick={()=>commit({...project,tracks:[...project.tracks,{id:uid(),name:`新轨道 ${project.tracks.length+1}`,hidden:false,clips:[]}]})}>＋ 轨道</button><button disabled={!selectedClip} onClick={split}>分割 S</button><button disabled={!selectedClip} onClick={duplicate}>复制 ⌘D</button><button disabled={!selectedClip} onClick={remove}>删除</button><label>缩放<input aria-label="时间线缩放" type="range" min=".5" max="8" step=".25" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></label><button onClick={()=>setZoom(Math.max(.5,Math.min(8,900/duration)))}>适配</button><button onClick={()=>{if(confirm('替换当前工程为示例？可撤销。'))commit(newProject());}}>重置示例</button></div>
  <div className="timeline-scroll"><div className="timeline-content" style={{width:Math.max(950,duration*zoom+180)}}><div className="ruler" style={{marginLeft:180,width:duration*zoom}} onClick={e=>{const box=e.currentTarget.getBoundingClientRect();player.current?.seekTo(Math.min(duration-1,Math.max(0,Math.round((e.clientX-box.left)/zoom))));}}>{Array.from({length:Math.ceil(duration/30)+1},(_,i)=><span key={i} style={{left:i*30*zoom}}>{i}s</span>)}</div>
  {[...project.tracks].reverse().map((track:any)=><div className="track-row" key={track.id} data-track={track.id} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData('application/datamagic-card');const rect=e.currentTarget.getBoundingClientRect();if(cardById[id])addCard(cardById[id],track.id,Math.max(0,Math.round((e.clientX-rect.left-180)/zoom)));}}><div className={`track-head ${trackId===track.id?'active':''}`} onClick={()=>setTrackId(track.id)}><input aria-label={`轨道名称 ${track.id}`} value={track.name} onChange={e=>{const next=structuredClone(project);next.tracks.find((t:any)=>t.id===track.id).name=e.target.value;commit(next);}}/><div><button title="隐藏／显示" onClick={()=>{const next=structuredClone(project);next.tracks.find((t:any)=>t.id===track.id).hidden=!track.hidden;commit(next);}}>{track.hidden?'显示':'隐藏'}</button><button title="上移图层" onClick={()=>{const next=structuredClone(project);const i=next.tracks.findIndex((t:any)=>t.id===track.id);if(i<next.tracks.length-1){[next.tracks[i],next.tracks[i+1]]=[next.tracks[i+1],next.tracks[i]];commit(next);}}}>↑</button><button title="下移图层" onClick={()=>{const next=structuredClone(project);const i=next.tracks.findIndex((t:any)=>t.id===track.id);if(i>0){[next.tracks[i],next.tracks[i-1]]=[next.tracks[i-1],next.tracks[i]];commit(next);}}}>↓</button><button title="删除轨道" onClick={()=>{if(project.tracks.length>1&&confirm('删除此轨道及片段？可撤销。'))commit({...project,tracks:project.tracks.filter((t:any)=>t.id!==track.id)});}}>×</button></div></div>
    <div className="track-lane" style={{width:Math.max(770,duration*zoom),opacity:track.hidden?.4:1}}>{track.clips.map((clip:any)=><div key={clip.id} className={`clip ${clip.cardId==='audio'?'audio':clip.cardId==='text'?'text':''} ${selected===clip.id?'selected':''}`} data-clip={clip.id} style={{left:clip.start*zoom,width:Math.max(10,clip.duration*zoom)}} onPointerDown={e=>dragClip(e,clip,'move')}><i className="trim left" onPointerDown={e=>dragClip(e,clip,'left')}/><strong>{cardById[clip.cardId]?.name.zh||clip.props.text||clip.cardId}</strong><small>{(clip.duration/30).toFixed(1)}s · {clip.speed}×</small><i className="trim right" onPointerDown={e=>dragClip(e,clip,'right')}/></div>)}<div className="playhead" style={{left:frame*zoom}}/></div>
  </div>)}</div></div></section><footer>浏览器自动保存 · 视频／图片／音频支持本机导入 · ⌘Z 撤销 · 空格播放 · 左右方向键逐帧 · 当前工程最长 60 秒</footer></>;
}
