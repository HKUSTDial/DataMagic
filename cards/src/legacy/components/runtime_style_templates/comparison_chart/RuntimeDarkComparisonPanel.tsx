import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {comparisonRows, firstString, formatCompact, metricMax, metricNamesForRows, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const DarkComparisonPanelDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('comparison', scene, rawFrame, 30);
  const rows = comparisonRows(sceneContent, scene).slice(0, 5);
  const metrics = metricNamesForRows(rows).slice(0, 3);
  const colors = paletteFor(sceneContent, true);
  const title = slotTitle(sceneContent);
  if (!rows.length || !metrics.length || !title) return null;

  const TOP = 178;
  const CARD_GAP = 18;
  const CARD_W = (1184 - 96 - (rows.length - 1) * CARD_GAP) / rows.length;
  const LEFT = 96;

  return (
    <AbsoluteFill style={{background: '#0a0f1c', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#e2e8f0'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(900px 460px at 50% -12%, rgba(96,165,250,0.14), transparent 60%), linear-gradient(160deg, #0a0f1c 0%, #101a2e 60%, #0a0f1c 100%)'}} />
      <EditableTransform id="dcp-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 64, fontSize: 38, fontWeight: 860, letterSpacing: '-0.03em', color: '#f8fafc', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      {rows.map((entity, ri) => {
        const cardP = cl(frame, [10 + ri * 5, 34 + ri * 5], [0, 1]);
        const left = LEFT + ri * (CARD_W + CARD_GAP);
        const accent = colors[ri % colors.length];
        const rowActive = runtimeContractMatches(animation, entity.label);
        return (
          <div key={entity.label} style={{position: 'absolute', left, top: TOP, width: CARD_W, height: 400, borderRadius: 22, background: rowActive ? 'rgba(96,165,250,0.12)' : 'rgba(255,255,255,0.04)', border: rowActive ? `2px solid ${animation.accent}` : '1px solid rgba(148,163,184,0.16)', boxShadow: rowActive ? `0 22px 56px rgba(2,6,23,0.5), ${animation.glow}` : '0 22px 56px rgba(2,6,23,0.5)', opacity: cardP * runtimeContractOpacity(animation, rowActive, 1), transform: `translateY(${(1 - cardP) * 14}px)`, padding: '24px 22px', boxSizing: 'border-box'}}>
            <div style={{height: 6, width: rowActive ? 64 : 44, borderRadius: 3, background: rowActive ? animation.accent : accent, marginBottom: 16, boxShadow: `0 0 14px ${rowActive ? animation.accent : accent}`}} />
            <div data-dm-text-editable style={{fontSize: 21, fontWeight: rowActive ? 920 : 860, color: '#f8fafc', lineHeight: 1.15, minHeight: 50}}>
              {truncate(entity.label, 22)}
            </div>
            <div style={{marginTop: 16}}>
              {metrics.map((metricName, mi) => {
                const metric = entity.metrics.find((candidate) => candidate.name === metricName);
                const val = metric?.value ?? 0;
                const max = metricMax(rows, metricName);
                const color = firstString(metric?.color, colors[mi % colors.length]);
                const metricActive = rowActive || runtimeContractMatches(animation, metricName, `${entity.label} ${metricName}`);
                return (
                  <div key={metricName} style={{marginBottom: 18, opacity: cl(frame, [20 + mi * 4 + ri * 3, 40 + mi * 4 + ri * 3], [0, 1]) * runtimeContractOpacity(animation, metricActive, 1)}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                      <span data-dm-text-editable style={{fontSize: 12, fontWeight: 760, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8'}}>{truncate(metricName, 16)}</span>
                      <span data-dm-text-editable style={{fontSize: 19, fontWeight: 880, color: metricActive ? animation.accent : color}}>{metric?.displayValue || formatCompact(val, metricName)}</span>
                    </div>
                    <div style={{marginTop: 7, height: 7, borderRadius: 4, background: 'rgba(148,163,184,0.18)', overflow: 'hidden'}}>
                      <div style={{width: `${Math.min(100, Math.max(4, (Math.abs(val) / max) * 100))}%`, height: '100%', background: metricActive ? animation.accent : color, borderRadius: 4}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
