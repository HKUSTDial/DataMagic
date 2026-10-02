import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimeScatterPoints, slotTitle, truncate, valueExtent, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const chart = {left: 160, top: 155, width: 860, height: 360};

export const QuadrantSplitScatterDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('scatter', scene, rawFrame, fps ?? 30);
  const emphasis = runtimeContractEase(animation);
  const palette = paletteFor(sceneContent, true);
  const points = runtimeScatterPoints(sceneContent).slice(0, 25).map((point, index) => ({...point, color: point.color || palette[index % palette.length]}));
  const title = slotTitle(sceneContent);
  if (!points.length || !title) return null;
  const xExt = valueExtent(points.map((point) => point.x));
  const yExt = valueExtent(points.map((point) => point.y));
  const xMid = (xExt.min + xExt.max) / 2;
  const yMid = (yExt.min + yExt.max) / 2;
  const xFor = (value: number) => chart.left + ((value - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
  const yFor = (value: number) => chart.top + chart.height - ((value - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
  const quadrants = [
    points.filter((p) => p.x < xMid && p.y >= yMid).length,
    points.filter((p) => p.x >= xMid && p.y >= yMid).length,
    points.filter((p) => p.x < xMid && p.y < yMid).length,
    points.filter((p) => p.x >= xMid && p.y < yMid).length,
  ];

  return (
    <AbsoluteFill style={{background: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #020617 0%, #0f172a 58%, #1e1b4b 100%)'}} />
      <EditableTransform id="runtime-quadrant-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 78, top: 58, width: 820, fontSize: 40, lineHeight: 1.04, fontWeight: 900, letterSpacing: '-0.04em', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-quadrant-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect x={chart.left - 32} y={chart.top - 28} width={chart.width + 64} height={chart.height + 56} rx={26} fill="rgba(255,255,255,0.06)" stroke="rgba(148,163,184,0.18)" />
          <line x1={xFor(xMid)} x2={xFor(xMid)} y1={chart.top} y2={chart.top + chart.height} stroke="rgba(248,250,252,0.42)" strokeWidth={2} strokeDasharray="7 7" opacity={ease(frame, [14, 32], [0, 1])} />
          <line x1={chart.left} x2={chart.left + chart.width} y1={yFor(yMid)} y2={yFor(yMid)} stroke="rgba(248,250,252,0.42)" strokeWidth={2} strokeDasharray="7 7" opacity={ease(frame, [14, 32], [0, 1])} />
          {points.map((point, index) => {
            const reveal = ease(frame, [20 + index * 2, 42 + index * 2], [0, 1]);
            const isActive = runtimeContractMatches(animation, point.label);
            return (
              <g key={`${point.label}-${index}`} opacity={reveal * runtimeContractOpacity(animation, isActive, 0.82)}>
                <circle cx={xFor(point.x)} cy={yFor(point.y)} r={(isActive ? 12 + emphasis * 4 : 7) * reveal} fill={isActive ? animation.accent : point.color} stroke="#f8fafc" strokeOpacity={0.66} strokeWidth={1.6} filter={isActive ? animation.glow : undefined} />
                {isActive ? <RuntimeEntitySvgLabel data-dm-text-editable x={xFor(point.x) + 14} y={yFor(point.y) + 5} fontSize={14} fontWeight={900} fill={animation.accent} sceneContent={sceneContent} label={point.label}>{truncate(point.label, 16)}</RuntimeEntitySvgLabel> : null}
              </g>
            );
          })}
        </svg>
        <div style={{position: 'absolute', right: 74, top: 170, width: 118, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
          {quadrants.map((count, index) => <div key={index} style={{height: 82, borderRadius: 18, background: 'rgba(255,255,255,0.075)', border: '1px solid rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center', opacity: ease(frame, [36 + index * 5, 54 + index * 5], [0, 1])}}><span data-dm-text-editable style={{fontSize: 28, fontWeight: 920, color: palette[index % palette.length]}}>{count}</span></div>)}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
