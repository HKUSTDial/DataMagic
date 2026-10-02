import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const DarkCompactBarRankingDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const titleProgress = ease(frame, [0, 16], [0, 1]);
  const palette = paletteFor(sceneContent, true);
  const runtimeRows = runtimePoints(sceneContent, scene)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 6);
  const visualRows = runtimeRows.map((row, index) => ({...row, color: row.color || palette[index % palette.length]}));
  const maxValue = Math.max(1, ...visualRows.map((row) => Math.abs(row.value)));
  const title = slotTitle(sceneContent);
  if (!visualRows.length || !title) return null;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(145deg, #06111f 0%, #0f172a 58%, #111827 100%)',
        color: '#f8fafc',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <EditableTransform id="dcbr-title" role="title" style={{display: 'block', opacity: titleProgress}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 88,
            top: 58,
            fontSize: 38,
            fontWeight: 880,
            color: '#f8fafc',
          }}
        >
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="dcbr-chart" role="chart" style={{display: 'block'}}>
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 150,
            width: 1080,
            display: 'grid',
            gap: 14,
          }}
        >
          {visualRows.map((row, index) => {
            const progress = ease(frame, [14 + index * 6, 44 + index * 6], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
            return (
              <div
                key={row.label}
                style={{
                  height: visualRows.length > 4 ? 60 : 72,
                  display: 'grid',
                  gridTemplateColumns: '260px 1fr 72px',
                  alignItems: 'center',
                  gap: 18,
                  borderRadius: 16,
                  padding: '0 22px',
                  background: isActive ? `rgba(56,189,248,${0.12 + focus * 0.08})` : index === 0 ? 'rgba(96,165,250,0.12)' : 'rgba(255,255,255,0.045)',
                  border: isActive ? '1px solid rgba(125,211,252,0.66)' : index === 0 ? '1px solid rgba(96,165,250,0.34)' : '1px solid rgba(148,163,184,0.14)',
                  opacity: progress * runtimeContractOpacity(animation, isActive),
                  transform: `translateY(${ease(frame, [14 + index * 6, 44 + index * 6], [14, 0])}px)`,
                  boxShadow: isActive ? `0 18px 42px rgba(56,189,248,${0.16 + focus * 0.08})` : 'none',
                }}
              >
                <div data-dm-text-editable style={{fontSize: visualRows.length > 4 ? 17 : 20, fontWeight: isActive ? 920 : 820, color: isActive ? '#f8fafc' : '#e2e8f0'}}>
                  {truncate(row.label, 26)}
                </div>
                <div style={{height: 18, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden'}}>
                  <div
                    style={{
                      width: `${(Math.abs(row.value) / maxValue) * 100 * progress}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: row.color,
                      boxShadow: isActive ? `0 0 0 2px rgba(255,255,255,0.20), 0 10px 24px ${row.color}66` : `0 4px 16px ${row.color}55`,
                    }}
                  />
                </div>
                <div
                  data-dm-text-editable
                  style={{fontSize: 20, fontWeight: isActive ? 940 : 860, color: isActive ? '#7dd3fc' : row.color, textAlign: 'right', fontVariantNumeric: 'tabular-nums'}}
                >
                  {row.displayValue || formatCompact(row.value, row.label)}
                </div>
              </div>
            );
          })}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
