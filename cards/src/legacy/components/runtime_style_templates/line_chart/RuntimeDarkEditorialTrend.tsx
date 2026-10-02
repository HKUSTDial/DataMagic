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
import {
  formatCompact,
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

export const DarkEditorialTrendDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safeFps = fps ?? 30;
  const animation = runtimeAnimationContract('line', scene, rawFrame, safeFps);
  const emphasisEase = runtimeContractEase(animation);

  const reveal = clampFrame(frame, [18, 84], [0, 1]);
  const numberEntrance = spring({
    frame: frame - 32,
    fps: safeFps,
    config: {damping: 180, stiffness: 150},
    durationInFrames: 32,
  });

  const runtimeRows = runtimePoints(sceneContent, scene).slice(0, 10);
  const hasRuntimeRows = runtimeRows.length >= 2;
  const values = hasRuntimeRows ? runtimeRows.map((row) => row.value) : [];
  const labelsForRender = hasRuntimeRows ? runtimeRows.map((row) => row.label) : [];
  const title = slotTitle(sceneContent);
  if (!hasRuntimeRows || !title) return null;
  const chart = {left: 600, top: 180, width: 540, height: 240};
  const {min, max} = valueExtent(values);
  const yFor = (value: number) =>
    chart.top + chart.height - ((value - min) / (max - min || 1)) * chart.height * 0.85 - 16;

  const points = values.map((value, index) => ({
    x: chart.left + (index / Math.max(1, values.length - 1)) * chart.width,
    y: yFor(value),
  }));

  const visibleCount = Math.max(2, Math.ceil(reveal * points.length));
  const visiblePoints = points.slice(0, visibleCount);
  const path = visiblePoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const last = visiblePoints[visiblePoints.length - 1];
  const areaPath = `${path} L ${last.x} ${chart.top + chart.height} L ${points[0].x} ${chart.top + chart.height} Z`;

  const activeIndex = labelsForRender.findIndex((label, index) => runtimeContractMatches(animation, label, runtimeRows[index]?.series));
  const safeAnnotationIndex = activeIndex >= 0
    ? activeIndex
    : Math.min(Math.max(1, Math.floor(points.length * 0.66)), Math.max(0, points.length - 2));
  const annotation = points[safeAnnotationIndex];
  const annotationVisible = animation.active && activeIndex >= 0 ? 1 : clampFrame(frame, [56, 80], [0, 1]);

  const latestValue = values[values.length - 1];
  const startValue = values[0];
  const growth = startValue === 0 ? Math.round(latestValue - startValue) : Math.round(((latestValue - startValue) / startValue) * 100);

  return (
    <AbsoluteFill
      style={{
        background: '#0a0f1c',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        color: '#f5f7fa',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 78% 30%, rgba(168,85,247,0.20), transparent 30%), radial-gradient(circle at 22% 80%, rgba(56,189,248,0.13), transparent 28%), linear-gradient(135deg, #0a0f1c 0%, #111728 56%, #050816 100%)',
        }}
      />

      <EditableTransform id="dark-trend-eyebrow" role="metric" style={{display: 'block'}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 96,
            top: 96,
            fontSize: 12,
            fontWeight: 840,
            letterSpacing: '0.22em',
            color: '#a5b4fc',
            textTransform: 'uppercase',
            opacity: clampFrame(frame, [0, 14], [0, 1]),
          }}
        >
          {uiLabel(sceneContent, 'growth_story', 'Growth Story')} · 2026
        </div>
      </EditableTransform>

      <EditableTransform id="dark-trend-headline" role="title" style={{display: 'block'}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 96,
            top: 134,
            width: 460,
            fontSize: 48,
            lineHeight: 1.04,
            fontWeight: 900,
            letterSpacing: '-0.05em',
            color: '#f5f7fa',
            opacity: clampFrame(frame, [4, 22], [0, 1]),
          }}
        >
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="dark-trend-hero-number" role="metric" style={{display: 'block'}}>
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 290,
            width: 460,
            display: 'flex',
            alignItems: 'baseline',
            gap: 14,
            transform: `scale(${0.92 + numberEntrance * 0.08})`,
            transformOrigin: 'left top',
            opacity: clampFrame(frame, [28, 48], [0, 1]),
          }}
        >
          <div
            data-dm-text-editable
            style={{
              fontSize: 76,
              lineHeight: 1,
              fontWeight: 920,
              color: '#a78bfa',
              letterSpacing: '-0.06em',
            }}
          >
            +{growth}%
          </div>
          <div
            data-dm-text-editable
            style={{
              fontSize: 14,
              fontWeight: 740,
              color: 'rgba(245,247,250,0.62)',
              maxWidth: 200,
              lineHeight: 1.4,
            }}
          >
            {uiLabel(sceneContent, 'cumulative_growth_from', 'cumulative growth from')} {truncate(labelsForRender[0], 10)} {uiLabel(sceneContent, 'to', 'to')} {truncate(labelsForRender[labelsForRender.length - 1], 10)}
          </div>
        </div>
      </EditableTransform>

      <EditableTransform id="dark-trend-byline" role="metric" style={{display: 'block'}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 96,
            top: 408,
            width: 440,
            fontSize: 14,
            lineHeight: 1.5,
            fontWeight: 580,
            color: 'rgba(245,247,250,0.62)',
            opacity: clampFrame(frame, [40, 60], [0, 1]),
          }}
        >
          {truncate(sceneContent?.description || scene?.insight_summary || scene?.narrative_goal || '', 120)}
        </div>
      </EditableTransform>

      <EditableTransform id="dark-trend-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <linearGradient id="dark-trend-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.42} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="dark-trend-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = chart.top + chart.height * (1 - t);
            return (
              <line
                key={t}
                x1={chart.left}
                x2={chart.left + chart.width}
                y1={y}
                y2={y}
                stroke="rgba(245,247,250,0.06)"
              />
            );
          })}

          <path d={areaPath} fill="url(#dark-trend-area)" />
          <path
            d={path}
            fill="none"
            stroke="url(#dark-trend-stroke)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{filter: 'drop-shadow(0 0 16px rgba(167,139,250,0.55))'}}
          />

          {points.map((point, index) => (
            <g key={`${labelsForRender[index]}-${index}`} opacity={clampFrame(frame, [22 + index * 5, 42 + index * 5], [0, runtimeContractOpacity(animation, runtimeContractMatches(animation, labelsForRender[index], runtimeRows[index]?.series), 1)])}>
              <text
                data-dm-text-editable
                x={point.x}
                y={chart.top + chart.height + 30}
                textAnchor="middle"
                fontSize={13}
                fontWeight={780}
                fill="rgba(245,247,250,0.5)"
              >
                {truncate(labelsForRender[index], 8)}
              </text>
              {runtimeContractMatches(animation, labelsForRender[index], runtimeRows[index]?.series) ? (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={10}
                  fill="none"
                  stroke={animation.accent}
                  strokeWidth={2.5 + emphasisEase * 2.5}
                  opacity={0.9}
                  style={{filter: animation.glow}}
                />
              ) : null}
            </g>
          ))}

          {visibleCount > safeAnnotationIndex && (
            <g opacity={annotationVisible}>
              <circle
                cx={annotation.x}
                cy={annotation.y}
                r={9}
                fill="#0a0f1c"
                stroke="#a78bfa"
                strokeWidth={animation.active && activeIndex >= 0 ? 3.5 + emphasisEase * 2 : 3}
                style={{filter: animation.active && activeIndex >= 0 ? animation.glow : 'drop-shadow(0 0 14px rgba(167,139,250,0.7))'}}
              />
              <line
                x1={annotation.x}
                y1={annotation.y - 14}
                x2={annotation.x}
                y2={annotation.y - 50}
                stroke={animation.active && activeIndex >= 0 ? animation.accent : 'rgba(167,139,250,0.55)'}
                strokeWidth={animation.active && activeIndex >= 0 ? 1.8 + emphasisEase : 1.5}
                strokeDasharray="3 3"
              />
              <text
                data-dm-text-editable
                x={annotation.x}
                y={annotation.y - 60}
                textAnchor="middle"
                fontSize={12}
                fontWeight={840}
                fill={animation.active && activeIndex >= 0 ? animation.accent : '#a78bfa'}
                letterSpacing="0.06em"
              >
                {truncate(labelsForRender[safeAnnotationIndex], 12)} · {formatCompact(values[safeAnnotationIndex])}
              </text>
            </g>
          )}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
