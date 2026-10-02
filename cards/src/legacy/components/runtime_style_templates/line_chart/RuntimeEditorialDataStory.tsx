import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  firstString,
  formatCompact,
  linePath,
  runtimeAnimationContract,
  runtimeContractEase,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimePoints,
  slotTitle,
  truncate,
  uiLabel,
  valueExtent,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const RuntimeEditorialDataStory: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('line', scene, rawFrame, 30);
  const emphasisEase = runtimeContractEase(animation);
  const rows = runtimePoints(sceneContent, scene).slice(0, 14);
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  const subtitle = firstString(sceneContent?.subtitle, sceneContent?.style?.subtitle, '');
  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#ef4444');
  const latest = rows[rows.length - 1];
  const first = rows[0];
  const pct = first.value !== 0 ? ((latest.value - first.value) / Math.abs(first.value)) * 100 : 0;
  const heroStat = firstString(
    sceneContent?.stat,
    sceneContent?.metric,
    sceneContent?.style?.stat,
    pct !== 0 ? `${pct >= 0 ? '+' : ''}${Math.round(pct)}%` : formatCompact(latest.value),
  );
  const heroLabel = firstString(sceneContent?.stat_label, sceneContent?.style?.stat_label, uiLabel(sceneContent, 'stat_label', 'TREND MOMENTUM'));

  const chart = {left: 580, top: 180, width: 560, height: 280};
  const ext = valueExtent(rows.map(r => r.value));
  const points = rows.map((row, i) => ({
    x: chart.left + (i / Math.max(1, rows.length - 1)) * chart.width,
    y: chart.top + chart.height - ((row.value - ext.min) / (ext.max - ext.min || 1)) * chart.height,
  }));
  const visible = Math.max(2, Math.ceil(ease(frame, [24, 82], [0, 1]) * points.length));
  const path = linePath(points.slice(0, visible));

  return (
    <AbsoluteFill style={{background: '#f6f1e8', fontFamily: 'Georgia, Times New Roman, serif', color: '#111827', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 72, top: 54, right: 72, height: 1, background: '#111827', opacity: ease(frame, [0, 10], [0, 1])}} />
      <div style={{position: 'absolute', left: 72, top: 72, fontSize: 13, letterSpacing: '0.22em', fontWeight: 800, fontFamily: 'Inter, Helvetica, Arial, sans-serif', opacity: ease(frame, [0, 14], [0, 1])}}>
        {uiLabel(sceneContent, 'kicker', 'DATA BRIEFING')}
      </div>

      <EditableTransform id="runtime-editorial-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 72, top: 118, width: 430, fontSize: 52, lineHeight: 0.98, fontWeight: 900, letterSpacing: '-0.04em', opacity: ease(frame, [4, 24], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <div style={{position: 'absolute', left: 78, top: 332, opacity: ease(frame, [14, 32], [0, 1])}}>
        <div style={{fontSize: 70, fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1, color: accent}}>{heroStat}</div>
        <div style={{marginTop: 8, fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', fontFamily: 'Inter, Helvetica, Arial, sans-serif'}}>{heroLabel}</div>
      </div>

      {subtitle ? (
        <div style={{position: 'absolute', left: 78, top: 456, width: 380, fontSize: 16, lineHeight: 1.5, color: '#374151', fontFamily: 'Inter, Helvetica, Arial, sans-serif', opacity: ease(frame, [20, 40], [0, 1])}}>
          {truncate(subtitle, 120)}
        </div>
      ) : null}

      <EditableTransform id="runtime-editorial-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect x={542} y={142} width={648} height={388} fill="#fffaf0" stroke="#111827" strokeWidth={2} opacity={ease(frame, [8, 20], [0, 1])} />
          {[0, 0.33, 0.67, 1].map((tick) => {
            const y = chart.top + chart.height - tick * chart.height;
            return (
              <line key={tick} x1={chart.left} x2={chart.left + chart.width} y1={y} y2={y}
                stroke="#d8cfc0" strokeWidth={1} opacity={ease(frame, [10, 22], [0, 1])} />
            );
          })}
          <path d={path} fill="none" stroke="#111827" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point, index) => {
            const row = rows[index];
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const shown = index < visible;
            return (
              <g key={`${row.label}-${index}`} opacity={shown ? runtimeContractOpacity(animation, isActive) : 0}>
                <circle cx={point.x} cy={point.y} r={isActive ? 8 + emphasisEase : 5}
                  fill="#fffaf0" stroke={isActive ? accent : '#111827'}
                  strokeWidth={isActive ? animation.strokeWidth : 2.5}
                  filter={isActive ? animation.glow : undefined} />
                {isActive ? (
                  <text data-dm-text-editable x={point.x + 12} y={point.y - 14}
                    fontSize={14} fontWeight={900} fontFamily="Inter, Helvetica, Arial, sans-serif" fill={accent}>
                    {row.displayValue || formatCompact(row.value, row.label)}
                  </text>
                ) : null}
              </g>
            );
          })}
          {visible >= points.length && (
            <>
              <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y}
                r={8} fill={accent} opacity={ease(frame, [76, 90], [0, 1])} />
              <text x={points[points.length - 1].x - 200} y={points[points.length - 1].y - 16}
                fontSize={15} fontWeight={900} fontFamily="Inter, Helvetica, Arial, sans-serif"
                fill={accent} opacity={ease(frame, [78, 92], [0, 1])}>
                {latest.displayValue || formatCompact(latest.value)}
              </text>
            </>
          )}
        </svg>
      </EditableTransform>

      <div style={{position: 'absolute', left: 72, bottom: 52, right: 72, height: 1, background: '#111827', opacity: ease(frame, [0, 10], [0, 1])}} />
    </AbsoluteFill>
  );
};
