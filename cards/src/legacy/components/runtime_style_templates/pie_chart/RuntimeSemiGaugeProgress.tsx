import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, formatCompact, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, toNumber, trimNumber, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const arcPath = (cx: number, cy: number, r: number, fromPct: number, toPct: number) => {
  const angleFor = (pct: number) => Math.PI - (pct / 100) * Math.PI;
  const a1 = angleFor(fromPct);
  const a2 = angleFor(toPct);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy - r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy - r * Math.sin(a2);
  const largeArc = Math.abs(toPct - fromPct) > 50 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
};

export const SemiGaugeProgressDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('pie', scene, rawFrame, 30);
  const accent = firstString(sceneContent?.style?.accent, sceneContent?.style?.accent_color, '#22d3ee');
  const rows = runtimePoints(sceneContent, scene).filter((row) => row.value > 0).slice(0, 6);
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  const headline = rows.reduce((best, row) => (row.value > best.value ? row : best), rows[0]);
  const headlineActive = runtimeContractMatches(animation, headline.label, title);
  const emphasis = runtimeContractEase(animation);
  const headlineOpacity = runtimeContractOpacity(animation, headlineActive, 1);
  const rawScore = toNumber(headline.displayValue, headline.value);
  const score = Math.max(0, Math.min(100, rawScore > 100 ? (headline.value / rows.reduce((sum, row) => sum + row.value, 0)) * 100 : rawScore));
  const target = Math.max(55, Math.min(95, toNumber(sceneContent?.template_payload?.target, 80)));
  const prior = Math.max(0, Math.min(100, toNumber(sceneContent?.template_payload?.prior, Math.max(0, score - 8))));
  const animatedValue = score * cl(frame, [12, 64], [0, 1]);
  const delta = score - target;

  const cx = 640;
  const cy = 380;
  const r = 220;
  const needleAngle = Math.PI - (animatedValue / 100) * Math.PI;
  const needleX = cx + (r - 8) * Math.cos(needleAngle);
  const needleY = cy - (r - 8) * Math.sin(needleAngle);
  const bands = [
    {label: 'Below', start: 0, end: 40, color: '#f43f5e'},
    {label: 'On Track', start: 40, end: 70, color: '#f59e0b'},
    {label: 'Strong', start: 70, end: 100, color: accent},
  ];

  return (
    <AbsoluteFill style={{background: '#0b1220', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#f8fafc', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 70%, ${accent}2e, transparent 30%), linear-gradient(135deg, #0b1220 0%, #131b30 56%, #050912 100%)`}} />
      <EditableTransform id="sgp-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 70, width: 760, fontSize: 44, lineHeight: 1.06, fontWeight: 900, letterSpacing: 0, color: '#f8fafc', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="sgp-status-chip" role="metric" style={{display: 'block'}}>
        <div style={{position: 'absolute', right: 110, top: 78, height: 38, padding: '0 18px', borderRadius: 999, background: `${accent}29`, border: `1px solid ${accent}5c`, display: 'flex', alignItems: 'center', gap: 9, opacity: cl(frame, [22, 44], [0, 1])}}>
          <span style={{width: 8, height: 8, borderRadius: 999, background: accent, boxShadow: `0 0 12px ${accent}aa`}} />
          <span data-dm-text-editable style={{fontSize: 13, fontWeight: 820, letterSpacing: '0.06em', color: '#a5f3fc'}}>{uiLabel(sceneContent, 'strong', 'STRONG')}</span>
        </div>
      </EditableTransform>
      <EditableTransform id="sgp-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <path d={arcPath(cx, cy, r, 0, 100)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={42} strokeLinecap="round" opacity={headlineOpacity} />
          {headlineActive ? <path d={arcPath(cx, cy, r + 34 + emphasis * 8, Math.max(0, score - 7), Math.min(100, score + 7))} fill="none" stroke={animation.accent} strokeWidth={4} strokeLinecap="round" opacity={0.42 + emphasis * 0.28} style={{filter: animation.glow}} /> : null}
          {bands.map((band, index) => {
            const bandEnd = Math.min(band.end, animatedValue);
            const reveal = cl(frame, [10 + index * 6, 36 + index * 6], [0, 1]);
            if (bandEnd <= band.start) return null;
            return (
              <path
                key={band.label}
                d={arcPath(cx, cy, r, band.start, band.start + (bandEnd - band.start) * reveal)}
                fill="none"
                stroke={band.color}
                strokeWidth={42}
                strokeLinecap="round"
                opacity={headlineOpacity}
                style={{filter: headlineActive && band.start <= score && band.end >= score ? animation.glow : `drop-shadow(0 0 18px ${band.color}66)`}}
              />
            );
          })}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = Math.PI - (tick / 100) * Math.PI;
            const tickInner = r - 30;
            const tickOuter = r + 8;
            const x1 = cx + tickInner * Math.cos(angle);
            const y1 = cy - tickInner * Math.sin(angle);
            const x2 = cx + tickOuter * Math.cos(angle);
            const y2 = cy - tickOuter * Math.sin(angle);
            const labelX = cx + (r + 38) * Math.cos(angle);
            const labelY = cy - (r + 38) * Math.sin(angle);
            return (
              <g key={tick} opacity={cl(frame, [38, 56], [0, headlineOpacity])}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(248,250,252,0.32)" strokeWidth={2} strokeLinecap="round" />
                <text data-dm-text-editable x={labelX} y={labelY + 4} textAnchor="middle" fontSize={13} fontWeight={780} fill="rgba(248,250,252,0.5)">{tick}</text>
              </g>
            );
          })}
          {(() => {
            const angle = Math.PI - (target / 100) * Math.PI;
            const inner = r - 28;
            const outer = r + 28;
            const x1 = cx + inner * Math.cos(angle);
            const y1 = cy - inner * Math.sin(angle);
            const x2 = cx + outer * Math.cos(angle);
            const y2 = cy - outer * Math.sin(angle);
            return (
              <g opacity={cl(frame, [44, 62], [0, headlineOpacity])}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth={3} strokeDasharray="6 4" strokeLinecap="round" />
                <text data-dm-text-editable x={x2 + 14} y={y2 + 4} fontSize={12} fontWeight={820} fill="#fbbf24">{uiLabel(sceneContent, 'target', 'TARGET')} {trimNumber(target, 0)}</text>
              </g>
            );
          })()}
          <g opacity={cl(frame, [22, 40], [0, headlineOpacity])} style={{filter: headlineActive ? animation.glow : 'drop-shadow(0 0 12px rgba(248,250,252,0.4))'}}>
            <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={headlineActive ? animation.accent : '#f8fafc'} strokeWidth={headlineActive ? 5 : 4} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={headlineActive ? 14 : 11} fill="#0b1220" stroke={headlineActive ? animation.accent : '#f8fafc'} strokeWidth={3} />
          </g>
        </svg>
      </EditableTransform>
      <EditableTransform id="sgp-headline-value" role="metric" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: cx - 110, top: cy + 14, width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: cl(frame, [26, 46], [0, headlineOpacity]), transform: `scale(${headlineActive ? 1.04 + emphasis * 0.018 : 1})`}}>
          <div data-dm-text-editable style={{fontSize: 70, lineHeight: 1, fontWeight: 920, letterSpacing: 0, color: headlineActive ? animation.accent : accent, filter: headlineActive ? animation.glow : undefined}}>
            {trimNumber(animatedValue, 0)}
          </div>
          <div data-dm-text-editable style={{marginTop: 6, fontSize: 11, fontWeight: headlineActive ? 920 : 840, letterSpacing: '0.18em', color: headlineActive ? '#f8fafc' : 'rgba(248,250,252,0.5)', textTransform: 'uppercase'}}>
            {truncate(headline.label || 'Index Score', 20)}
          </div>
        </div>
      </EditableTransform>
      <EditableTransform id="sgp-stats-strip" role="group" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: 240, top: 470, width: 800, height: 50, display: 'flex', justifyContent: 'space-between', opacity: cl(frame, [44, 64], [0, 1])}}>
          {[
            {label: 'Last Period', value: trimNumber(prior, 0)},
            {label: 'Target', value: trimNumber(target, 0)},
            {label: uiLabel(sceneContent, 'delta_vs_target', 'Delta vs Target'), value: `${delta >= 0 ? '+' : ''}${trimNumber(delta, 0)}`},
          ].map((stat) => (
            <div key={stat.label} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
              <div data-dm-text-editable style={{fontSize: 10, fontWeight: 820, letterSpacing: '0.18em', color: 'rgba(248,250,252,0.46)', textTransform: 'uppercase'}}>{stat.label}</div>
              <div data-dm-text-editable style={{fontSize: 22, fontWeight: 880, color: '#f8fafc', letterSpacing: 0}}>{formatCompact(stat.value)}</div>
            </div>
          ))}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
