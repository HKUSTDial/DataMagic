import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const HorizontalBarMatrixDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const runtimeRows = runtimePoints(sceneContent, scene)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 12);
  const rows = runtimeRows.map((row, index) => ({...row, isLeader: index === 0}));
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const rowsTop = 152;
  const chartBottom = 520;
  const colCount = 2;
  const perCol = Math.ceil(rows.length / colCount);
  const rowTotal = (chartBottom - rowsTop) / perCol;
  const rowHeight = Math.max(28, Math.min(44, rowTotal - 6));
  const rowGap = Math.max(4, rowTotal - rowHeight);
  const colLeft = [80, 670];
  const rankW = 36;
  const labelW = 165;
  const barWMax = 240;
  const accent = '#fbbf24';
  const neutral = '#475569';

  return (
    <AbsoluteFill style={{background: '#0f1419', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>

      <EditableTransform id="hbm-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 80, top: 60, fontSize: 38, fontWeight: 850, letterSpacing: 0, color: '#ffffff', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="hbm-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {rows.map((row, index) => {
            const p = cl(frame, [10 + index * 3, 32 + index * 3], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const col = index < perCol ? 0 : 1;
            const rowIdx = index % perCol;
            const y = rowsTop + rowIdx * (rowHeight + rowGap);
            const baseX = colLeft[col];
            const labelX = baseX + rankW;
            const barX = labelX + labelW;
            const valueX = barX + barWMax + 12;
            const barWidth = (Math.abs(row.value) / maxValue) * barWMax * p;
            const isLeader = row.isLeader || isActive;
            const fill = isActive ? animation.accent : isLeader ? accent : neutral;
            const labelColor = isActive ? animation.accent : isLeader ? accent : '#e5e7eb';
            return (
              <g key={`${row.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive)}>
                {isActive ? <rect x={baseX - 10} y={y - 4} width={540} height={rowHeight + 8} rx={10} fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.22)" strokeWidth={1} /> : null}
                <text x={baseX} y={y + rowHeight / 2 + 5} fontSize={12} fontWeight={700} fill="#64748b" textAnchor="start">
                  {String(index + 1).padStart(2, '0')}
                </text>
                <text data-dm-text-editable x={labelX} y={y + rowHeight / 2 + 5} fontSize={14} fontWeight={isLeader ? 800 : 600} fill={labelColor}>
                  {truncate(row.label, 18)}
                </text>
                <rect x={barX} y={y + rowHeight / 2 - 7} width={barWMax} height={14} rx={3} fill="rgba(255,255,255,0.06)" />
                <rect x={barX} y={y + rowHeight / 2 - 7} width={barWidth} height={14} rx={3} fill={fill} opacity={0.92} filter={isActive ? animation.glow : undefined} />
                <text data-dm-text-editable x={valueX} y={y + rowHeight / 2 + 5} fontSize={13} fontWeight={isLeader ? 800 : 700} fill={labelColor} style={{fontVariantNumeric: 'tabular-nums'}} opacity={p}>
                  {row.displayValue || formatCompact(row.value, row.label)}
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
