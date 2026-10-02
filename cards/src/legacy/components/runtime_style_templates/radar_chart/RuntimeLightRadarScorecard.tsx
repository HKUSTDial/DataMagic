import {RuntimeEntityLabel} from '../runtimeEntityVisuals';
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

const CX = 420;
const CY = 400;
const R = 200;

export const LightRadarScorecardDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('radar', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 6);
  const axes = metricNamesForRows(rows);
  const colors = paletteFor(sceneContent, false);
  const title = slotTitle(sceneContent);
  if (rows.length < 1 || axes.length < 3 || !title) return null;

  const angleFor = (i: number) => (i / axes.length) * 2 * Math.PI - Math.PI / 2;
  const pointAt = (i: number, radius: number) => ({
    x: CX + Math.cos(angleFor(i)) * radius,
    y: CY + Math.sin(angleFor(i)) * radius,
  });
  const lead = rows[0];

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #ffffff 0%, #eef2ff 50%, #f1f5f9 100%)'}} />

      {/* White card */}
      <div style={{position: 'absolute', left: 56, top: 132, width: 1168, height: 540, borderRadius: 24, background: '#ffffff', boxShadow: '0 24px 60px rgba(15,23,42,0.10)', opacity: cl(frame, [0, 16], [0, 1])}} />

      <EditableTransform id="lrs-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 80, top: 48, fontSize: 34, fontWeight: 860, letterSpacing: '-0.03em', color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
        <div data-dm-text-editable style={{position: 'absolute', left: 82, top: 94, fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b', opacity: cl(frame, [6, 22], [0, 1])}}>
          Scorecard
        </div>
      </EditableTransform>

      <EditableTransform id="lrs-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {[0.25, 0.5, 0.75, 1].map((ring) => {
            const path = axes.map((_, i) => {
              const p = pointAt(i, R * ring);
              return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
            }).join(' ') + ' Z';
            return <path key={ring} d={path} fill="none" stroke="#e2e8f0" strokeWidth={1.2} />;
          })}

          {axes.map((axisName, i) => {
            const rim = pointAt(i, R);
            const lbl = pointAt(i, R + 30);
            const anchor = lbl.x > CX + 6 ? 'start' : lbl.x < CX - 6 ? 'end' : 'middle';
            return (
              <g key={axisName}>
                <line x1={CX} y1={CY} x2={rim.x} y2={rim.y} stroke="#e2e8f0" strokeWidth={1.2} />
                <text data-dm-text-editable x={lbl.x} y={lbl.y + 4} textAnchor={anchor} fontSize={12} fontWeight={800} fill="#475569">
                  {truncate(axisName, 14)}
                </text>
              </g>
            );
          })}

          {rows.map((row, ri) => {
            const color = firstString(row.metrics[0]?.color, colors[ri % colors.length]);
            const isActive = runtimeContractMatches(animation, row.label);
            const scale = cl(frame, [12 + ri * 5, 40 + ri * 5], [0, 1]);
            const verts = axes.map((axisName, i) => {
              const metric = row.metrics.find((m) => m.name === axisName);
              const val = metric?.value ?? 0;
              const max = metricMax(rows, axisName);
              return pointAt(i, (Math.abs(val) / max) * R * scale);
            });
            const path = verts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x.toFixed(1)} ${v.y.toFixed(1)}`).join(' ') + ' Z';
            return (
              <g key={row.label}>
                <path d={path} fill={isActive ? animation.accent : color} fillOpacity={isActive ? 0.18 : 0.1} stroke={isActive ? animation.accent : color} strokeWidth={isActive ? 4.2 : 2.6} strokeLinejoin="round" filter={isActive ? animation.glow : undefined} opacity={runtimeContractOpacity(animation, isActive, 1)} />
                {verts.map((v, i) => (
                  <circle key={i} cx={v.x} cy={v.y} r={isActive ? 5.5 : 4} fill="#ffffff" stroke={isActive ? animation.accent : color} strokeWidth={isActive ? 3 : 2.4} opacity={scale * runtimeContractOpacity(animation, isActive, 1)} />
                ))}
              </g>
            );
          })}
        </svg>
      </EditableTransform>

      {/* Right-side legend of axis values for the lead entity */}
      <div style={{position: 'absolute', left: 760, top: 196, width: 410, opacity: cl(frame, [16, 32], [0, 1])}}>
        <div data-dm-text-editable style={{fontSize: 14, fontWeight: 800, color: firstString(lead.metrics[0]?.color, colors[0]), letterSpacing: '0.04em', marginBottom: 14}}>
          <RuntimeEntityLabel sceneContent={sceneContent} label={lead.label}>{truncate(lead.label, 26)}</RuntimeEntityLabel>
        </div>
        {axes.map((axisName, i) => {
          const metric = lead.metrics.find((m) => m.name === axisName);
          const val = metric?.value ?? 0;
          const color = colors[i % colors.length];
          const isActive = runtimeContractMatches(animation, lead.label, axisName);
          return (
            <div key={axisName} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', borderRadius: 12, background: isActive ? 'rgba(219,234,254,0.95)' : i % 2 === 0 ? '#f8fafc' : '#ffffff', marginBottom: 8, boxShadow: isActive ? '0 12px 26px rgba(37,99,235,0.14)' : i % 2 === 0 ? 'none' : '0 1px 4px rgba(15,23,42,0.05)', opacity: cl(frame, [20 + i * 4, 38 + i * 4], [0, 1]) * runtimeContractOpacity(animation, isActive, 1)}}>
              <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span style={{width: 10, height: 10, borderRadius: 3, background: color}} />
                <span data-dm-text-editable style={{fontSize: 14, fontWeight: 700, color: '#334155'}}>{truncate(axisName, 22)}</span>
              </span>
              <span data-dm-text-editable style={{fontSize: 17, fontWeight: 860, color: '#0f172a'}}>
                {metric?.displayValue || formatCompact(val, axisName)}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
