import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const CoffeeRatingHorizontalRankingDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, false);
  const runtimeRows = runtimePoints(sceneContent, scene)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 7);
  const rows = runtimeRows.map((row, index) => ({...row, color: row.color || palette[index % palette.length]}));
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const TOP = 174;
  const ROW_H = 42;
  const GAP = 10;
  const CARD_LEFT = 96;
  const CARD_W = 1088;
  const BAR_LEFT = CARD_LEFT + 268;
  const BAR_W = CARD_W - 268 - 150;

  return (
    <AbsoluteFill style={{background: '#faf7f2', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#2b211a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #fffaf2 0%, #f3e7d6 55%, #faf7f2 100%)'}} />

      <EditableTransform id="crhr-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 70, width: 900, fontSize: 36, fontWeight: 860, letterSpacing: 0, color: '#3a2c20', opacity: cl(frame, [0, 18], [0, 1]), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="crhr-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {rows.map((row, index) => {
            const p = cl(frame, [10 + index * 5, 36 + index * 5], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const y = TOP + index * (ROW_H + GAP);
            const barW = (Math.abs(row.value) / maxValue) * BAR_W * p;
            return (
              <g key={`${row.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive)}>
                <rect x={CARD_LEFT} y={y} width={CARD_W} height={ROW_H} rx={12} fill={isActive ? '#fff7ec' : 'rgba(255,255,255,0.7)'} stroke={isActive ? row.color : 'rgba(180,150,120,0.25)'} strokeWidth={isActive ? 2 : 1} />
                <circle cx={CARD_LEFT + 32} cy={y + ROW_H / 2} r={14} fill={row.color} opacity={0.92} />
                <text x={CARD_LEFT + 32} y={y + ROW_H / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={900} fill="#fff">{index + 1}</text>
                <RuntimeEntitySvgLabel data-dm-text-editable x={CARD_LEFT + 62} y={y + ROW_H / 2 + 5} fontSize={15} fontWeight={isActive ? 860 : 700} fill="#3a2c20" sceneContent={sceneContent} label={row.label}>{truncate(row.label, 18)}</RuntimeEntitySvgLabel>
                <rect x={BAR_LEFT} y={y + ROW_H / 2 - 7} width={BAR_W} height={14} rx={7} fill="rgba(180,150,120,0.18)" />
                <rect x={BAR_LEFT} y={y + ROW_H / 2 - 7} width={barW} height={14} rx={7} fill={row.color} opacity={isActive ? 1 : 0.84} filter={isActive ? animation.glow : undefined} />
                <text data-dm-text-editable x={CARD_LEFT + CARD_W - 24} y={y + ROW_H / 2 + 5} textAnchor="end" fontSize={16} fontWeight={900} fill={isActive ? row.color : '#5a4636'} opacity={p}>
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
