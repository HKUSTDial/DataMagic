import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const TimelineMilestonesDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, false);
  const rows = runtimePoints(sceneContent, scene).slice(0, 8).map((row, index) => ({...row, color: row.color || palette[index % palette.length]}));
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  const AXIS_LEFT = 120;
  const AXIS_RIGHT = 1160;
  const AXIS_Y = 360;
  const span = AXIS_RIGHT - AXIS_LEFT;
  const step = span / Math.max(1, rows.length - 1);
  const axisDraw = cl(frame, [12, 40], [0, 1]);

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 55%, #f8fafc 100%)'}} />
      <div style={{position: 'absolute', top: 0, left: 0, width: cl(frame, [0, 28], [0, 1280]), height: 3, background: 'linear-gradient(90deg, #2563eb, #93c5fd, transparent)'}} />

      <EditableTransform id="tlm-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 72, top: 56, fontSize: 36, fontWeight: 860, color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="tlm-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <line x1={AXIS_LEFT} y1={AXIS_Y} x2={AXIS_LEFT + span * axisDraw} y2={AXIS_Y} stroke="#cbd5e1" strokeWidth={4} strokeLinecap="round" />

          {rows.map((row, i) => {
            const x = AXIS_LEFT + i * step;
            const above = i % 2 === 0;
            const nodePop = cl(frame, [24 + i * 6, 40 + i * 6], [0, 1]);
            const labelFade = cl(frame, [34 + i * 6, 50 + i * 6], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label);
            const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
            const valueLabel = row.displayValue || formatCompact(row.value, row.label);
            const subtitle = firstString(row.subtitle);
            const cardY = above ? AXIS_Y - 50 : AXIS_Y + 50;
            const cardH = subtitle ? 96 : 70;
            const cardTop = above ? cardY - cardH : cardY;
            return (
              <g key={row.label} opacity={runtimeContractOpacity(animation, isActive) * labelFade}>
                <line x1={x} y1={AXIS_Y} x2={x} y2={cardY} stroke={isActive ? row.color : '#cbd5e1'} strokeWidth={isActive ? 2.4 : 1.6} opacity={nodePop} />
                <g transform={`translate(${x - 110}, ${cardTop})`} opacity={labelFade}>
                  <rect x={0} y={0} width={220} height={cardH} rx={14} fill="rgba(255,255,255,0.95)" stroke={isActive ? row.color : 'rgba(148,163,184,0.3)'} strokeWidth={isActive ? animation.strokeWidth : 1} filter={isActive ? animation.glow : undefined} />
                  <RuntimeEntitySvgLabel data-dm-text-editable x={110} y={28} textAnchor="middle" fontSize={18} fontWeight={isActive ? 900 : 760} fill="#0f172a" sceneContent={sceneContent} label={row.label}>{truncate(row.label, 22)}</RuntimeEntitySvgLabel>
                  <text data-dm-text-editable x={110} y={52} textAnchor="middle" fontSize={20} fontWeight={900} fill={isActive ? animation.accent : '#2563eb'}>{truncate(valueLabel, 18)}</text>
                  {subtitle ? <text data-dm-text-editable x={110} y={76} textAnchor="middle" fontSize={13} fontWeight={600} fill="#64748b">{truncate(subtitle, 30)}</text> : null}
                </g>
                <circle cx={x} cy={AXIS_Y} r={11 + focus * 4} fill={row.color} opacity={nodePop} filter={isActive ? animation.glow : undefined} />
                <circle cx={x} cy={AXIS_Y} r={5} fill="#ffffff" opacity={nodePop} />
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
