import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const RISE = '#34d399';
const FALL = '#f87171';
const TOTAL = '#60a5fa';

export const DarkWaterfallBridgeDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  paletteFor(sceneContent, true);
  const rows = runtimePoints(sceneContent, scene).slice(0, 10);
  const title = slotTitle(sceneContent);
  if (rows.length < 2 || !title) return null;

  let running = 0;
  const steps = rows.map((row) => {
    const segStart = running;
    running += row.value;
    const segEnd = running;
    return {label: row.label, value: row.value, displayValue: row.displayValue, segStart, segEnd, rising: row.value >= 0, total: false as boolean};
  });
  const grandTotal = running;
  steps.push({label: uiLabel(sceneContent, 'total', 'Total'), value: grandTotal, displayValue: undefined, segStart: 0, segEnd: grandTotal, rising: grandTotal >= 0, total: true});

  const cumulatives = [0, ...steps.map((s) => s.segEnd), grandTotal];
  const domainMin = Math.min(0, ...cumulatives);
  const domainMax = Math.max(0, ...cumulatives);
  const span = Math.max(1, domainMax - domainMin);

  const CHART_LEFT = 120;
  const CHART_WIDTH = 1040;
  const CHART_TOP = 188;
  const CHART_HEIGHT = 340;
  const slot = CHART_WIDTH / steps.length;
  const barW = Math.min(94, slot * 0.6);
  const y = (v: number) => CHART_TOP + CHART_HEIGHT - ((v - domainMin) / span) * CHART_HEIGHT;
  const zeroY = y(0);

  const glowFor = (c: string) => `drop-shadow(0 0 10px ${c}) drop-shadow(0 6px 14px rgba(0,0,0,0.45))`;

  return (
    <AbsoluteFill style={{background: '#0b1220', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#e2e8f0'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(1200px 700px at 30% -10%, #16233d 0%, #0b1220 60%, #070b14 100%)'}} />
      <div style={{
        position: 'absolute', left: 64, top: 112, width: 1152, height: 464, borderRadius: 24,
        background: 'rgba(17,28,48,0.6)', border: '1px solid rgba(96,165,250,0.16)',
        boxShadow: '0 30px 78px rgba(0,0,0,0.5)', opacity: cl(frame, [0, 18], [0, 1]),
      }} />
      <div style={{position: 'absolute', top: 0, left: 0, width: cl(frame, [0, 28], [0, 1280]), height: 3, background: 'linear-gradient(90deg, #34d399, #60a5fa, transparent)'}} />

      <EditableTransform id="dwb-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{
          position: 'absolute', left: 96, top: 76, fontSize: 34, fontWeight: 860, color: '#f1f5f9',
          opacity: cl(frame, [0, 18], [0, 1]),
        }}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="dwb-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const gy = CHART_TOP + pct * CHART_HEIGHT;
            return <line key={pct} x1={CHART_LEFT} x2={CHART_LEFT + CHART_WIDTH} y1={gy} y2={gy} stroke="rgba(148,163,184,0.14)" strokeWidth={1} />;
          })}
          <line x1={CHART_LEFT} x2={CHART_LEFT + CHART_WIDTH} y1={zeroY} y2={zeroY} stroke="rgba(148,163,184,0.4)" strokeWidth={1.5} />

          {steps.map((step, i) => {
            const p = cl(frame, [12 + i * 5, 38 + i * 5], [0, 1]);
            const isActive = runtimeContractMatches(animation, step.label);
            const cx = CHART_LEFT + i * slot + slot / 2;
            const x = cx - barW / 2;
            const fullTop = y(Math.max(step.segStart, step.segEnd));
            const fullBot = y(Math.min(step.segStart, step.segEnd));
            const fullH = Math.max(2, fullBot - fullTop);
            const h = fullH * p;
            const by = fullBot - h;
            const color = step.total ? TOTAL : step.rising ? RISE : FALL;
            const valueLabel = step.displayValue || formatCompact(step.value, step.label);
            const next = steps[i + 1];
            const connY = y(step.segEnd);
            return (
              <g key={`${step.label}-${i}`} opacity={runtimeContractOpacity(animation, isActive)}>
                {next ? (
                  <line x1={x + barW} x2={CHART_LEFT + (i + 1) * slot + slot / 2 - barW / 2} y1={connY} y2={connY}
                    stroke="rgba(148,163,184,0.45)" strokeWidth={1.4} strokeDasharray="4 4" opacity={p} />
                ) : null}
                <rect x={x} y={by} width={barW} height={h} rx={8}
                  fill={color} opacity={isActive ? 1 : 0.92}
                  stroke={isActive ? animation.accent : 'transparent'} strokeWidth={isActive ? animation.strokeWidth : 0}
                  filter={isActive ? animation.glow : glowFor(color)} />
                <text data-dm-text-editable x={cx} y={fullTop - 10} textAnchor="middle"
                  fontSize={15} fontWeight={isActive ? 940 : 820} fill={color} opacity={p}>
                  {(!step.total && step.rising ? '+' : '') + valueLabel}
                </text>
                <text data-dm-text-editable x={cx} y={CHART_TOP + CHART_HEIGHT + 24} textAnchor="middle"
                  fontSize={13} fontWeight={isActive ? 880 : 640} fill={isActive ? '#f1f5f9' : '#94a3b8'}>
                  {truncate(step.label, 12)}
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
