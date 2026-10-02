import {RuntimeEntityLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, trimNumber, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const arcPath = (cx: number, cy: number, r: number, start: number, end: number, inner: number) => {
  const toRad = (angle: number) => (angle - 90) * Math.PI / 180;
  const sx = cx + r * Math.cos(toRad(start));
  const sy = cy + r * Math.sin(toRad(start));
  const ex = cx + r * Math.cos(toRad(end));
  const ey = cy + r * Math.sin(toRad(end));
  const isx = cx + inner * Math.cos(toRad(end));
  const isy = cy + inner * Math.sin(toRad(end));
  const iex = cx + inner * Math.cos(toRad(start));
  const iey = cy + inner * Math.sin(toRad(start));
  const large = end - start > 180 ? 1 : 0;
  return `M${sx},${sy} A${r},${r},0,${large},1,${ex},${ey} L${isx},${isy} A${inner},${inner},0,${large},0,${iex},${iey} Z`;
};

export const MultiSliceDonutDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('pie', scene, rawFrame, fps ?? 30);
  const emphasis = runtimeContractEase(animation);
  const palette = paletteFor(sceneContent, true);
  const items = runtimePoints(sceneContent, scene).filter((row) => row.value > 0).slice(0, 12).map((row, index) => ({...row, color: row.color || palette[index % palette.length]}));
  const title = slotTitle(sceneContent);
  if (!items.length || !title) return null;
  const total = items.reduce((sum, row) => sum + row.value, 0) || 1;
  let cumulative = 0;

  return (
    <AbsoluteFill style={{background: '#111827', color: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 32% 48%, rgba(59,130,246,0.18), transparent 32%), linear-gradient(135deg, #020617 0%, #111827 100%)'}} />
      <EditableTransform id="runtime-multi-donut-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 82, top: 60, width: 620, fontSize: 41, lineHeight: 1.04, fontWeight: 900, letterSpacing: '-0.04em', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-multi-donut-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {items.map((item, index) => {
            const angle = (item.value / total) * 360;
            const start = cumulative;
            const end = cumulative + angle * ease(frame, [14 + index * 3, 40 + index * 3], [0, 1]);
            cumulative += angle;
            const isActive = runtimeContractMatches(animation, item.label, item.series);
            return <path key={`${item.label}-${index}`} d={arcPath(430, 380, isActive ? 222 + emphasis * 5 : 216, start, end, 118)} fill={isActive ? animation.accent : item.color} opacity={runtimeContractOpacity(animation, isActive, 0.9)} filter={isActive ? animation.glow : undefined} />;
          })}
          <text x={430} y={374} textAnchor="middle" fontSize={14} fontWeight={800} fill="#94a3b8">{uiLabel(sceneContent, 'total', 'TOTAL')}</text>
          <text x={430} y={410} textAnchor="middle" fontSize={34} fontWeight={920} fill="#f8fafc">{trimNumber(total, total >= 100 ? 0 : 1)}</text>
        </svg>
        <div style={{position: 'absolute', left: 740, top: 140, width: 420}}>
          {items.map((item, index) => {
            const isActive = runtimeContractMatches(animation, item.label, item.series);
            return (
              <div key={`${item.label}-legend`} style={{display: 'flex', alignItems: 'center', gap: 12, height: 34, opacity: ease(frame, [32 + index * 3, 52 + index * 3], [0, 1]) * runtimeContractOpacity(animation, isActive, 0.86)}}>
                <div style={{width: 13, height: 13, borderRadius: 999, background: isActive ? animation.accent : item.color}} />
                <div data-dm-text-editable style={{flex: 1, fontSize: 15, fontWeight: 760, color: isActive ? '#ffffff' : '#cbd5e1'}}><RuntimeEntityLabel sceneContent={sceneContent} label={item.label}>{truncate(item.label, 22)}</RuntimeEntityLabel></div>
                <div data-dm-text-editable style={{fontSize: 14, fontWeight: 900, color: isActive ? animation.accent : '#f8fafc'}}>{trimNumber((item.value / total) * 100, 1)}%</div>
              </div>
            );
          })}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
