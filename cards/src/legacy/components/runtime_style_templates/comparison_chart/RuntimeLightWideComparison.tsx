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

const ROW_H = 52;
const COL_W = 190;
const LEFT = 180;
const TOP = 158;

export const LightWideComparisonDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('comparison', scene, rawFrame, 30);
  const runtimeRows = comparisonRows(sceneContent, scene).slice(0, 8);
  const metrics = metricNamesForRows(runtimeRows);
  const colors = paletteFor(sceneContent, false);
  const title = slotTitle(sceneContent);
  if (!runtimeRows.length || !metrics.length || !title) return null;

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #eff6ff 50%, #f8fafc 100%)'}} />

      <EditableTransform id="lwc-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{
          position: 'absolute', left: 72, top: 44,
          fontSize: 34, fontWeight: 860, letterSpacing: '-0.03em', color: '#0f172a',
          opacity: cl(frame, [0, 18], [0, 1]),
        }}>
          {title}
        </div>
      </EditableTransform>

      {/* Column headers */}
      {metrics.map((m, mi) => (
        <div key={m} style={{
          position: 'absolute',
          left: LEFT + 160 + mi * COL_W,
          top: TOP - 36,
          width: COL_W - 16,
          textAlign: 'center',
          fontSize: 12, fontWeight: 800, letterSpacing: '0.12em',
          color: colors[mi % colors.length],
          textTransform: 'uppercase',
          opacity: cl(frame, [0, 18], [0, 1]),
        }}>{truncate(m, 18)}</div>
      ))}

      {/* Rows */}
      {runtimeRows.map((entity, ri) => {
        const rowP = cl(frame, [8 + ri * 3, 30 + ri * 3], [0, 1]);
        const isEven = ri % 2 === 0;
        const rowActive = runtimeContractMatches(animation, entity.label);
        return (
          <div key={entity.label} style={{
            position: 'absolute',
            left: LEFT, top: TOP + ri * ROW_H,
            width: 1000, height: ROW_H - 4,
            borderRadius: 10,
            background: rowActive ? 'rgba(219,234,254,0.96)' : isEven ? 'rgba(255,255,255,0.8)' : 'rgba(241,245,249,0.6)',
            border: rowActive ? `2px solid ${animation.accent}` : '1px solid transparent',
            display: 'flex', alignItems: 'center',
            opacity: rowP * runtimeContractOpacity(animation, rowActive, 1),
            boxShadow: rowActive ? animation.glow : isEven ? '0 1px 4px rgba(37,99,235,0.06)' : 'none',
          }}>
            {/* Entity name */}
            <div data-dm-text-editable style={{
              width: 140, paddingLeft: 20,
              fontSize: 14, fontWeight: 700, color: '#334155',
            }}>{truncate(entity.label, 20)}</div>

            {/* Metric cells */}
            {metrics.map((metricName, mi) => {
              const metric = entity.metrics.find((candidate) => candidate.name === metricName);
              const val = metric?.value ?? 0;
              const max = metricMax(runtimeRows, metricName);
              const color = firstString(metric?.color, colors[mi % colors.length]);
              const metricActive = rowActive || runtimeContractMatches(animation, metricName, `${entity.label} ${metricName}`);
              return (
              <div key={metricName} style={{
                width: COL_W, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4, opacity: runtimeContractOpacity(animation, metricActive, 1),
              }}>
                <div data-dm-text-editable style={{
                  fontSize: 16, fontWeight: 800,
                  color: metricActive ? animation.accent : color,
                }}>{metric?.displayValue || formatCompact(val, metricName)}</div>
                {/* Mini bar */}
                <div style={{width: 80, height: 5, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden'}}>
                  <div style={{
                    width: `${Math.min(100, Math.max(3, (Math.abs(val) / max) * 100))}%`, height: '100%',
                    background: metricActive ? animation.accent : color,
                    borderRadius: 3,
                    opacity: 0.7,
                  }} />
                </div>
              </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
