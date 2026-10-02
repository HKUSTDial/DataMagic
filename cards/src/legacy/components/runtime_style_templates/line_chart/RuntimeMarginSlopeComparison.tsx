import {RuntimeEntitySvgLabel, RuntimeEntityLabel, runtimeEntityIcon} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  firstString,
  formatCompact,
  paletteFor,
  runtimeAnimationContract,
  runtimeContractEase,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimePoints,
  slotTitle,
  toNumber,
  truncate,
  uiLabel,
  valueExtent,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const clampFrame = (frame: number, input: [number, number], output: [number, number], easing = Easing.out(Easing.cubic)) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

type RuntimeSlopeRow = {
  label: string;
  start: number;
  end: number;
  color: string;
};

const activeCueText = (scene: any, sceneContent: any, rawFrame: number, fps: number): string => {
  const narrations = Array.isArray(scene?.narration) ? scene.narration : [];
  if (!narrations.length) return '';
  const sceneStart = Array.isArray(scene?.time_range) ? Number(scene.time_range[0]) || 0 : 0;
  const rawSeconds = rawFrame / (fps || 30);
  const sceneSeconds = rawSeconds + sceneStart;
  for (const narration of narrations) {
    if (!narration || typeof narration !== 'object') continue;
    const start = Number.isFinite(Number(narration.time_start))
      ? Number(narration.time_start)
      : Number(narration.scene_time_start) + sceneStart;
    const end = Number.isFinite(Number(narration.time_end))
      ? Number(narration.time_end)
      : Number(narration.scene_time_end) + sceneStart;
    if (Number.isFinite(start) && Number.isFinite(end) && sceneSeconds >= start && sceneSeconds <= end) {
      return String(narration.text || '');
    }
  }
  const cues = Array.isArray(sceneContent?.narration_cues) ? sceneContent.narration_cues : [];
  for (const cue of cues) {
    const start = Number(cue?.start);
    const end = Number(cue?.end);
    if (Number.isFinite(start) && Number.isFinite(end) && rawSeconds >= start && rawSeconds <= end) {
      return String(cue.text || '');
    }
  }
  return '';
};

const spreadLabels = (items: {index: number; y: number}[], minGap = 30, minY = 248, maxY = 486) => {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  const placed = sorted.map((item) => ({...item, labelY: Math.max(minY, Math.min(maxY, item.y))}));
  for (let i = 1; i < placed.length; i++) {
    if (placed[i].labelY - placed[i - 1].labelY < minGap) {
      placed[i].labelY = placed[i - 1].labelY + minGap;
    }
  }
  const overflow = placed.length ? placed[placed.length - 1].labelY - maxY : 0;
  if (overflow > 0) {
    for (let i = placed.length - 1; i >= 0; i--) {
      placed[i].labelY -= overflow;
      if (i < placed.length - 1 && placed[i + 1].labelY - placed[i].labelY < minGap) {
        placed[i].labelY = placed[i + 1].labelY - minGap;
      }
    }
  }
  return new Map(placed.map((item) => [item.index, item.labelY]));
};

