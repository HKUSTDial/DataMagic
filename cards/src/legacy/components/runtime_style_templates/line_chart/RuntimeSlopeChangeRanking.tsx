import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  firstString,
  formatCompact,
  paletteFor,
  runtimeAnimationContract,
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

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

type SlopeRow = {label: string; start: number; end: number; color: string};

export const SlopeChangeRankingDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('line', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, false);
  const payloadRows: SlopeRow[] = Array.isArray(sceneContent?.template_payload?.rows)
    ? sceneContent.template_payload.rows
        .map((row: any, index: number): SlopeRow | null => {
          const label = firstString(row?.label, row?.name, row?.category);
          const start = toNumber(row?.start ?? row?.from ?? row?.baseline, NaN);
          const end = toNumber(row?.end ?? row?.to ?? row?.value, NaN);
          if (!label || !Number.isFinite(start) || !Number.isFinite(end)) return null;
          return {label, start, end, color: firstString(row?.color) || palette[index % palette.length]};
        })
        .filter((row: SlopeRow | null): row is SlopeRow => row !== null)
    : [];
  const points = runtimePoints(sceneContent, scene).slice(0, 8);
  const rawRows: SlopeRow[] = payloadRows.length
    ? payloadRows
    : points.length >= 2
      ? points.slice(1).map((point, index): SlopeRow => ({label: point.label, start: points[index].value, end: point.value, color: point.color || palette[index % palette.length]}))
      : [];
  const rows = [...rawRows].sort((a, b) => Math.abs(b.end - b.start) - Math.abs(a.end - a.start)).slice(0, 8);
  const extent = valueExtent(rows.flatMap((row) => [row.start, row.end]));
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  const plot = {left: 360, right: 920, top: 210, bottom: 580};
  const yFor = (value: number) => plot.bottom - ((value - extent.min) / (extent.max - extent.min || 1)) * (plot.bottom - plot.top);

  return (
    <AbsoluteFill style={{background: '#f7f9fc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #ffffff 0%, #eef2ff 52%, #f7f9fc 100%)'}} />
      <EditableTransform id="scr-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 70, width: 1000, fontSize: 40, fontWeight: 880, letterSpacing: '-0.03em', color: '#0f172a', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="scr-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <text x={plot.left} y={plot.top - 30} textAnchor="middle" fontSize={13} fontWeight={850} letterSpacing="0.16em" fill="#94a3b8">{uiLabel(sceneContent, 'start', 'START')}</text>
          <text x={plot.right} y={plot.top - 30} textAnchor="middle" fontSize={13} fontWeight={850} letterSpacing="0.16em" fill="#94a3b8">{uiLabel(sceneContent, 'end', 'END')}</text>
          <line x1={plot.left} x2={plot.left} y1={plot.top} y2={plot.bottom} stroke="#e2e8f0" strokeWidth={1.5} />
          <line x1={plot.right} x2={plot.right} y1={plot.top} y2={plot.bottom} stroke="#e2e8f0" strokeWidth={1.5} />
          {rows.map((row, index) => {
            const progress = ease(frame, [16 + index * 6, 52 + index * 6], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label);
            const y1 = yFor(row.start);
            const y2 = yFor(row.end);
            const xEnd = plot.left + (plot.right - plot.left) * progress;
            const yEnd = y1 + (y2 - y1) * progress;
            const delta = row.end - row.start;
            return (
              <g key={`${row.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive)}>
                <line x1={plot.left} y1={y1} x2={xEnd} y2={yEnd} stroke={isActive ? animation.accent : row.color} strokeWidth={isActive ? 6 : 4.5} strokeLinecap="round" filter={isActive ? animation.glow : undefined} />
                <circle cx={plot.left} cy={y1} r={6} fill={row.color} />
                <circle cx={xEnd} cy={yEnd} r={isActive ? 9 : 7} fill="#ffffff" stroke={isActive ? animation.accent : row.color} strokeWidth={isActive ? animation.strokeWidth : 3} opacity={progress} filter={isActive ? animation.glow : undefined} />
                <text data-dm-text-editable x={plot.left - 18} y={y1 + 5} textAnchor="end" fontSize={13} fontWeight={800} fill="#64748b">{formatCompact(row.start)}</text>
                <RuntimeEntitySvgLabel data-dm-text-editable x={plot.right + 18} y={y2 + 5} fontSize={15} fontWeight={isActive ? 920 : 820} fill={isActive ? animation.accent : '#0f172a'} opacity={progress} sceneContent={sceneContent} label={row.label}>{truncate(row.label, 16)}</RuntimeEntitySvgLabel>
                <text data-dm-text-editable x={plot.right + 18} y={y2 + 24} fontSize={12} fontWeight={760} fill={delta >= 0 ? '#047857' : '#b91c1c'} opacity={progress}>
                  {delta >= 0 ? '+' : ''}{formatCompact(delta)}
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
