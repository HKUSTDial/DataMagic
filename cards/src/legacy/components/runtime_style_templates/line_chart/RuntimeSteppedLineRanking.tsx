import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  firstString,
  formatCompact,
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

export const SteppedLineRankingDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('line', scene, rawFrame, 30);
  const allRows = runtimePoints(sceneContent, scene);
  const seriesNames = Array.from(new Set(allRows.map((row) => row.series).filter(Boolean)));
  const rows = seriesNames.length >= 3 ? allRows : allRows.slice(0, 14);
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#60a5fa');
  // Reserve room for each identity badge and the complete endpoint label.
  const plot = {left: 150, right: 1140, top: 214, bottom: 560};
  const plotW = plot.right - plot.left;
  const plotH = plot.bottom - plot.top;
  const isRankChart = seriesNames.length >= 3;
  const groupedSeries = isRankChart ? seriesNames.slice(0, 8).map((name, index) => {
    const points = rows.filter((row) => row.series === name);
    return {name: name || `Series ${index + 1}`, color: firstString(points[0]?.color, ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'][index % 6]), points};
  }).filter((series) => series.points.length >= 2) : [];
  const periods = isRankChart ? groupedSeries[0]?.points.map((point) => point.label) ?? [] : [];
  const maxRank = Math.max(2, groupedSeries.length);
  const xAt = (index: number, count = rows.length) => plot.left + (index / Math.max(1, count - 1)) * plotW;
  const yRankAt = (rank: number) => plot.top + ((rank - 1) / Math.max(1, maxRank - 1)) * plotH;
  const values = rows.map((row) => row.value);
  const extent = valueExtent(values);
  const yAt = (value: number) => plot.bottom - ((value - extent.min) / (extent.max - extent.min || 1)) * plotH;
  // Stepped path: horizontal then vertical between consecutive points.
  const stepPath = rows
    .map((row, index) => {
      const x = xAt(index);
      const y = yAt(row.value);
      if (index === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      const prevY = yAt(rows[index - 1].value);
      return `L ${x.toFixed(1)} ${prevY.toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const drawProgress = ease(frame, [16, 78], [0, 1]);
  const revealW = plotW * drawProgress;
  const peakIndex = values.reduce((best, value, index) => (value > values[best] ? index : best), 0);
  const labelStride = Math.max(1, Math.ceil(rows.length / 7));

  return (
    <AbsoluteFill style={{background: '#0a0f1c', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#e2e8f0', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #0a0f1c 0%, #111a2e 58%, #0a0f1c 100%)'}} />
      <div style={{position: 'absolute', top: 0, left: 0, width: ease(frame, [0, 28], [0, 1280]), height: 3, background: `linear-gradient(90deg, ${accent}, rgba(96,165,250,0.2), transparent)`}} />

      <EditableTransform id="stepped-line-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 72, width: 900, fontSize: 40, fontWeight: 880, letterSpacing: '-0.03em', color: '#f8fafc', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="stepped-line-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <clipPath id="runtime-stepped-reveal">
              <rect x={plot.left} y={plot.top - 24} width={revealW} height={plotH + 48} />
            </clipPath>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const value = isRankChart ? Math.round(1 + tick * (maxRank - 1)) : extent.min + tick * (extent.max - extent.min);
            const y = isRankChart ? yRankAt(value) : yAt(value);
            return (
              <g key={tick}>
                <line x1={plot.left} x2={plot.right} y1={y} y2={y} stroke="rgba(148,163,184,0.14)" strokeWidth={1} />
                <text x={plot.left - 14} y={y + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">
                  {isRankChart ? `#${value}` : formatCompact(value)}
                </text>
              </g>
            );
          })}
          {isRankChart ? (
            <>
              {periods.map((period, index) => (
                <text key={`period-${period}-${index}`} data-dm-text-editable x={xAt(index, periods.length)} y={plot.top - 20} textAnchor="middle" fontSize={13} fontWeight={700} fill="#94a3b8">
                  {truncate(period, 8)}
                </text>
              ))}
              {groupedSeries.map((series, seriesIndex) => {
                const lineProgress = ease(frame, [16 + seriesIndex * 6, 56 + seriesIndex * 6], [0, 1]);
                const visible = Math.max(2, Math.ceil(series.points.length * lineProgress));
                const points = series.points.slice(0, visible);
                const d = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index, periods.length)} ${yRankAt(point.value)}`).join(' ');
                const last = series.points[series.points.length - 1];
                const isActive = runtimeContractMatches(animation, series.name);
                const emphasis = isActive ? animation.sustain : 0;
                return (
                  <g
                    key={series.name}
                    opacity={lineProgress * runtimeContractOpacity(animation, isActive)}
                    style={{filter: isActive ? animation.glow : undefined}}
                  >
                    <path
                      d={d}
                      stroke={isActive ? animation.accent : series.color}
                      strokeWidth={isActive ? 3.5 + emphasis * 3 : 3.5}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.map((point, index) => (
                      <circle
                        key={`${series.name}-${index}`}
                        cx={xAt(index, periods.length)}
                        cy={yRankAt(point.value)}
                        r={isActive ? 6 + emphasis * 3 : 6}
                        fill={isActive ? animation.accent : series.color}
                        stroke="#0a0f1c"
                        strokeWidth={2}
                      />
                    ))}
                    {lineProgress > 0.85 ? (
                      <RuntimeEntitySvgLabel data-dm-text-editable x={plot.right + 12} y={yRankAt(last.value) + 5} fontSize={isActive ? 16 : 14} fontWeight={isActive ? 900 : 800} fill={isActive ? animation.accent : series.color} sceneContent={sceneContent} label={series.name}>{truncate(series.name, 14)}</RuntimeEntitySvgLabel>
                    ) : null}
                  </g>
                );
              })}
            </>
          ) : (
            <path d={stepPath} fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" clipPath="url(#runtime-stepped-reveal)" />
          )}
          {!isRankChart && rows.map((row, index) => {
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const showDefault = !animation.active && index === peakIndex && drawProgress > 0.9;
            if (!isActive && !showDefault && animation.active) return null;
            return (
              <g key={`${row.label}-${index}`} opacity={isActive ? runtimeContractOpacity(animation, true) : showDefault ? ease(frame, [74, 90], [0, 1]) : 0}>
                <circle cx={xAt(index)} cy={yAt(row.value)} r={6} fill="#0a0f1c" stroke={isActive ? animation.accent : accent} strokeWidth={isActive ? animation.strokeWidth : 3} filter={isActive ? animation.glow : undefined} />
                <text data-dm-text-editable x={xAt(index)} y={yAt(row.value) - 16} textAnchor="middle" fontSize={13} fontWeight={860} fill={isActive ? animation.accent : '#e2e8f0'}>
                  {truncate(row.displayValue || formatCompact(row.value), 12)}
                </text>
              </g>
            );
          })}
          {!isRankChart && rows.map((row, index) => (
            index % labelStride === 0 || index === rows.length - 1 ? (
              <RuntimeEntitySvgLabel key={`${row.label}-label-${index}`} data-dm-text-editable x={xAt(index)} y={plot.bottom + 30} textAnchor="middle" fontSize={12} fontWeight={720} fill="#64748b" sceneContent={sceneContent} label={row.label}>{truncate(row.label, 10)}</RuntimeEntitySvgLabel>
            ) : null
          ))}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
