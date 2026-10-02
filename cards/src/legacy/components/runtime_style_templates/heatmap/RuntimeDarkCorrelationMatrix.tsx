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
  if (!/^[a-f\d]{6}$/i.test(n)) return [34, 211, 238];
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
};

export const DarkCorrelationMatrixDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('heatmap', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 6);
  const cols = metricNamesForRows(rows, 6);
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || cols.length < 2 || !title) return null;

  const cell = 48;
  const gap = 6;
  const gridLeft = 786;
  const gridTop = 158;
  const colorFor = (value: number) => {
    const abs = Math.min(1, Math.abs(value));
    if (value >= 0) return `rgba(56,189,248,${0.18 + abs * 0.66})`;
    return `rgba(244,114,182,${0.18 + abs * 0.66})`;
  };
  let strongest = {value: 0, label: ''};
  for (const row of rows) {
    for (const metric of row.metrics) {
      if (Math.abs(metric.value) > Math.abs(strongest.value) && row.label !== metric.name) {
        strongest = {value: metric.value, label: `${row.label} x ${metric.name}`};
      }
    }
  }

  return (
    <AbsoluteFill style={{background: '#08111f', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#f5f7fa', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 22% 18%, rgba(56,189,248,0.14), transparent 28%), radial-gradient(circle at 80% 78%, rgba(244,114,182,0.10), transparent 26%), linear-gradient(135deg, #08111f 0%, #0c1729 60%, #04080f 100%)'}} />
      <EditableTransform id="dcm-card" role="group" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: 100, top: 100, width: 1080, height: 420, borderRadius: 28, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 84px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset', opacity: cl(frame, [0, 18], [0, 1])}} />
      </EditableTransform>
      <EditableTransform id="dcm-eyebrow" role="metric" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 156, top: 138, fontSize: 12, fontWeight: 840, letterSpacing: '0.22em', color: '#7dd3fc', textTransform: 'uppercase', opacity: cl(frame, [0, 14], [0, 1])}}>{uiLabel(sceneContent, 'signal_map', 'Signal Map')}</div>
      </EditableTransform>

      <EditableTransform id="dcm-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 156, top: 168, width: 320, fontSize: 38, lineHeight: 1.04, fontWeight: 900, letterSpacing: 0, color: '#f5f7fa', opacity: cl(frame, [4, 22], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 156, top: 244, width: 300, fontSize: 13, lineHeight: 1.5, fontWeight: 580, color: 'rgba(245,247,250,0.6)', opacity: cl(frame, [16, 34], [0, 1])}}>
        Cyan tiles indicate co-movement, magenta tiles indicate inverse pull. Darker shades mean stronger pairs.
      </div>
      <EditableTransform id="dcm-strongest" role="metric" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: 156, top: 332, width: 220, borderRadius: 18, background: 'rgba(244,114,182,0.10)', border: '1px solid rgba(244,114,182,0.32)', padding: '14px 18px', opacity: cl(frame, [42, 64], [0, 1])}}>
          <div data-dm-text-editable style={{fontSize: 11, fontWeight: 840, letterSpacing: '0.16em', color: 'rgba(245,247,250,0.6)', textTransform: 'uppercase', marginBottom: 6}}>{uiLabel(sceneContent, 'strongest_inverse', 'Strongest Inverse')}</div>
          <div data-dm-text-editable style={{fontSize: 32, lineHeight: 1, fontWeight: 900, color: strongest.value < 0 ? '#f472b6' : '#38bdf8', letterSpacing: 0}}>{strongest.value.toFixed(2)}</div>
          <div data-dm-text-editable style={{marginTop: 4, fontSize: 12, fontWeight: 720, color: 'rgba(245,247,250,0.6)'}}>{truncate(strongest.label, 18)}</div>
        </div>
      </EditableTransform>

      <EditableTransform id="dcm-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {cols.slice(0, 6).map((label, index) => (
            <g key={label}>
              <text data-dm-text-editable x={gridLeft + index * (cell + gap) + cell / 2} y={gridTop - 16} textAnchor="middle" fontSize={11} fontWeight={780} fill="rgba(245,247,250,0.55)">{truncate(label, 8)}</text>
              <text data-dm-text-editable x={gridLeft - 18} y={gridTop + index * (cell + gap) + cell / 2 + 4} textAnchor="end" fontSize={11} fontWeight={780} fill="rgba(245,247,250,0.55)">{truncate(rows[index]?.label ?? label, 8)}</text>
            </g>
          ))}
          {rows.map((row, rowIndex) => cols.slice(0, 6).map((colName, colIndex) => {
            const value = row.metrics.find((metric) => metric.name === colName)?.value ?? 0;
            const progress = cl(frame, [10 + Math.abs(rowIndex - colIndex) * 4 + (rowIndex + colIndex) * 2, 28 + Math.abs(rowIndex - colIndex) * 4 + (rowIndex + colIndex) * 2], [0, 1]);
            const x = gridLeft + colIndex * (cell + gap);
            const y = gridTop + rowIndex * (cell + gap);
            const isStrong = row.label !== colName && Math.abs(value) === Math.abs(strongest.value);
            const isActive = runtimeContractMatches(animation, row.label, colName, `${row.label} ${colName}`);
            return (
              <g key={`${row.label}-${colName}`} opacity={progress * runtimeContractOpacity(animation, isActive, 1)}>
                <rect x={x} y={y} width={cell} height={cell} rx={12} fill={isActive ? animation.accent : colorFor(value)} fillOpacity={isActive ? 0.94 : 1} stroke={isActive ? '#f5f7fa' : isStrong ? '#f5f7fa' : 'rgba(255,255,255,0.12)'} strokeWidth={isActive ? 4 : isStrong ? 3 : 1} filter={isActive ? animation.glow : undefined} />
              </g>
            );
          }))}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
