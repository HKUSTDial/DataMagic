import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Row = {label: string; value: number; iconSrc?: string};
export type SourceToInsightProps = {title: string; question: string; rows: Row[]; unit: string; takeaway: string; source: string};
const fontFamily = 'Inter, "Noto Sans SC", sans-serif';

export const SourceToInsight: React.FC<SourceToInsightProps> = props => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, durationInFrames: Math.round(.7 * fps), config: {damping: 180}});
  const tableIn = spring({frame: frame - Math.round(.5 * fps), fps, durationInFrames: Math.round(.7 * fps), config: {damping: 170}});
  const pipeline = interpolate(frame, [fps * 1.5, fps * 3.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const chartIn = spring({frame: frame - Math.round(2.6 * fps), fps, durationInFrames: Math.round(.8 * fps), config: {damping: 160}});
  const insightIn = spring({frame: frame - Math.round(4.8 * fps), fps, durationInFrames: Math.round(.8 * fps), config: {damping: 160}});
  const max = Math.max(...props.rows.map(row => row.value));

  return <AbsoluteFill style={{backgroundColor: '#f7f5f0', color: '#15191e', fontFamily, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 82, top: 64, right: 82, opacity: intro}}><div style={{fontSize: 18, fontWeight: 700, color: '#cf7416'}}>SOURCE → TRANSFORM → INSIGHT</div><h1 style={{margin: '16px 0 8px', fontSize: 56, lineHeight: 1.1, letterSpacing: 0}}>{props.title}</h1><p style={{margin: 0, fontSize: 23, color: '#68717a'}}>{props.question}</p></div>
    <section style={{position: 'absolute', left: 82, top: 255, width: 520, height: 580, padding: '28px', border: '1px solid #d8d3c9', borderRadius: 8, backgroundColor: '#fff', opacity: tableIn, transform: `translateY(${(1 - tableIn) * 24}px)`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}><strong style={{fontSize: 22}}>01 原始数据</strong><span style={{fontSize: 15, color: '#878176'}}>CSV</span></div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 135px', padding: '12px 14px', backgroundColor: '#f1eee8', color: '#777167', fontSize: 16}}><span>地区</span><span style={{textAlign: 'right'}}>活跃用户</span></div>
      {props.rows.map((row, index) => {
        const rowIn = spring({frame: frame - Math.round((.8 + index * .12) * fps), fps, durationInFrames: Math.round(.45 * fps), config: {damping: 170}});
        return <div key={row.label} style={{display: 'grid', gridTemplateColumns: '1fr 135px', padding: '20px 14px', borderBottom: '1px solid #ece8e0', fontSize: 20, opacity: rowIn}}><span style={{display:'flex',alignItems:'center',gap:10}}><EntityIcon src={row.iconSrc} size={30}/>{row.label}</span><strong style={{textAlign: 'right'}}>{row.value}{props.unit}</strong></div>;
      })}
    </section>
    <section style={{position: 'absolute', left: 650, top: 337, width: 260, textAlign: 'center'}}>
      <div style={{fontSize: 16, color: '#8a8174'}}>02 结构转换</div>
      <svg width="260" height="270" viewBox="0 0 260 270"><path d="M 22 135 C 85 20, 175 20, 238 135 C 175 250, 85 250, 22 135" fill="none" stroke="#d3b48a" strokeWidth="7" pathLength={1} strokeDasharray={`${pipeline} 1`} /><circle cx="130" cy="135" r="54" fill="#15191e" opacity={pipeline} /><text x="130" y="128" textAnchor="middle" fill="#fff" fontFamily={fontFamily} fontSize="18" fontWeight="700">SORT</text><text x="130" y="154" textAnchor="middle" fill="#cfb99d" fontFamily={fontFamily} fontSize="15">NORMALIZE</text></svg>
      <div style={{fontSize: 17, color: '#766f65', opacity: pipeline}}>清洗 · 排序 · 映射</div>
    </section>
    <section style={{position: 'absolute', left: 955, top: 255, right: 82, height: 580, padding: '28px 34px', borderRadius: 8, backgroundColor: '#15191e', color: '#fff', opacity: chartIn, transform: `translateX(${(1 - chartIn) * 34}px)`}}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}><strong style={{fontSize: 22}}>03 可视化结论</strong><span style={{fontSize: 15, color: '#a7adb3'}}>RANKED BAR</span></div>
      <div style={{marginTop: 38, display: 'grid', gap: 18}}>{[...props.rows].sort((a,b) => b.value-a.value).map((row,index) => {const bar = interpolate(frame, [fps * (3 + index * .12), fps * (4 + index * .12)], [0, row.value / max], {extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)}); return <div key={row.label}><div style={{display:'flex',justifyContent:'space-between',fontSize:18,marginBottom:9}}><span style={{display:'flex',alignItems:'center',gap:10}}><EntityIcon src={row.iconSrc} size={30}/>{row.label}</span><strong>{row.value}{props.unit}</strong></div><div style={{height:18,backgroundColor:'#2d3339',borderRadius:3,overflow:'hidden'}}><div style={{width:`${bar*100}%`,height:'100%',backgroundColor:index===0?'#f4a340':'#6d7d8d'}} /></div></div>;})}</div>
      <div style={{position: 'absolute', left: 34, right: 34, bottom: 30, padding: '20px 22px', borderLeft: '5px solid #f4a340', backgroundColor: '#242a30', fontSize: 22, lineHeight: 1.45, opacity: insightIn}}>{props.takeaway}</div>
    </section>
    <div style={{position: 'absolute', left: 82, right: 82, bottom: 38, paddingTop: 16, borderTop: '1px solid #d3cec4', display: 'flex', justifyContent: 'space-between', color: '#777168', fontSize: 15}}><span>来源：{props.source}</span><span>数据表、排序结果与结论保持可追溯</span></div>
  </AbsoluteFill>;
};
