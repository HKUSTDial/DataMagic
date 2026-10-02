import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const TimelineMilestoneRoadmapDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, false);
  const rows = runtimePoints(sceneContent, scene).slice(0, 8).map((row, index) => ({...row, color: row.color || palette[index % palette.length]}));
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  const TRACK_LEFT = 110;
  const TRACK_RIGHT = 1170;
  const TRACK_Y = 300;
  const span = TRACK_RIGHT - TRACK_LEFT;
  const step = span / rows.length;
  const trackDraw = cl(frame, [14, 46], [0, 1]);

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #eef3ff 55%, #f8fafc 100%)'}} />
      <div style={{position: 'absolute', top: 0, left: 0, width: cl(frame, [0, 28], [0, 1280]), height: 3, background: 'linear-gradient(90deg, #2563eb, #93c5fd, transparent)'}} />

      <EditableTransform id="tlmr-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 72, top: 56, fontSize: 36, fontWeight: 860, color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="tlmr-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect x={TRACK_LEFT} y={TRACK_Y - 9} width={span} height={18} rx={9} fill="#e2e8f0" />
          <rect x={TRACK_LEFT} y={TRACK_Y - 9} width={span * trackDraw} height={18} rx={9} fill="url(#tlmrTrack)" />
          <defs>
            <linearGradient id="tlmrTrack" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {rows.map((row, i) => {
            const cx = TRACK_LEFT + i * step + step / 2;
            const chipPop = cl(frame, [26 + i * 7, 44 + i * 7], [0, 1]);
            const textFade = cl(frame, [36 + i * 7, 54 + i * 7], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label);
            const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
            const valueLabel = row.displayValue || formatCompact(row.value, row.label);
            const subtitle = firstString(row.subtitle);
            const r = 30 + focus * 4;
            return (
              <g key={row.label} opacity={runtimeContractOpacity(animation, isActive)}>
                <circle cx={cx} cy={TRACK_Y} r={r} fill={row.color} opacity={chipPop} filter={isActive ? animation.glow : undefined} />
                <circle cx={cx} cy={TRACK_Y} r={r - 5} fill="rgba(255,255,255,0.18)" opacity={chipPop} />
                <text x={cx} y={TRACK_Y + 8} textAnchor="middle" fontSize={24} fontWeight={900} fill="#ffffff" opacity={chipPop}>{i + 1}</text>
                <g transform={`translate(${cx}, ${TRACK_Y + 64})`} opacity={textFade}>
                  <RuntimeEntitySvgLabel data-dm-text-editable x={0} y={0} textAnchor="middle" fontSize={19} fontWeight={isActive ? 900 : 780} fill="#0f172a" sceneContent={sceneContent} label={row.label}>{truncate(row.label, 18)}</RuntimeEntitySvgLabel>
                  <text data-dm-text-editable x={0} y={30} textAnchor="middle" fontSize={22} fontWeight={900} fill={isActive ? animation.accent : '#2563eb'}>{truncate(valueLabel, 16)}</text>
                  {subtitle ? <text data-dm-text-editable x={0} y={56} textAnchor="middle" fontSize={13} fontWeight={600} fill="#64748b">{truncate(subtitle, 26)}</text> : null}
                </g>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
