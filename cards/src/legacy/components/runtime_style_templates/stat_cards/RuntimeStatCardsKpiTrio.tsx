import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeCards, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const clampFrame = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing = Easing.out(Easing.cubic),
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

type Kpi = {
  label: string;
  value: string;
  delta: string;
  deltaDirection: 'up' | 'down';
  accent: string;
  spark: number[];
};

const sparkPath = (values: number[], width: number, height: number, progress: number) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const points = values.map((value, index) => ({
    x: (index / (values.length - 1)) * width,
    y: height - ((value - min) / range) * height * 0.85 - height * 0.08,
  }));
  const visible = Math.max(2, Math.ceil(progress * points.length));
  return points
    .slice(0, visible)
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');
};

const sparkArea = (values: number[], width: number, height: number, progress: number) => {
  const path = sparkPath(values, width, height, progress);
  if (!path) return '';
  const visible = Math.max(2, Math.ceil(progress * values.length));
  const lastIndex = visible - 1;
  const lastX = (lastIndex / (values.length - 1)) * width;
  return `${path} L ${lastX.toFixed(1)} ${height} L 0 ${height} Z`;
};

export const StatCardsKpiTrioDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safeFps = fps ?? 30;
  const animation = runtimeAnimationContract('stat', scene, rawFrame, safeFps);

  const cardEntrance = spring({
    frame,
    fps: safeFps,
    config: {damping: 200, stiffness: 130},
    durationInFrames: 28,
  });

  const sparkWidth = 232;
  const sparkHeight = 72;
  const runtime = runtimeCards(sceneContent, scene);
  const palette = paletteFor(sceneContent, false);
  const visualKpis: Kpi[] = runtime.slice(0, 3).map((card, index) => {
      const rawDelta = typeof card.delta === 'number' && Number.isFinite(card.delta) ? card.delta : null;
      const delta = rawDelta !== null
        ? `${rawDelta >= 0 ? '+' : '-'}${formatCompact(Math.abs(rawDelta), card.label)}`
        : typeof card.subtitle === 'string' && /^[+-]/.test(card.subtitle.trim())
          ? card.subtitle.trim()
          : card.subtitle || '';
      return {
        label: card.label,
        value: card.displayValue || formatCompact(card.value, card.label),
        delta,
        deltaDirection: rawDelta !== null ? (rawDelta < 0 ? 'down' : 'up') : String(card.subtitle || '').includes('-') ? 'down' : 'up',
        accent: card.color || palette[index % palette.length],
        spark: card.sparkline && card.sparkline.length >= 2 ? card.sparkline : [],
      };
    });
  const title = slotTitle(sceneContent);
  if (!visualKpis.length || !title) return null;

  return (
    <AbsoluteFill
      style={{
        background: '#f4f5fb',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        color: '#1f2937',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.92), transparent 32%), radial-gradient(circle at 82% 78%, rgba(99,102,241,0.08), transparent 26%)',
        }}
      />

      <EditableTransform id="kpi-trio-eyebrow" role="subtitle" style={{display: 'block'}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 96,
            top: 86,
            fontSize: 12,
            fontWeight: 850,
            letterSpacing: '0.22em',
            color: '#2563eb',
            textTransform: 'uppercase',
            opacity: clampFrame(frame, [0, 14], [0, 1]),
          }}
        >
          Performance Snapshot
        </div>
      </EditableTransform>

      <EditableTransform id="kpi-trio-title" role="title" style={{display: 'block'}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 96,
            top: 122,
            width: 760,
            fontSize: 42,
            lineHeight: 1.04,
            fontWeight: 880,
            letterSpacing: 0,
            color: '#1f2937',
            opacity: clampFrame(frame, [4, 22], [0, 1]),
          }}
        >
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="kpi-trio-cards" role="group" style={{display: 'block'}}>
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 220,
            width: 1088,
            height: 280,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            transform: `translateY(${(1 - cardEntrance) * 16}px)`,
          }}
        >
          {visualKpis.map((kpi, index) => {
            const reveal = clampFrame(frame, [16 + index * 8, 46 + index * 8], [0, 1]);
            const sparkProgress = clampFrame(frame, [30 + index * 8, 80 + index * 8], [0, 1]);
            const isActive = runtimeContractMatches(animation, kpi.label);
            const isUp = kpi.deltaDirection === 'up';
            const deltaColor = isUp ? '#10b981' : '#f43f5e';
            const arrow = isUp ? '▲' : '▼';
            return (
              <div
                key={kpi.label}
                style={{
                  height: 280,
                  borderRadius: 22,
                  background: '#ffffff',
                  border: `1px solid ${isActive ? animation.accent : 'rgba(31,41,55,0.06)'}`,
                  boxShadow: isActive ? `${animation.glow}, 0 1px 0 rgba(255,255,255,0.96) inset` : '0 24px 60px rgba(31,41,55,0.10), 0 1px 0 rgba(255,255,255,0.96) inset',
                  padding: 26,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: reveal * runtimeContractOpacity(animation, isActive),
                  transform: `translateY(${(1 - reveal) * 14}px)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}
                >
                  <div
                    data-dm-text-editable
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                      letterSpacing: '0.16em',
                      color: '#64748b',
                      textTransform: 'uppercase',
                    }}
                  >
                    {truncate(kpi.label, 18)}
                  </div>
                  <div
                    style={{
                      height: 28,
                      borderRadius: 999,
                      padding: '0 12px',
                      background: `${deltaColor}1a`,
                      border: `1px solid ${deltaColor}40`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {kpi.delta ? <span style={{fontSize: 10, color: deltaColor, fontWeight: 900}}>{arrow}</span> : null}
                    <span
                      data-dm-text-editable
                      style={{fontSize: 12, fontWeight: 880, color: deltaColor, letterSpacing: '0.02em'}}
                    >
                      {kpi.delta}
                    </span>
                  </div>
                </div>
                <div
                  data-dm-text-editable
                  style={{
                    fontSize: 56,
                    lineHeight: 1,
                    fontWeight: 900,
                    letterSpacing: 0,
                    color: '#1f2937',
                  }}
                >
                  {kpi.value}
                </div>
                <div style={{flex: 1}} />
                {kpi.spark.length >= 2 ? <svg width={sparkWidth} height={sparkHeight} viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} style={{display: 'block', marginTop: 16}}>
                  <defs>
                    <linearGradient id={`spark-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={kpi.accent} stopOpacity={0.32} />
                      <stop offset="100%" stopColor={kpi.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path d={sparkArea(kpi.spark, sparkWidth, sparkHeight, sparkProgress)} fill={`url(#spark-${index})`} />
                  <path
                    d={sparkPath(kpi.spark, sparkWidth, sparkHeight, sparkProgress)}
                    fill="none"
                    stroke={kpi.accent}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> : null}
              </div>
            );
          })}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
