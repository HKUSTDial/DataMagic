import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type SpatialPercentOverlayProps = {
  title: string;
  context: string;
  metricLabel: string;
  entityLabel: string;
  entityIconSrc?: string;
  value: number;
  unit: string;
  takeaway: string;
  source: string;
  backgroundSrc: string;
  accentColor: string;
};

const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
const clamp = (value: number) => Math.min(100, Math.max(0, value));

export const SpatialPercentOverlay: React.FC<SpatialPercentOverlayProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const intro = spring({frame, fps, durationInFrames: Math.round(0.8 * fps), config: {damping: 180}});
  const metricProgress = interpolate(
    frame,
    [0.7 * fps, 2.6 * fps],
    [0, clamp(props.value) / 100],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)},
  );
  const displayValue = metricProgress * 100;
  const waveY = 410 - metricProgress * 380;
  const waveOffset = Math.sin((frame / fps) * Math.PI * 2 * 0.55) * 14;
  const backgroundScale = interpolate(frame, [0, durationInFrames], [1.045, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const calloutCenterX = 1450;
  const calloutCenterY = 570;

  return (
    <AbsoluteFill style={{backgroundColor: '#0d1621', color: '#fff', fontFamily, overflow: 'hidden'}}>
      <Img
        src={staticFile(props.backgroundSrc)}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${backgroundScale})`, filter: 'brightness(.58) saturate(.82) contrast(1.06)'}}
      />
      <div style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(7, 16, 28, .25)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 780, backgroundColor: 'rgba(5, 13, 24, .72)'}} />

      <div style={{position: 'absolute', left: 84, top: 70, display: 'flex', alignItems: 'center', gap: 16, opacity: intro}}>
        <span style={{width: 6, height: 42, backgroundColor: props.accentColor}} />
        <strong style={{fontSize: 22}}>DATAMAGIC CARDS</strong>
        <span style={{color: 'rgba(255,255,255,.65)', fontSize: 20}}>{props.context}</span>
      </div>

      <div style={{position: 'absolute', left: 84, top: 252, width: 620, opacity: intro, transform: `translateY(${(1 - intro) * 26}px)`}}>
        <p style={{margin: 0, color: props.accentColor, fontSize: 19, fontWeight: 700}}>CONTEXTUAL DATA OVERLAY</p>
        <h1 style={{margin: '22px 0 18px', fontSize: 68, lineHeight: 1.12, fontWeight: 700, letterSpacing: 0}}>{props.title}</h1>
        <p style={{margin: 0, maxWidth: 570, color: 'rgba(255,255,255,.76)', fontSize: 25, lineHeight: 1.58}}>{props.takeaway}</p>
      </div>

      <div style={{position: 'absolute', left: 84, bottom: 128, width: 620, padding: '22px 25px', borderLeft: `5px solid ${props.accentColor}`, backgroundColor: 'rgba(8, 18, 30, .72)', opacity: intro}}>
        <div style={{color: 'rgba(255,255,255,.57)', fontSize: 16}}>镜头规则</div>
        <div style={{marginTop: 9, fontSize: 20, lineHeight: 1.5}}>实景负责语境；数值、标签、液位与来源全部由结构化数据渲染。</div>
      </div>

      <div style={{position: 'absolute', left: calloutCenterX - 220, top: calloutCenterY - 220, width: 440, height: 440, opacity: intro, transform: `scale(${0.9 + intro * 0.1})`}}>
        {[0, 1, 2].map(index => (
          <div key={index} style={{position: 'absolute', inset: index * -34, border: `2px solid rgba(115, 220, 255, ${0.24 - index * 0.05})`, borderRadius: '50%'}} />
        ))}
        <svg width="440" height="440" viewBox="0 0 440 440" style={{position: 'absolute', inset: 0}}>
          <defs>
            <clipPath id="spatial-percent-circle"><circle cx="220" cy="220" r="190" /></clipPath>
            <linearGradient id="spatial-percent-liquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={props.accentColor} stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0b4057" stopOpacity="0.96" />
            </linearGradient>
          </defs>
          <circle cx="220" cy="220" r="190" fill="rgba(7, 19, 32, .82)" stroke="rgba(182,232,248,.62)" strokeWidth="4" />
          <g clipPath="url(#spatial-percent-circle)">
            <path
              d={`M -20 ${waveY} Q 65 ${waveY - waveOffset} 140 ${waveY} T 300 ${waveY} T 460 ${waveY} L 460 430 L -20 430 Z`}
              fill="url(#spatial-percent-liquid)"
            />
            <path
              d={`M -20 ${waveY} Q 65 ${waveY - waveOffset} 140 ${waveY} T 300 ${waveY} T 460 ${waveY}`}
              fill="none"
              stroke={props.accentColor}
              strokeWidth="9"
            />
          </g>
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', textShadow: '0 3px 16px rgba(0,0,0,.52)'}}>
          <div style={{fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,.82)'}}>{props.metricLabel}</div>
          <div style={{marginTop: 12, fontSize: 92, lineHeight: 1, fontWeight: 700, letterSpacing: 0, color: '#fff'}}>{displayValue.toFixed(1)}<span style={{marginLeft: 3, fontSize: 42, color: 'rgba(255,255,255,.86)'}}>{props.unit}</span></div>
          <div style={{width: 52, height: 3, margin: '20px 0 14px', borderRadius: 2, backgroundColor: props.accentColor}} />
          <div style={{fontSize: 21, fontWeight: 600, color: 'rgba(255,255,255,.82)',display:'flex',alignItems:'center',gap:12}}><EntityIcon src={props.entityIconSrc} size={40}/>{props.entityLabel}</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 84, right: 84, bottom: 52, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.28)', display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,.67)', fontSize: 15}}>
        <span>来源：{props.source}</span>
        <span>演示背景由生成模型创建；数据层独立且可编辑</span>
      </div>
    </AbsoluteFill>
  );
};
