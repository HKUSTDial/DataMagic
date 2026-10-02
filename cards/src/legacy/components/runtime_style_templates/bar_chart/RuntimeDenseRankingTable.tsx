import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const DenseRankingTableDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, fps ?? 30);
  const emphasis = runtimeContractEase(animation);
  const rows = runtimePoints(sceneContent, scene)
    .slice(0, 12)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .map((row, index) => ({...row, isLeader: index === 0}));
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;
  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const rowsTop = 152;
  const chartBottom = 520;
  const rowTotalHeight = (chartBottom - rowsTop) / rows.length;
  const rowHeight = Math.max(20, Math.min(48, rowTotalHeight - 4));
  const rowGap = Math.max(2, rowTotalHeight - rowHeight);
  const labelFont = rowHeight >= 40 ? 16 : rowHeight >= 30 ? 15 : rowHeight >= 24 ? 13 : 12;
  const valueFont = rowHeight >= 40 ? 15 : rowHeight >= 30 ? 14 : rowHeight >= 24 ? 12 : 11;
  const rankFont = rowHeight >= 40 ? 13 : rowHeight >= 30 ? 12 : rowHeight >= 24 ? 11 : 10;
  const barH = Math.min(20, Math.max(12, rowHeight - 12));
  const labelLeft = 100;
  const labelWidth = 220;
  const barLeft = labelLeft + labelWidth + 16;
  const barTrackWidth = 720;
  const valueLeft = barLeft + barTrackWidth + 16;
  const accentColor = '#fbbf24';
  const neutralColor = '#475569';

  return (
    <AbsoluteFill style={{background: '#0f1419', color: '#ffffff', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden'}}>
      <EditableTransform id="runtime-dense-ranking-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 100, top: 56, width: 760, fontSize: 38, lineHeight: 1.05, fontWeight: 850, letterSpacing: 0, opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-dense-ranking-table" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {rows.map((row, index) => {
            const y = rowsTop + index * (rowHeight + rowGap);
            const reveal = ease(frame, [12 + index * 3, 34 + index * 3], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const opacity = reveal * runtimeContractOpacity(animation, isActive);
            const barWidth = (Math.abs(row.value) / maxValue) * barTrackWidth * reveal;
            const isLeader = row.isLeader || isActive;
            const fillColor = isActive ? animation.accent : isLeader ? accentColor : neutralColor;
            const labelColor = isActive ? animation.accent : isLeader ? accentColor : '#e5e7eb';
            const valueColor = isActive ? animation.accent : isLeader ? accentColor : '#e5e7eb';
            return (
              <g key={`${row.label}-${index}`} opacity={opacity} transform={`translate(${(1 - reveal) * -14}, 0)`}>
                <text x={labelLeft - 36} y={y + rowHeight / 2 + 5} fontSize={rankFont} fontWeight={700} fill="#64748b" textAnchor="end">
                  {String(index + 1).padStart(2, '0')}
                </text>
                <text data-dm-text-editable x={labelLeft} y={y + rowHeight / 2 + 5} fontSize={labelFont} fontWeight={isLeader ? 800 : 600} fill={labelColor}>
                  {truncate(row.label, 24)}
                </text>
                <rect x={barLeft} y={y + rowHeight / 2 - barH / 2} width={barTrackWidth} height={barH} rx={3} fill="rgba(255,255,255,0.06)" />
                {isActive ? (
                  <rect x={barLeft - 5} y={y + rowHeight / 2 - barH / 2 - 5} width={barTrackWidth + 10} height={barH + 10} rx={6} fill={`rgba(251,191,36,${0.08 + emphasis * 0.08})`} />
                ) : null}
                <rect x={barLeft} y={y + rowHeight / 2 - barH / 2} width={barWidth} height={barH} rx={3} fill={fillColor} opacity={0.92} filter={isActive ? animation.glow : undefined} />
                <text data-dm-text-editable x={valueLeft} y={y + rowHeight / 2 + 5} fontSize={valueFont} fontWeight={isLeader ? 800 : 700} fill={valueColor} style={{fontVariantNumeric: 'tabular-nums'}}>
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
