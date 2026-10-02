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

const LEFT_X = 262;
const RIGHT_X = 914;
const TOP = 218;
const NODE_W = 184;
const NODE_H = 56;

type Node = {label: string; total: number; y0: number; y1: number};

const ribbon = (x0: number, y0: number, x1: number, y1: number, thick: number): string => {
  const cx = (x0 + x1) / 2;
  const t = thick / 2;
  return [
    `M ${x0} ${y0 - t}`,
    `C ${cx} ${y0 - t} ${cx} ${y1 - t} ${x1} ${y1 - t}`,
    `L ${x1} ${y1 + t}`,
    `C ${cx} ${y1 + t} ${cx} ${y0 + t} ${x0} ${y0 + t}`,
    'Z',
  ].join(' ');
};

const layout = (entries: {label: string; total: number}[], _height: number, _gap: number): Node[] => {
  let cursor = TOP;
  return entries.map((e) => {
    const h = NODE_H;
    const node: Node = {label: e.label, total: e.total, y0: cursor, y1: cursor + h};
    cursor += 108;
    return node;
  });
};

export const SupplyFlowSankeyDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('flow', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 3);
  const targets = metricNamesForRows(rows).slice(0, 3);
  const colors = paletteFor(sceneContent, true);
  const title = slotTitle(sceneContent);
  if (rows.length < 1 || targets.length < 1 || !title) return null;

  const flowOf = (r: number, t: string) => rows[r].metrics.find((m) => m.name === t)?.value ?? 0;
  const grand = rows.reduce((acc, _r, ri) => acc + targets.reduce((a, t) => a + Math.abs(flowOf(ri, t)), 0), 0) || 1;

  const height = 320;
  const sources = layout(rows.map((row, ri) => ({label: row.label, total: targets.reduce((a, t) => a + Math.abs(flowOf(ri, t)), 0)})), height, 14);
  const tgts = layout(targets.map((t) => ({label: t, total: rows.reduce((a, _r, ri) => a + Math.abs(flowOf(ri, t)), 0)})), height, 14);

  const srcCursor = sources.map((n) => n.y0);
  const tgtCursor = tgts.map((n) => n.y0);

  return (
    <AbsoluteFill style={{background: '#101820', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 16%, rgba(45,212,191,0.14), transparent 24%), linear-gradient(135deg, #101820 0%, #162235 62%, #0f172a 100%)'}} />
      <EditableTransform id="sfs-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 92, top: 72, fontSize: 48, fontWeight: 870, letterSpacing: 0, color: '#ffffff', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="sfs-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <rect x={154} y={148} width={972} height={368} rx={30} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.10)" />
          {rows.map((_row, ri) =>
            targets.map((t, ti) => {
              const raw = Math.abs(flowOf(ri, t));
              if (raw / grand < 0.004) return null;
              const thick = Math.max(8, Math.min(34, raw / grand * 140));
              const y0 = sources[ri].y0 + NODE_H / 2;
              const y1 = tgts[ti].y0 + NODE_H / 2;
              srcCursor[ri] += thick;
              tgtCursor[ti] += thick;
              const color = colors[ri % colors.length];
              const reveal = cl(frame, [14 + ri * 4 + ti * 2, 46 + ri * 4 + ti * 2], [0, 1]);
              const isActive = runtimeContractMatches(animation, rows[ri].label, t, `${rows[ri].label} ${t}`);
              return (
                <path
                  key={`${ri}-${t}`}
                  d={`M ${LEFT_X + NODE_W / 2} ${y0} C ${(LEFT_X + RIGHT_X) / 2 - 90} ${y0}, ${(LEFT_X + RIGHT_X) / 2 + 90} ${y1}, ${RIGHT_X - NODE_W / 2} ${y1}`}
                  fill="none"
                  stroke={isActive ? animation.accent : color}
                  strokeWidth={thick}
                  strokeLinecap="round"
                  opacity={(0.18 + reveal * (isActive ? 0.66 : 0.48)) * runtimeContractOpacity(animation, isActive, 1)}
                  strokeDasharray="900"
                  strokeDashoffset={(1 - reveal) * 900}
                  filter={isActive ? animation.glow : undefined}
                />
              );
            }),
          )}

          {sources.map((n, ri) => {
            const reveal = cl(frame, [6 + ri * 4, 30 + ri * 4], [0, 1]);
            const color = colors[ri % colors.length];
            const isActive = runtimeContractMatches(animation, n.label);
            return (
              <g key={`s-${ri}`} opacity={reveal * runtimeContractOpacity(animation, isActive, 1)}>
                <rect x={LEFT_X - NODE_W / 2} y={n.y0} width={NODE_W} height={NODE_H} rx={16} fill={isActive ? animation.accent : color} opacity={0.92} filter={isActive ? animation.glow : undefined} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={LEFT_X} y={n.y0 + 34} textAnchor="middle" fontSize={15} fontWeight={isActive ? 950 : 850} fill="#ffffff" sceneContent={sceneContent} label={n.label}>{truncate(n.label, 16)}</RuntimeEntitySvgLabel>
              </g>
            );
          })}

          {tgts.map((n, ti) => {
            const reveal = cl(frame, [20 + ti * 4, 48 + ti * 4], [0, 1]);
            const isActive = runtimeContractMatches(animation, n.label);
            return (
              <g key={`t-${ti}`} opacity={reveal * runtimeContractOpacity(animation, isActive, 1)}>
                <rect x={RIGHT_X - NODE_W / 2} y={n.y0} width={NODE_W} height={NODE_H} rx={16} fill={isActive ? animation.accent : colors[(rows.length + ti) % colors.length] ?? '#f59e0b'} opacity={0.92} filter={isActive ? animation.glow : undefined} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={RIGHT_X} y={n.y0 + 34} textAnchor="middle" fontSize={15} fontWeight={isActive ? 950 : 850} fill="#ffffff" sceneContent={sceneContent} label={n.label}>{truncate(n.label, 16)}</RuntimeEntitySvgLabel>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
