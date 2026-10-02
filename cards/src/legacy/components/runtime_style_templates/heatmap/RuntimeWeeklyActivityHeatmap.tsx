import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  comparisonRows,
  firstString,
  formatCompact,
  metricNamesForRows,
  runtimeAnimationContract,
  runtimeContractMatches,
  runtimeContractOpacity,
  slotTitle,
  trimNumber,
  truncate,
  uiLabel,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const hexToRgb = (hex: string): [number, number, number] => {
  const n = hex.replace('#', '').trim();
  if (!/^[a-f\d]{6}$/i.test(n)) return [22, 163, 74];
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
};

export const WeeklyActivityHeatmapDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('heatmap', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 7);
  const cols = metricNamesForRows(rows, 6);
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || cols.length < 2 || !title) return null;

  const maxValue = Math.max(1, ...rows.flatMap((row) => row.metrics.map((metric) => metric.value)));
  const peak = rows.flatMap((row) => row.metrics).reduce((best, metric) => (metric.value > best.value ? metric : best), rows[0].metrics[0]);
  const colorFor = (value: number) => `rgba(37,99,235,${0.16 + value / Math.max(110, maxValue * 1.15)})`;

  return (
    <AbsoluteFill style={{background: '#f3f4f6', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.95), transparent 32%), radial-gradient(circle at 82% 70%, rgba(37,99,235,0.07), transparent 28%)'}} />

      <EditableTransform id="wah-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 72, right: 330, fontSize: 44, lineHeight: 1.06, fontWeight: 870, letterSpacing: 0, opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="wah-peak" role="metric" style={{display: 'block'}}>
        <div style={{position: 'absolute', right: 110, top: 72, width: 188, height: 84, borderRadius: 22, background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 18px 44px rgba(15,23,42,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: cl(frame, [22, 44], [0, 1])}}>
          <div data-dm-text-editable style={{fontSize: 11, fontWeight: 850, letterSpacing: '0.14em', color: '#64748b', textTransform: 'uppercase'}}>{uiLabel(sceneContent, 'peak_activity', 'Peak Activity')}</div>
          <div data-dm-text-editable style={{marginTop: 6, fontSize: 30, lineHeight: 1, fontWeight: 900, color: '#2563eb'}}>{formatCompact(peak.value)}</div>
        </div>
      </EditableTransform>

      <EditableTransform id="wah-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect x={150} y={172} width={980} height={328} rx={26} fill="#ffffff" filter="drop-shadow(0 30px 80px rgba(15,23,42,0.14))" />
          {cols.slice(0, 6).map((hour, index) => (
            <text key={hour} data-dm-text-editable x={330 + index * 112} y={216} textAnchor="middle" fontSize={13} fontWeight={820} fill="#64748b">{truncate(hour, 8)}</text>
          ))}
          {rows.map((row, rowIndex) => (
            <g key={row.label}>
              <text data-dm-text-editable x={244} y={258 + rowIndex * 32} textAnchor="end" fontSize={13} fontWeight={820} fill="#64748b">{truncate(row.label, 8)}</text>
              {cols.slice(0, 6).map((hour, columnIndex) => {
                const progress = cl(frame, [16 + rowIndex * 4 + columnIndex * 2, 38 + rowIndex * 4 + columnIndex * 2], [0, 1]);
                const value = row.metrics.find((metric) => metric.name === hour)?.value ?? 0;
                const isActive = runtimeContractMatches(animation, row.label, hour, `${row.label} ${hour}`);
                return (
                  <rect key={`${row.label}-${hour}`} x={280 + columnIndex * 112} y={240 + rowIndex * 32} width={82} height={22} rx={6} fill={isActive ? animation.accent : colorFor(value)} opacity={progress * runtimeContractOpacity(animation, isActive, 1)} stroke={isActive ? '#111827' : undefined} strokeWidth={isActive ? 2 : 0} filter={isActive ? animation.glow : undefined} />
                );
              })}
            </g>
          ))}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
