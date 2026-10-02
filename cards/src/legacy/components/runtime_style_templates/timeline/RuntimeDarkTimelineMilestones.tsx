import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const DarkTimelineMilestonesDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, true);
  const rows = runtimePoints(sceneContent, scene).slice(0, 8).map((row, index) => ({...row, color: row.color || palette[index % palette.length]}));
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  const RAIL_X = 180;
  const TOP = 180;
  const BOTTOM = 680;
  const step = (BOTTOM - TOP) / Math.max(1, rows.length - 1);
  const railDraw = cl(frame, [12, 44], [0, 1]);

  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg, #0b1220 0%, #0f172a 60%, #111827 100%)', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#f8fafc', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: cl(frame, [0, 28], [0, 1280]), height: 3, background: 'linear-gradient(90deg, #60a5fa, #38bdf8, transparent)'}} />

      <EditableTransform id="dtlm-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 80, top: 64, fontSize: 36, fontWeight: 860, color: '#f8fafc', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="dtlm-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <line x1={RAIL_X} y1={TOP} x2={RAIL_X} y2={TOP + (BOTTOM - TOP) * railDraw} stroke="rgba(96,165,250,0.4)" strokeWidth={3} strokeLinecap="round" />

          {rows.map((row, i) => {
            const y = TOP + i * step;
            const nodePop = cl(frame, [22 + i * 6, 38 + i * 6], [0, 1]);
            const textFade = cl(frame, [32 + i * 6, 48 + i * 6], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label);
            const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
            const valueLabel = row.displayValue || formatCompact(row.value, row.label);
            const subtitle = firstString(row.subtitle);
            const r = 13 + focus * 5;
            const glow = `drop-shadow(0 0 ${10 + focus * 14}px ${row.color})`;
            return (
              <g key={row.label} opacity={runtimeContractOpacity(animation, isActive)}>
                <circle cx={RAIL_X} cy={y} r={r + 8} fill={row.color} opacity={nodePop * 0.18} filter={glow} />
                <circle cx={RAIL_X} cy={y} r={r} fill={row.color} opacity={nodePop} filter={glow} />
                <circle cx={RAIL_X} cy={y} r={5} fill="#0b1220" opacity={nodePop} />
                <g transform={`translate(${RAIL_X + 48}, ${y})`} opacity={textFade}>
                  <rect x={0} y={-34} width={subtitle ? 700 : 700} height={68} rx={14} fill={isActive ? 'rgba(30,41,59,0.85)' : 'rgba(15,23,42,0.6)'} stroke={isActive ? row.color : 'rgba(148,163,184,0.18)'} strokeWidth={isActive ? animation.strokeWidth : 1} />
                  <RuntimeEntitySvgLabel data-dm-text-editable x={22} y={subtitle ? -6 : 6} fontSize={20} fontWeight={isActive ? 900 : 760} fill="#f1f5f9" sceneContent={sceneContent} label={row.label}>{truncate(row.label, 30)}</RuntimeEntitySvgLabel>
                  {subtitle ? <text data-dm-text-editable x={22} y={20} fontSize={13} fontWeight={600} fill="#94a3b8">{truncate(subtitle, 48)}</text> : null}
                  <text data-dm-text-editable x={678} y={8} textAnchor="end" fontSize={24} fontWeight={900} fill={isActive ? animation.accent : row.color}>{truncate(valueLabel, 14)}</text>
                </g>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
