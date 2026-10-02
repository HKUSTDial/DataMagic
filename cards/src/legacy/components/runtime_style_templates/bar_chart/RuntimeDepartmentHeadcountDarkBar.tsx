import {RuntimeEntityLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const DepartmentHeadcountDarkBarDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const accent = firstString(animation.accent, '#38bdf8');
  const runtimeRows = runtimePoints(sceneContent, scene)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 5);
  const staticAccents = ['#b9ff66', '#55e6c1', '#ffffff', '#c8b6ff', '#ff7a90'];
  const rows = runtimeRows.map((row, index) => ({...row, color: row.color || staticAccents[index % staticAccents.length]}));
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const total = rows.reduce((sum, row) => sum + Math.abs(row.value), 0);

  return (
    <AbsoluteFill style={{background: '#0f0f13', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#f5f7fb', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 14% 12%, rgba(185,255,102,0.14), transparent 26%), radial-gradient(circle at 86% 18%, rgba(200,182,255,0.18), transparent 28%), linear-gradient(135deg, #0f0f13 0%, #17151e 54%, #101216 100%)'}} />
      <div style={{
        position: 'absolute',
        left: 64,
        top: 66,
        width: 1152,
        padding: '44px 46px 36px',
        borderRadius: 26,
        border: '1px solid rgba(255,255,255,0.075)',
        background: 'rgba(255,255,255,0.026)',
        boxShadow: '0 28px 74px rgba(0,0,0,0.26)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: ease(frame, [0, 18], [0, 1]),
      }}>
        <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: 28}}>
          <EditableTransform id="dhdb-title" role="title" style={{display: 'block', flex: 1, minWidth: 0}}>
            <div data-dm-text-editable style={{fontSize: 44, lineHeight: 1.05, fontWeight: 840, letterSpacing: 0, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {truncate(title, 42)}
            </div>
          </EditableTransform>

          <EditableTransform id="dhdb-total" role="metric" style={{display: 'block', flexShrink: 0, marginLeft: 16}}>
            <div style={{
              width: 156,
              height: 82,
              borderRadius: 22,
              background: 'rgba(255,255,255,0.075)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: ease(frame, [30, 52], [0, 1]),
            }}>
              <div data-dm-text-editable style={{fontSize: 10, lineHeight: 1, fontWeight: 820, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.46)', marginBottom: 7}}>
                Total team
              </div>
              <div data-dm-text-editable style={{fontSize: 31, lineHeight: 1, fontWeight: 860, letterSpacing: 0, color: rows[0]?.color || '#b9ff66'}}>
                {formatCompact(Math.round(total * ease(frame, [34, 58], [0, 1])), title)}
              </div>
            </div>
          </EditableTransform>
        </div>

        <EditableTransform id="dhdb-chart" role="chart" style={{display: 'block'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
            {rows.map((row, i) => {
              const p = ease(frame, [14 + i * 6, 46 + i * 6], [0, 1]);
              const isActive = runtimeContractMatches(animation, row.label, row.series);
              const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
              const widthPct = (Math.abs(row.value) / maxValue) * 100 * p;
              const valueLabel = row.displayValue || formatCompact(row.value, row.label);
              const fill = isActive ? accent : i === 0 ? row.color : 'rgba(255,255,255,0.9)';
              return (
                <div
                  key={`${row.label}-${i}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '190px 1fr 86px',
                    alignItems: 'center',
                    columnGap: 22,
                    opacity: ease(frame, [8 + i * 5, 30 + i * 5], [0, 1]) * runtimeContractOpacity(animation, isActive),
                    padding: isActive ? '8px 10px' : '0 10px',
                    margin: isActive ? '-8px -10px' : '0 -10px',
                    borderRadius: 14,
                    background: isActive ? `rgba(56,189,248,${0.08 + focus * 0.08})` : 'transparent',
                    outline: isActive ? `1px solid rgba(56,189,248,${0.24 + focus * 0.16})` : 'none',
                  }}
                >
                  <div data-dm-text-editable style={{fontSize: 19, lineHeight: 1, fontWeight: isActive ? 840 : 760, letterSpacing: 0, color: isActive ? '#f8fafc' : 'rgba(255,255,255,0.88)'}}>
                    <RuntimeEntityLabel sceneContent={sceneContent} label={row.label}>{truncate(row.label, 18)}</RuntimeEntityLabel>
                  </div>
                  <div style={{position: 'relative', height: 22, borderRadius: 999, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
                    <div style={{width: `${widthPct}%`, height: '100%', borderRadius: 999, background: fill, boxShadow: i === 0 || isActive ? `0 0 28px ${fill}55` : 'none', filter: isActive ? animation.glow : undefined}} />
                    <div style={{position: 'absolute', left: `${Math.min(96, widthPct)}%`, top: 0, width: 3, height: '100%', background: row.color, opacity: p}} />
                  </div>
                  <div data-dm-text-editable style={{textAlign: 'right', fontSize: 23, lineHeight: 1, fontWeight: isActive ? 900 : 820, color: isActive ? accent : row.color, letterSpacing: 0}}>
                    {p < 1 && !row.displayValue ? Math.round(Math.abs(row.value) * p) : valueLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </EditableTransform>
      </div>
    </AbsoluteFill>
  );
};
