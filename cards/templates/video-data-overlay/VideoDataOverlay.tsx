import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type Metric = {id: string; label: string; value: number; unit: string; color: string; iconSrc?: string};
type TrackingKeyframe = {frame: number; x: number; y: number};
export type VideoDataOverlayProps = {
  layout: 'negative_space' | 'tracked_callout';
  videoSrc: string;
  title: string;
  subtitle: string;
  source: string;
  conclusion: string;
  metrics: Metric[];
  tracking: {label: string; value: number; unit: string; color: string; iconSrc?: string; keyframes: TrackingKeyframe[]};
};

const font = 'Inter, "Noto Sans SC", sans-serif';
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const trackingPosition = (keyframes: TrackingKeyframe[], frame: number) => {
  const points = [...keyframes].sort((left, right) => left.frame - right.frame);
  if (!points.length) return {x: 0.72, y: 0.42};
  if (frame <= points[0].frame) return points[0];
  if (frame >= points.at(-1)!.frame) return points.at(-1)!;
  const rightIndex = points.findIndex(point => point.frame >= frame);
  const left = points[rightIndex - 1];
  const right = points[rightIndex];
  const progress = (frame - left.frame) / Math.max(1, right.frame - left.frame);
  return {x: left.x + (right.x - left.x) * progress, y: left.y + (right.y - left.y) * progress};
};

const VideoDataOverlay: React.FC<VideoDataOverlayProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const freezeAt = durationInFrames - Math.round(1.2 * fps);
  const motionFrame = Math.min(frame, freezeAt);
  const intro = interpolate(motionFrame, [0, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const evidence = interpolate(motionFrame, [42, 116], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const settle = interpolate(motionFrame, [156, 194], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const anchor = trackingPosition(props.tracking.keyframes, motionFrame);
  const anchorX = anchor.x * 1920;
  const anchorY = anchor.y * 1080;
  const isTracked = props.layout === 'tracked_callout';
  const max = Math.max(1, ...props.metrics.map(metric => Math.abs(metric.value)));

  return <AbsoluteFill style={{background: '#071014', color: '#f7f8f7', fontFamily: font, overflow: 'hidden'}}>
    <Freeze frame={motionFrame}>
      <OffthreadVideo src={staticFile(props.videoSrc)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
    </Freeze>
    <AbsoluteFill style={{background: isTracked
      ? 'linear-gradient(90deg,rgba(4,10,13,.88) 0%,rgba(4,10,13,.54) 31%,rgba(4,10,13,.08) 58%,rgba(4,10,13,.18) 100%)'
      : 'linear-gradient(90deg,rgba(4,10,13,.96) 0%,rgba(4,10,13,.78) 29%,rgba(4,10,13,.16) 60%,rgba(4,10,13,.08) 100%)'}}/>
    <div style={{position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,.08)'}}/>

    <header style={{position: 'absolute', left: 72, right: 72, top: 48, opacity: intro}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><span style={{fontSize: 15, fontWeight: 850, letterSpacing: 3, color: props.tracking.color}}>VIDEO × DATA</span><span style={{fontSize: 14, color: '#bac4c7'}}>真实视频输入 · 时间同步 · 主体避让</span></div>
      <div style={{height: 1, marginTop: 20, background: 'rgba(255,255,255,.22)'}}/>
    </header>

    <section style={{position: 'absolute', left: 78, top: 150, width: isTracked ? 600 : 650, opacity: intro, transform: `translateY(${(1 - intro) * 18}px)`}}>
      <h1 style={{margin: 0, fontSize: isTracked ? 52 : 59, lineHeight: 1.16, letterSpacing: -1}}>{props.title}</h1>
      <p style={{maxWidth: 590, margin: '18px 0 0', fontSize: 22, lineHeight: 1.55, color: '#c2cccf'}}>{props.subtitle}</p>
    </section>

    {isTracked ? <>
      <div style={{position: 'absolute', left: 80, top: 430, width: 540, padding: '22px 24px', border: '1px solid rgba(255,255,255,.24)', borderRadius: 13, background: 'rgba(4,15,18,.78)', backdropFilter: 'blur(8px)', opacity: evidence}}>
        <div style={{fontSize: 13, color: '#9cb0b6', letterSpacing: 2}}>LIVE SIGNAL</div>
        <div style={{marginTop: 13, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}><strong style={{fontSize: 26,display:'flex',alignItems:'center',gap:12}}><EntityIcon src={props.tracking.iconSrc} size={38}/>{props.tracking.label}</strong><b style={{fontSize: 47, color: props.tracking.color}}>{props.tracking.value}<small style={{marginLeft: 8, fontSize: 18, color: '#c5ced0'}}>{props.tracking.unit}</small></b></div>
        <div style={{height: 6, marginTop: 18, borderRadius: 5, background: 'rgba(255,255,255,.12)'}}><div style={{height: '100%', width: `${evidence * 100}%`, borderRadius: 5, background: props.tracking.color}}/></div>
      </div>
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: evidence}}>
        <path d={`M 620 545 C 840 545, ${anchorX - 180} ${anchorY - 46}, ${anchorX} ${anchorY}`} fill="none" stroke={props.tracking.color} strokeWidth="3" strokeDasharray="9 9"/>
        <circle cx={anchorX} cy={anchorY} r={18 + 7 * Math.sin(motionFrame / 7)} fill="none" stroke={props.tracking.color} strokeWidth="3"/>
        <circle cx={anchorX} cy={anchorY} r="6" fill={props.tracking.color}/>
      </svg>
    </> : <div style={{position: 'absolute', left: 78, top: 455, width: 630, display: 'grid', gap: 15}}>
      {props.metrics.slice(0, 4).map((metric, index) => <div key={metric.id} style={{display: 'grid', gridTemplateColumns: '170px minmax(0,1fr) 118px', alignItems: 'center', gap: 15, opacity: interpolate(evidence, [index * .13, index * .13 + .42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `translateX(${(1 - evidence) * -14}px)`}}>
        <span style={{fontSize: 19, color: '#d3dadc',display:'flex',alignItems:'center',gap:10}}><EntityIcon src={metric.iconSrc} size={32}/>{metric.label}</span><div style={{height: 13, borderRadius: 8, background: 'rgba(255,255,255,.13)'}}><div style={{height: '100%', width: `${Math.abs(metric.value) / max * evidence * 100}%`, borderRadius: 8, background: metric.color}}/></div><strong style={{fontSize: 28, textAlign: 'right'}}>{Math.round(metric.value * evidence * 10) / 10}<small style={{marginLeft: 5, fontSize: 15, color: '#9daeb3'}}>{metric.unit}</small></strong>
      </div>)}
    </div>}

    <div style={{position: 'absolute', left: 330, right: 330, bottom: 72, padding: '18px 25px', border: `1px solid ${props.tracking.color}`, borderRadius: 12, background: 'rgba(4,17,20,.9)', backdropFilter: 'blur(10px)', textAlign: 'center', fontSize: 21, lineHeight: 1.45, fontWeight: 720, opacity: settle, transform: `translateY(${(1 - settle) * 15}px)`}}>{props.conclusion}</div>
    <footer style={{position: 'absolute', left: 72, right: 72, bottom: 28, display: 'flex', justifyContent: 'space-between', color: '#aab7bb', fontSize: 13}}><span>来源：{props.source}</span><span>{isTracked ? '关键帧锚点跟踪' : '负空间数据叠加'} · 最终静止 1.2 秒</span></footer>
  </AbsoluteFill>;
};

export {VideoDataOverlay, trackingPosition};
