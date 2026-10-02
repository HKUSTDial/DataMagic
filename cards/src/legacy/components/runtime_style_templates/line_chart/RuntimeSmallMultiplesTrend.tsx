import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  firstString,
  formatCompact,
  linePath,
  paletteFor,
  runtimeAnimationContract,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimePoints,
  slotTitle,
  truncate,
  valueExtent,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

type Series = {name: string; color: string; values: number[]; labels: string[]};

export const SmallMultiplesTrendDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('line', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, true);
  const points = runtimePoints(sceneContent, scene).slice(0, 60);
  const seriesMap = new Map<string, Series>();
  for (const point of points) {
    const name = firstString(point.series);
    if (!name) continue;
    const existing = seriesMap.get(name) ?? {name, color: firstString(point.color, palette[seriesMap.size % palette.length]), values: [], labels: []};
    existing.values.push(point.value);
    existing.labels.push(point.label);
    seriesMap.set(name, existing);
  }
  const series = Array.from(seriesMap.values()).filter((item) => item.values.length >= 2).slice(0, 6);
  const title = slotTitle(sceneContent);
  if (series.length < 2 || !title) return null;

  const cols = 3;
  const rowsCount = Math.ceil(series.length / cols);
  const area = {left: 80, top: 160};
  const gapX = 16;
  const gapY = 16;
  const cellW = 380;
  const cellH = 170;

  return (
    <AbsoluteFill style={{background: '#0f1419', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <EditableTransform id="smt-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 80, top: 60, width: 1040, fontSize: 38, fontWeight: 850, letterSpacing: 0, color: '#ffffff', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="smt-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {series.map((item, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x0 = area.left + col * (cellW + gapX);
            const y0 = area.top + row * (cellH + gapY);
            const pad = {top: 50, bottom: 18, left: 16, right: 16};
            const plotL = x0 + pad.left;
            const plotR = x0 + cellW - pad.right;
            const plotT = y0 + pad.top;
            const plotB = y0 + cellH - pad.bottom;
            const ext = valueExtent(item.values);
            const n = item.values.length;
            const pts = item.values.map((value, i) => ({
              x: plotL + (i / Math.max(1, n - 1)) * (plotR - plotL),
              y: plotB - ((value - ext.min) / (ext.max - ext.min || 1)) * (plotB - plotT),
            }));
            const progress = ease(frame, [14 + index * 6, 50 + index * 6], [0, 1]);
            const revealW = (plotR - plotL) * progress;
            const last = item.values[item.values.length - 1];
            const isActive = runtimeContractMatches(animation, item.name, item.labels[item.labels.length - 1]);
            const opacity = runtimeContractOpacity(animation, isActive, 1);
            return (
              <g key={item.name} opacity={opacity}>
                <rect x={x0} y={y0} width={cellW} height={cellH} rx={10} fill={isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'} stroke={isActive ? animation.accent : 'transparent'} strokeWidth={isActive ? 2 : 0} opacity={ease(frame, [10 + index * 5, 26 + index * 5], [0, 1])} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={x0 + 16} y={y0 + 22} fontSize={14} fontWeight={isActive ? 900 : 700} fill={isActive ? '#ffffff' : '#cbd5e1'} sceneContent={sceneContent} label={item.name}>{truncate(item.name, 18)}</RuntimeEntitySvgLabel>
                <text data-dm-text-editable x={x0 + 16} y={y0 + 42} fontSize={20} fontWeight={900} fill={isActive ? animation.accent : item.color}>{formatCompact(last, item.name)}</text>
                <defs>
                  <clipPath id={`smt-clip-${index}`}>
                    <rect x={plotL} y={plotT - 8} width={revealW} height={plotB - plotT + 16} />
                  </clipPath>
                </defs>
                <path d={`${linePath(pts)} L ${plotR.toFixed(1)} ${plotB.toFixed(1)} L ${plotL.toFixed(1)} ${plotB.toFixed(1)} Z`} fill={item.color} opacity={0.1} clipPath={`url(#smt-clip-${index})`} />
                <path d={linePath(pts)} fill="none" stroke={isActive ? animation.accent : item.color} strokeWidth={isActive ? 5 : 3} strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#smt-clip-${index})`} filter={isActive ? animation.glow : undefined} />
                {pts.length ? <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={isActive ? 6 : 4} fill={isActive ? animation.accent : item.color} opacity={progress} /> : null}
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
