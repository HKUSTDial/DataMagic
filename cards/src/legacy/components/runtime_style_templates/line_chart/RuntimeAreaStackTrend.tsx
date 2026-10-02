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
  uiLabel,
  valueExtent,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const AreaStackTrendDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('line', scene, rawFrame, 30);
  const allRows = runtimePoints(sceneContent, scene);
  const seriesNames = Array.from(new Set(allRows.map((row) => row.series).filter(Boolean)));
  const rows = seriesNames.length >= 2 ? allRows : allRows.slice(0, 16);
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#34d399');
  const plot = {left: 132, right: 1120, top: 232, bottom: 596};
  const plotW = plot.right - plot.left;
  const plotH = plot.bottom - plot.top;
  const drawProgress = ease(frame, [16, 80], [0, 1]);
  const revealW = plotW * drawProgress;
  const isStacked = seriesNames.length >= 2;
  const palette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  const groupedSeries = isStacked ? seriesNames.slice(0, 5).map((name, index) => {
    const points = rows.filter((row) => row.series === name);
    return {name: name || `Series ${index + 1}`, color: firstString(points[0]?.color, palette[index % palette.length]), points};
  }).filter((series) => series.points.length >= 2) : [];
  const periods = isStacked ? groupedSeries[0]?.points.map((point) => point.label) ?? [] : [];
  const stackTotals = periods.map((_, pointIndex) => groupedSeries.reduce((sum, series) => sum + (series.points[pointIndex]?.value ?? 0), 0));
  const yMax = isStacked ? Math.ceil(Math.max(...stackTotals, 1) / 50) * 50 : 0;
  const xAt = (index: number, count: number) => plot.left + (index / Math.max(1, count - 1)) * (plot.right - plot.left);
  const yStackAt = (value: number) => plot.bottom - (value / Math.max(1, yMax)) * plotH;

  const stacked: number[][] = [];
  if (isStacked) {
    const running = new Array(periods.length).fill(0);
    for (const series of groupedSeries) {
      const top: number[] = [];
      for (let index = 0; index < periods.length; index++) {
        running[index] += series.points[index]?.value ?? 0;
        top.push(running[index]);
      }
      stacked.push(top);
    }
  }

  const buildAreaPath = (top: number[], bottom: number[]) => {
    const topPath = top.map((value, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index, top.length)} ${yStackAt(value)}`).join(' ');
    const bottomPath = bottom
      .slice()
      .reverse()
      .map((value, reverseIndex) => {
        const index = bottom.length - 1 - reverseIndex;
        return `L ${xAt(index, bottom.length)} ${yStackAt(value)}`;
      })
      .join(' ');
    return `${topPath} ${bottomPath} Z`;
  };

  const values = rows.map((row) => row.value);
  const extent = valueExtent(values);
  const latest = isStacked
    ? {value: stackTotals[stackTotals.length - 1] ?? 0, displayValue: formatCompact(stackTotals[stackTotals.length - 1] ?? 0), label: periods[periods.length - 1] ?? ''}
    : rows[rows.length - 1];
  const first = isStacked
    ? {value: stackTotals[0] ?? 0, label: periods[0] ?? ''}
    : rows[0];
  const delta = first.value === 0 ? latest.value - first.value : ((latest.value - first.value) / Math.abs(first.value)) * 100;
  const singleXAt = (index: number) => xAt(index, rows.length);
  const singleYAt = (value: number) => plot.bottom - ((value - extent.min) / (extent.max - extent.min || 1)) * plotH;
  const singlePath = rows.map((row, index) => `${index === 0 ? 'M' : 'L'} ${singleXAt(index)} ${singleYAt(row.value)}`).join(' ');
  const peakIndex = values.reduce((best, value, index) => (value > values[best] ? index : best), 0);
  const labelStride = Math.max(1, Math.ceil((isStacked ? periods.length : rows.length) / 7));

  return (
    <AbsoluteFill style={{background: '#0b1220', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#e2e8f0', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(1100px 540px at 18% -8%, rgba(52,211,153,0.18), transparent 60%), linear-gradient(160deg, #0b1220 0%, #0f172a 60%, #0b1220 100%)'}} />

      <EditableTransform id="area-stack-kicker" role="annotation" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 132, top: 70, fontSize: 13, fontWeight: 820, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, opacity: ease(frame, [4, 22], [0, 1])}}>
          {uiLabel(sceneContent, 'trend', 'Trend')}
        </div>
      </EditableTransform>
      <EditableTransform id="area-stack-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 132, top: 96, width: 760, fontSize: 46, lineHeight: 1.04, fontWeight: 900, letterSpacing: '-0.04em', color: '#f8fafc', opacity: ease(frame, [0, 20], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="area-stack-summary" role="metric" style={{display: 'block'}}>
        <div style={{position: 'absolute', right: 132, top: 92, textAlign: 'right', opacity: ease(frame, [22, 44], [0, 1])}}>
          <div data-dm-text-editable style={{fontSize: 52, lineHeight: 1, fontWeight: 930, color: accent, letterSpacing: '-0.04em'}}>
            {latest.displayValue || formatCompact(latest.value)}
          </div>
          <div data-dm-text-editable style={{marginTop: 6, fontSize: 16, fontWeight: 760, color: delta >= 0 ? '#6ee7b7' : '#fca5a5'}}>
            {delta >= 0 ? '+' : ''}{formatCompact(delta, 'growth')} {uiLabel(sceneContent, 'since', 'since')} {truncate(first.label, 10)}
          </div>
        </div>
      </EditableTransform>

      <EditableTransform id="area-stack-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <linearGradient id="runtime-area-stack-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={0.42} />
              <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
            </linearGradient>
            <clipPath id="runtime-area-stack-reveal">
              <rect x={plot.left} y={plot.top - 24} width={revealW} height={plotH + 48} />
            </clipPath>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const value = isStacked ? yMax * tick : extent.min + tick * (extent.max - extent.min);
            const y = isStacked ? yStackAt(value) : singleYAt(value);
            return (
              <g key={tick}>
                <line x1={plot.left} x2={plot.right} y1={y} y2={y} stroke="rgba(148,163,184,0.16)" strokeWidth={1} />
                <text x={plot.left - 14} y={y + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">
                  {formatCompact(value)}
                </text>
              </g>
            );
          })}
          {isStacked ? (
            <g clipPath="url(#runtime-area-stack-reveal)">
              {stacked.map((topValues, seriesIndex) => {
                const bottomValues = seriesIndex === 0 ? new Array(periods.length).fill(0) : stacked[seriesIndex - 1];
                const series = groupedSeries[seriesIndex];
                const isActive = runtimeContractMatches(animation, series.name);
                return (
                  <path
                    key={series.name}
                    d={buildAreaPath(topValues, bottomValues)}
                    fill={isActive ? animation.accent : series.color}
                    opacity={runtimeContractOpacity(animation, isActive, 0.85)}
                    stroke={isActive ? animation.accent : '#0b1220'}
                    strokeWidth={isActive ? animation.strokeWidth : 1}
                    style={{filter: isActive ? animation.glow : undefined}}
                  />
                );
              })}
            </g>
          ) : (
            <>
              <path d={`${singlePath} L ${plot.right} ${plot.bottom} L ${plot.left} ${plot.bottom} Z`} fill="url(#runtime-area-stack-fill)" clipPath="url(#runtime-area-stack-reveal)" />
              <path d={singlePath} fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" clipPath="url(#runtime-area-stack-reveal)" />
            </>
          )}
          {!isStacked && rows.map((row, index) => {
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const showDefault = !animation.active && index === peakIndex && drawProgress > 0.9;
            if (!isActive && !showDefault && animation.active) return null;
            return (
              <g key={`${row.label}-${index}`} opacity={isActive ? runtimeContractOpacity(animation, true) : showDefault ? ease(frame, [76, 92], [0, 1]) : 0}>
                <circle cx={singleXAt(index)} cy={singleYAt(row.value)} r={isActive ? 15 : 13} fill={accent} opacity={0.18} />
                <circle cx={singleXAt(index)} cy={singleYAt(row.value)} r={6} fill="#0b1220" stroke={isActive ? animation.accent : accent} strokeWidth={isActive ? animation.strokeWidth : 3} filter={isActive ? animation.glow : undefined} />
                <text data-dm-text-editable x={singleXAt(index)} y={singleYAt(row.value) - 18} textAnchor="middle" fontSize={14} fontWeight={880} fill={isActive ? animation.accent : '#e2e8f0'}>
                  {truncate(row.displayValue || formatCompact(row.value), 12)}
                </text>
              </g>
            );
          })}
          {(isStacked ? periods : rows.map((row) => row.label)).map((label, index, labels) => (
            index % labelStride === 0 || index === labels.length - 1 ? (
              <text key={`${label}-label-${index}`} data-dm-text-editable x={xAt(index, labels.length)} y={plot.bottom + 30} textAnchor="middle" fontSize={12} fontWeight={720} fill="#64748b">
                {truncate(label, 10)}
              </text>
            ) : null
          ))}
          {isStacked && drawProgress > 0.92 ? stacked.map((topValues, seriesIndex) => {
            const bottomValues = seriesIndex === 0 ? new Array(periods.length).fill(0) : stacked[seriesIndex - 1];
            const last = periods.length - 1;
            const midY = (yStackAt(topValues[last]) + yStackAt(bottomValues[last])) / 2;
            const bandH = yStackAt(bottomValues[last]) - yStackAt(topValues[last]);
            if (bandH < 22) return null;
            const series = groupedSeries[seriesIndex];
            const isActive = runtimeContractMatches(animation, series.name);
            return (
              <RuntimeEntitySvgLabel
                key={`${series.name}-end-label`}
                data-dm-text-editable
                x={plot.right + 12}
                y={midY + 5}
                fontSize={isActive ? 15 : 13}
                fontWeight={isActive ? 900 : 800}
                fill={isActive ? animation.accent : series.color}
                opacity={runtimeContractOpacity(animation, isActive)}
               sceneContent={sceneContent} label={series.name}>{truncate(series.name, 14)}</RuntimeEntitySvgLabel>
            );
          }) : null}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
