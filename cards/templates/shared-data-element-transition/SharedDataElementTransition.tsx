import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type Datum = {label: string; value: number; iconSrc?: string};
export type SharedDataElementTransitionProps = {
  title: string; subtitle: string; data: Datum[]; focusIndex: number; unit: string;
  destinationTitle: string; takeaway: string; source: string; accentColor: string;
};
const font = 'Inter, "Noto Sans SC", sans-serif';
const clamp = (value:number) => Math.max(0, Math.min(1, value));
const mix = (a:number,b:number,t:number) => a+(b-a)*t;
const ease = (t:number) => Easing.inOut(Easing.cubic)(clamp(t));

export const SharedDataElementTransition:React.FC<SharedDataElementTransitionProps> = p => {
  const frame=useCurrentFrame(); const {fps,durationInFrames}=useVideoConfig();
  const f=Math.min(frame,durationInFrames-fps-1);
  const focus=Math.min(p.data.length-1,Math.max(0,p.focusIndex));
  const max=Math.max(...p.data.map(d=>d.value)); const item=p.data[focus];
  const lift=ease((f-fps*2.35)/(fps*1.35));
  const travel=ease((f-fps*3.55)/(fps*1.35));
  const destination=ease((f-fps*4.4)/(fps*.9));
  const sourceOpacity=1-ease((f-fps*3.65)/(fps*.75));
  const sourceX=330+focus*185; const sourceY=735-item.value/max*330;
  const bridgeX=mix(sourceX,960,lift); const bridgeY=mix(sourceY,430,lift);
  const metricX=mix(bridgeX,1450,travel); const metricY=mix(bridgeY,560,travel);
  return <AbsoluteFill style={{background:'#f2efe7',fontFamily:font,color:'#14201f',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 80% 42%,rgba(28,128,116,.16),transparent 34%),linear-gradient(135deg,#f7f4ec,#e7eee9)'}}/>
    <header style={{position:'absolute',left:72,top:58,right:72}}><div style={{color:p.accentColor,fontSize:16,fontWeight:800,letterSpacing:3}}>SHARED DATA ELEMENT</div><h1 style={{fontSize:50,margin:'12px 0 7px'}}>{p.title}</h1><p style={{fontSize:21,color:'#697671',margin:0}}>{p.subtitle}</p></header>
    <section style={{position:'absolute',left:72,top:245,width:850,height:660,padding:'38px 42px',borderRadius:24,background:'rgba(255,255,255,.9)',boxShadow:'0 22px 70px rgba(32,56,49,.12)',opacity:sourceOpacity}}>
      <div style={{fontSize:18,fontWeight:800}}>01 完整比较</div>
      <div style={{position:'absolute',left:55,right:55,top:115,height:430,borderBottom:'2px solid #bfc9c5',display:'flex',alignItems:'end',gap:34}}>{p.data.map((d,i)=>{const h=d.value/max*330;return <div key={d.label} style={{width:150,textAlign:'center'}}><strong style={{display:'block',fontSize:22,color:i===focus?p.accentColor:'#687470',marginBottom:9}}>{d.value}{p.unit}</strong><div style={{height:h,background:i===focus?p.accentColor:'#c6ceca',borderRadius:'12px 12px 2px 2px'}}/><span style={{display:'block',fontSize:17,marginTop:12,fontWeight:i===focus?800:500}}><span style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8}}><EntityIcon src={d.iconSrc} size={28}/>{d.label}</span></span></div>})}</div>
    </section>
    <section style={{position:'absolute',right:72,top:245,width:760,height:660,padding:'38px 42px',borderRadius:24,background:'#102725',color:'#fff',opacity:destination,transform:`translateX(${(1-destination)*45}px)`,boxShadow:'0 26px 80px rgba(13,48,43,.25)'}}>
      <div style={{fontSize:18,color:'#78cabe',fontWeight:800}}>02 结论场景</div><h2 style={{fontSize:42,lineHeight:1.18,margin:'24px 0 18px',maxWidth:590}}>{p.destinationTitle}</h2>
      <div style={{position:'absolute',left:42,right:42,bottom:42,padding:'24px 28px',borderLeft:`5px solid ${p.accentColor}`,background:'rgba(255,255,255,.07)',fontSize:22,lineHeight:1.5}}>{p.takeaway}</div>
    </section>
    <div style={{position:'absolute',left:metricX,top:metricY,transform:`translate(-50%,-50%) scale(${1+travel*.22})`,zIndex:4,padding:`${16+travel*10}px ${24+travel*14}px`,borderRadius:18,background:p.accentColor,color:'#fff',boxShadow:'0 18px 55px rgba(10,69,61,.3)',whiteSpace:'nowrap'}}><strong style={{fontSize:44+travel*24}}>{item.value}{p.unit}</strong><span style={{display:'block',fontSize:16+travel*3,marginTop:5,textAlign:'center'}}><span style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8}}><EntityIcon src={item.iconSrc} size={32}/>{item.label}</span></span></div>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}><path d={`M ${sourceX} ${sourceY} C 720 260, 1160 300, 1450 560`} fill="none" stroke={p.accentColor} strokeWidth="3" strokeDasharray="9 12" opacity={lift*(1-travel)*.55}/></svg>
    <footer style={{position:'absolute',left:72,right:72,bottom:34,paddingTop:15,borderTop:'1px solid #c7d0cc',display:'flex',justifyContent:'space-between',color:'#66746f',fontSize:14}}><span>来源：{p.source}</span><span>同一数据对象跨场景保持身份、数值与颜色一致</span></footer>
  </AbsoluteFill>;
};
