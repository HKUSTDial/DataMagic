import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  comparisonRows,
  firstString,
  formatCompact,
  metricMax,
  metricNamesForRows,
  paletteFor,
  runtimeAnimationContract,
  runtimeContractMatches,
  runtimeContractOpacity,
  slotTitle,
  truncate,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const PLOT_LEFT = 96;
const PLOT_RIGHT = 1184;
const PLOT_TOP = 196;
const PLOT_BOTTOM = 612;

export const QuarterlyRevenueGroupedBarDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('comparison', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 6);
  const metrics = metricNamesForRows(rows).slice(0, 3);
  const colors = paletteFor(sceneContent, false);
  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#2563eb');
  const title = slotTitle(sceneContent);
  if (!rows.length || !metrics.length || !title) return null;

  const palette = [accent, ...colors].filter(Boolean);
  const plotW = PLOT_RIGHT - PLOT_LEFT;
  const plotH = PLOT_BOTTOM - PLOT_TOP;
  const groupW = plotW / rows.length;
  const barGap = 6;
  const innerPad = groupW * 0.18;
  const barW = Math.max(8, (groupW - innerPad * 2 - barGap * (metrics.length - 1)) / metrics.length);

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #ffffff 0%, #eff6ff 52%, #f8fafc 100%)'}} />

      <EditableTransform id="qrgb-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{
          position: 'absolute', left: 96, top: 56,
          fontSize: 36, fontWeight: 860, letterSpacing: '-0.03em', color: '#0f172a',
          opacity: cl(frame, [0, 18], [0, 1]),
        }}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      {/* Legend */}
      <div style={{position: 'absolute', left: 96, top: 116, display: 'flex', gap: 22, opacity: cl(frame, [4, 22], [0, 1])}}>
        {metrics.map((m, mi) => (
          <div key={m} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 14, height: 14, borderRadius: 4, background: palette[mi % palette.length]}} />
            <span data-dm-text-editable style={{fontSize: 13, fontWeight: 760, letterSpacing: '0.04em', color: '#475569'}}>
              {truncate(m, 18)}
            </span>
          </div>
        ))}
      </div>

      {/* Baseline */}
      <div style={{position: 'absolute', left: PLOT_LEFT, top: PLOT_BOTTOM, width: plotW, height: 2, background: '#cbd5e1'}} />

      {/* Groups */}
      {rows.map((entity, ri) => {
        const groupLeft = PLOT_LEFT + ri * groupW + innerPad;
        return (
          <React.Fragment key={entity.label}>
            {metrics.map((metricName, mi) => {
              const metric = entity.metrics.find((candidate) => candidate.name === metricName);
              const val = metric?.value ?? 0;
              const max = metricMax(rows, metricName);
              const color = firstString(metric?.color, palette[mi % palette.length]);
              const fullH = Math.max(4, (Math.abs(val) / max) * plotH);
              const grow = cl(frame, [12 + ri * 4 + mi * 3, 40 + ri * 4 + mi * 3], [0, 1]);
              const h = fullH * grow;
              const x = groupLeft + mi * (barW + barGap);
              const isActive = runtimeContractMatches(animation, entity.label, metricName, `${entity.label} ${metricName}`);
              return (
                <div key={metricName} style={{position: 'absolute', left: x, top: PLOT_BOTTOM - h, width: barW, height: h, opacity: runtimeContractOpacity(animation, isActive, 1)}}>
                  <div style={{
                    width: '100%', height: '100%',
                    background: `linear-gradient(180deg, ${isActive ? animation.accent : color} 0%, ${isActive ? animation.accent : color}cc 100%)`,
                    borderRadius: '5px 5px 0 0',
                    boxShadow: isActive ? animation.glow : `0 6px 14px ${color}33`,
                    border: isActive ? '2px solid #ffffff' : 'none',
                  }} />
                  <div data-dm-text-editable style={{
                    position: 'absolute', top: -22, left: -10, width: barW + 20,
                    textAlign: 'center', fontSize: 11, fontWeight: isActive ? 920 : 820, color: isActive ? animation.accent : color,
                    opacity: cl(frame, [30 + ri * 4 + mi * 3, 48 + ri * 4 + mi * 3], [0, 1]),
                  }}>{metric?.displayValue || formatCompact(val, metricName)}</div>
                </div>
              );
            })}
            <div data-dm-text-editable style={{
              position: 'absolute', left: PLOT_LEFT + ri * groupW, top: PLOT_BOTTOM + 12,
              width: groupW, textAlign: 'center',
              fontSize: 14, fontWeight: runtimeContractMatches(animation, entity.label) ? 920 : 780, color: runtimeContractMatches(animation, entity.label) ? animation.accent : '#334155',
              opacity: cl(frame, [10 + ri * 4, 30 + ri * 4], [0, 1]),
            }}>{truncate(entity.label, 14)}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
