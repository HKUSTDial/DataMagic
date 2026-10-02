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
  uiLabel,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const LEFT = 80;
const RIGHT = 1200;
const HEAD_TOP = 168;
const ROW_TOP = 214;
const LABEL_W = 260;

export const WideComparisonGridDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('comparison', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 8);
  const metrics = metricNamesForRows(rows).slice(0, 4);
  const colors = paletteFor(sceneContent, true);
  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#60a5fa');
  const title = slotTitle(sceneContent);
  if (!rows.length || !metrics.length || !title) return null;

  const palette = [accent, ...colors].filter(Boolean);
  const gridW = RIGHT - LEFT;
  const colW = (gridW - LABEL_W) / metrics.length;
  const rowH = Math.min(58, Math.floor((624 - ROW_TOP) / rows.length));

  return (
    <AbsoluteFill style={{background: '#0a0f1c', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#e2e8f0'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #0a0f1c 0%, #111a2e 55%, #0a0f1c 100%)'}} />

      <EditableTransform id="wcg-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{
          position: 'absolute', left: LEFT, top: 52,
          fontSize: 36, fontWeight: 840, letterSpacing: '-0.03em', color: '#f1f5f9',
          opacity: cl(frame, [0, 18], [0, 1]),
        }}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      {/* Header row */}
      <div data-dm-text-editable style={{
        position: 'absolute', left: LEFT, top: HEAD_TOP, width: LABEL_W,
        fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b',
        opacity: cl(frame, [6, 22], [0, 1]),
      }}>{uiLabel(sceneContent, 'entity', 'Entity')}</div>
      {metrics.map((m, mi) => (
        <div key={m} data-dm-text-editable style={{
          position: 'absolute', left: LEFT + LABEL_W + mi * colW + 18, top: HEAD_TOP, width: colW - 28,
          fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: palette[mi % palette.length],
          opacity: cl(frame, [6 + mi * 2, 22 + mi * 2], [0, 1]),
        }}>{truncate(m, 16)}</div>
      ))}
      <div style={{position: 'absolute', left: LEFT, top: HEAD_TOP + 26, width: gridW, height: 1, background: 'rgba(148,163,184,0.22)', opacity: cl(frame, [8, 24], [0, 1])}} />

      {/* Data rows */}
      {rows.map((entity, ri) => {
        const top = ROW_TOP + ri * rowH;
        const rowP = cl(frame, [12 + ri * 3, 32 + ri * 3], [0, 1]);
        const striped = ri % 2 === 1;
        const rowActive = runtimeContractMatches(animation, entity.label);
        return (
          <React.Fragment key={entity.label}>
            {(striped || rowActive) && (
              <div style={{position: 'absolute', left: LEFT - 8, top, width: gridW + 16, height: rowH, background: rowActive ? 'rgba(96,165,250,0.12)' : 'rgba(148,163,184,0.05)', border: rowActive ? `1px solid ${animation.accent}` : 'none', borderRadius: 8, opacity: rowP * runtimeContractOpacity(animation, rowActive, 1), boxShadow: rowActive ? animation.glow : 'none'}} />
            )}
            <div data-dm-text-editable style={{
              position: 'absolute', left: LEFT, top: top + rowH / 2 - 11, width: LABEL_W - 16,
              fontSize: 15, fontWeight: rowActive ? 900 : 700, color: rowActive ? '#ffffff' : '#cbd5e1',
              opacity: rowP * runtimeContractOpacity(animation, rowActive, 1), transform: `translateX(${(1 - rowP) * 10}px)`,
            }}>{truncate(entity.label, 24)}</div>
            {metrics.map((metricName, mi) => {
              const metric = entity.metrics.find((candidate) => candidate.name === metricName);
              const val = metric?.value ?? 0;
              const max = metricMax(rows, metricName);
              const color = firstString(metric?.color, palette[mi % palette.length]);
              const barFull = Math.min(100, Math.max(4, (Math.abs(val) / max) * 100));
              const barW = (colW - 36) * (barFull / 100) * rowP;
              const cellLeft = LEFT + LABEL_W + mi * colW + 18;
              const metricActive = rowActive || runtimeContractMatches(animation, metricName, `${entity.label} ${metricName}`);
              return (
                <React.Fragment key={metricName}>
                  <div data-dm-text-editable style={{
                    position: 'absolute', left: cellLeft, top: top + rowH / 2 - 17, width: colW - 28,
                    fontSize: 16, fontWeight: metricActive ? 920 : 820, color: metricActive ? animation.accent : color,
                    opacity: rowP * runtimeContractOpacity(animation, metricActive, 1),
                  }}>{metric?.displayValue || formatCompact(val, metricName)}</div>
                  <div style={{position: 'absolute', left: cellLeft, top: top + rowH / 2 + 6, width: colW - 36, height: 4, borderRadius: 2, background: 'rgba(148,163,184,0.16)'}}>
                    <div style={{width: barW, height: '100%', borderRadius: 2, background: metricActive ? animation.accent : color, boxShadow: metricActive ? animation.glow : `0 0 8px ${color}66`}} />
                  </div>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
