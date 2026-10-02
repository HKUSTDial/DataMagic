import React from 'react';
import {AbsoluteFill,Audio,Composition,Easing,Freeze,Img,interpolate,OffthreadVideo,registerRoot,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {PageCam} from './PageCam';
import {SHOTS,SFX,TOTAL} from './timeline';
import layout from '../../../../assets/walkthrough-v2/capture-layout.json';
import voices from '../../../../assets/walkthrough-v2/audio/voice-manifest.json';
import {filmFont} from './fonts';
const BG='#f7f8fb',INK='#171b25',BLUE='#3568e8';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...clamp,easing:Easing.bezier(.22,1,.36,1)});
const file=(name:string)=>staticFile('assets/walkthrough-v2/'+name);
const textStyle:React.CSSProperties={fontFamily:`"${filmFont}",sans-serif`,fontSynthesis:'none',color:INK};
const Badge:React.FC<{children:React.ReactNode}>=({children})=><div style={{fontSize:32,color:'#526078',display:'inline-block',padding:'12px 20px',borderRadius:14,background:'#eef2f8'}}>{children}</div>;
const Shell:React.FC<{children:React.ReactNode,title:string}>=({children,title})=><AbsoluteFill style={{background:BG,...textStyle}}><div style={{position:'absolute',left:88,top:40,fontSize:54,fontWeight:700,letterSpacing:-1}}>{title}</div><div style={{position:'absolute',right:88,top:52,fontSize:30,color:'#697184'}}>DataMagic</div>{children}</AbsoluteFill>;
const FilmVideo:React.FC<{name:string,start?:number,hero?:boolean}>=({name,start=0,hero=false})=>{
 const frame=useCurrentFrame();const enter=ease(frame,0,24);
 return <div style={{position:'absolute',left:hero?650:100,top:hero?230:126,width:hero?1160:1720,height:hero?652.5:850,borderRadius:24,overflow:'hidden',background:'#f4f7f9',boxShadow:'0 22px 75px #17212616',transform:`translateY(${(1-enter)*28}px)`}}><OffthreadVideo muted src={file(name)} startFrom={start} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>;
};
const Cursor:React.FC<{x:number,y:number}>=({x,y})=><svg width={58} height={58} viewBox="0 0 28 28" style={{position:'absolute',left:x-3.4,top:y-1.7,filter:'drop-shadow(0 4px 7px #0005)'}}><path d="M2 1 L2 23 L8 17.5 L11.5 25 L15.5 23.2 L12 15.8 L20 15 Z" fill="white" stroke="#2f2f2f" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
const CopyShot=()=>{
 const f=useCurrentFrame();const target={x:layout.copyButton.x+layout.copyButton.width/2,y:layout.copyButton.y+layout.copyButton.height/2};
 const t=f<24?interpolate(f,[0,24],[0,1.05],{...clamp,easing:Easing.out(Easing.cubic)}):interpolate(f,[24,30],[1.05,1],{...clamp,easing:Easing.inOut(Easing.quad)});
 const p=[{x:220,y:980},{x:700,y:1000},{x:target.x+130,y:target.y+120},target];const u=1-t;
 const x=u*u*u*p[0].x+3*u*u*t*p[1].x+3*u*t*t*p[2].x+t*t*t*p[3].x;
 const y=u*u*u*p[0].y+3*u*u*t*p[1].y+3*u*t*t*p[2].y+t*t*t*p[3].y;
 const z=f<72?interpolate(f,[40,52],[1,1.4],{...clamp,easing:Easing.out(Easing.cubic)}):interpolate(f,[72,90],[1.4,1],{...clamp,easing:Easing.inOut(Easing.cubic)});
 const d=interpolate(f,[40,62],[60,380],{...clamp,easing:Easing.out(Easing.cubic)}),opacity=interpolate(f,[40,66],[.9,0],clamp);
 return <><div style={{position:'absolute',left:180,top:125,width:1560,height:877.5,overflow:'hidden',borderRadius:24,boxShadow:'0 20px 60px #17212618'}}><div style={{width:1920,height:1080,transform:'scale(.8125)',transformOrigin:'0 0',position:'relative'}}>
 <PageCam src={'assets/walkthrough-v2/'+(f<40?'detail-before.png':'detail-after.png')} pageH={1080} frame={0} keys={[{frame:0,cx:target.x+(960-target.x)/z,cy:target.y+(540-target.y)/z,zoom:z}]}>
 {f>=40&&f<66?<div style={{position:'absolute',left:target.x-d/2,top:target.y-d/2,width:d,height:d,border:`${interpolate(f,[40,62],[9,3],clamp)}px solid ${BLUE}`,borderRadius:'50%',opacity}}/>:null}<Cursor x={x} y={y+interpolate(f,[40,42,46],[0,3,0],clamp)}/>
 </PageCam></div></div><div style={{position:'absolute',left:120,top:144}}><Badge>真实页面 · 镜头包装</Badge></div></>;
};
const Prompt:React.FC<{revision?:boolean,executing?:boolean}>=({revision=false,executing=false})=>{
 const f=useCurrentFrame();const prompt=revision?'标题改成「谁是咖啡店的增长主角？」\n拿铁改为紫色；其他颜色保留并淡化。\n数据不变，结尾再多停两秒。':'用 BarChartRace 配方制作咖啡店销量视频。\n标题：咖啡店的半年销量变化。\n单位：杯；12 秒；1080p；搭配饮品图标。';
 const count=executing?prompt.length:Math.floor(interpolate(f,[30,revision?175:200],[0,prompt.length],clamp));
 const sent=executing||f>=(revision?185:210);
 const files=revision||executing&&f>=84?['sales.csv','BarChartRace 配方','v1.json']:['sales.csv','BarChartRace 配方'];
 return <><div style={{position:'absolute',left:120,top:135,width:1680,height:802,background:'white',border:'1px solid #dfe3eb',borderRadius:26,boxShadow:'0 18px 70px #25314d0d',overflow:'hidden'}}>
 <div style={{height:92,borderBottom:'1px solid #dfe3eb',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 36px'}}><b style={{fontSize:34}}>数据视频任务</b><span style={{fontSize:32,color:'#697184'}}>流程演示 · 非客户端录屏</span></div>
 <div style={{position:'absolute',left:0,top:92,bottom:0,width:342,background:'#f5f7fb',padding:32}}><div style={{fontSize:30,color:'#697184',marginBottom:28}}>项目文件</div>{files.map((name,i)=><div key={name} style={{fontSize:30,padding:'19px 0',borderBottom:'1px solid #e0e5ef',opacity:revision||executing?1:ease(f,i*10,i*10+22),transform:`translateX(${revision||executing?0:(1-ease(f,i*10,i*10+22))*-20}px)`}}>▤ &nbsp; {name==='BarChartRace 配方'?<>BarChartRace<br/>配方</>:name}</div>)}<div style={{marginTop:36,fontSize:30,color:BLUE,lineHeight:1.7}}>6 个月<br/>6 种饮品<br/>36 个数据点</div></div>
 <div style={{position:'absolute',left:384,right:38,top:128}}>
 {executing?<><Badge>输入：sales.csv + 配方指令</Badge><div style={{fontSize:38,fontWeight:700,marginTop:24}}>已按请求执行</div>{['读取配方、源码与字段约束','36 个数值与原始 CSV 一致','渲染 MP4，保存可编辑参数'].map((s,i)=><div key={s} style={{marginTop:22,padding:'20px 26px',background:'#f7f9fc',borderRadius:16,fontSize:38,opacity:ease(f,i*32,i*32+20),transform:`translateY(${(1-ease(f,i*32,i*32+20))*18}px)`}}><span style={{color:'#198a6a',marginRight:16}}>✓</span>{s}</div>)}<div style={{fontSize:30,color:'#697184',marginTop:30}}>依据实际运行结果重排 · 等待过程已省略</div></>:
 <><div style={{fontSize:30,color:'#697184',marginBottom:18}}>你的{revision?'修改请求':'制作请求'}</div><div style={{minHeight:250,padding:'24px 30px',borderRadius:18,background:'#edf3ff',fontSize:38,lineHeight:1.7,whiteSpace:'pre-wrap'}}>{prompt.slice(0,count)}{count<prompt.length?<span style={{borderRight:`3px solid ${BLUE}`}}/>:null}</div>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:20}}><Badge>{revision?'保留第一版，另存新版':'已附：sales.csv + 配方指令'}</Badge><div style={{background:sent?'#e9f5ef':BLUE,color:sent?'#187050':'white',fontSize:32,padding:'14px 28px',borderRadius:14}}>{sent?'已提交 ✓':'发送 ↑'}</div></div>
 <div style={{marginTop:28,opacity:sent?ease(f,revision?185:210,revision?205:230):0,fontSize:34,lineHeight:1.6}}><b style={{color:BLUE}}>执行目标</b><br/>{revision?'保留数据；更新标题、配色和结尾停留。':'读取配方并映射数据，输出视频与参数文件。'}</div></>}
 </div></div></>;
};
const Scene:React.FC<{id:string}>=({id})=>{
 const f=useCurrentFrame();
 if(id==='copy')return <CopyShot/>;
 if(id==='gallery')return <><div style={{position:'absolute',left:120,top:128,width:1680,height:845,overflow:'hidden',borderRadius:22,boxShadow:'0 20px 60px #17212612'}}><OffthreadVideo muted src={file('gallery.mp4')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}/></div><div style={{position:'absolute',right:150,top:148}}><Badge>真实配方库操作</Badge></div></>;
 if(id==='prompt'||id==='revise'||id==='execute')return <Prompt revision={id==='revise'} executing={id==='execute'}/>;
 if(id==='first'||id==='final')return <><FilmVideo name={id==='first'?'v1.mp4':'v2.mp4'} start={id==='first'?60:0}/><div style={{position:'absolute',right:350,top:43}}><Badge>{id==='first'?'原始配色':'拿铁高亮 · 数据不变'}</Badge></div></>;
 if(id==='result')return <><div style={{position:'absolute',left:100,top:180,width:500,zIndex:1}}><Img src={staticFile('assets/datamagic_logo.png')} style={{width:410,mixBlendMode:'multiply'}}/><div style={{fontSize:68,fontWeight:700,lineHeight:1.25,marginTop:60}}>选配方<br/><span style={{color:BLUE}}>换数据</span><br/>继续改</div></div><FilmVideo name="v2.mp4" start={240} hero/></>;
 return <><div style={{position:'absolute',left:120,top:165,right:120,display:'flex',gap:30}}>{[{name:'视频成片',sub:'v2.mp4',img:'v2-final.png'},{name:'原始数据',sub:'sales.csv',img:null},{name:'可编辑参数',sub:'v2.json',img:null}].map((c,i)=><div key={c.name} style={{flex:1,height:450,background:'white',border:'1px solid #dfe3eb',borderRadius:24,overflow:'hidden',opacity:ease(f,i*8,28+i*8),transform:`translateY(${(1-ease(f,i*8,28+i*8))*60}px)`}}>{c.img?<Img src={file(c.img)} style={{width:'100%',height:260,objectFit:'cover'}}/>:<div style={{height:260,display:'flex',alignItems:'center',justifyContent:'center',fontSize:80,color:BLUE,background:'#eef3ff'}}>{i===1?'CSV':'{ }'}</div>}<div style={{padding:'22px 30px'}}><div style={{fontSize:38,fontWeight:700}}>{c.name}</div><div style={{fontSize:32,color:'#697184',marginTop:12}}>{c.sub}</div></div></div>)}</div><div style={{position:'absolute',left:120,top:690,fontSize:60,fontWeight:700}}>挑一个效果，用你的数据试一次。</div><div style={{position:'absolute',left:120,top:795,fontSize:50,color:BLUE}}>datamagic.chat/cards/</div></>;
};
const Captions=()=>{
 const frame=useCurrentFrame();const sec=frame/30;const voice=voices.segments.find(s=>sec>=s.start&&sec<s.start+s.renderedSeconds);
 if(!voice)return null;const clauses=voice.text.split(/[，。；：]/).filter(Boolean);let units=0;const total=clauses.reduce((n,s)=>n+s.length,0);const unit=(sec-voice.start)/voice.renderedSeconds*total;
 const text=clauses.find(s=>{units+=s.length;return unit<units})||clauses.at(-1);
 return <div style={{position:'absolute',bottom:22,left:64,right:64,display:'flex',justifyContent:'center'}}><div style={{fontSize:56,fontWeight:700,lineHeight:1.3,color:'white',padding:'12px 30px',borderRadius:15,background:'rgba(23,27,37,.94)',boxShadow:'0 4px 18px #0001'}}>{text}</div></div>;
};
export const WorkflowFilm:React.FC<{bgm:boolean,sound?:boolean}>=({bgm,sound=true})=>{
 const frame=useCurrentFrame();const current=SHOTS.find(s=>frame>=s.from&&frame<s.from+s.duration)||SHOTS[0];
 return <AbsoluteFill style={textStyle}>
 {SHOTS.map((shot,i)=><Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration+10}><Freeze frame={Math.min(frame-shot.from,shot.duration-1)}><AbsoluteFill style={{opacity:i===0?1:interpolate(frame,[shot.from,shot.from+10],[0,1],clamp)}}><Shell title={shot.title}><Scene id={shot.id}/></Shell></AbsoluteFill></Freeze></Sequence>)}
 <div style={{position:'absolute',left:0,right:0,bottom:0,height:5,background:'#dfe3eb'}}><div style={{height:'100%',width:`${frame/TOTAL*100}%`,background:BLUE}}/></div>
 <Captions/>
 {sound?<>{voices.segments.map(s=><Sequence key={s.id} from={Math.round(s.start*30)} durationInFrames={Math.ceil(s.renderedSeconds*30)}><Audio src={file('audio/'+s.file)}/></Sequence>)}
 {bgm?<Audio loop durationInFrames={900} src={file('audio/music.wav')} volume={f=>interpolate(f,[0,30,TOTAL-45,TOTAL],[0,.075,.075,0],clamp)}/>:null}
 {SFX.map((s,i)=><Sequence key={i} from={s.from} durationInFrames={s.duration}><Audio src={file('audio/'+s.src)} volume={s.volume}/></Sequence>)}</>:null}
 </AbsoluteFill>;
};
registerRoot(()=><Composition id="DataMagicWorkflowV2" component={WorkflowFilm} durationInFrames={TOTAL} fps={30} width={1920} height={1080} defaultProps={{bgm:true}}/>);
