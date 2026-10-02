import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  formatCompact,
  paletteFor,
  runtimeAnimationContract,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimePoints,
  slotTitle,
  trimNumber,
  truncate,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const ConversionFunnelCleanDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, false);
  const runtimeRows = runtimePoints(sceneContent, scene).slice(0, 7);
  // Funnel stages read top-to-bottom in the data's given order (widest first).
  const rows = runtimeRows.map((row, index) => ({...row, color: row.color || palette[index % palette.length]}));
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const top = rows[0].value || maxValue;
  const TOP = 192;
  const STAGE_H = Math.min(58, Math.floor((560 - TOP) / rows.length) - 12);
  const GAP = 12;
  const CENTER = 470;
  const MAX_W = 660;

  return (
    <AbsoluteFill style={{background: '#f7f9fc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #ffffff 0%, #eef2ff 52%, #f7f9fc 100%)'}} />
      <EditableTransform id="cfc-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 80, top: 70, width: 1040, fontSize: 38, fontWeight: 880, letterSpacing: '-0.03em', color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="cfc-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {rows.map((row, index) => {
            const progress = cl(frame, [12 + index * 6, 40 + index * 6], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label);
            const wTop = (Math.abs(row.value) / maxValue) * MAX_W;
            const nextVal = index < rows.length - 1 ? Math.abs(rows[index + 1].value) : Math.abs(row.value);
            const wBot = (nextVal / maxValue) * MAX_W;
            const y = TOP + index * (STAGE_H + GAP);
            const halfTop = (wTop / 2) * progress;
            const halfBot = (wBot / 2) * progress;
            const pct = top ? (row.value / top) * 100 : 0;
            const points = `${CENTER - halfTop},${y} ${CENTER + halfTop},${y} ${CENTER + halfBot},${y + STAGE_H} ${CENTER - halfBot},${y + STAGE_H}`;
            return (
              <g key={`${row.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive)}>
                <polygon points={points} fill={row.color} opacity={isActive ? 1 : 0.9} stroke={isActive ? animation.accent : 'transparent'} strokeWidth={isActive ? animation.strokeWidth : 0} filter={isActive ? animation.glow : undefined} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={CENTER} y={y + STAGE_H / 2 + 6} textAnchor="middle" fontSize={16} fontWeight={860} fill="#ffffff" opacity={progress} sceneContent={sceneContent} label={row.label}>{truncate(row.label, 22)}</RuntimeEntitySvgLabel>
                <text data-dm-text-editable x={CENTER + MAX_W / 2 + 40} y={y + STAGE_H / 2 - 2} fontSize={20} fontWeight={900} fill={isActive ? animation.accent : '#0f172a'} opacity={progress}>
                  {row.displayValue || formatCompact(row.value, row.label)}
                </text>
                <text data-dm-text-editable x={CENTER + MAX_W / 2 + 40} y={y + STAGE_H / 2 + 20} fontSize={13} fontWeight={740} fill="#64748b" opacity={progress}>
                  {trimNumber(pct, 1)}%
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
