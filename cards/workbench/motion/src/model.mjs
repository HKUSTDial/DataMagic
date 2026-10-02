import catalog from './catalog.json' with {type:'json'};
export const cards=catalog;
export const cardById=Object.fromEntries(cards.map(c=>[c.id,c]));
export const builtin=['text','background','video','image','audio'];
export function createId(){if(typeof crypto.randomUUID==='function')return crypto.randomUUID();const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const hex=[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;}
export function endFrame(project){return Math.max(1,...project.tracks.flatMap(t=>t.clips.map(c=>c.start+c.duration)));}
export function sourceFrame(clip,frame,baseFrames){return Math.min(baseFrames-1,Math.max(0,Math.floor(clip.in+(frame-clip.start)*clip.speed)));}
export function makeClip(card,start=0){return {id:createId(),cardId:card.id,start,duration:card.frames,in:0,speed:1,opacity:1,scale:1,x:0,y:0,volume:1,props:structuredClone(card.props||{})};}
export function newProject(){return {version:2,name:'DataMagic 多轨工程',width:1920,height:1080,fps:30,background:'#f6f4ef',tracks:[{id:'shots',name:'镜头',hidden:false,clips:[makeClip(cardById.RankedReveal)]},{id:'text',name:'字幕与标注',hidden:false,clips:[]},{id:'audio',name:'音频',hidden:false,clips:[]}]};}
export function splitClip(clip,frame){if(frame<=clip.start||frame>=clip.start+clip.duration)throw new Error('播放头需要位于片段内部');const left={...clip,duration:frame-clip.start},right={...structuredClone(clip),id:createId(),start:frame,in:clip.in+(frame-clip.start)*clip.speed,duration:clip.start+clip.duration-frame};return [left,right];}
export function trimLeft(clip,newStart){const delta=newStart-clip.start;if(clip.in+delta*clip.speed<0||clip.duration-delta<1)throw new Error('裁剪范围无效');return {...clip,start:newStart,duration:clip.duration-delta,in:clip.in+delta*clip.speed};}
export function snap(frame,project,exclude,threshold=6){const edges=[0,...project.tracks.flatMap(t=>t.clips.filter(c=>c.id!==exclude).flatMap(c=>[c.start,c.start+c.duration]))];const nearest=edges.sort((a,b)=>Math.abs(a-frame)-Math.abs(b-frame))[0];return Math.max(0,Math.round(Math.abs(nearest-frame)<=threshold?nearest:frame));}
export function assetPaths(value){const paths=[];function visit(v){if(typeof v==='string'&&/\.(mp4|webm|mov|png|jpe?g|webp|svg|wav|mp3|m4a|ogg)(?:[?#].*)?$/i.test(v))paths.push(v);else if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')Object.values(v).forEach(visit);}visit(value);return [...new Set(paths)];}
export function validateProject(project){
  if(!project||project.version!==2||project.fps!==30||![1080,1920].includes(project.width)||![1080,1920].includes(project.height)||project.width===project.height)throw new Error('只支持 1080p 横屏／竖屏、30fps 的版本 2 工程');
  if(typeof project.name!=='string'||project.name.length<1||project.name.length>80||typeof project.background!=='string'||!/^#[0-9a-f]{6}$/i.test(project.background))throw new Error('工程名称或背景无效');
  if(!Array.isArray(project.tracks)||project.tracks.length<1||project.tracks.length>16)throw new Error('轨道需要 1–16 条');
  const ids=new Set();let count=0;
  for(const track of project.tracks){
    if(typeof track.id!=='string'||ids.has(track.id)||typeof track.name!=='string'||track.name.length>80||typeof track.hidden!=='boolean'||!Array.isArray(track.clips))throw new Error('轨道无效');ids.add(track.id);
    for(const clip of track.clips){
      if(typeof clip.id!=='string'||ids.has(clip.id)||(!cardById[clip.cardId]&&!builtin.includes(clip.cardId)))throw new Error('片段标识无效');ids.add(clip.id);count++;
      if(!Number.isInteger(clip.start)||clip.start<0||!Number.isInteger(clip.duration)||clip.duration<1||clip.start+clip.duration>1800)throw new Error('片段范围无效；本机工作台单工程最多 60 秒');
      for(const key of ['in','speed','opacity','scale','x','y','volume'])if(!Number.isFinite(clip[key]))throw new Error(`无效片段参数 ${key}`);
      if(clip.in<0||clip.speed<.25||clip.speed>4||clip.opacity<0||clip.opacity>1||clip.scale<.1||clip.scale>4||Math.abs(clip.x)>4000||Math.abs(clip.y)>4000||clip.volume<0||clip.volume>2)throw new Error('片段参数超出范围');
      if(!clip.props||typeof clip.props!=='object'||Array.isArray(clip.props))throw new Error('片段参数必须是对象');
      for(const file of assetPaths(clip.props))if(file.startsWith('/')||file.includes('..')||file.includes('\\')||file.includes(':')||!file.trim())throw new Error('素材只允许工程内的相对路径');
      if(clip.cardId==='text'&&(typeof clip.props.text!=='string'||clip.props.text.length>1000||!/^#[0-9a-f]{6}$/i.test(clip.props.color)||!Number.isFinite(clip.props.size)||clip.props.size<10||clip.props.size>200))throw new Error('文字参数无效');
      if(clip.cardId==='background'&&!/^#[0-9a-f]{6}$/i.test(clip.props.color))throw new Error('背景色无效');
      if(['video','image','audio'].includes(clip.cardId)&&(typeof clip.props.src!=='string'||!assetPaths(clip.props).includes(clip.props.src)))throw new Error('请指定支持的本地素材');
    }
  }
  if(count>100)throw new Error('最多 100 个片段');return project;
}
