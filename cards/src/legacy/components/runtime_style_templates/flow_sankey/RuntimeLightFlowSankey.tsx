import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  comparisonRows,
  formatCompact,
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

const LEFT_X = 180;
const RIGHT_X = 640;
const NODE_W = 28;
const TOP = 120;
const BOTTOM = 510;

type Node = {label: string; total: number; y0: number; y1: number};

const ribbon = (x0: number, y0: number, x1: number, y1: number, thick: number): string => {
  const cx = (x0 + x1) / 2;
  const t = thick / 2;
  return `M ${x0} ${y0 - t} C ${cx} ${y0 - t} ${cx} ${y1 - t} ${x1} ${y1 - t} L ${x1} ${y1 + t} C ${cx} ${y1 + t} ${cx} ${y0 + t} ${x0} ${y0 + t} Z`;
};

const layout = (entries: {label: string; total: number}[], height: number, gap: number): Node[] => {
  const sum = entries.reduce((acc, e) => acc + e.total, 0) || 1;
  const usable = height - gap * Math.max(0, entries.length - 1);
  let cursor = TOP;
  return entries.map((e) => {
    const h = Math.max(8, (e.total / sum) * usable);
    const node: Node = {label: e.label, total: e.total, y0: cursor, y1: cursor + h};
    cursor += h + gap;
    return node;
  });
};

export const LightFlowSankeyDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('flow', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 8);
  const targets = metricNamesForRows(rows);
  const colors = paletteFor(sceneContent, false);
  const title = slotTitle(sceneContent);
  if (rows.length < 1 || targets.length < 1 || !title) return null;

  const flowOf = (r: number, t: string) => rows[r].metrics.find((m) => m.name === t)?.value ?? 0;
  const grand = rows.reduce((acc, _r, ri) => acc + targets.reduce((a, t) => a + Math.abs(flowOf(ri, t)), 0), 0) || 1;

  const height = BOTTOM - TOP;
  const sources = layout(rows.map((row, ri) => ({label: row.label, total: targets.reduce((a, t) => a + Math.abs(flowOf(ri, t)), 0)})), height, 14);
  const tgts = layout(targets.map((t) => ({label: t, total: rows.reduce((a, _r, ri) => a + Math.abs(flowOf(ri, t)), 0)})), height, 14);

  const srcCursor = sources.map((n) => n.y0);
  const tgtCursor = tgts.map((n) => n.y0);

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #eff6ff 52%, #f8fafc 100%)'}} />
      <EditableTransform id="lgt-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 72, top: 44, fontSize: 36, fontWeight: 860, letterSpacing: 0, color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="lgt-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {rows.map((_row, ri) =>
            targets.map((t, ti) => {
              const raw = Math.abs(flowOf(ri, t));
              if (raw / grand < 0.004) return null;
              const thick = Math.max(3, (raw / grand) * height * 1.25);
              const y0 = srcCursor[ri] + thick / 2;
              const y1 = tgtCursor[ti] + thick / 2;
              srcCursor[ri] += thick;
              tgtCursor[ti] += thick;
              const color = colors[ri % colors.length];
              const reveal = cl(frame, [14 + ri * 4 + ti * 2, 46 + ri * 4 + ti * 2], [0, 1]);
              const isActive = runtimeContractMatches(animation, rows[ri].label, t, `${rows[ri].label} ${t}`);
              return (
                <path key={`${ri}-${t}`} d={ribbon(LEFT_X + NODE_W, y0, RIGHT_X, y1, thick * reveal)} fill={isActive ? animation.accent : color} opacity={(isActive ? 0.52 : 0.28) * runtimeContractOpacity(animation, isActive, 1)} filter={isActive ? animation.glow : undefined} />
              );
            }),
          )}

          {sources.map((n, ri) => {
            const reveal = cl(frame, [6 + ri * 4, 30 + ri * 4], [0, 1]);
            const color = colors[ri % colors.length];
            const isActive = runtimeContractMatches(animation, n.label);
            return (
              <g key={`s-${ri}`} opacity={reveal * runtimeContractOpacity(animation, isActive, 1)}>
                <rect x={LEFT_X} y={n.y0} width={NODE_W} height={Math.max(8, (n.y1 - n.y0) * reveal)} rx={6} fill={isActive ? animation.accent : color} style={{filter: isActive ? animation.glow : 'drop-shadow(0 4px 10px rgba(15,23,42,0.12))'}} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={LEFT_X - 12} y={(n.y0 + n.y1) / 2 - 2} textAnchor="end" fontSize={13} fontWeight={isActive ? 900 : 760} fill={isActive ? animation.accent : '#334155'} sceneContent={sceneContent} label={n.label}>{truncate(n.label, 16)}</RuntimeEntitySvgLabel>
                <text data-dm-text-editable x={LEFT_X - 12} y={(n.y0 + n.y1) / 2 + 15} textAnchor="end" fontSize={11} fontWeight={650} fill="#94a3b8">{formatCompact(n.total)}</text>
              </g>
            );
          })}

          {tgts.map((n, ti) => {
            const reveal = cl(frame, [20 + ti * 4, 48 + ti * 4], [0, 1]);
            const color = colors[(rows.length + ti) % colors.length];
            const isActive = runtimeContractMatches(animation, n.label);
            return (
              <g key={`t-${ti}`} opacity={reveal * runtimeContractOpacity(animation, isActive, 1)}>
                <rect x={RIGHT_X} y={n.y0} width={NODE_W} height={Math.max(8, (n.y1 - n.y0) * reveal)} rx={6} fill={isActive ? animation.accent : color} style={{filter: isActive ? animation.glow : 'drop-shadow(0 4px 10px rgba(15,23,42,0.12))'}} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={RIGHT_X + NODE_W + 12} y={(n.y0 + n.y1) / 2 - 2} textAnchor="start" fontSize={13} fontWeight={isActive ? 900 : 760} fill={isActive ? animation.accent : '#334155'} sceneContent={sceneContent} label={n.label}>{truncate(n.label, 16)}</RuntimeEntitySvgLabel>
                <text data-dm-text-editable x={RIGHT_X + NODE_W + 12} y={(n.y0 + n.y1) / 2 + 15} textAnchor="start" fontSize={11} fontWeight={650} fill="#94a3b8">{formatCompact(n.total)}</text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
