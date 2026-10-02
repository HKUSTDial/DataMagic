import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeScatterPoints, slotTitle, truncate, valueExtent, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const chart = {left: 150, top: 150, width: 840, height: 340};

export const DarkCompactScatterPanelDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('scatter', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, true);
  const runtimeRows = runtimeScatterPoints(sceneContent).slice(0, 12);
  const visualPoints = runtimeRows.map((point, index) => ({...point, size: point.size ?? 18, color: point.color || palette[index % palette.length]}));
  const xExt = valueExtent(visualPoints.map((point) => point.x));
  const yExt = valueExtent(visualPoints.map((point) => point.y));
  const sizeMax = Math.max(1, ...visualPoints.map((point) => Math.abs(point.size)));
  const xFor = (value: number) => chart.left + ((value - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
  const yFor = (value: number) => chart.top + chart.height - ((value - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
  const title = slotTitle(sceneContent);
  const xLabel = sceneContent?.data_binding?.x_axis?.label || sceneContent?.data_binding?.x?.label || sceneContent?.mapping?.x || '';
  const yLabel = sceneContent?.data_binding?.y_axis?.label || sceneContent?.data_binding?.y?.label || sceneContent?.mapping?.y || '';
  if (!visualPoints.length || !title) return null;
  const circleObstacles = visualPoints.map((point) => {
    const cx = xFor(point.x);
    const cy = yFor(point.y);
    const radius = 10 + (Math.abs(point.size) / sizeMax) * 18;
    return {x: cx - radius - 4, y: cy - radius - 4, width: radius * 2 + 8, height: radius * 2 + 8};
  });
  const occupiedLabels: Array<{x: number; y: number; width: number; height: number}> = [];
  const placedLabels = visualPoints.map((point, pointIndex) => {
    const cx = xFor(point.x);
    const cy = yFor(point.y);
    const baseRadius = 10 + (Math.abs(point.size) / sizeMax) * 18;
    const width = Math.min(116, point.label.length * 8 + 12);
    const height = 18;
    const candidates = [
      {x: cx + baseRadius + 10, y: cy + 5, anchor: 'start' as const},
      {x: cx - baseRadius - 10, y: cy + 5, anchor: 'end' as const},
      {x: cx, y: cy + baseRadius + 18, anchor: 'middle' as const},
      {x: cx, y: cy - baseRadius - 12, anchor: 'middle' as const},
    ].map((candidate) => {
      const x = candidate.anchor === 'end' ? candidate.x - width : candidate.anchor === 'middle' ? candidate.x - width / 2 : candidate.x;
      return {...candidate, box: {x, y: candidate.y - height + 4, width, height}};
    });
    const inside = (box: {x: number; y: number; width: number; height: number}) =>
      box.x >= chart.left - 30 && box.x + box.width <= chart.left + chart.width + 30 && box.y >= chart.top - 28 && box.y + box.height <= chart.top + chart.height + 28;
    const overlaps = (box: {x: number; y: number; width: number; height: number}) =>
      occupiedLabels.some((other) => !(box.x + box.width < other.x || other.x + other.width < box.x || box.y + box.height < other.y || other.y + other.height < box.y)) ||
      circleObstacles.some((other, obstacleIndex) => obstacleIndex !== pointIndex && !(box.x + box.width < other.x || other.x + other.width < box.x || box.y + box.height < other.y || other.y + other.height < box.y));
    const selected = candidates.find((candidate) => inside(candidate.box) && !overlaps(candidate.box)) || candidates.find((candidate) => inside(candidate.box)) || candidates[0];
    occupiedLabels.push(selected.box);
    return selected;
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(145deg, #07111f 0%, #0f172a 60%, #111827 100%)',
        color: '#f8fafc',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <EditableTransform id="dcsp-title" role="title" style={{display: 'block'}}>
        <div
          data-dm-text-editable
          style={{
            position: 'absolute',
            left: 88,
            top: 58,
            fontSize: 38,
            fontWeight: 880,
            color: '#f8fafc',
            opacity: ease(frame, [0, 18], [0, 1]),
          }}
        >
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="dcsp-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect
            x={chart.left - 40}
            y={chart.top - 38}
            width={chart.width + 80}
            height={chart.height + 76}
            rx={24}
            fill="rgba(15,23,42,0.82)"
            stroke="rgba(148,163,184,0.20)"
          />
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick} opacity={ease(frame, [8, 24], [0, 1])}>
              <line
                x1={xFor(tick)}
                x2={xFor(tick)}
                y1={chart.top}
                y2={chart.top + chart.height}
                stroke="rgba(148,163,184,0.14)"
              />
              <line
                x1={chart.left}
                x2={chart.left + chart.width}
                y1={yFor(tick)}
                y2={yFor(tick)}
                stroke="rgba(148,163,184,0.14)"
              />
            </g>
          ))}

          {visualPoints.map((point, index) => {
            const progress = ease(frame, [16 + index * 5, 42 + index * 5], [0, 1]);
            const baseRadius = 10 + (Math.abs(point.size) / sizeMax) * 18;
            const cx = xFor(point.x);
            const cy = yFor(point.y);
            const labelPlacement = placedLabels[index];
            const isActive = runtimeContractMatches(animation, point.label);
            const fill = isActive ? animation.accent : point.color;
            return (
              <g key={point.label} opacity={runtimeContractOpacity(animation, isActive, progress)}>
                {isActive ? <circle cx={cx} cy={cy} r={(baseRadius + 14) * progress} fill={fill} fillOpacity={0.18} /> : null}
                <circle
                  cx={cx}
                  cy={cy}
                  r={(baseRadius + (isActive ? 3 : 0)) * progress}
                  fill={fill}
                  fillOpacity={isActive ? 1 : 0.88}
                  stroke="#f8fafc"
                  strokeOpacity={0.7}
                  strokeWidth={isActive ? 3 : 2}
                  filter={isActive ? animation.glow : `drop-shadow(0 0 16px ${point.color}55)`}
                />
                <RuntimeEntitySvgLabel
                  x={labelPlacement.x}
                  y={labelPlacement.y}
                  textAnchor={labelPlacement.anchor}
                  fontSize={14}
                  fontWeight={isActive ? 920 : 780}
                  fill={isActive ? '#ffffff' : '#e2e8f0'}
                 sceneContent={sceneContent} label={point.label}>{truncate(point.label, 14)}</RuntimeEntitySvgLabel>
              </g>
            );
          })}
        </svg>
      </EditableTransform>

      <EditableTransform id="dcsp-axes" role="annotation" style={{display: 'block'}}>
        {xLabel ? (
          <div data-dm-text-editable style={{position: 'absolute', left: 150, top: 562, fontSize: 14, fontWeight: 760, color: '#94a3b8'}}>
            {truncate(xLabel, 28)}
          </div>
        ) : null}
        {yLabel ? (
          <div data-dm-text-editable style={{position: 'absolute', left: 58, top: 150, fontSize: 14, fontWeight: 760, color: '#94a3b8'}}>
            {truncate(yLabel, 28)}
          </div>
        ) : null}
      </EditableTransform>
    </AbsoluteFill>
  );
};
