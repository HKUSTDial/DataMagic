import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const BasicBarChartDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, fps ?? 30);
  const emphasis = runtimeContractEase(animation);
  const rows = runtimePoints(sceneContent, scene).slice(0, 6);
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;
  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const chart = {left: 252, top: 206, width: 760, height: 290};
  const barGap = rows.length > 4 ? 44 : 88;
  const barWidth = (chart.width - barGap * (rows.length - 1)) / rows.length;

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden'}}>
      <EditableTransform id="runtime-basic-bar-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 92, top: 72, width: 880, fontSize: 48, lineHeight: 1.04, fontWeight: 860, letterSpacing: 0, opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-basic-bar-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect x={158} y={144} width={964} height={430} rx={24} fill="#ffffff" filter="drop-shadow(0 30px 80px rgba(15,23,42,0.14))" />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = chart.top + chart.height - tick * chart.height;
            return <line key={tick} x1={chart.left} x2={chart.left + chart.width} y1={y} y2={y} stroke="#e5e7eb" />;
          })}
          {rows.map((row, index) => {
            const reveal = ease(frame, [18 + index * 5, 50 + index * 5], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const barHeight = (Math.abs(row.value) / maxValue) * chart.height * reveal;
            const x = chart.left + 66 + index * (barWidth + barGap);
            const y = chart.top + chart.height - barHeight;
            return (
              <g key={`${row.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive)}>
                <rect x={x} y={y} width={barWidth} height={barHeight} rx={14} fill={isActive ? animation.accent : '#2563eb'} filter={isActive ? animation.glow : undefined} />
                {isActive ? <rect x={x - 5} y={y - 5} width={barWidth + 10} height={barHeight + 10} rx={16} fill="none" stroke={animation.accent} strokeWidth={2 + emphasis * 1.4} opacity={0.72} /> : null}
                <text data-dm-text-editable x={x + barWidth / 2} y={y - 14} textAnchor="middle" fontSize={15} fontWeight={isActive ? 900 : 780} fill={isActive ? animation.accent : '#334155'} opacity={ease(frame, [44 + index * 5, 64 + index * 5], [0, 1])}>
                  {row.displayValue || formatCompact(row.value, row.label)}
                </text>
                <text data-dm-text-editable x={x + barWidth / 2} y={chart.top + chart.height + 34} textAnchor="middle" fontSize={14} fontWeight={760} fill={isActive ? '#111827' : '#64748b'}>
                  {truncate(row.label, 10)}
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
