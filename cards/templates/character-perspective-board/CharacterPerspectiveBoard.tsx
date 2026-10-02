import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {activeRow, reveal, sceneFont, type EvidenceRow} from '../../src/sceneTiming';
import {heldMediaFrame, validateStory} from './timing';
export type CharacterPerspectiveBoardProps = {
  title: string; question: string; takeaway: string; source: string;
  presenter: {src: string; type: 'image' | 'video'; label: string; durationSeconds?: number};
  metricLabel: string; unit: string; maximum: number; rows: EvidenceRow[];
  conclusionAt: number; tiltDegrees: number;
};
export const CharacterPerspectiveBoard: React.FC<CharacterPerspectiveBoardProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const seconds = frame / fps;
  validateStory(props.rows, props.maximum, durationInFrames / fps, props.conclusionAt, props.tiltDegrees);
  const active = activeRow(props.rows, seconds);
  const board = reveal(seconds, 1.2, .9);
  const finished = seconds >= props.conclusionAt;
  const mediaFrame = props.presenter.type === 'video' ? heldMediaFrame(frame, fps, Number(props.presenter.durationSeconds)) : frame;
  return <AbsoluteFill style={{background: '#102c32', color: '#f3f3e9', fontFamily: sceneFont, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 10% 50%,#23525a,transparent 60%),linear-gradient(125deg,transparent,#091f24)'}} />
    <header style={{position: 'absolute', top: 52, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', fontSize: 19, letterSpacing: 2, color: '#9bc4c2'}}><span>DATAMAGIC / 角色数据故事</span><span>生成角色 · 演示数据</span></header>
    <div style={{position: 'absolute', left: 72, top: 134, width: 530, height: 688, borderRadius: 28, overflow: 'hidden', border: '1px solid #8ab2b144', boxShadow: '0 30px 70px #0005'}}>
      {props.presenter.type === 'image' ? <Img src={staticFile(props.presenter.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Freeze frame={mediaFrame}><OffthreadVideo muted src={staticFile(props.presenter.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Freeze>}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '25px 28px', background: 'linear-gradient(transparent,#102c32)', fontSize: 23, fontWeight: 700}}>{props.presenter.label}</div>
    </div>
    <section style={{position: 'absolute', left: 672, top: 136, width: 1136, height: 688, padding: '34px 44px', boxSizing: 'border-box', background: '#f7f3e8', color: '#183839', borderRadius: 24, border: '2px solid #d1dfcc', boxShadow: '14px 22px 0 #071d2266,0 32px 75px #0004', opacity: board, transformOrigin: '50% 50%', transform: `perspective(1800px) translateX(${(1-board)*45}px) rotateY(${props.tiltDegrees}deg) rotateZ(-0.6deg)`}}>
      <div style={{fontSize: 18, color: '#477e77', fontWeight: 700, letterSpacing: 2}}>设问 · 分步证据 · 结论</div>
      <h1 style={{fontSize: 43, lineHeight: 1.3, margin: '15px 0 12px'}}>{props.title}</h1>
      <p style={{fontSize: 25, lineHeight: 1.45, margin: 0, color: '#49615b'}}>{props.question}</p>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 19, color: '#57786e', marginTop: 30, paddingBottom: 14, borderBottom: '1px solid #cbd9ca'}}><span>{props.metricLabel}</span><span>共同尺度 0–{props.maximum}{props.unit}</span></div>
      {props.rows.map(row => {
        const progress = reveal(seconds, row.at);
        const focus = active?.id === row.id && !finished;
        return <div key={row.id} style={{height: 106, display: 'grid', gridTemplateColumns: '240px 1fr 170px', gap: 20, alignItems: 'center', opacity: .2 + .8 * progress, borderBottom: '1px solid #dce3d5'}}>
          <span style={{fontSize: 28, fontWeight: focus ? 700 : 400,display:'flex',alignItems:'center',gap:12}}><EntityIcon src={row.iconSrc} size={40}/>{row.label}</span>
          <div style={{height: 31, borderRadius: 5, background: '#dce5d5', overflow: 'hidden'}}><div style={{height: '100%', width: `${row.value / props.maximum * progress * 100}%`, background: focus ? '#137b6e' : '#749d89', borderRadius: 5}} /></div>
          <strong style={{fontSize: 40, textAlign: 'right', opacity: progress}}>{row.value}<small style={{fontSize: 21, marginLeft: 4}}>{props.unit}</small></strong>
        </div>;
      })}
      <div style={{marginTop: 23, fontSize: 18, color: '#57786e'}}>{finished ? '证据已完整呈现 · 看下方结论' : active ? `正在解读：${active.label}` : '先读问题，再看数据'}</div>
    </section>
    <div style={{position: 'absolute', left: 76, right: 92, top: 868, minHeight: 92, display: 'flex', alignItems: 'center', gap: 28, padding: '16px 28px', boxSizing: 'border-box', borderRadius: 14, background: finished ? '#c9e6be' : '#ffffff0d', color: finished ? '#1c3b33' : '#d6e6dc'}}>
      <strong style={{fontSize: 22, minWidth: 88, color: finished ? '#266545' : '#94beb3'}}>{finished ? '结论' : active ? '证据' : '先设问'}</strong>
      <span style={{fontSize: 28, lineHeight: 1.45}}>{finished ? props.takeaway : active?.caption || props.question}</span>
    </div>
    <footer style={{position: 'absolute', left: 76, bottom: 36, right: 76, fontSize: 17, color: '#8cb0aa', lineHeight: 1.5}}>{props.source}</footer>
  </AbsoluteFill>;
};
