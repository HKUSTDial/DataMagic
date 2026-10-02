import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {createRaceFrame, formatRaceValue} from '../bar-chart-race/model';

type Entity = {id: string; label: string; color: string; iconSrc?: string};
type Snapshot = {time: string; values: Record<string, number>};
export type CinematicTrackRaceProps = {
  title: string; subtitle: string; unit: string; source: string; topN: number; decimals: number; locale: string;
  entities: Entity[]; snapshots: Snapshot[];
  story: {hook: string; turningPoint: string; takeaway: string; focusEntityId: string};
};

const font = 'Inter, "Noto Sans SC", sans-serif';

export const CinematicTrackRace: React.FC<CinematicTrackRaceProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const hold = Math.round(1.55 * fps);
  const motionFrame = Math.min(frame, durationInFrames - hold);
  const progress = interpolate(motionFrame,[22,durationInFrames-hold-8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.linear});
  const state = createRaceFrame(props,progress);
  const intro = interpolate(motionFrame,[0,22],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});
  const crashCenter = Math.round(durationInFrames*.53);
  const crash = interpolate(motionFrame,[crashCenter-10,crashCenter,crashCenter+14],[0,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
  const settle = interpolate(motionFrame,[durationInFrames-hold-30,durationInFrames-hold],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const focus = props.entities.find(entity=>entity.id===props.story.focusEntityId) || state.leader;
  const focusRow = state.rows.find(row=>row.id===focus.id) || state.leader;
  const rowHeight=92, trackLeft=402, trackWidth=1050;

  return <AbsoluteFill style={{background:'#071014',color:'#f4f7f5',fontFamily:font,overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 76% 45%,rgba(36,211,171,.16),transparent 32%),linear-gradient(120deg,#071014,#0c1b21 55%,#071014)'}}/>
    <div style={{position:'absolute',inset:0,opacity:.22,background:'linear-gradient(90deg,transparent 49.8%,rgba(255,255,255,.08) 50%,transparent 50.2%)',backgroundSize:'72px 100%'}}/>
    <header style={{position:'absolute',left:72,right:72,top:50,display:'flex',justifyContent:'space-between',opacity:intro}}><div><div style={{fontSize:14,fontWeight:800,letterSpacing:3,color:'#38d6b4'}}>CINEMATIC RACE · LIVE TRACK</div><h1 style={{margin:'12px 0 6px',fontSize:53}}>{props.title}</h1><p style={{margin:0,color:'#91a5aa',fontSize:20}}>{props.subtitle}</p></div><div style={{width:430,padding:'15px 18px',border:'1px solid #244047',borderRadius:12,background:'rgba(8,22,27,.75)',fontSize:18,lineHeight:1.5}}>{props.story.hook}</div></header>
    <div style={{position:'absolute',left:72,right:72,top:204,height:1,background:'#20373d'}}/>

    <div style={{position:'absolute',left:0,top:0,width:'100%',height:'100%',transform:`translateX(${crash*28}px) scale(${1+crash*.025})`,transformOrigin:'56% 51%'}}>
      {state.rows.map(row=>{
        const y=248+row.rank*rowHeight;
        const width=Math.max(5,(row.value/state.maxValue)*trackWidth);
        const leader=row.displayRank===0;
        const isFocus=row.id===focus.id;
        return <div key={row.id} style={{position:'absolute',left:0,top:0,width:'100%',height:78,transform:`translateY(${y}px)`,opacity:row.opacity*intro}}>
          <div style={{position:'absolute',left:72,top:13,width:46,height:46,borderRadius:'50%',border:`1px solid ${leader?'#38d6b4':'#31515a'}`,display:'grid',placeItems:'center',fontSize:16,fontWeight:800,color:leader?'#38d6b4':'#789097'}}>{row.displayRank+1}</div>
          <div style={{position:'absolute',left:137,top:8,width:235,padding:'7px 10px',background:'#071014',opacity:row.contentOpacity,display:'flex',alignItems:'center',gap:10}}><EntityIcon src={row.iconSrc} size={40}/><div><strong style={{display:'block',fontSize:22,color:leader?'#fff':'#c7d1d2'}}>{row.label}</strong><small style={{display:'block',marginTop:4,color:row.rankDelta>0?'#38d6b4':row.rankDelta<0?'#ff765f':'#71868b',fontSize:12}}>{row.rankDelta>0?`▲ +${row.rankDelta}`:row.rankDelta<0?`▼ ${row.rankDelta}`:'— HOLD'}</small></div></div>
          <div style={{position:'absolute',left:trackLeft,top:24,width:trackWidth,height:19,borderRadius:20,background:'#15292f',boxShadow:'inset 0 0 0 1px #203940'}}/>
          <div style={{position:'absolute',left:trackLeft,top:24,width,height:19,borderRadius:20,background:`linear-gradient(90deg,${row.color}55,${row.color})`,boxShadow:leader?`0 0 24px ${row.color}88`:'none'}}><span style={{position:'absolute',right:-8,top:-7,width:32,height:32,borderRadius:'50%',background:row.color,boxShadow:`0 0 ${leader?32:15}px ${row.color}`}}/></div>
          <div style={{position:'absolute',left:Math.min(trackLeft+width+35,1454),top:10,padding:'5px 8px',background:'#071014',fontSize:22,fontWeight:800,opacity:row.contentOpacity,whiteSpace:'nowrap'}}>{formatRaceValue(row.value,props.locale,props.decimals)}</div>
          {isFocus&&crash>.05?<div style={{position:'absolute',left:Math.min(trackLeft+width-78,1330),top:-31,padding:'5px 9px',borderRadius:5,background:'#ff765f',color:'#071014',fontSize:11,fontWeight:900,opacity:crash}}>关键超越</div>:null}
        </div>;
      })}
    </div>

    <aside style={{position:'absolute',right:72,top:264,width:330,padding:'22px',border:'1px solid #26434b',borderRadius:16,background:'rgba(7,18,22,.88)'}}><small style={{fontSize:11,color:'#779098',letterSpacing:2}}>LEADER / {state.time}</small><strong style={{display:'block',marginTop:10,fontSize:30,color:state.leader.color}}><span style={{display:'flex',alignItems:'center',gap:12}}><EntityIcon src={state.leader.iconSrc} size={38}/>{state.leader.label}</span></strong><div style={{marginTop:5,fontSize:50,fontWeight:800}}>{formatRaceValue(state.leader.value,props.locale,props.decimals)}<span style={{marginLeft:7,fontSize:14,color:'#779098'}}>{props.unit}</span></div><div style={{marginTop:20,height:4,background:'#193037'}}><div style={{width:`${state.progress*100}%`,height:'100%',background:'#38d6b4',boxShadow:'0 0 12px #38d6b4'}}/></div></aside>
    <div style={{position:'absolute',right:72,top:552,width:330,padding:'20px 22px',borderLeft:'3px solid #ff765f',background:'rgba(16,34,39,.88)',fontSize:16,lineHeight:1.55}}><small style={{display:'block',marginBottom:8,color:'#ff8a76',fontSize:10,fontWeight:900}}>TURNING POINT</small>{props.story.turningPoint}</div>
    <div style={{position:'absolute',left:270,right:270,bottom:68,padding:'19px 25px',border:'1px solid #38d6b4',borderRadius:12,background:'rgba(14,40,43,.95)',boxShadow:'0 0 45px rgba(56,214,180,.13)',fontSize:21,fontWeight:750,textAlign:'center',opacity:settle,transform:`translateY(${(1-settle)*12}px)`}}><span style={{color:focus.color}}>{focus.label} {formatRaceValue(focusRow.value,props.locale,props.decimals)}</span> · {props.story.takeaway}</div>
    <footer style={{position:'absolute',left:72,right:72,bottom:28,display:'flex',justifyContent:'space-between',fontSize:12,color:'#6f858b'}}><span>来源：{props.source}</span><span>单次冲击聚焦 · 排名与数值逐帧计算</span></footer>
  </AbsoluteFill>;
};
