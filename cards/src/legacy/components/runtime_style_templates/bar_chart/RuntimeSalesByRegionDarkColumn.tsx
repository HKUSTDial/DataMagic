import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, i: [number, number], o: [number, number]) =>
  interpolate(frame, i, o, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const SalesByRegionDarkColumnDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const rows = runtimePoints(sceneContent, scene).slice(0, 5);
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const plot = {left: 180, right: 1100, top: 252, bottom: 456};
  const plotW = plot.right - plot.left;
  const plotH = plot.bottom - plot.top;
  const slot = plotW / rows.length;
  const barW = Math.min(120, slot * 0.56);

  return (
    <AbsoluteFill style={{background: '#101114', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 22%, rgba(255,116,97,0.16), transparent 27%), radial-gradient(circle at 84% 16%, rgba(77,210,255,0.13), transparent 26%), linear-gradient(135deg, #101114 0%, #1a171f 58%, #101114 100%)'}} />

      <EditableTransform id="sbr-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 64, width: 760, fontSize: 46, lineHeight: 1.04, fontWeight: 860, letterSpacing: 0, color: '#ffffff', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="sbr-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {rows.map((row, index) => {
            const center = plot.left + slot * index + slot / 2;
            const blockProgress = cl(frame, [8 + index * 4, 34 + index * 4], [0, 1]);
            return <rect key={`block-${row.label}`} x={center - slot / 2 + 13} y={plot.top - 36} width={slot - 26} height={plotH + 82} rx={18} fill={index === 2 ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.045)'} opacity={blockProgress} />;
          })}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = plot.bottom - tick * plotH;
            return <line key={tick} x1={plot.left} x2={plot.right} y1={y} y2={y} stroke={tick === 0 ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.08)'} strokeWidth={tick === 0 ? 2 : 1} />;
          })}
          {rows.map((row, index) => {
            const p = cl(frame, [10 + index * 4, 36 + index * 4], [0, 1]);
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const cx = plot.left + slot * index + slot / 2;
            const h = (Math.abs(row.value) / maxValue) * plotH * p;
            const y = plot.bottom - h;
            return (
              <g key={`${row.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive)}>
                <rect x={cx - barW / 2} y={y} width={barW} height={h} rx={14} fill="#ffffff" opacity={isActive ? 1 : 0.82} filter={isActive ? animation.glow : index === 2 ? 'drop-shadow(0 16px 30px rgba(255,255,255,0.2))' : undefined} />
                {isActive ? <rect x={cx - barW / 2 - 3} y={y - 3} width={barW + 6} height={h + 6} rx={12} fill="none" stroke={animation.accent} strokeWidth={animation.strokeWidth} /> : null}
                <text data-dm-text-editable x={cx} y={y - 14} textAnchor="middle" fontSize={16} fontWeight={900} fill={isActive ? animation.accent : 'rgba(255,255,255,0.86)'} opacity={p}>
                  {row.displayValue || formatCompact(row.value, row.label)}
                </text>
                <text data-dm-text-editable x={cx} y={plot.bottom + 38} textAnchor="middle" fontSize={15} fontWeight={820} fill="rgba(255,255,255,0.66)" letterSpacing="0.08em">
                  {truncate(row.label, 12)}
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
