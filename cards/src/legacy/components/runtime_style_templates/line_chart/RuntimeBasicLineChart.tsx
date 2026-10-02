import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, formatCompact, linePath, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, valueExtent, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const BasicLineChartDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('line', scene, rawFrame, fps ?? 30);
  const emphasis = runtimeContractEase(animation);
  const rows = runtimePoints(sceneContent, scene).slice(0, 14);
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;
  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#2563eb');
  const chart = {left: 150, top: 205, width: 980, height: 310};
  const ext = valueExtent(rows.map((row) => row.value));
  const points = rows.map((row, index) => ({
    x: chart.left + (index / Math.max(1, rows.length - 1)) * chart.width,
    y: chart.top + chart.height - ((row.value - ext.min) / (ext.max - ext.min || 1)) * chart.height,
  }));
  const visible = Math.max(2, Math.ceil(ease(frame, [18, 78], [0, 1]) * points.length));
  const path = linePath(points.slice(0, visible));

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #f8fafc 100%)'}} />
      <EditableTransform id="runtime-basic-line-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 94, top: 72, width: 820, fontSize: 46, lineHeight: 1.04, fontWeight: 880, letterSpacing: '-0.04em', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-basic-line-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect x={106} y={160} width={1068} height={420} rx={26} fill="rgba(255,255,255,0.90)" stroke="#e2e8f0" filter="drop-shadow(0 30px 70px rgba(15,23,42,0.10))" />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = chart.top + chart.height - tick * chart.height;
            return <line key={tick} x1={chart.left} x2={chart.left + chart.width} y1={y} y2={y} stroke="#e5e7eb" />;
          })}
          <path d={path} fill="none" stroke={accent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" filter={`drop-shadow(0 12px 24px ${accent}33)`} />
          {points.map((point, index) => {
            const row = rows[index];
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const shown = index < visible;
            return (
              <g key={`${row.label}-${index}`} opacity={shown ? runtimeContractOpacity(animation, isActive) : 0}>
                <circle cx={point.x} cy={point.y} r={isActive ? 8 + emphasis : 6} fill="#ffffff" stroke={isActive ? animation.accent : accent} strokeWidth={isActive ? animation.strokeWidth : 4} filter={isActive ? animation.glow : undefined} />
                {isActive ? (
                  <text data-dm-text-editable x={point.x + 12} y={point.y - 18} fontSize={15} fontWeight={900} fill={animation.accent}>
                    {row.displayValue || formatCompact(row.value, row.label)}
                  </text>
                ) : null}
                <text data-dm-text-editable x={point.x} y={chart.top + chart.height + 34} textAnchor="middle" fontSize={13} fontWeight={740} fill={isActive ? '#111827' : '#64748b'}>
                  {truncate(row.label, 9)}
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
