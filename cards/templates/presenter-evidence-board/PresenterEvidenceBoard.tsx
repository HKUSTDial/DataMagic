import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {activeRow, EvidenceRow, reveal, sceneFont, validateRows} from '../../src/sceneTiming';
import {EntityIcon} from '../../src/entityVisuals';

export type PresenterEvidenceBoardProps = {
  title: string; question: string; takeaway: string; source: string;
  presenter: {src: string; type: 'image' | 'video'; label: string; durationSeconds?: number};
  metricLabel: string; unit: string; maximum: number; rows: EvidenceRow[];
  fontFamily?: string;
};

export const PresenterEvidenceBoard: React.FC<PresenterEvidenceBoardProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const seconds = frame / fps;
  validateRows(props.rows, props.maximum, durationInFrames / fps);
  if (props.rows.length > 3) throw new Error('This presenter layout supports 2 or 3 rows.');
  if (props.presenter.type === 'video' && !(Number(props.presenter.durationSeconds) > 0)) throw new Error('Provide the presenter video duration.');
  const active = activeRow(props.rows, seconds);
  const conclusionAt = Math.max(...props.rows.map(row => row.at)) + 1.2;
  const conclusion = reveal(seconds, conclusionAt);
  const mediaFrame = Math.min(frame, Math.max(0, Math.floor((props.presenter.durationSeconds || 10) * fps) - 1));
  return <AbsoluteFill style={{background: '#f7f9fa', color: '#172429', fontFamily: props.fontFamily ?? sceneFont}}>
    <div style={{position: 'absolute', left: 64, top: 64, bottom: 110, width: 530, overflow: 'hidden', borderRadius: 8, background: '#e5e8e9'}}>
      {props.presenter.type === 'image'
        ? <Img src={staticFile(props.presenter.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 25%'}} />
        : <Freeze frame={mediaFrame}><OffthreadVideo muted src={staticFile(props.presenter.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Freeze>}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '22px 26px', background: '#172429', color: '#fff', fontSize: 22}}>{props.presenter.label}</div>
    </div>
    <section style={{position: 'absolute', left: 664, right: 76, top: 76}}>
      <div style={{fontSize: 20, color: '#007968', fontWeight: 700}}>DataMagic Cards / 数据解读</div>
      <h1 style={{margin: '22px 0 18px', fontSize: 50, lineHeight: 1.25}}>{props.title}</h1>
      <p style={{fontSize: 25, color: '#58676d', margin: 0, lineHeight: 1.5}}>{props.question}</p>
      <div style={{marginTop: 38, display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#58676d'}}><span>{props.metricLabel}</span><span>共同尺度：0–{props.maximum}{props.unit}</span></div>
      <div style={{marginTop: 20}}>{props.rows.map(row => {
        const progress = reveal(seconds, row.at);
        const focused = active?.id === row.id;
        return <div key={row.id} style={{height: 116, display: 'grid', gridTemplateColumns: '230px 1fr 120px', gap: 25, alignItems: 'center', borderTop: '1px solid #d9e0e3'}}>
          <span style={{fontSize: 27, fontWeight: focused ? 700 : 400, display: 'flex', alignItems: 'center', gap: 12}}><EntityIcon src={row.iconSrc} size={48}/><span>{row.label}</span></span>
          <div style={{height: 34, background: '#e1e7e9', overflow: 'hidden'}}><div style={{height: '100%', width: `${row.value / props.maximum * progress * 100}%`, background: row.color ?? (focused ? '#009981' : '#83999d'), opacity: row.color && !focused ? 0.72 : 1}} /></div>
          <strong style={{fontSize: 34, textAlign: 'right', opacity: progress}}>{row.value}<small style={{fontSize: 20}}>{props.unit}</small></strong>
        </div>;
      })}</div>
      <div style={{marginTop: 26, minHeight: 92, padding: '18px 0 18px 24px', borderLeft: '5px solid #009981', fontSize: 27, lineHeight: 1.5, color: '#20534b'}}>
        {seconds >= conclusionAt ? props.takeaway : active?.caption || props.question}
      </div>
      <div style={{marginTop: 12, width: 130 * conclusion, height: 5, background: '#009981'}} />
    </section>
    <footer style={{position: 'absolute', left: 64, right: 76, bottom: 40, borderTop: '1px solid #ccd7da', paddingTop: 16, fontSize: 17, color: '#58676d'}}>{props.source}</footer>
  </AbsoluteFill>;
};
