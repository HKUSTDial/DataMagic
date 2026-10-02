import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {activeRow, reveal, sceneFont, validateRows, type EvidenceRow} from '../../src/sceneTiming';
import {EntityIcon} from '../../src/entityVisuals';

export type PortraitRankedRevealProps = {title: string; question: string; metricLabel: string; unit: string; maximum: number; source: string; takeaway: string; rows: EvidenceRow[]; fontFamily?: string};

export function validatePortraitRanking(props: PortraitRankedRevealProps, duration = 10) {
  validateRows(props.rows, props.maximum, duration);
  if (props.rows.length > 4) throw new Error('Portrait ranking supports 2 to 4 rows.');
  for (const [key, limit] of Object.entries({title: 24, question: 48, metricLabel: 16, unit: 6, source: 56, takeaway: 48})) {
    const value = props[key as keyof PortraitRankedRevealProps];
    if (typeof value !== 'string' || !value.trim() || value.length > limit) throw new Error(`${key} must contain 1 to ${limit} characters.`);
  }
  for (const row of props.rows) {
    if (row.label.length > 12 || row.caption.length > 40 || row.at < 1.5 || row.at > duration - 2.8) throw new Error('Portrait rows need short labels/captions and room for the hook and conclusion.');
  }
  const ordered = [...props.rows].sort((a, b) => a.at - b.at);
  if (ordered.some((row, index) => index > 0 && row.value < ordered[index - 1].value)) throw new Error('Countdown reveals must proceed from the lowest to the highest value.');
}

export const PortraitRankedReveal: React.FC<PortraitRankedRevealProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  validatePortraitRanking(props, durationInFrames / fps);
  const seconds = frame / fps;
  const sorted = [...props.rows].sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
  const active = activeRow(props.rows, seconds);
  const end = Math.max(...props.rows.map(row => row.at)) + 1.0;
  const conclusion = reveal(seconds, end, 0.5);
  return <AbsoluteFill style={{background: '#101c2c', color: '#f5f7fc', fontFamily: props.fontFamily ?? sceneFont}}>
    <div style={{position: 'absolute', left: 80, right: 160, top: 135}}>
      <div style={{fontSize: 27, fontWeight: 700, letterSpacing: 2, color: '#72ddd1'}}>DATAMAGIC CARDS / 竖屏榜单</div>
      <h1 style={{fontSize: 66, lineHeight: 1.25, margin: '32px 0 22px', overflowWrap: 'anywhere'}}>{props.title}</h1>
      <div style={{fontSize: 32, lineHeight: 1.55, color: '#c7d2e1'}}>{props.question}</div>
    </div>
    <section style={{position: 'absolute', left: 80, right: 160, top: 510}}>
      <div style={{fontSize: 26, color: '#c7d2e1', display: 'flex', justifyContent: 'space-between', marginBottom: 28}}><span>{props.metricLabel}</span><span>0–{props.maximum} {props.unit}</span></div>
      {sorted.map(row => {
        const progress = reveal(seconds, row.at, 0.7);
        const visible = seconds >= row.at;
        const rank = sorted.findIndex(other => other.value === row.value) + 1;
        const highlighted = active?.id === row.id || (seconds >= end && rank === 1);
        return <div key={row.id} style={{height: 168, borderTop: '1px solid #354355', paddingTop: 26, boxSizing: 'border-box'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <span style={{fontSize: 30, color: '#8594a9', width: 48}}>{String(rank).padStart(2, '0')}</span>
            {row.iconSrc ? <div style={{width: 56, height: 56, flexShrink: 0, opacity: progress}}>{visible ? <EntityIcon src={row.iconSrc} size={56}/> : null}</div> : null}
            <strong style={{fontSize: 36, flex: 1, minWidth: 0, color: highlighted ? '#72ddd1' : '#f5f7fc'}}>{visible ? row.label : '待揭晓'}</strong>
            <strong style={{fontSize: 48, opacity: progress, fontVariantNumeric: 'tabular-nums'}}>{row.value}</strong>
          </div>
          <div style={{height: 22, background: '#263449', marginTop: 22, borderRadius: 5, overflow: 'hidden'}}><div style={{height: '100%', width: `${row.value / props.maximum * progress * 100}%`, background: row.color ?? (highlighted ? '#72ddd1' : '#7697bc'), opacity: row.color && !highlighted ? 0.75 : 1}} /></div>
        </div>;
      })}
    </section>
    <div style={{position: 'absolute', left: 80, right: 160, top: 1295, minHeight: 205, padding: '28px 32px', boxSizing: 'border-box', background: '#1d3044', borderLeft: '5px solid #72ddd1'}}>
      <div style={{fontSize: 25, color: '#72ddd1', marginBottom: 14}}>{seconds >= end ? '关键结论' : `${props.rows.filter(row => row.at <= seconds).length} / ${props.rows.length} 已揭晓`}</div>
      <div style={{fontSize: 35, lineHeight: 1.5}}>{seconds >= end ? props.takeaway : active?.caption || '从榜单末位开始，看看谁最终领先。'}</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: '#72ddd1', transform: `scaleX(${conclusion})`, transformOrigin: 'left'}} />
    </div>
    <footer style={{position: 'absolute', left: 80, right: 160, bottom: 265, fontSize: 24, lineHeight: 1.5, color: '#a7b7cc', borderTop: '1px solid #354355', paddingTop: 24}}>{props.source}</footer>
  </AbsoluteFill>;
};
