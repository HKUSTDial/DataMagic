import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const LightDenseRankingBarDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const runtimeRows = runtimePoints(sceneContent, scene)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 10);
  const rows = runtimeRows.map((row) => ({...row, color: '#2563eb'}));
  const compactRuntimeRows = runtimeRows.length > 0 && rows.length <= 4;
  const BAR_H = compactRuntimeRows ? 62 : 36;
  const GAP = compactRuntimeRows ? 24 : 8;
  const CHART_LEFT = compactRuntimeRows ? 286 : 220;
  const CHART_WIDTH = compactRuntimeRows ? 730 : 820;
  const TOP = compactRuntimeRows ? 238 : 130;
  const chartHeight = rows.length * BAR_H + Math.max(0, rows.length - 1) * GAP;
  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 55%, #f8fafc 100%)'}} />
      {compactRuntimeRows ? (
        <div style={{
          position: 'absolute',
          left: 72,
          top: 112,
          width: 1136,
          height: 492,
          borderRadius: 24,
          background: 'rgba(255,255,255,0.86)',
          border: '1px solid rgba(148,163,184,0.16)',
          boxShadow: '0 28px 74px rgba(15,23,42,0.10)',
          opacity: cl(frame, [0, 18], [0, 1]),
        }} />
      ) : null}

      <EditableTransform id="ldrb-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{
          position: 'absolute', left: compactRuntimeRows ? 100 : 72, top: compactRuntimeRows ? 70 : 52,
          fontSize: compactRuntimeRows ? 42 : 34, fontWeight: 860, letterSpacing: 0, color: '#0f172a',
          opacity: cl(frame, [0, 18], [0, 1]),
        }}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: cl(frame, [0, 28], [0, 1280]), height: 3,
        background: 'linear-gradient(90deg, #2563eb, #93c5fd, transparent)',
      }} />

      <EditableTransform id="ldrb-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {/* subtle grid lines */}
          {[25, 50, 75, 100].map(pct => {
            const x = CHART_LEFT + (pct / 100) * CHART_WIDTH;
            return (
              <line key={pct} x1={x} x2={x} y1={TOP - (compactRuntimeRows ? 24 : 10)} y2={TOP + chartHeight + (compactRuntimeRows ? 24 : 0)}
                stroke={compactRuntimeRows ? '#dbeafe' : '#e2e8f0'} strokeWidth={1} />
            );
          })}

          {rows.map((row, i) => {
            const p = cl(frame, [10 + i * 4, 34 + i * 4], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
            const y = TOP + i * (BAR_H + GAP);
            const barW = (Math.abs(row.value) / maxValue) * CHART_WIDTH * p;
            const rank = i + 1;
            const valueLabel = row.displayValue || formatCompact(row.value, row.label);
            const valueInside = compactRuntimeRows && barW > 150;
            const valueX = valueInside ? CHART_LEFT + Math.max(96, barW - 22) : CHART_LEFT + Math.min(CHART_WIDTH - 88, barW + 16);
            return (
              <g key={row.label} opacity={runtimeContractOpacity(animation, isActive)}>
                {isActive ? (
                  <rect
                    x={CHART_LEFT - 196}
                    y={y - 7}
                    width={CHART_WIDTH + 300}
                    height={BAR_H + 14}
                    rx={compactRuntimeRows ? 18 : 10}
                    fill={`rgba(37,99,235,${0.08 + focus * 0.08})`}
                    stroke="rgba(37,99,235,0.22)"
                    strokeWidth={1}
                  />
                ) : null}
                {/* Rank badge */}
                <text x={CHART_LEFT - 16} y={y + BAR_H / 2 + 5}
                  textAnchor="end" fontSize={compactRuntimeRows ? 13 : 11} fontWeight={800} fill="#94a3b8">
                  {rank}
                </text>
                {/* Label */}
                <text data-dm-text-editable x={CHART_LEFT - 24} y={y + BAR_H / 2 + 5}
                  textAnchor="end" fontSize={compactRuntimeRows ? 18 : 12} fontWeight={isActive ? 900 : compactRuntimeRows ? 760 : 600} fill={isActive ? '#0f172a' : '#334155'}>
                  {truncate(row.label, compactRuntimeRows ? 20 : 18)}
                </text>
                {/* Bar background track */}
                <rect x={CHART_LEFT} y={y} width={CHART_WIDTH} height={BAR_H} rx={compactRuntimeRows ? 14 : 6} fill={isActive ? '#dbeafe' : compactRuntimeRows ? '#edf4ff' : '#f1f5f9'} stroke={isActive ? 'rgba(37,99,235,0.34)' : 'transparent'} strokeWidth={isActive ? animation.strokeWidth : 0} />
                {/* Bar fill */}
                <rect x={CHART_LEFT} y={y} width={barW} height={BAR_H} rx={compactRuntimeRows ? 14 : 6} fill={isActive ? animation.accent : '#2563eb'} opacity={isActive ? 1 : compactRuntimeRows ? 0.94 : 0.85} filter={isActive ? animation.glow : undefined} />
                {/* Value */}
                <text data-dm-text-editable
                  x={compactRuntimeRows ? valueX : CHART_LEFT + (Math.abs(row.value) / maxValue) * CHART_WIDTH * p + 10}
                  y={y + BAR_H / 2 + (compactRuntimeRows ? 7 : 5)}
                  textAnchor={valueInside ? 'end' : 'start'}
                  fontSize={compactRuntimeRows ? 20 : 12} fontWeight={isActive ? 940 : 880} fill={isActive && !valueInside ? animation.accent : valueInside ? '#ffffff' : '#1e40af'} opacity={p}>
                  {valueLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
