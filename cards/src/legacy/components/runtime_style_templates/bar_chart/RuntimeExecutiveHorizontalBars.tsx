import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const ExecutiveHorizontalBarsDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safeFps = fps ?? 30;
  const animation = runtimeAnimationContract('bar', scene, rawFrame, safeFps);
  const emphasisEase = runtimeContractEase(animation);
  const shell = spring({
    frame,
    fps: safeFps,
    config: {damping: 190, stiffness: 125},
    durationInFrames: 30,
  });
  const palette = paletteFor(sceneContent, false);
  const runtimeRows = runtimePoints(sceneContent, scene)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 5);
  const visualRows = runtimeRows.map((row, index) => ({...row, color: row.color || palette[index % palette.length]}));
  const maxValue = Math.max(1, ...visualRows.map((row) => Math.abs(row.value)));
  const leader = visualRows[0];
  const title = slotTitle(sceneContent);
  if (!visualRows.length || !leader || !title) return null;

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#111827', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #eef6ff 52%, #f8fafc 100%)'}} />

      {/*
        Panel: position: absolute on canvas.
        INSIDE: flex-column — header row and chart rows are flex children, NOT absolutely positioned.
        No fixed height — panel wraps its content naturally.
      */}
      <div
        style={{
          position: 'absolute',
          left: 76,
          top: runtimeRows.length > 4 ? 64 : 78,
          width: 1128,
          // NO fixed height — wraps content
          borderRadius: 24,
          background: 'rgba(255,255,255,0.88)',
          border: '1px solid rgba(148,163,184,0.14)',
          boxShadow: '0 28px 74px rgba(15,23,42,0.10)',
          padding: runtimeRows.length > 4 ? '34px 36px 32px 36px' : '40px 36px 36px 36px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          opacity: ease(frame, [0, 18], [0, 1]),
          transform: `translateY(${(1 - shell) * 12}px) scale(${0.99 + shell * 0.01})`,
        }}
      >
        {/* Header row: title (flex-grow) + metric badge (flex-shrink-0) side by side */}
        <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: 28}}>

          {/* Title: flex child — height is automatic, never overlaps rows below */}
          <EditableTransform id="executive-bars-title" role="title" style={{display: 'block', flex: 1, minWidth: 0}}>
            <div data-dm-text-editable style={{fontSize: 44, lineHeight: 1, fontWeight: 880, letterSpacing: '-0.045em', whiteSpace: 'nowrap'}}>
              {truncate(title, 60)}
            </div>
          </EditableTransform>

          {/* Metric badge: flex-shrink-0 so it never squeezes the title */}
          <EditableTransform id="executive-bars-metric" role="metric" style={{display: 'block', flexShrink: 0, marginLeft: 16}}>
            <div style={{width: 148, height: 84, borderRadius: 20, background: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: ease(frame, [34, 56], [0, 1])}}>
              <div data-dm-text-editable style={{fontSize: 10, fontWeight: 860, letterSpacing: '0.15em', color: '#64748b', textTransform: 'uppercase', marginBottom: 7}}>{uiLabel(sceneContent, 'leader', 'Leader')}</div>
              <div data-dm-text-editable style={{fontSize: 30, lineHeight: 1, fontWeight: 900, color: leader?.color || '#2563eb', letterSpacing: '-0.04em'}}>
                {leader.displayValue || formatCompact(leader.value, leader.label)}
              </div>
            </div>
          </EditableTransform>

        </div>

        {/* Chart rows: flex child — starts immediately after the header row */}
        <EditableTransform id="executive-bars-chart" role="chart" style={{display: 'block'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: runtimeRows.length > 4 ? 16 : 24}}>
            {visualRows.map((row, index) => {
              const p = ease(frame, [18 + index * 7, 50 + index * 7], [0, 1]);
              const isActive = runtimeContractMatches(animation, row.label, row.series);
              const focus = runtimeContractEase(animation);
              return (
                <div
                  key={row.label}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr 72px',
                    alignItems: 'center',
                    gap: 22,
                    margin: '0 -12px',
                    padding: '5px 12px',
                    borderRadius: 14,
                    background: isActive ? `rgba(37,99,235,${0.08 + focus * 0.08})` : 'transparent',
                    opacity: ease(frame, [10 + index * 5, 30 + index * 5], [0, runtimeContractOpacity(animation, isActive)]),
                    boxShadow: isActive ? `0 10px 28px rgba(37,99,235,${0.08 + focus * 0.08})` : 'none',
                  }}
                >
                  <div data-dm-text-editable style={{fontSize: 18, fontWeight: isActive ? 900 : 800, color: isActive ? '#0f172a' : '#334155'}}>{truncate(row.label, 18)}</div>
                  <div style={{height: 24, borderRadius: 999, background: isActive ? '#dbeafe' : '#e9eef5', overflow: 'visible', boxShadow: isActive ? `0 0 0 ${2 + emphasisEase * 2}px rgba(37,99,235,0.18)` : 'none'}}>
                    <div className="bar" style={{width: `${(Math.abs(row.value) / maxValue) * 100 * p}%`, height: '100%', borderRadius: 999, background: isActive ? `linear-gradient(90deg, ${row.color}, ${animation.accent})` : row.color, border: isActive ? `${animation.strokeWidth}px solid rgba(255,255,255,0.72)` : '0 solid transparent', boxSizing: 'border-box', boxShadow: isActive ? '0 0 0 2px rgba(37,99,235,0.26), 0 16px 34px rgba(37,99,235,0.22)' : `0 10px 24px ${row.color}33`}} />
                  </div>
                  <div data-dm-text-editable style={{textAlign: 'right', fontSize: 22, fontWeight: isActive ? 940 : 880, color: isActive ? animation.accent : row.color}}>
                    {row.displayValue || formatCompact(row.value, row.label)}
                  </div>
                </div>
              );
            })}
          </div>
        </EditableTransform>
      </div>
    </AbsoluteFill>
  );
};
