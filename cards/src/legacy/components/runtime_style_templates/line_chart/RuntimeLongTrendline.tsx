import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  formatCompact,
  linePath,
  runtimeAnimationContract,
  runtimeContractEase,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimePoints,
  slotTitle,
  truncate,
  uiLabel,
  valueExtent,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const clampFrame = (frame: number, input: [number, number], output: [number, number], easing = Easing.out(Easing.cubic)) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const LongTrendlineDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('line', scene, rawFrame, fps ?? 30);
  const emphasisEase = runtimeContractEase(animation);
  const titleProgress = clampFrame(frame, [0, 16], [0, 1]);
  const rows = runtimePoints(sceneContent, scene).slice(0, 30);
  const points = rows.length >= 2 ? rows : [];
  const values = points.map((point) => point.value);
  const extent = valueExtent(values);
  const accent = sceneContent?.style?.accent || sceneContent?.style?.accent_color || '#fbbf24';
  const title = slotTitle(sceneContent);
  if (points.length < 2 || !title) return null;
  const plot = {left: 110, right: 1180, top: 220, bottom: 480};
  const plotW = plot.right - plot.left;
  const plotH = plot.bottom - plot.top;
  const xAt = (index: number) => plot.left + (index / Math.max(1, points.length - 1)) * plotW;
  const yAt = (value: number) => plot.bottom - ((value - extent.min) / (extent.max - extent.min || 1)) * plotH;
  const pathPoints = points.map((point, index) => ({x: xAt(index), y: yAt(point.value)}));
  const path = linePath(pathPoints);
  const areaPath = `${path} L ${xAt(points.length - 1)} ${plot.bottom} L ${plot.left} ${plot.bottom} Z`;
  const drawProgress = clampFrame(frame, [16, 80], [0, 1]);
  const revealW = plotW * drawProgress;
  const heroIndex = values.reduce((best, value, index) => (value > values[best] ? index : best), 0);
  const activeIndex = points.findIndex((point) => runtimeContractMatches(animation, point.label, point.series));
  const focusIndex = activeIndex >= 0 ? activeIndex : heroIndex;
  const labelStride = Math.max(1, Math.ceil(points.length / 8));

  return (
    <AbsoluteFill style={{background: '#0f1419', color: '#fff', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden'}}>
      <EditableTransform id="long-trendline-title" role="title" style={{display: 'block', opacity: titleProgress}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 110, top: 64, width: 760, fontSize: 40, fontWeight: 850, letterSpacing: '-0.02em'}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="long-trendline-kpi" role="metric" style={{display: 'block'}}>
        <div style={{position: 'absolute', right: 110, top: 70, textAlign: 'right', opacity: titleProgress}}>
          <div data-dm-text-editable style={{fontSize: 36, fontWeight: 900, color: accent, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
            {formatCompact(values[heroIndex])}
          </div>
          <div data-dm-text-editable style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginTop: 6}}>
            {uiLabel(sceneContent, 'peak', 'Peak')} ({truncate(points[heroIndex].label, 10)})
          </div>
        </div>
      </EditableTransform>
      <EditableTransform id="long-trendline-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="runtime-long-trend-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
              <stop offset="100%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
            <clipPath id="runtime-long-trend-reveal">
              <rect x={plot.left} y={plot.top - 20} width={revealW} height={plotH + 40} />
            </clipPath>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const value = extent.min + tick * (extent.max - extent.min);
            return (
              <g key={tick}>
                <line x1={plot.left} x2={plot.right} y1={yAt(value)} y2={yAt(value)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                <text x={plot.left - 10} y={yAt(value) + 4} fontSize={11} fill="#94a3b8" textAnchor="end" style={{fontVariantNumeric: 'tabular-nums'}}>
                  {formatCompact(value)}
                </text>
              </g>
            );
          })}
          <line x1={plot.left} x2={plot.right} y1={plot.bottom} y2={plot.bottom} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
          {points.map((point, index) => (
            index % labelStride === 0 || index === points.length - 1 ? (
              <text key={`${point.label}-${index}`} data-dm-text-editable x={xAt(index)} y={plot.bottom + 22} fontSize={11} fill={runtimeContractMatches(animation, point.label, point.series) ? accent : '#94a3b8'} textAnchor="middle" opacity={runtimeContractOpacity(animation, runtimeContractMatches(animation, point.label, point.series), 1)}>
                {truncate(point.label, 10)}
              </text>
            ) : null
          ))}
          <path className="area" d={areaPath} fill="url(#runtime-long-trend-area)" clipPath="url(#runtime-long-trend-reveal)" />
          <path className="chart-line" d={path} stroke={accent} strokeWidth={animation.active ? 3.6 + emphasisEase : 3} fill="none" clipPath="url(#runtime-long-trend-reveal)" filter={animation.active ? animation.glow : undefined} />
          {drawProgress > 0.95 && (
            <g>
              <circle cx={xAt(focusIndex)} cy={yAt(values[focusIndex])} r={14} fill={accent} opacity={activeIndex >= 0 ? 0.26 : 0.18} />
              <circle className="dot" cx={xAt(focusIndex)} cy={yAt(values[focusIndex])} r={6} fill={accent} stroke={activeIndex >= 0 ? animation.accent : '#0f1419'} strokeWidth={activeIndex >= 0 ? 3 + emphasisEase * 2 : 2} filter={activeIndex >= 0 ? animation.glow : undefined} />
            </g>
          )}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
