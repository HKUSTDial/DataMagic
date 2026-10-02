import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {activeRow, EvidenceRow, reveal, sceneFont, validateRows} from '../../src/sceneTiming';
import {EntityIcon} from '../../src/entityVisuals';

export type RankedRevealProps = {title: string; question: string; source: string; takeaway: string; rows: EvidenceRow[]; metricLabel: string; maximum: number; unit: string; plate?: boolean; fontFamily?: string};
export const RankedReveal: React.FC<RankedRevealProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const seconds = frame / fps;
  validateRows(props.rows, props.maximum, durationInFrames / fps);
  const sorted = [...props.rows].sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
  const active = activeRow(props.rows, seconds);
  const end = Math.max(...props.rows.map(row => row.at)) + 1.2;
  return <AbsoluteFill style={{background: '#fbfbfc', color: '#202128', fontFamily: props.fontFamily ?? sceneFont}}>
    <div style={{position: 'absolute', left: 76, top: 76, width: 560}}>
      <div style={{fontSize: 20, fontWeight: 700, color: '#ab3d48'}}>DataMagic Cards / 榜单解读</div>
      <h1 style={{fontSize: 59, lineHeight: 1.2, margin: '40px 0 28px'}}>{props.title}</h1>
      <p style={{fontSize: 28, lineHeight: 1.55, color: '#61636f', margin: 0}}>{props.question}</p>
      <div style={{marginTop: 68, paddingTop: 28, borderTop: '3px solid #c74a59', fontSize: 29, lineHeight: 1.55, color: '#8e3340', visibility: props.plate ? 'hidden' : 'visible'}}>{seconds >= end ? props.takeaway : active?.caption || '从榜单末位开始，逐项揭晓。'}</div>
      <div style={{marginTop: 32, fontSize: 19, color: '#73757e'}}>{Math.min(props.rows.length, props.rows.filter(row => row.at <= seconds).length)} / {props.rows.length} 已揭晓</div>
    </div>
    <section style={{position: 'absolute', left: 735, right: 76, top: 102}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#73757e', paddingBottom: 30}}><span>{props.metricLabel}</span><span>0–{props.maximum} {props.unit}</span></div>
      {sorted.map((row, index) => {
        const progress = reveal(seconds, row.at, 0.8);
        const visible = seconds >= row.at;
        const rank = sorted.findIndex(other => other.value === row.value) + 1;
        const highlight = active?.id === row.id || (seconds >= end && rank === 1);
        return <div key={row.id} style={{height: 166, position: 'relative', borderTop: '1px solid #d8d9df', display: 'grid', gridTemplateColumns: '70px 1fr 110px', gap: 20, alignItems: 'center'}}>
          <span style={{fontSize: 27, color: '#9698a1'}}>{String(rank).padStart(2, '0')}</span>
          <div style={{opacity: visible ? 1 : 0.35}}><div style={{display: 'flex', alignItems: 'center', gap: 14}}>{row.iconSrc ? <div style={{width: 50, height: 50, flexShrink: 0, opacity: progress}}>{visible ? <EntityIcon src={row.iconSrc} size={50}/> : null}</div> : null}<strong style={{fontSize: 30, color: highlight ? row.color ?? '#a33847' : '#343744'}}>{visible ? row.label : '待揭晓'}</strong></div><div style={{marginTop: 22, width: '100%', height: 20, background: '#ececf0'}}><div style={{height: '100%', width: `${row.value / props.maximum * progress * 100}%`, background: row.color ?? (highlight ? '#c74a59' : '#929aaf'), opacity: row.color && !highlight ? 0.72 : 1}} /></div></div>
          <strong style={{fontSize: 44, textAlign: 'right', color: highlight ? '#a33847' : '#343744', opacity: progress}}>{row.value}</strong>
        </div>;
      })}
    </section>
    <footer style={{position: 'absolute', left: 76, right: 76, bottom: 44, paddingTop: 20, borderTop: '1px solid #d8d9df', color: '#73757e', fontSize: 18}}>{props.source}</footer>
  </AbsoluteFill>;
};
