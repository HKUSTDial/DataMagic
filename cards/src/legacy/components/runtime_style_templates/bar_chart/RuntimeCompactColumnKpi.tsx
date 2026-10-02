import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const CompactColumnKpiDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const chart = {left: 264, top: 228, width: 760, height: 214};
  const palette = paletteFor(sceneContent, true);
  const runtimeRows = runtimePoints(sceneContent, scene).slice(0, 6);
  const rows = runtimeRows.map((row, index) => ({...row, color: row.color || palette[index % palette.length]}));
  const max = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const leader = rows.reduce((best, row) => Math.abs(row.value) > Math.abs(best.value) ? row : best, rows[0]);
  const title = slotTitle(sceneContent);
  if (!rows.length || !leader || !title) return null;

  return (
    <AbsoluteFill style={{background: '#111827', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#f8fafc', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 16%, rgba(244,114,182,0.18), transparent 26%), linear-gradient(135deg, #111827 0%, #172033 58%, #020617 100%)'}} />
      <EditableTransform id="compact-column-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 112, top: 78, width: 760, fontSize: 50, lineHeight: 1, fontWeight: 890, letterSpacing: '-0.05em', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="compact-column-kpi" role="metric" style={{display: 'block'}}>
        <div style={{position: 'absolute', right: 112, top: 82, width: 220, height: 96, borderRadius: 24, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: '18px 22px', boxSizing: 'border-box', opacity: ease(frame, [22, 46], [0, 1])}}>
          <div data-dm-text-editable style={{fontSize: 12, fontWeight: 860, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.52)'}}>{uiLabel(sceneContent, 'peak', 'Peak')}</div>
          <div data-dm-text-editable style={{marginTop: 8, fontSize: 30, lineHeight: 1, fontWeight: 920, color: leader.color || '#f472b6', letterSpacing: '-0.045em'}}>
            {truncate(leader.label, 10)}
          </div>
        </div>
      </EditableTransform>
      <EditableTransform id="compact-column-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect x={180} y={196} width={920} height={324} rx={30} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = chart.top + chart.height - tick * chart.height;
            return <line key={tick} x1={chart.left} x2={chart.left + chart.width} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />;
          })}
          {rows.map((item, index) => {
            const p = ease(frame, [18 + index * 7, 52 + index * 7], [0, 1]);
            const isActive = runtimeContractMatches(animation, item.label, item.series);
            const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
            const barWidth = rows.length > 5 ? 66 : 86;
            const step = chart.width / rows.length;
            const x = chart.left + index * step + step / 2 - barWidth / 2;
            const h = (Math.abs(item.value) / max) * chart.height * p;
            return (
              <g key={`${item.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive)}>
                {isActive ? (
                  <rect
                    x={x - 16}
                    y={chart.top - 18}
                    width={barWidth + 32}
                    height={chart.height + 74}
                    rx={22}
                    fill={`rgba(244,114,182,${0.10 + focus * 0.08})`}
                    stroke="rgba(244,114,182,0.46)"
                    strokeWidth={1}
                  />
                ) : null}
                <rect className="bar" x={x} y={chart.top + chart.height - h} width={barWidth} height={h} rx={16} fill={item.color} stroke={isActive ? 'rgba(255,255,255,0.78)' : 'transparent'} strokeWidth={isActive ? animation.strokeWidth : 0} filter={isActive ? animation.glow : `drop-shadow(0 16px 26px ${item.color}33)`} />
                <text data-dm-text-editable x={x + barWidth / 2} y={chart.top + chart.height + 34} textAnchor="middle" fontSize={14} fontWeight={isActive ? 940 : 850} fill={isActive ? '#fdf2f8' : 'rgba(248,250,252,0.72)'}>
                  {truncate(item.label, 9)}
                </text>
                <text data-dm-text-editable x={x + barWidth / 2} y={chart.top + chart.height - h - 12} textAnchor="middle" fontSize={13} fontWeight={isActive ? 940 : 850} fill={isActive ? '#f9a8d4' : item.color} opacity={p}>
                  {item.displayValue || formatCompact(item.value, item.label)}
                </text>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
