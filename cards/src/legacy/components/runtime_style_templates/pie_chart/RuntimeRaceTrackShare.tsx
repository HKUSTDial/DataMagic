import {RuntimeEntitySvgLabel, RuntimeEntityLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, trimNumber, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const clampFrame = (frame: number, input: [number, number], output: [number, number], easing = Easing.out(Easing.cubic)) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} ${sweep} ${x1} ${y1}`;
};

export const RaceTrackShareDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('pie', scene, rawFrame, 30);
  const emphasis = runtimeContractEase(animation);
  const palette = paletteFor(sceneContent, true);
  const runtimeRows = runtimePoints(sceneContent, scene).filter((row) => row.value > 0).slice(0, 7);
  const segments = runtimeRows.map((row, index) => ({label: row.label, value: row.value, color: firstString(row.color, palette[index % palette.length])}));
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const title = slotTitle(sceneContent);
  if (!segments.length || !title) return null;
  const cx = 380;
  const cy = 360;
  const ringInner = 80;
  const ringW = segments.length > 5 ? 18 : 22;
  const ringGap = segments.length > 5 ? 6 : 8;
  const arcStart = -Math.PI * 0.75;
  const arcEnd = Math.PI * 0.75;
  const arcLen = arcEnd - arcStart;
  const legendLeft = 760;
  const legendTop = segments.length > 5 ? 170 : 200;
  const legendRowH = segments.length > 5 ? 46 : 56;

  return (
    <AbsoluteFill style={{background: '#0f1419', color: '#fff', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden'}}>
      <EditableTransform id="racetrack-title" role="title" style={{display: 'block', opacity: clampFrame(frame, [0, 16], [0, 1])}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 80, top: 64, width: 620, fontSize: 38, fontWeight: 850, letterSpacing: '-0.02em'}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="racetrack-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {segments.map((segment, index) => {
            const r = ringInner + index * (ringW + ringGap);
            const fillProgress = clampFrame(frame, [16 + index * 6, 50 + index * 6], [0, 1]);
            const sweep = (segment.value / total) * arcLen;
            const fillEnd = arcStart + sweep * fillProgress;
            const isActive = runtimeContractMatches(animation, segment.label);
            return (
              <g key={`${segment.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive, 1)}>
                <path d={arcPath(cx, cy, r, arcStart, arcEnd)} stroke="rgba(255,255,255,0.06)" strokeWidth={ringW} fill="none" strokeLinecap="round" />
                {isActive && fillProgress > 0 ? (
                  <path d={arcPath(cx, cy, r, arcStart, fillEnd)} stroke={animation.accent} strokeWidth={ringW + 10 + emphasis * 4} fill="none" strokeLinecap="round" opacity={0.2 + emphasis * 0.18} />
                ) : null}
                {fillProgress > 0 && (
                  <path
                    className="arc"
                    d={arcPath(cx, cy, r, arcStart, fillEnd)}
                    stroke={isActive ? animation.accent : segment.color}
                    strokeWidth={ringW + (isActive ? 4 : 0)}
                    fill="none"
                    strokeLinecap="round"
                    opacity={isActive ? 1 : 0.92}
                    filter={isActive ? animation.glow : undefined}
                  />
                )}
              </g>
            );
          })}
          <text data-dm-text-editable x={cx} y={cy + 4} textAnchor="middle" fontSize={42} fontWeight={900} fill="#fff" style={{fontVariantNumeric: 'tabular-nums'}}>
            100%
          </text>
          {segments.map((segment, index) => {
            const y = legendTop + index * legendRowH;
            const rowProgress = clampFrame(frame, [22 + index * 6, 50 + index * 6], [0, 1]);
            const isActive = runtimeContractMatches(animation, segment.label);
            return (
              <g key={`lg-${segment.label}`} opacity={rowProgress * runtimeContractOpacity(animation, isActive, 1)}>
                {isActive ? <rect x={legendLeft - 16} y={y - 24} width={390} height={46} rx={16} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" /> : null}
                <rect x={legendLeft} y={y - 14} width={isActive ? 36 : 28} height={28} rx={4} fill={isActive ? animation.accent : segment.color} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={legendLeft + 44} y={y + 6} fontSize={segments.length > 5 ? 17 : 20} fontWeight={isActive ? 900 : 700} fill={isActive ? '#ffffff' : '#e5e7eb'} sceneContent={sceneContent} label={segment.label}>
                  {truncate(segment.label, 22)}
                </RuntimeEntitySvgLabel>
                <text data-dm-text-editable x={legendLeft + 360} y={y + 6} fontSize={segments.length > 5 ? 19 : 22} fontWeight={900} fill={isActive ? animation.accent : '#fff'} textAnchor="end" style={{fontVariantNumeric: 'tabular-nums'}}>
                  {trimNumber((segment.value / total) * 100, 1)}%
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
