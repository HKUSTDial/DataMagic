import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EvidenceRow, reveal, sceneFont, validateRows} from '../../src/sceneTiming';

export type FootageEvidenceRevealProps = {title: string; question: string; source: string; takeaway: string; videoSrc: string; videoDurationSeconds: number; rows: EvidenceRow[]; metricLabel: string; maximum: number; unit: string};
export const FootageEvidenceReveal: React.FC<FootageEvidenceRevealProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const seconds = frame / fps;
  validateRows(props.rows, props.maximum, durationInFrames / fps);
  if (props.rows.length > 3) throw new Error('This footage layout supports 2 or 3 rows.');
  if (!(props.videoDurationSeconds > 0)) throw new Error('Provide the measured video duration.');
  const panel = reveal(seconds, 1.5, 0.8);
  const takeaway = reveal(seconds, Math.max(...props.rows.map(row => row.at)) + 1);
  // Hold the final source frame if the shot outlasts the footage; never loop it.
  const mediaFrame = Math.min(frame, Math.max(0, Math.floor(props.videoDurationSeconds * fps) - 1));
  return <AbsoluteFill style={{background: '#10231e', color: '#fff', fontFamily: sceneFont, overflow: 'hidden'}}>
    <Freeze frame={mediaFrame}><OffthreadVideo muted src={staticFile(props.videoSrc)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Freeze>
    <AbsoluteFill style={{background: '#071914', opacity: 0.18 + panel * 0.24}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(7,25,20,.82),rgba(7,25,20,.5) 27%,transparent 58%)', opacity: 1 - panel}} />
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 900, background: '#10231e', opacity: panel * 0.98, transform: `translateX(${(1 - panel) * -900}px)`}} />
    <header style={{position: 'absolute', left: 72, top: 64, width: 744}}>
      <div style={{fontSize: 20, color: '#a9e9c5', fontWeight: 700}}>DataMagic Cards / 现场与数据</div>
      <h1 style={{fontSize: 49, lineHeight: 1.3, margin: '28px 0 20px'}}>{props.title}</h1>
      <p style={{fontSize: 25, lineHeight: 1.5, margin: 0, color: '#e1eee8'}}>{props.question}</p>
    </header>
    <section style={{position: 'absolute', top: 345, left: 72, width: 744, opacity: panel}}>
      <div style={{fontSize: 19, color: '#b9cfc3', marginBottom: 30}}>{props.metricLabel} / 0–{props.maximum}{props.unit}</div>
      {props.rows.map(row => {
        const progress = reveal(seconds, row.at);
        return <div key={row.id} style={{marginBottom: 38, opacity: progress, transform: `translateY(${(1 - progress) * 16}px)`}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14}}><span style={{fontSize: 27, display:'flex',alignItems:'center',gap:12}}><EntityIcon src={row.iconSrc} size={40}/>{row.label}</span><strong style={{fontSize: 40, color: '#adf2c8'}}>{row.value}<small style={{fontSize: 22}}>{props.unit}</small></strong></div>
          <div style={{height: 12, background: '#344a40'}}><div style={{height: '100%', width: `${row.value / props.maximum * progress * 100}%`, background: '#7ce6a8'}} /></div>
        </div>;
      })}
    </section>
    <div style={{position: 'absolute', right: 76, top: 68, padding: '12px 18px', background: '#10231ee8', fontSize: 18}}>AI 生成情境影像</div>
    <div style={{position: 'absolute', left: 72, bottom: 144, width: 744, borderTop: '1px solid #557567', paddingTop: 26, fontSize: 27, lineHeight: 1.5, opacity: takeaway}}>{props.takeaway}</div>
    <footer style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: '#10231ef2', padding: '24px 72px', fontSize: 18, color: '#cfdfd5'}}>{props.source}</footer>
  </AbsoluteFill>;
};
