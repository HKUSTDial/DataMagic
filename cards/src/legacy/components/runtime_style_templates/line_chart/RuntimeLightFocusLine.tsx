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

export const LightFocusLineDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('line', scene, rawFrame, 30);
  const emphasisEase = runtimeContractEase(animation);
  const rows = runtimePoints(sceneContent, scene).slice(0, 14);
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  const values = rows.map((row) => row.value);
  const extent = valueExtent(values);
  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#0ea5e9');
  const latest = rows[rows.length - 1];
  const first = rows[0];
  const delta = first.value === 0 ? latest.value - first.value : ((latest.value - first.value) / Math.abs(first.value)) * 100;
  const plot = {left: 420, right: 1120, top: 214, bottom: 492};
  const chartBox = {left: 388, top: 178, width: 772, height: 358};
  const plotW = plot.right - plot.left;
  const plotH = plot.bottom - plot.top;
  const xAt = (index: number) => plot.left + (index / Math.max(1, rows.length - 1)) * plotW;
  const yAt = (value: number) => plot.bottom - ((value - extent.min) / (extent.max - extent.min || 1)) * plotH;
  const points = rows.map((row, index) => ({x: xAt(index), y: yAt(row.value)}));
  const path = linePath(points);
  const drawProgress = ease(frame, [16, 74], [0, 1]);
  const revealW = plotW * drawProgress;
  const peakIndex = values.reduce((best, value, index) => (value > values[best] ? index : best), 0);
  const labelStride = Math.max(1, Math.ceil(rows.length / 6));

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 44%, #ffffff 100%)'}} />
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 56,
          width: 1136,
          height: 504,
          borderRadius: 28,
          background: 'rgba(255,255,255,0.94)',
          border: '1px solid rgba(148,163,184,0.18)',
          boxShadow: '0 28px 78px rgba(15,23,42,0.11)',
          opacity: ease(frame, [0, 18], [0, 1]),
        }}
      />

      <EditableTransform id="light-focus-line-title" role="title" style={{display: 'block'}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 116,
            top: 104,
            width: 360,
            fontSize: 44,
            lineHeight: 1.03,
            fontWeight: 900,
            letterSpacing: '-0.045em',
            opacity: ease(frame, [0, 20], [0, 1]),
          }}
        >
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="light-focus-line-summary" role="metric" style={{display: 'block'}}>
        <div
          style={{
            position: 'absolute',
            left: 116,
            top: 292,
            width: 244,
            borderRadius: 24,
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            padding: '22px 24px',
            boxSizing: 'border-box',
            opacity: ease(frame, [26, 48], [0, 1]),
          }}
        >
          <div data-dm-text-editable style={{fontSize: 11, fontWeight: 880, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b'}}>
            {uiLabel(sceneContent, 'latest', 'Latest value')}
          </div>
          <div data-dm-text-editable style={{marginTop: 8, fontSize: 44, lineHeight: 1, fontWeight: 930, color: accent, letterSpacing: '-0.04em'}}>
            {latest.displayValue || formatCompact(latest.value)}
          </div>
          <div data-dm-text-editable style={{marginTop: 12, fontSize: 15, lineHeight: 1.35, fontWeight: 740, color: delta >= 0 ? '#047857' : '#b91c1c'}}>
            {delta >= 0 ? '+' : ''}{formatCompact(delta, 'growth')} {uiLabel(sceneContent, 'from', 'from')} {truncate(first.label, 10)}
          </div>
        </div>
      </EditableTransform>

      <EditableTransform
        id="light-focus-line-chart"
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
            <linearGradient id="runtime-light-focus-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={0.2} />
              <stop offset="100%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
            <clipPath id="runtime-light-focus-reveal">
              <rect x={plot.left} y={plot.top - 18} width={revealW} height={plotH + 36} />
            </clipPath>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const value = extent.min + tick * (extent.max - extent.min);
            const y = yAt(value);
            return (
              <g key={tick}>
                <line x1={plot.left} x2={plot.right} y1={y} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                <text x={plot.left - 14} y={y + 4} textAnchor="end" fontSize={12} fontWeight={760} fill="#94a3b8">
                  {formatCompact(value)}
                </text>
              </g>
            );
          })}
          <path
            d={`${path} L ${plot.right} ${plot.bottom} L ${plot.left} ${plot.bottom} Z`}
            fill="url(#runtime-light-focus-area)"
            clipPath="url(#runtime-light-focus-reveal)"
          />
          <path d={path} fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" clipPath="url(#runtime-light-focus-reveal)" opacity={animation.active ? 0.42 : 1} />
          {rows.map((row, index) => {
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const showDefault = !animation.active && index === peakIndex && drawProgress > 0.92;
            if (!isActive && !showDefault && animation.active) return null;
            return (
              <g key={`${row.label}-${index}`} opacity={isActive ? runtimeContractOpacity(animation, true) : showDefault ? ease(frame, [72, 88], [0, 1]) : 0}>
                {isActive ? <rect x={xAt(index) - 34} y={plot.top - 8} width={68} height={plotH + 16} rx={24} fill={animation.accent} opacity={0.08 + emphasisEase * 0.08} /> : null}
                {isActive ? <line x1={xAt(index)} x2={xAt(index)} y1={plot.top} y2={plot.bottom} stroke={animation.accent} strokeWidth={2} strokeDasharray="6 8" opacity={0.5 + emphasisEase * 0.35} /> : null}
                <circle cx={xAt(index)} cy={yAt(row.value)} r={isActive ? 20 + emphasisEase * 6 : 13} fill={accent} opacity={isActive ? 0.12 + emphasisEase * 0.12 : 0.16} />
                <circle cx={xAt(index)} cy={yAt(row.value)} r={isActive ? 7 + emphasisEase * 2 : 6} fill="#ffffff" stroke={isActive ? animation.accent : accent} strokeWidth={isActive ? animation.strokeWidth + 1 : 3} filter={isActive ? animation.glow : undefined} />
                <text data-dm-text-editable x={xAt(index) + 14} y={yAt(row.value) - 14} fontSize={13} fontWeight={860} fill={isActive ? animation.accent : accent}>
                  {truncate(row.displayValue || formatCompact(row.value), 12)}
                </text>
              </g>
            );
          })}
          {rows.map((row, index) => (
            index % labelStride === 0 || index === rows.length - 1 ? (
              <text key={`${row.label}-label-${index}`} data-dm-text-editable x={xAt(index)} y={plot.bottom + 28} textAnchor="middle" fontSize={12} fontWeight={760} fill="#94a3b8">
                {truncate(row.label, 10)}
              </text>
            ) : null
          ))}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
