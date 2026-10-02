import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const RISE = '#10b981';
const FALL = '#ef4444';
const TOTAL = '#2563eb';

export const RevenueWaterfallBridgeDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  paletteFor(sceneContent, false);
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

  const CARD_LEFT = 108;
  const CARD_TOP = 72;
  const CARD_WIDTH = 1064;
  const CARD_HEIGHT = 430;
  const CHART_LEFT = CARD_LEFT + 64 + 56;
  const CHART_WIDTH = 856;
  const CHART_TOP = CARD_TOP + 132 + 14;
  const CHART_HEIGHT = 200;
  const slot = CHART_WIDTH / steps.length;
  const barW = Math.min(94, slot * 0.6);
  const y = (v: number) => CHART_TOP + CHART_HEIGHT - ((v - domainMin) / span) * CHART_HEIGHT;
  const zeroY = y(0);
  const kpiLabel = formatCompact(grandTotal, title);
  const netPct = rows[0]?.value ? ((grandTotal - rows[0].value) / Math.abs(rows[0].value)) * 100 : 0;
  const netLabel = `${netPct >= 0 ? '+' : ''}${Math.round(netPct)}%`;

  return (
    <AbsoluteFill style={{background: '#eceaf6', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#172033', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 22% 18%, rgba(255,255,255,0.85), transparent 32%), radial-gradient(circle at 80% 78%, rgba(252,231,243,0.55), transparent 28%), linear-gradient(135deg, #eceaf6 0%, #f1ecf8 52%, #fbf2ed 100%)'}} />
      <div style={{
        position: 'absolute', left: CARD_LEFT, top: CARD_TOP, width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 22,
        background: 'rgba(255,255,255,0.97)',
        boxShadow: '0 30px 72px rgba(48,43,75,0.14), 0 1px 0 rgba(255,255,255,0.86) inset',
        opacity: cl(frame, [0, 18], [0, 1]),
      }} />
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(37,99,235,0.08), transparent 36%, rgba(236,72,153,0.06))'}} />

      <div style={{
        position: 'absolute',
        right: CARD_LEFT + 64,
        top: CARD_TOP + 52,
        textAlign: 'right',
        opacity: cl(frame, [18, 34], [0, 1]),
      }}>
        <div data-dm-text-editable style={{fontSize: 11, fontWeight: 850, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6}}>
          Net change
        </div>
        <div data-dm-text-editable style={{fontSize: 38, lineHeight: 1, fontWeight: 900, letterSpacing: 0, color: TOTAL}}>
          {netLabel}
        </div>
      </div>

      <EditableTransform id="rwb-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{
          position: 'absolute', left: CARD_LEFT + 64, top: CARD_TOP + 52, fontSize: 38, lineHeight: 1, fontWeight: 850, color: '#162032', maxWidth: 700,
          opacity: cl(frame, [0, 18], [0, 1]),
        }}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="rwb-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const gy = CHART_TOP + pct * CHART_HEIGHT;
            return <line key={pct} x1={CHART_LEFT} x2={CHART_LEFT + CHART_WIDTH} y1={gy} y2={gy} stroke={pct === 1 ? '#d9d5df' : '#ece9f0'} strokeWidth={1} />;
          })}
          <line x1={CHART_LEFT} x2={CHART_LEFT + CHART_WIDTH} y1={zeroY} y2={zeroY} stroke="#d9d5df" strokeWidth={1.5} />

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
                    stroke="#d9d5df" strokeWidth={1.4} strokeDasharray="4 4" opacity={p} />
                ) : null}
                <rect x={x} y={by} width={barW} height={h} rx={8}
                  fill={color} opacity={isActive ? 1 : 0.92}
                  stroke={isActive ? animation.accent : 'transparent'} strokeWidth={isActive ? animation.strokeWidth : 0}
                  filter={isActive ? animation.glow : undefined} />
                <text data-dm-text-editable x={cx} y={fullTop - 10} textAnchor="middle"
                  fontSize={15} fontWeight={isActive ? 940 : 820} fill={color} opacity={p}>
                  {(!step.total && step.rising ? '+' : '') + valueLabel}
                </text>
                <text data-dm-text-editable x={cx} y={CHART_TOP + CHART_HEIGHT + 30} textAnchor="middle"
                  fontSize={12} fontWeight={isActive ? 880 : 680} fill={isActive ? '#172033' : '#686274'}>
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
