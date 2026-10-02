import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {createRaceFrame, formatRaceValue} from '../bar-chart-race/model';

type Entity = {id: string; label: string; color: string; iconSrc?: string};
type Snapshot = {time: string; values: Record<string, number>};
export type EditorialLedgerRaceProps = {
  title: string; subtitle: string; unit: string; source: string; topN: number; decimals: number; locale: string;
  entities: Entity[]; snapshots: Snapshot[];
  story: {hook: string; turningPoint: string; takeaway: string; focusEntityId: string};
};

const font = 'Inter, "Noto Sans SC", sans-serif';

export const EditorialLedgerRace: React.FC<EditorialLedgerRaceProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const motionFrame = Math.min(frame, durationInFrames - Math.round(1.55 * fps));
  const progress = interpolate(motionFrame, [24, durationInFrames - Math.round(1.8 * fps)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear});
  const state = createRaceFrame(props, progress);
  const intro = interpolate(motionFrame, [0, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const push = interpolate(motionFrame, [fps * 3.5, fps * 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const conclusion = interpolate(motionFrame, [durationInFrames - fps * 2.5, durationInFrames - fps * 1.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const focus = props.entities.find(entity => entity.id === props.story.focusEntityId) || state.leader;
  const focusRow = state.rows.find(row => row.id === focus.id) || state.leader;
  const rowHeight = 91;
  const barLeft = 420;
  const barWidth = 820;

  return <AbsoluteFill style={{background:'#f2efe7',color:'#1c211f',fontFamily:font,overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(rgba(27,33,31,.045) 1px,transparent 1px)',backgroundSize:'100% 42px',opacity:.48}}/>
    <header style={{position:'absolute',left:72,right:72,top:52,display:'flex',justifyContent:'space-between',opacity:intro}}>
      <div><div style={{fontSize:14,fontWeight:800,letterSpacing:3,color:'#bd4d38'}}>EDITORIAL RACE · 01</div><h1 style={{margin:'12px 0 6px',fontSize:51,lineHeight:1.12}}>{props.title}</h1><p style={{margin:0,color:'#6f756f',fontSize:20}}>{props.subtitle}</p></div>
      <div style={{maxWidth:420,padding:'12px 0 0 22px',borderLeft:'3px solid #bd4d38',fontSize:19,lineHeight:1.55,fontWeight:650}}>{props.story.hook}</div>
    </header>
    <div style={{position:'absolute',left:72,right:72,top:200,height:1,background:'#b9bbb4'}}/>

    <div style={{position:'absolute',left:60,top:208,width:1300,height:708,transform:`scale(${1 + push * .035}) translate(${push * 8}px,${push * -4}px)`,transformOrigin:'50% 45%'}}>
      {state.rows.map(row => {
        const y = 42 + row.rank * rowHeight;
        const width = Math.max(4,(row.value/state.maxValue)*barWidth);
        const isFocus = row.id === focus.id;
        return <div key={row.id} style={{position:'absolute',left:0,top:0,width:'100%',height:76,transform:`translateY(${y}px)`,opacity:row.opacity*intro}}>
          <div style={{position:'absolute',left:18,top:18,width:36,fontSize:15,fontWeight:800,color:'#898d87'}}>{String(row.displayRank+1).padStart(2,'0')}</div>
          <div style={{position:'absolute',left:74,top:8,width:294,height:58,padding:'8px 12px',background:'#f2efe7',borderBottom:'1px solid #d4d3cb',display:'flex',alignItems:'center',gap:12,opacity:row.contentOpacity}}>{row.iconSrc ? <EntityIcon src={row.iconSrc} size={44}/> : <span style={{width:10,height:10,borderRadius:'50%',background:row.color}}/>}<div><strong style={{display:'block',fontSize:22}}>{row.label}</strong><small style={{fontSize:12,color:row.rankDelta>0?'#167a67':row.rankDelta<0?'#bd4d38':'#8b8e89'}}>{row.rankDelta>0?`上升 ${row.rankDelta} 位`:row.rankDelta<0?`下降 ${Math.abs(row.rankDelta)} 位`:'排名稳定'}</small></div></div>
          <div style={{position:'absolute',left:barLeft,top:22,width:barWidth,height:23,borderTop:'1px solid #c7c8c1',borderBottom:'1px solid #c7c8c1'}}/>
          <div style={{position:'absolute',left:barLeft,top:22,width,height:23,background:isFocus?'#bd4d38':row.color,opacity:isFocus?1:.72}}/>
          <div style={{position:'absolute',left:Math.min(barLeft+width+15,1190),top:12,padding:'5px 7px',background:'#f2efe7',fontSize:20,fontWeight:800,opacity:row.contentOpacity,whiteSpace:'nowrap'}}>{formatRaceValue(row.value,props.locale,props.decimals)}</div>
        </div>;
      })}
    </div>

    <aside style={{position:'absolute',right:72,top:236,width:420,height:650,paddingLeft:34,borderLeft:'1px solid #b9bbb4'}}>
      <div style={{fontSize:13,color:'#777c76',letterSpacing:2}}>CURRENT CHAPTER</div><div style={{marginTop:8,fontSize:96,lineHeight:1,fontWeight:750}}>{state.time}</div>
      <div style={{marginTop:20,height:5,background:'#d8d6ce'}}><div style={{width:`${state.progress*100}%`,height:'100%',background:'#bd4d38'}}/></div>
      <div style={{marginTop:42,padding:'24px 22px',background:'#202521',color:'#f2efe7'}}><small style={{color:'#b7bbb4',fontSize:12}}>追踪对象</small><strong style={{display:'block',marginTop:9,fontSize:27,color:focus.color}}><span style={{display:'flex',alignItems:'center',gap:12}}><EntityIcon src={focus.iconSrc} size={40}/>{focus.label}</span></strong><div style={{marginTop:7,fontSize:42,fontWeight:800}}>{formatRaceValue(focusRow.value,props.locale,props.decimals)}<span style={{marginLeft:8,fontSize:15,fontWeight:500,color:'#b7bbb4'}}>{props.unit}</span></div></div>
      <div style={{marginTop:32,paddingLeft:18,borderLeft:'3px solid #bd4d38',fontSize:17,lineHeight:1.55}}>{props.story.turningPoint}</div>
    </aside>

    <div style={{position:'absolute',left:330,right:330,bottom:66,padding:'18px 24px',background:'#bd4d38',color:'#fff',fontSize:20,fontWeight:700,textAlign:'center',opacity:conclusion,transform:`translateY(${(1-conclusion)*14}px)`}}>{props.story.takeaway}</div>
    <footer style={{position:'absolute',left:72,right:72,bottom:28,display:'flex',justifyContent:'space-between',fontSize:13,color:'#777c76'}}><span>来源：{props.source}</span><span>逐帧排名 · 最终静止 1.5 秒</span></footer>
  </AbsoluteFill>;
};
