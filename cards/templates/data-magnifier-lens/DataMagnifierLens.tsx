import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type DataMagnifierLensProps = {
  title: string;
  subtitle: string;
  labels: string[];
  values: number[];
  unit: string;
  insight: string;
  source: string;
  accentColor: string;
};

const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
const area = {left: 135, top: 300, width: 1180, height: 520};

export const DataMagnifierLens: React.FC<DataMagnifierLensProps> = props => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, durationInFrames: Math.round(.65 * fps), config: {damping: 180}});
  const maxValue = Math.max(...props.values);
  const minValue = Math.min(...props.values);
  const range = Math.max(1, maxValue - minValue);
  const points = props.values.map((value, index) => ({
    x: area.left + index / Math.max(1, props.values.length - 1) * area.width,
    y: area.top + area.height - ((value - minValue) / range * area.height * .78 + area.height * .1),
    value,
  }));
  const focusIndex = props.values.indexOf(maxValue);
  const scan = interpolate(frame, [fps * .9, fps * 4.8], [0, focusIndex], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const lower = Math.floor(scan);
  const upper = Math.min(focusIndex, lower + 1);
  const mix = scan - lower;
  const lensX = interpolate(mix, [0, 1], [points[lower].x, points[upper].x]);
  const lensY = interpolate(mix, [0, 1], [points[lower].y, points[upper].y]);
  const reveal = interpolate(frame, [fps * .5, fps * 2.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const callout = spring({frame: frame - Math.round(4.7 * fps), fps, durationInFrames: Math.round(.8 * fps), config: {damping: 160}});

  return <AbsoluteFill style={{backgroundColor: '#0d1520', color: '#f7fbff', fontFamily, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 72% 35%, rgba(39, 100, 160, .25), transparent 38%)'}} />
    <div style={{position: 'absolute', left: 84, top: 66, right: 84, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: intro}}>
      <div style={{maxWidth: 1160}}><div style={{color: props.accentColor, fontSize: 18, fontWeight: 700}}>FOCUS THE ANOMALY</div><h1 style={{margin: '18px 0 10px', fontSize: 60, lineHeight: 1.1, letterSpacing: 0}}>{props.title}</h1><p style={{margin: 0, color: '#9aabbc', fontSize: 23}}>{props.subtitle}</p></div>
      <div style={{padding: '18px 22px', border: '1px solid #2d3c4c', borderRadius: 8, color: '#a9b7c5', fontSize: 17}}>数据放大镜 · 可编辑焦点</div>
    </div>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      {[0, .25, .5, .75, 1].map(t => <line key={t} x1={area.left} y1={area.top + area.height * t} x2={area.left + area.width} y2={area.top + area.height * t} stroke="#263646" strokeWidth="1" />)}
      <path d={path} fill="none" stroke={props.accentColor} strokeWidth="7" pathLength={1} strokeDasharray={`${reveal} 1`} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => <g key={index} opacity={index / Math.max(1, points.length - 1) <= reveal + .1 ? 1 : .16}><circle cx={point.x} cy={point.y} r={8} fill="#0d1520" stroke={props.accentColor} strokeWidth={4} /><text x={point.x} y={area.top + area.height + 42} textAnchor="middle" fontFamily={fontFamily} fontSize="18" fill="#8091a2">{props.labels[index]}</text></g>)}
      <circle cx={lensX} cy={lensY} r="115" fill="rgba(9, 22, 35, .83)" stroke="#fff" strokeWidth="6" />
      <circle cx={lensX} cy={lensY} r="92" fill="none" stroke={props.accentColor} strokeWidth="3" strokeDasharray="8 10" />
      <line x1={lensX + 82} y1={lensY + 82} x2={lensX + 166} y2={lensY + 166} stroke="#fff" strokeWidth="24" strokeLinecap="round" />
      <circle cx={lensX} cy={lensY} r="13" fill={props.accentColor} />
      <text x={lensX} y={lensY - 12} textAnchor="middle" fontFamily={fontFamily} fontSize="21" fontWeight="700" fill="#fff">{props.labels[Math.round(scan)]}</text>
      <text x={lensX} y={lensY + 35} textAnchor="middle" fontFamily={fontFamily} fontSize="38" fontWeight="700" fill={props.accentColor}>{Math.round(points[Math.round(scan)].value)}{props.unit}</text>
    </svg>
    <div style={{position: 'absolute', right: 92, top: 385, width: 395, padding: '34px 34px 30px', borderRadius: 8, backgroundColor: '#f7fbff', color: '#14202b', boxShadow: '0 24px 70px rgba(0,0,0,.28)', opacity: callout, transform: `translateX(${(1 - callout) * 36}px)`}}>
      <div style={{fontSize: 17, fontWeight: 700, color: props.accentColor}}>关键异常</div><div style={{marginTop: 16, fontSize: 66, lineHeight: 1, fontWeight: 700}}>{maxValue}{props.unit}</div><p style={{margin: '22px 0 0', fontSize: 23, lineHeight: 1.5, color: '#536272'}}>{props.insight}</p>
    </div>
    <div style={{position: 'absolute', left: 84, right: 84, bottom: 40, paddingTop: 16, borderTop: '1px solid #314151', display: 'flex', justifyContent: 'space-between', color: '#8293a4', fontSize: 15}}><span>来源：{props.source}</span><span>放大镜只强调已有数据，不改变原始比例</span></div>
  </AbsoluteFill>;
};