export const MarginSlopeComparisonDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safeFps = fps ?? 30;
  const animation = runtimeAnimationContract('line', scene, rawFrame, safeFps);
  const emphasisEase = runtimeContractEase(animation);
  const palette = paletteFor(sceneContent, true);
  const payloadRows: RuntimeSlopeRow[] = Array.isArray(sceneContent?.template_payload?.rows)
    ? sceneContent.template_payload.rows
      .map((row: any, index: number): RuntimeSlopeRow | null => {
        const label = firstString(row?.label, row?.name, row?.category);
        const start = toNumber(row?.start ?? row?.from ?? row?.baseline, NaN);
        const end = toNumber(row?.end ?? row?.to ?? row?.value, NaN);
        if (!label || !Number.isFinite(start) || !Number.isFinite(end)) return null;
        return {
          label,
          start,
          end,
          color: firstString(row?.color) || palette[index % palette.length],
        };
      })
      .filter((row: RuntimeSlopeRow | null): row is RuntimeSlopeRow => row !== null)
    : [];
  const points = runtimePoints(sceneContent, scene).slice(0, 8);
  const runtimeRows: RuntimeSlopeRow[] = payloadRows.length
    ? payloadRows
    : points.length >= 2
    ? points.slice(1).map((point, index): RuntimeSlopeRow => ({
      label: point.label,
      start: points[index].value,
      end: point.value,
      color: point.color || palette[index % palette.length],
    }))
    : [];
  const rows = runtimeRows;
  const values = rows.flatMap((row) => [row.start, row.end]);
  const extent = valueExtent(values);
  const card = {x: 190, y: 224, width: 900, height: 344};
  const plot = {
    left: card.x + 146,
    right: card.x + card.width - 318,
    top: card.y + 64,
    bottom: card.y + card.height - 58,
  };
  const x1 = plot.left;
  const x2 = plot.right;
  const yFor = (value: number) => {
    const pct = (value - extent.min) / (extent.max - extent.min || 1);
    return plot.bottom - pct * (plot.bottom - plot.top);
  };
  const cueText = activeCueText(scene, sceneContent, rawFrame, safeFps);
  const fallbackActiveLabel = !animation.active && cueText
    ? rows.find((row) => row.label && cueText.includes(row.label))?.label
    : '';
  const labelYByIndex = spreadLabels(
    rows.map((row, index) => ({index, y: yFor(row.end)})),
    rows.length > 5 ? 31 : 34,
    card.y + 82,
    card.y + card.height - 64,
  );
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  return (
    <AbsoluteFill style={{background: '#101820', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #101820 0%, #162235 64%, #101820 100%)'}} />
      <EditableTransform id="slope-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 100, top: 132, width: 860, fontSize: 48, lineHeight: 1.05, fontWeight: 860, opacity: clampFrame(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="slope-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <rect x={card.x} y={card.y} width={card.width} height={card.height} rx={30} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const value = extent.min + tick * (extent.max - extent.min);
            return (
              <g key={tick}>
                <line x1={card.x + 96} x2={card.x + card.width - 96} y1={yFor(value)} y2={yFor(value)} stroke="rgba(255,255,255,0.08)" />
                <text x={card.x + 72} y={yFor(value) + 5} textAnchor="end" fontSize={13} fontWeight={800} fill="rgba(255,255,255,0.42)">
                  {formatCompact(value)}
                </text>
              </g>
            );
          })}
          <text x={x1} y={card.y + 36} textAnchor="middle" fontSize={13} fontWeight={850} letterSpacing="0.16em" fill="rgba(255,255,255,0.62)">{uiLabel(sceneContent, 'start', 'START')}</text>
          <text x={x2} y={card.y + 36} textAnchor="middle" fontSize={13} fontWeight={850} letterSpacing="0.16em" fill="rgba(255,255,255,0.62)">{uiLabel(sceneContent, 'end', 'END')}</text>
          {rows.map((row, index) => {
            const progress = clampFrame(frame, [18 + index * 7, 56 + index * 7], [0, 1]);
            const explicitActive = runtimeContractMatches(animation, row.label);
            const fallbackActive = row.label === fallbackActiveLabel;
            const isActive = explicitActive || fallbackActive;
            const rowOpacity = animation.active
              ? runtimeContractOpacity(animation, isActive)
              : fallbackActiveLabel
                ? (isActive ? 1 : 0.34)
                : 1;
            const activeStroke = fallbackActive ? Math.max(1, Math.sin(rawFrame / 5) * 0.5 + 1) : 1;
            const y1 = yFor(row.start);
            const y2 = yFor(row.end);
            const labelY = labelYByIndex.get(index) ?? y2;
            const xEnd = x1 + (x2 - x1) * progress;
            const yEnd = y1 + (y2 - y1) * progress;
            return (
              <g key={`${row.label}-${index}`} opacity={rowOpacity}>
                <line
                  className="chart-line"
                  x1={x1}
                  y1={y1}
                  x2={xEnd}
                  y2={yEnd}
                  stroke={isActive ? animation.accent : row.color}
                  strokeWidth={isActive ? 8.5 * activeStroke : 5.25}
                  strokeLinecap="round"
                  filter={isActive ? `drop-shadow(0 0 14px ${animation.accent}88)` : undefined}
                />
                <circle className="dot" cx={x1} cy={y1} r={isActive ? 9 : 8} fill={row.color} />
                <circle className="dot" cx={xEnd} cy={yEnd} r={isActive ? 12 + emphasisEase * 1.4 : 8.5} fill="#ffffff" stroke={isActive ? animation.accent : 'transparent'} strokeWidth={isActive ? Math.max(3, animation.strokeWidth) : 0} opacity={progress} filter={isActive ? `drop-shadow(0 0 12px ${animation.accent}99)` : undefined} />
                {isActive ? (
                  <circle cx={xEnd} cy={yEnd} r={22 + emphasisEase * 6} fill="none" stroke={animation.accent} strokeWidth={1.7} opacity={0.42} />
                ) : null}
                <line x1={x2 + 12} x2={x2 + 50} y1={y2} y2={labelY} stroke={isActive ? animation.accent : 'rgba(255,255,255,0.18)'} strokeWidth={isActive ? 2 : 1.1} opacity={progress} />
                <rect x={x2 + 58} y={labelY - 18} width={Math.max(70, truncate(row.label, rows.length > 5 ? 8 : 15).length * (rows.length > 5 ? 8.4 : 9) + 24 + (runtimeEntityIcon(sceneContent, row.label) ? 32 : 0))} height={30} rx={12} fill={isActive ? 'rgba(22,163,74,0.18)' : 'rgba(255,255,255,0.045)'} stroke={isActive ? animation.accent : 'rgba(255,255,255,0.08)'} strokeWidth={isActive ? 1.4 : 1} opacity={progress} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={x2 + 70} y={labelY + 4} fontSize={rows.length > 5 ? 14 : 15} fontWeight={isActive ? 940 : 850} fill={isActive ? '#ffffff' : 'rgba(255,255,255,0.86)'} opacity={progress} sceneContent={sceneContent} label={row.label}>{truncate(row.label, rows.length > 5 ? 8 : 15)}</RuntimeEntitySvgLabel>
                <text data-dm-text-editable x={x1 - 28} y={y1 + 5} textAnchor="end" fontSize={14} fontWeight={800} fill="rgba(255,255,255,0.48)">{formatCompact(row.start)}</text>
                <text data-dm-text-editable x={card.x + card.width - 34} y={labelY + 5} textAnchor="end" fontSize={rows.length > 5 ? 14 : 15} fontWeight={isActive ? 940 : 820} fill={isActive ? animation.accent : row.color} opacity={progress}>{formatCompact(row.end)}</text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
