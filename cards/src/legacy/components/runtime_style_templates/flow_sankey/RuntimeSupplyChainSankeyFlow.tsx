import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {comparisonRows, formatCompact, metricNamesForRows, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, slotTitle, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const CHAIN_PALETTE = ['#38bdf8', '#60a5fa', '#818cf8', '#f59e0b', '#fb7185', '#34d399', '#22d3ee', '#a78bfa'];

type CardNode = {x: number; y: number; w: number; h: number; label: string; value: string; color: string};

export const SupplyChainSankeyFlowDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('flow', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 3);
  const targets = metricNamesForRows(rows).slice(0, 5);
  const title = slotTitle(sceneContent);
  if (rows.length < 1 || targets.length < 1 || !title) return null;

  const flowOf = (r: number, t: string) => rows[r].metrics.find((m) => m.name === t)?.value ?? 0;
  const grand = rows.reduce((acc, _r, ri) => acc + targets.reduce((a, t) => a + Math.abs(flowOf(ri, t)), 0), 0) || 1;

  const sourceNodes: CardNode[] = rows.map((row, index) => ({
    x: 130,
    y: 148 + index * 124,
    w: 164,
    h: 54,
    label: row.label,
    value: formatCompact(targets.reduce((a, t) => a + Math.abs(flowOf(index, t)), 0)),
    color: CHAIN_PALETTE[index],
  }));
  const midTargets = targets.slice(0, 2);
  const middleNodes: CardNode[] = midTargets.map((target, index) => ({
    x: 548,
    y: index === 0 ? 188 : 350,
    w: 184,
    h: 64,
    label: target,
    value: formatCompact(rows.reduce((a, _r, ri) => a + Math.abs(flowOf(ri, target)), 0)),
    color: CHAIN_PALETTE[index + 3],
  }));
  const endTargets = targets.slice(2, 5);
  const endNodes: CardNode[] = endTargets.map((target, index) => ({
    x: 964,
    y: [174, 334, 458][index] ?? 334,
    w: 178,
    h: 58,
    label: target,
    value: formatCompact(rows.reduce((a, _r, ri) => a + Math.abs(flowOf(ri, target)), 0)),
    color: CHAIN_PALETTE[index + 5],
  }));
  const links = [
    ...sourceNodes.flatMap((source, si) => middleNodes.map((target, ti) => ({
      from: [source.x + source.w, source.y + source.h / 2],
      to: [target.x, target.y + target.h / 2],
      value: Math.abs(flowOf(si, midTargets[ti])),
      color: source.color,
      sourceLabel: source.label,
      targetLabel: target.label,
    }))),
    ...middleNodes.flatMap((source, mi) => endNodes.map((target, ti) => ({
      from: [source.x + source.w, source.y + source.h / 2],
      to: [target.x, target.y + target.h / 2],
      value: rows.reduce((a, _r, ri) => a + Math.abs(flowOf(ri, endTargets[ti])) * (mi === 0 ? 0.62 : 0.38), 0),
      color: mi === 0 ? '#f59e0b' : '#fb7185',
      sourceLabel: source.label,
      targetLabel: target.label,
    }))),
  ].filter((link) => link.value > 0);

  return (
    <AbsoluteFill style={{background: '#07111f', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#e5eefc', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 16%, rgba(56,189,248,0.18), transparent 28%), radial-gradient(circle at 72% 78%, rgba(245,158,11,0.16), transparent 32%), linear-gradient(135deg, #07111f 0%, #0f172a 58%, #111827 100%)'}} />
      <div style={{position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.16) 1px, transparent 1px)', backgroundSize: '54px 54px'}} />
      <EditableTransform id="scsf-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 76, top: 56, right: 440, fontSize: 44, lineHeight: 1.02, fontWeight: 880, letterSpacing: 0, color: '#e5eefc', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', right: 76, top: 62, display: 'flex', gap: 10}}>
        {[
          uiLabel(sceneContent, 'quality', 'Quality 92%'),
          uiLabel(sceneContent, 'on_time', 'On-time 87%'),
          uiLabel(sceneContent, 'cost', 'Cost -8%'),
        ].map((label, index) => (
          <div key={label} style={{padding: '9px 12px', borderRadius: 999, border: '1px solid rgba(148,163,184,0.18)', background: 'rgba(15,23,42,0.72)', color: index === 2 ? '#fbbf24' : '#bfdbfe', fontSize: 13, fontWeight: 820, opacity: cl(frame, [16 + index * 5, 34 + index * 5], [0, 1])}}>
            {label}
          </div>
        ))}
      </div>

      <EditableTransform id="scsf-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <filter id="runtimeSupplyChainGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {links.map((link, index) => {
            const reveal = cl(frame, [18 + index * 4, 72 + index * 4], [0, 1]);
            const path = `M ${link.from[0]} ${link.from[1]} C ${link.from[0] + 160} ${link.from[1]}, ${link.to[0] - 160} ${link.to[1]}, ${link.to[0]} ${link.to[1]}`;
            const isActive = runtimeContractMatches(animation, link.sourceLabel, link.targetLabel, `${link.sourceLabel} ${link.targetLabel}`);
            return (
              <path key={`${index}-${link.color}`} d={path} pathLength={1} stroke={isActive ? animation.accent : link.color} strokeWidth={Math.max(10, Math.min(38, (link.value / grand) * 160)) + (isActive ? 4 : 0)} strokeLinecap="round" fill="none" opacity={(0.16 + reveal * (isActive ? 0.62 : 0.46)) * runtimeContractOpacity(animation, isActive, 1)} strokeDasharray={1} strokeDashoffset={1 - reveal} filter={isActive ? animation.glow : 'url(#runtimeSupplyChainGlow)'} />
            );
          })}
          {[...sourceNodes, ...middleNodes, ...endNodes].map((node, index) => {
            const reveal = cl(frame, [10 + index * 4, 34 + index * 4], [0, 1]);
            const isActive = runtimeContractMatches(animation, node.label);
            return (
              <g key={`${node.label}-${index}`} opacity={reveal * runtimeContractOpacity(animation, isActive, 1)} transform={`translate(${(1 - reveal) * -10}, 0)`}>
                <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={16} fill={isActive ? 'rgba(37,99,235,0.18)' : 'rgba(15,23,42,0.86)'} stroke={isActive ? animation.accent : node.color} strokeWidth={isActive ? 2.5 : 1.5} filter={isActive ? animation.glow : undefined} />
                <rect x={node.x + 8} y={node.y + 9} width={6} height={node.h - 18} rx={3} fill={isActive ? animation.accent : node.color} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={node.x + 26} y={node.y + 24} fontSize={15} fontWeight={isActive ? 950 : 850} fill="#f8fafc" sceneContent={sceneContent} label={node.label}>{truncate(node.label, 15)}</RuntimeEntitySvgLabel>
                <text data-dm-text-editable x={node.x + 26} y={node.y + 43} fontSize={13} fontWeight={800} fill={isActive ? animation.accent : node.color}>{node.value}</text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
