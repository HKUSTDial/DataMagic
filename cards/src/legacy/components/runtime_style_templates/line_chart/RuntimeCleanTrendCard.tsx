import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  firstString,
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

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const CleanTrendCardDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('line', scene, rawFrame, 30);
  const emphasisEase = runtimeContractEase(animation);
  const runtimeRows = runtimePoints(sceneContent, scene).slice(0, 20);
  const rows = runtimeRows.length >= 2 ? runtimeRows : [];
  const labels = rows.map((row) => row.label);
  const values = rows.map((row) => row.value);
  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#3b82f6');
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  const plot = {left: 120, right: 1060, top: 198, bottom: 468};
  const chartBox = {left: 96, top: 174, width: 1000, height: 332};
  const width = plot.right - plot.left;
  const height = plot.bottom - plot.top;
  const extent = valueExtent(values);
  const xAt = (index: number) => plot.left + (index / Math.max(1, rows.length - 1)) * width;
  const yAt = (value: number) => plot.bottom - ((value - extent.min) / (extent.max - extent.min || 1)) * height;
  const points = values.map((value, index) => ({x: xAt(index), y: yAt(value)}));
  const path = linePath(points);
  const areaPath = `${path} L ${xAt(points.length - 1)} ${plot.bottom} L ${plot.left} ${plot.bottom} Z`;
  const drawProgress = ease(frame, [16, 76], [0, 1]);
  const revealW = width * drawProgress;
  const first = values[0] || 1;
  const last = values[values.length - 1] || 0;
  const growth = first === 0 ? last - first : ((last - first) / Math.abs(first)) * 100;
  const peakIndex = values.reduce((best, value, index) => (value > values[best] ? index : best), 0);

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #eff6ff 55%, #f8fafc 100%)'}} />
      <div
        style={{
          position: 'absolute',
          left: 56,
          top: 52,
          width: 1168,
          height: 472,
          borderRadius: 28,
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid rgba(148,163,184,0.16)',
          boxShadow: '0 24px 72px rgba(15,23,42,0.10)',
          opacity: ease(frame, [0, 16], [0, 1]),
        }}
      />

      <EditableTransform id="clean-trend-title" role="title" style={{display: 'block'}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 100,
            top: 98,
            width: 680,
            fontSize: 42,
            lineHeight: 1.05,
            fontWeight: 880,
            letterSpacing: '-0.04em',
            color: '#0f172a',
            opacity: ease(frame, [0, 18], [0, 1]),
          }}
        >
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="clean-trend-kpi" role="metric" style={{display: 'block'}}>
        <div
          style={{
            position: 'absolute',
            right: 100,
            top: 86,
            width: 170,
            borderRadius: 20,
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '16px 18px',
            boxSizing: 'border-box',
            opacity: ease(frame, [24, 44], [0, 1]),
          }}
        >
          <div data-dm-text-editable style={{fontSize: 10, fontWeight: 860, letterSpacing: '0.13em', textTransform: 'uppercase', color: accent, marginBottom: 6}}>
            {uiLabel(sceneContent, 'change', 'Change')}
          </div>
          <div data-dm-text-editable style={{fontSize: 32, fontWeight: 920, lineHeight: 1, color: accent, letterSpacing: '-0.03em'}}>
            {growth >= 0 ? '+' : ''}{formatCompact(growth, 'growth')}
          </div>
        </div>
      </EditableTransform>

      <EditableTransform
        id="clean-trend-chart"
        role="chart"
        style={{position: 'absolute', left: chartBox.left, top: chartBox.top, width: chartBox.width, height: chartBox.height, display: 'block'}}
      >
        <svg
          width={1280}
          height={720}
          viewBox="0 0 1280 720"
          style={{position: 'absolute', left: -chartBox.left, top: -chartBox.top, overflow: 'visible'}}
        >
          <defs>
            <linearGradient id="runtime-clean-trend-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.20" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
            <clipPath id="runtime-clean-trend-reveal">
              <rect x={plot.left} y={plot.top - 20} width={revealW} height={height + 40} />
            </clipPath>
          </defs>

          {Array.from({length: 5}, (_, i) => {
            const t = i / 4;
            const y = plot.bottom - t * height;
            const value = extent.min + t * (extent.max - extent.min);
            return (
              <g key={i}>
                <line x1={plot.left} x2={plot.right} y1={y} y2={y} stroke={i === 0 ? '#cbd5e1' : '#e2e8f0'} strokeWidth={i === 0 ? 2 : 1} />
                <text x={plot.left - 14} y={y + 4} textAnchor="end" fontSize={12} fill="#94a3b8" fontWeight={700}>
                  {formatCompact(value)}
                </text>
              </g>
            );
          })}
          <line x1={plot.left} x2={plot.left} y1={plot.top} y2={plot.bottom} stroke="#cbd5e1" strokeWidth={2} />
          {labels.map((label, index) => (
            index % Math.max(1, Math.ceil(labels.length / 8)) === 0 || index === labels.length - 1 ? (
              <text key={`${label}-${index}`} data-dm-text-editable x={xAt(index)} y={plot.bottom + 26} textAnchor="middle" fontSize={12} fill="#94a3b8" fontWeight={700}>
                {truncate(label, 10)}
              </text>
            ) : null
          ))}
          <g clipPath="url(#runtime-clean-trend-reveal)">
            <path d={areaPath} fill="url(#runtime-clean-trend-area)" />
            <path className="chart-line" d={path} fill="none" stroke={accent} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" opacity={animation.active ? 0.42 : 1} />
          </g>
          {drawProgress > 0.9 && rows.map((row, index) => {
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const hasActiveEmphasis = animation.active;
            if (!isActive && hasActiveEmphasis) return null;
            if (!isActive && index !== peakIndex) return null;
            return (
              <g key={`${row.label}-cue`} opacity={isActive ? runtimeContractOpacity(animation, true) : hasActiveEmphasis ? animation.mutedOpacity : ease(frame, [74, 88], [0, 1])}>
                {isActive ? <rect x={xAt(index) - 36} y={plot.top - 8} width={72} height={height + 16} rx={24} fill={animation.accent} opacity={0.08 + emphasisEase * 0.08} /> : null}
                {isActive ? <line x1={xAt(index)} x2={xAt(index)} y1={plot.top} y2={plot.bottom} stroke={animation.accent} strokeWidth={2} strokeDasharray="6 8" opacity={0.5 + emphasisEase * 0.35} /> : null}
                {!isActive ? <circle cx={xAt(index)} cy={yAt(values[index])} r={12} fill={accent} opacity={0.12} /> : null}
                {isActive ? <circle cx={xAt(index)} cy={yAt(values[index])} r={20 + emphasisEase * 6} fill={animation.accent} opacity={0.12 + emphasisEase * 0.12} /> : null}
                <circle className="dot" cx={xAt(index)} cy={yAt(values[index])} r={isActive ? 7 + emphasisEase * 2 : 5.5} fill="#ffffff" stroke={isActive ? animation.accent : accent} strokeWidth={isActive ? animation.strokeWidth + 1 : 2.8} filter={isActive ? animation.glow : undefined} />
                {isActive ? (
                  <text data-dm-text-editable x={xAt(index) + 14} y={yAt(values[index]) - 14} fontSize={13} fontWeight={850} fill={animation.accent} opacity={0.78 + emphasisEase * 0.22}>
                    {truncate(row.displayValue || formatCompact(row.value, row.label), 12)}
                  </text>
                ) : null}
              </g>
            );
          })}
          {drawProgress > 0.9 && !animation.active && (
            <g opacity={ease(frame, [74, 88], [0, 1])}>
              <circle cx={xAt(peakIndex)} cy={yAt(values[peakIndex])} r={14} fill={accent} opacity={0.14} />
              <circle className="dot" cx={xAt(peakIndex)} cy={yAt(values[peakIndex])} r={6} fill="#ffffff" stroke={accent} strokeWidth={3} />
            </g>
          )}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
