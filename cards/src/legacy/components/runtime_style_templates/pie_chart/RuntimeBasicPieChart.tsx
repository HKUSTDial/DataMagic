import {RuntimeEntityLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, trimNumber, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const arcPath = (cx: number, cy: number, r: number, start: number, end: number) => {
  const rad = (angle: number) => (angle - 90) * Math.PI / 180;
  const x1 = cx + r * Math.cos(rad(start));
  const y1 = cy + r * Math.sin(rad(start));
  const x2 = cx + r * Math.cos(rad(end));
  const y2 = cy + r * Math.sin(rad(end));
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
};

export const BasicPieChartDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('pie', scene, rawFrame, fps ?? 30);
  const emphasis = runtimeContractEase(animation);
  const palette = paletteFor(sceneContent, false);
  const rows = runtimePoints(sceneContent, scene).filter((row) => row.value > 0).slice(0, 7).map((row, index) => ({
    ...row,
    color: row.color || palette[index % palette.length],
  }));
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  const cx = 430;
  const cy = 370;
  const r = 205;
  let cursor = 0;

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #ecfeff 54%, #f8fafc 100%)'}} />
      <EditableTransform id="runtime-basic-pie-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 90, top: 70, width: 720, fontSize: 44, lineHeight: 1.04, fontWeight: 880, letterSpacing: '-0.04em', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-basic-pie-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <circle cx={cx} cy={cy} r={r + 20} fill="#ffffff" filter="drop-shadow(0 30px 72px rgba(15,23,42,0.12))" />
          {rows.map((row, index) => {
            const fullAngle = (row.value / total) * 360;
            const start = cursor;
            const end = cursor + fullAngle * ease(frame, [14 + index * 4, 42 + index * 4], [0, 1]);
            cursor += fullAngle;
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const scale = isActive ? 1 + emphasis * 0.018 : 1;
            return (
              <path key={`${row.label}-${index}`} d={arcPath(cx, cy, r * scale, start, end)} fill={isActive ? animation.accent : row.color} opacity={runtimeContractOpacity(animation, isActive, 0.92)} stroke="#ffffff" strokeWidth={isActive ? 4 + emphasis * 2 : 3} filter={isActive ? animation.glow : undefined} />
            );
          })}
          <circle cx={cx} cy={cy} r={88} fill="#ffffff" />
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize={13} fontWeight={850} fill="#64748b">{uiLabel(sceneContent, 'total', 'TOTAL')}</text>
          <text data-dm-text-editable x={cx} y={cy + 24} textAnchor="middle" fontSize={34} fontWeight={920} fill="#111827">{trimNumber(total, total >= 100 ? 0 : 1)}</text>
        </svg>
      </EditableTransform>
      <div style={{position: 'absolute', left: 760, top: 170, width: 400}}>
        {rows.map((row, index) => {
          const share = row.value / total * 100;
          const isActive = runtimeContractMatches(animation, row.label, row.series);
          return (
            <div key={`${row.label}-legend`} style={{height: 48, display: 'grid', gridTemplateColumns: '16px 1fr 72px', alignItems: 'center', gap: 14, opacity: ease(frame, [28 + index * 4, 50 + index * 4], [0, runtimeContractOpacity(animation, isActive)])}}>
              <div style={{width: 14, height: 14, borderRadius: 4, background: isActive ? animation.accent : row.color}} />
              <div data-dm-text-editable style={{fontSize: 16, fontWeight: isActive ? 880 : 720, color: isActive ? '#111827' : '#334155'}}><RuntimeEntityLabel sceneContent={sceneContent} label={row.label}>{truncate(row.label, 22)}</RuntimeEntityLabel></div>
              <div data-dm-text-editable style={{fontSize: 16, fontWeight: 860, color: isActive ? animation.accent : '#0f172a', textAlign: 'right'}}>{trimNumber(share, 1)}%</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
