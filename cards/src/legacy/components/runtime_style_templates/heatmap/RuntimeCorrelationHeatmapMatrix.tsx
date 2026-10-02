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
  if (!/^[a-f\d]{6}$/i.test(n)) return [37, 99, 235];
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
};

export const CorrelationHeatmapMatrixDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('heatmap', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 10);
  const cols = metricNamesForRows(rows, 6);
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || cols.length < 2 || !title) return null;

  const cell = 50;
  const gap = 6;
  const gridLeft = 482;
  const gridTop = 162;
  const matrixRows = rows.slice(0, 6);
  const colorFor = (value: number) => {
    const abs = Math.min(1, Math.abs(value));
    if (value >= 0) return `rgba(37, 99, 235, ${0.16 + abs * 0.74})`;
    return `rgba(244, 63, 94, ${0.15 + abs * 0.7})`;
  };
  let strongest = {value: 0, label: ''};
  for (const row of matrixRows) {
    for (const metric of row.metrics) {
      if (Math.abs(metric.value) > Math.abs(strongest.value) && row.label !== metric.name) {
        strongest = {value: metric.value, label: `${row.label} x ${metric.name}`};
      }
    }
  }

  return (
    <AbsoluteFill style={{background: '#f3f5f8', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 18%, rgba(255,255,255,0.96), transparent 30%), radial-gradient(circle at 80% 70%, rgba(37,99,235,0.09), transparent 25%)'}} />
      <EditableTransform id="chm-card" role="group" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: 120, top: 84, width: 1040, height: 456, borderRadius: 28, background: '#ffffff', boxShadow: '0 34px 90px rgba(31,41,55,0.13), 0 1px 0 rgba(255,255,255,0.92) inset', opacity: cl(frame, [0, 18], [0, 1])}} />
      </EditableTransform>

      <EditableTransform id="chm-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 182, top: 152, width: 270, fontSize: 45, lineHeight: 1, fontWeight: 850, letterSpacing: 0, color: '#111827', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="chm-strongest" role="metric" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: 184, top: 360, width: 210, borderRadius: 22, background: '#f8fafc', border: '1px solid rgba(15,23,42,0.08)', padding: '14px 18px', opacity: cl(frame, [48, 70], [0, 1])}}>
          <div data-dm-text-editable style={{fontSize: 11, fontWeight: 840, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6}}>{uiLabel(sceneContent, 'strongest_inverse', 'strongest inverse')}</div>
          <div data-dm-text-editable style={{fontSize: 38, lineHeight: 1, fontWeight: 850, color: strongest.value < 0 ? '#f43f5e' : '#2563eb', letterSpacing: 0}}>{strongest.value.toFixed(2)}</div>
          <div data-dm-text-editable style={{marginTop: 4, fontSize: 12, fontWeight: 720, color: '#64748b'}}>{truncate(strongest.label, 20)}</div>
        </div>
      </EditableTransform>

      <EditableTransform id="chm-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {cols.slice(0, 6).map((label, index) => (
            <g key={label}>
              <text data-dm-text-editable x={gridLeft + index * (cell + gap) + cell / 2} y={gridTop - 18} textAnchor="middle" fontSize={12} fontWeight={820} fill="#64748b">{truncate(label, 8)}</text>
              <text data-dm-text-editable x={gridLeft - 22} y={gridTop + index * (cell + gap) + cell / 2 + 5} textAnchor="end" fontSize={12} fontWeight={820} fill="#64748b">{truncate(matrixRows[index]?.label ?? label, 8)}</text>
            </g>
          ))}
          {matrixRows.map((row, rowIndex) => cols.slice(0, 6).map((colName, colIndex) => {
            const value = row.metrics.find((metric) => metric.name === colName)?.value ?? 0;
            const progress = cl(frame, [10 + Math.abs(rowIndex - colIndex) * 4 + (rowIndex + colIndex) * 2, 28 + Math.abs(rowIndex - colIndex) * 4 + (rowIndex + colIndex) * 2], [0, 1]);
            const x = gridLeft + colIndex * (cell + gap);
            const y = gridTop + rowIndex * (cell + gap);
            const isStrong = row.label !== colName && Math.abs(value) === Math.abs(strongest.value);
            const isActive = runtimeContractMatches(animation, row.label, colName, `${row.label} ${colName}`);
            return (
              <g key={`${row.label}-${colName}`} opacity={progress * runtimeContractOpacity(animation, isActive, 1)}>
                <rect x={x} y={y} width={cell} height={cell} rx={14} fill={isActive ? animation.accent : colorFor(value)} fillOpacity={isActive ? 0.92 : 1} stroke={isActive ? '#111827' : isStrong ? '#111827' : 'rgba(255,255,255,0.65)'} strokeWidth={isActive ? 4 : isStrong ? 3 : 1} filter={isActive ? animation.glow : undefined} />
              </g>
            );
          }))}
          <g opacity={cl(frame, [62, 82], [0, 1])}>
            <text x={gridLeft} y={gridTop + cols.slice(0, 6).length * (cell + gap) + 40} fontSize={11} fontWeight={820} fill="#94a3b8">{uiLabel(sceneContent, 'negative', 'NEGATIVE')}</text>
            <defs>
              <linearGradient id="chm-legend" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <rect x={gridLeft + 92} y={gridTop + cols.slice(0, 6).length * (cell + gap) + 27} width={230} height={12} rx={6} fill="url(#chm-legend)" />
            <text x={gridLeft + 340} y={gridTop + cols.slice(0, 6).length * (cell + gap) + 40} fontSize={11} fontWeight={820} fill="#94a3b8">{uiLabel(sceneContent, 'positive', 'POSITIVE')}</text>
          </g>
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
