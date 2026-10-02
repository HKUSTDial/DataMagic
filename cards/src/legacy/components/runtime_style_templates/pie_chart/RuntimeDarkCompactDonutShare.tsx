import {RuntimeEntityLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  firstString,
  runtimeAnimationContract,
  runtimeContractEase,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimePoints,
  slotTitle,
  trimNumber,
  truncate,
  uiLabel,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const radius = 154;
const strokeWidth = 34;
const circumference = 2 * Math.PI * radius;

export const DarkCompactDonutShareDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safeFps = fps ?? 30;
  const animation = runtimeAnimationContract('pie', scene, rawFrame, safeFps);
  const emphasis = runtimeContractEase(animation);
  const progress = ease(frame, [0, 44], [0, 1]);
  const runtimeRows = runtimePoints(sceneContent, scene)
    .filter((row) => row.value > 0)
    .slice(0, 5);
  const palette = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'];
  const visualSlices = runtimeRows.map((row, index) => ({
      label: row.label,
      value: row.value,
      color: firstString(row.color, palette[index % palette.length], '#60a5fa'),
    }));
  const total = visualSlices.reduce((sum, slice) => sum + slice.value, 0) || 1;
  const title = slotTitle(sceneContent);
  if (!visualSlices.length || !title) return null;
  const largest = visualSlices.reduce((max, item) => (item.value > max.value ? item : max), visualSlices[0]);
  const activeSlice = visualSlices.find((item) => runtimeContractMatches(animation, item.label)) || largest;
  let offset = 0;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 25% 20%, rgba(96,165,250,0.18), transparent 30%), #07111f',
        color: '#f8fafc',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <EditableTransform id="dcds-title" role="title" style={{display: 'block'}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 88,
            top: 58,
            fontSize: 38,
            fontWeight: 880,
            color: '#f8fafc',
            opacity: ease(frame, [0, 18], [0, 1]),
          }}
        >
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="dcds-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <g transform="translate(430 365) rotate(-90)">
            <circle r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
            {visualSlices.map((slice) => {
              const length = (slice.value / total) * circumference;
              const dashOffset = -offset;
              const isActive = runtimeContractMatches(animation, slice.label);
              offset += length;
              return (
                <circle
                  key={slice.label}
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={strokeWidth + (isActive ? animation.strokeWidth * (0.6 + emphasis * 0.4) : 0)}
                  strokeLinecap="round"
                  strokeDasharray={`${length * progress} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  opacity={runtimeContractOpacity(animation, isActive, 0.95)}
                  style={{
                    filter: isActive ? animation.glow : 'drop-shadow(0 12px 18px rgba(0,0,0,0.16))',
                  }}
                />
              );
            })}
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            left: 304,
            top: 286,
            width: 252,
            textAlign: 'center',
            opacity: ease(frame, [20, 42], [0, 1]),
          }}
        >
          <div data-dm-text-editable style={{fontSize: 56, fontWeight: 900, color: visualSlices[0].color}}>
            {trimNumber((activeSlice.value / total) * 100, 1)}%
          </div>
          <div data-dm-text-editable style={{fontSize: 17, fontWeight: 760, color: '#cbd5e1'}}>
            <RuntimeEntityLabel sceneContent={sceneContent} label={activeSlice.label}>{truncate(activeSlice.label, 22)}</RuntimeEntityLabel> {activeSlice === largest ? uiLabel(sceneContent, 'leads_the_mix', 'leads the mix') : uiLabel(sceneContent, 'in_focus', 'in focus')}
          </div>
        </div>

        <div style={{position: 'absolute', left: 720, top: 200, width: 360, display: 'grid', gap: 14}}>
          {visualSlices.map((slice, index) => {
            const isActive = runtimeContractMatches(animation, slice.label);
            return (
              <div
                key={slice.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '18px 1fr 64px',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: isActive ? `${slice.color}22` : 'rgba(255,255,255,0.045)',
                  border: `1px solid ${isActive ? `${slice.color}88` : 'rgba(148,163,184,0.14)'}`,
                  boxShadow: isActive ? `0 14px 28px ${slice.color}1f` : 'none',
                  opacity: ease(frame, [18 + index * 5, 38 + index * 5], [0, 1]) * runtimeContractOpacity(animation, isActive),
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: slice.color,
                    boxShadow: `0 0 0 ${isActive ? 7 : 0}px ${slice.color}${isActive ? '33' : '00'}`,
                  }}
                />
                <span data-dm-text-editable style={{fontSize: 17, fontWeight: 760, color: '#e2e8f0'}}>
                  <RuntimeEntityLabel sceneContent={sceneContent} label={slice.label}>{truncate(slice.label, 22)}</RuntimeEntityLabel>
                </span>
                <span data-dm-text-editable style={{fontSize: 17, fontWeight: 840, color: slice.color, textAlign: 'right'}}>
                  {trimNumber((slice.value / total) * 100, 1)}%
                </span>
              </div>
            );
          })}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
