import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {calculateChartCamera} from '../../src/camera/chartCamera';

export type CraneRiseDashboardProps = {title: string; subtitle: string; focusLabel: string; focusValue: number; unit: string; categories: string[]; categoryIcons?: Record<string,string>; values: number[]; source: string; accentColor: string};
const font = 'Inter, "Noto Sans SC", sans-serif';
export const CraneRiseDashboard: React.FC<CraneRiseDashboardProps> = p => {
  const frame = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  const max = Math.max(...p.values); const focus = Math.max(0, p.categories.indexOf(p.focusLabel));
  const camera = calculateChartCamera({profile:'crane_rise_reveal',frame,fps,durationInFrames,canvasWidth:1920,canvasHeight:1080,focusX:520+focus*170,focusY:700-p.values[focus]/max*390});
  const reveal = interpolate(frame,[0,fps*.9],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});
  const context = interpolate(frame,[fps*2.5,fps*4],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:'#eef1ed',fontFamily:font,color:'#13221f',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:-80,background:'radial-gradient(circle at 24% 26%,#d9eee7 0,transparent 34%),linear-gradient(135deg,#f7f3e9,#e9efec)'}}/>
    <div style={{position:'absolute',inset:0,transformOrigin:`${camera.origin.x}px ${camera.origin.y}px`,transform:`translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale})`}}>
      <header style={{position:'absolute',left:110,top:75,opacity:context}}><div style={{fontSize:17,fontWeight:700,color:p.accentColor,letterSpacing:3}}>FROM DETAIL TO SYSTEM</div><h1 style={{fontSize:56,margin:'14px 0 8px'}}>{p.title}</h1><div style={{fontSize:24,color:'#60716d'}}>{p.subtitle}</div></header>
      <section style={{position:'absolute',left:100,top:260,width:1260,height:650,background:'rgba(255,255,255,.88)',boxShadow:'0 28px 80px rgba(29,52,45,.13)',borderRadius:28,padding:'60px 62px'}}>
        <div style={{display:'flex',alignItems:'end',gap:38,height:420,borderBottom:'2px solid #cbd6d1'}}>{p.values.map((v,i)=><div key={p.categories[i]} style={{width:128,height:'100%',display:'flex',flexDirection:'column',justifyContent:'end',alignItems:'center',gap:15}}><strong style={{fontSize:25,color:i===focus?p.accentColor:'#65736f',opacity:reveal}}>{v}{p.unit}</strong><div style={{width:92,height:`${Math.max(8,v/max*350*reveal)}px`,borderRadius:'15px 15px 2px 2px',background:i===focus?`linear-gradient(#79dcc3,${p.accentColor})`:'#c8d2ce'}}/><span style={{fontSize:19,fontWeight:i===focus?800:500,display:'flex',alignItems:'center',gap:6}}><EntityIcon src={p.categoryIcons?.[p.categories[i]]} size={28}/>{p.categories[i]}</span></div>)}</div>
        <div style={{marginTop:38,display:'flex',justifyContent:'space-between',color:'#71807b'}}><span>来源：{p.source}</span><span>镜头先锁定关键柱，再拉升揭示完整比较结构</span></div>
      </section>
      <aside style={{position:'absolute',right:100,top:310,width:360,padding:'34px',background:'#132a26',color:'#fff',borderRadius:24,opacity:context,transform:`translateX(${(1-context)*50}px)`}}><div style={{color:'#86dec8',fontSize:18}}>关键发现</div><div style={{fontSize:68,fontWeight:800,margin:'12px 0'}}>{p.focusValue}{p.unit}</div><div style={{fontSize:25,lineHeight:1.5}}>{p.focusLabel}成为结构揭示的视觉锚点</div></aside>
    </div>
  </AbsoluteFill>;
};
