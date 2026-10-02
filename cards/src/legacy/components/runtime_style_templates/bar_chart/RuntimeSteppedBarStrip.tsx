import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const SteppedBarStripDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, fps ?? 30);
  const emphasis = runtimeContractEase(animation);
  const rows = runtimePoints(sceneContent, scene)
    .slice(0, 15)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;
  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));

  return (
    <AbsoluteFill style={{background: '#101820', color: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #111827 0%, #172033 100%)'}} />
      <EditableTransform id="runtime-stepped-strip-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 82, top: 62, width: 840, fontSize: 42, lineHeight: 1.02, fontWeight: 900, letterSpacing: '-0.04em', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-stepped-strip-chart" role="chart" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: 82, top: 150, width: 1116, height: 430}}>
          {rows.map((row, index) => {
            const reveal = ease(frame, [12 + index * 3, 36 + index * 3], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const barWidth = (Math.abs(row.value) / maxValue) * 100 * reveal;
            const alpha = 0.36 + (1 - index / Math.max(1, rows.length - 1)) * 0.48;
            return (
              <div key={`${row.label}-${index}`} style={{height: 26, marginBottom: 2, position: 'relative', opacity: runtimeContractOpacity(animation, isActive)}}>
                <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.035)'}} />
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${barWidth}%`, background: isActive ? animation.accent : `rgba(96,165,250,${alpha})`, boxShadow: isActive ? animation.glow : undefined}} />
                {isActive ? <div style={{position: 'absolute', inset: -2, border: `2px solid ${animation.accent}`, opacity: 0.64 + emphasis * 0.18}} /> : null}
                <div data-dm-text-editable style={{position: 'absolute', left: 14, top: 5, fontSize: 12, fontWeight: 820, color: '#f8fafc'}}>{truncate(row.label, 30)}</div>
                <div data-dm-text-editable style={{position: 'absolute', right: 12, top: 5, fontSize: 12, fontWeight: 900, color: isActive ? animation.accent : '#cbd5e1'}}>{row.displayValue || formatCompact(row.value, row.label)}</div>
              </div>
            );
          })}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
