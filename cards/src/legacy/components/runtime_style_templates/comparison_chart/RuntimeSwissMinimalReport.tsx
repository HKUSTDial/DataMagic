import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  comparisonRows,
  firstString,
  formatCompact,
  metricNamesForRows,
  paletteFor,
  runtimeAnimationContract,
  runtimeContractMatches,
  runtimeContractOpacity,
  slotTitle,
  truncate,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const SwissMinimalReportDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('comparison', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 4);
  const metrics = metricNamesForRows(rows).slice(0, 1);
  const colors = paletteFor(sceneContent, false);
  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#111827');
  const title = slotTitle(sceneContent);
  if (!rows.length || !metrics.length || !title) return null;

  const chart = {
    left: 96,
    top: 186,
    width: 1088,
    height: 308,
    labelWidth: 210,
    valueWidth: 96,
    rowHeight: 62,
    barHeight: 28,
  };
  const metricName = metrics[0];
  const maxValue = Math.max(...rows.map((row) => row.metrics.find((candidate) => candidate.name === metricName)?.value ?? 0), 1);
  const barStart = chart.labelWidth + 32;
  const barMaxWidth = chart.width - barStart - chart.valueWidth - 44;

  return (
    <AbsoluteFill style={{background: '#f7f7f2', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 40, border: '2px solid #111111'}} />

      <EditableTransform id="smr-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{
          position: 'absolute', left: chart.left, top: 76, width: 860,
          fontSize: 46, fontWeight: 920, letterSpacing: 0, color: '#111827', lineHeight: 1.02,
          opacity: cl(frame, [0, 18], [0, 1]),
        }}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="smr-chart" role="chart" style={{position: 'absolute', left: chart.left, top: chart.top, width: chart.width, height: chart.height, display: 'block'}}>
        <svg width={chart.width} height={chart.height} viewBox={`0 0 ${chart.width} ${chart.height}`} style={{overflow: 'visible'}}>
          <line x1={barStart} x2={barStart} y1={0} y2={chart.rowHeight * rows.length + 30} stroke="#111111" strokeWidth={2} opacity={cl(frame, [6, 22], [0, 1])} />

          {[0, 25, 50, 75, 100].map((tick) => {
            const x = barStart + (tick / 100) * barMaxWidth;
            return (
              <g key={tick} opacity={cl(frame, [10, 28], [0, 1])}>
                <line x1={x} x2={x} y1={0} y2={chart.rowHeight * rows.length + 20} stroke="#d1d5db" />
                <text x={x} y={chart.rowHeight * rows.length + 46} textAnchor="middle" fontSize={12} fontWeight={800} fill="#111111">
                  {tick}
                </text>
              </g>
            );
          })}

          {rows.map((row, index) => {
            const metric = row.metrics.find((candidate) => candidate.name === metricName);
            const value = metric?.value ?? 0;
            const progress = cl(frame, [18 + index * 8, 48 + index * 8], [0, 1]);
            const y = index * chart.rowHeight + 22;
            const width = Math.max(8, (value / maxValue) * barMaxWidth);
            const color = index === 0 ? '#ef4444' : firstString(metric?.color, colors[index % colors.length], '#111111');
            const isActive = runtimeContractMatches(animation, row.label, metricName, `${row.label} ${metricName}`);
            return (
              <g key={row.label} opacity={runtimeContractOpacity(animation, isActive, 1)}>
                <text data-dm-text-editable x={barStart - 26} y={y + 21} textAnchor="end" fontSize={21} fontWeight={900} fill={isActive ? animation.accent : '#111111'} opacity={progress}>
                  {truncate(row.label, 18)}
                </text>
                <rect x={barStart} y={y} width={width * progress} height={chart.barHeight} fill={isActive ? animation.accent : color} filter={isActive ? animation.glow : undefined} />
                <text data-dm-text-editable x={barStart + width + 18} y={y + 21} fontSize={20} fontWeight={900} fill={isActive ? animation.accent : '#111111'} opacity={progress}>
                  {metric?.displayValue || formatCompact(value, metricName)}
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
