import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const clampFrame = (frame: number, input: [number, number], output: [number, number], easing = Easing.out(Easing.cubic)) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const LeaderboardCardGridDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('bar', scene, rawFrame, 30);
  const runtimeRows = runtimePoints(sceneContent, scene).sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 12);
  const rows = runtimeRows;
  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  const cols = rows.length > 8 ? 4 : 4;
  const cardW = 280;
  const cardH = rows.length > 8 ? 116 : 150;
  const gapX = 14;
  const gapY = 14;
  const accent = sceneContent?.style?.accent || sceneContent?.style?.accent_color || '#fbbf24';
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  return (
    <AbsoluteFill style={{background: '#0f1419', color: '#fff', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden'}}>
      <EditableTransform id="leaderboard-title" role="title" style={{display: 'block', opacity: clampFrame(frame, [0, 16], [0, 1])}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 80, top: 64, width: 900, fontSize: 38, fontWeight: 850, letterSpacing: '-0.02em'}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="leaderboard-chart" role="chart" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: 80, top: 150, width: cols * cardW + (cols - 1) * gapX, display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cardW}px)`, columnGap: gapX, rowGap: gapY}}>
          {rows.map((row, index) => {
            const isLeader = index === 0;
            const progress = clampFrame(frame, [16 + index * 4, 40 + index * 4], [0, 1]);
            const barW = (Math.abs(row.value) / maxValue) * (cardW - 56) * progress;
            const color = row.color || (isLeader ? accent : '#64748b');
            const isActive = runtimeContractMatches(animation, row.label, row.series);
            const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
            return (
              <div key={`${row.label}-${index}`} style={{width: cardW, height: cardH, background: isActive ? `rgba(251,191,36,${0.12 + focus * 0.08})` : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? 'rgba(251,191,36,0.76)' : isLeader ? accent : 'rgba(255,255,255,0.10)'}`, borderRadius: 14, padding: rows.length > 8 ? '14px 18px' : '18px 20px', position: 'relative', opacity: progress * runtimeContractOpacity(animation, isActive), boxSizing: 'border-box', boxShadow: isActive ? `0 18px 42px rgba(251,191,36,${0.14 + focus * 0.08})` : 'none'}}>
                <div style={{position: 'absolute', top: 16, right: 18, fontSize: 12, fontWeight: 800, color: isActive || isLeader ? accent : '#64748b', letterSpacing: '0.08em'}}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div data-dm-text-editable style={{fontSize: rows.length > 8 ? 14 : 16, fontWeight: isActive ? 900 : 760, color: isActive || isLeader ? accent : '#e5e7eb', marginBottom: 8, marginTop: 4}}>
                  {truncate(row.label, 20)}
                </div>
                <div data-dm-text-editable style={{fontSize: rows.length > 8 ? 24 : 32, fontWeight: isActive ? 960 : 900, color: '#fff', fontVariantNumeric: 'tabular-nums', marginBottom: rows.length > 8 ? 10 : 12, letterSpacing: '-0.02em'}}>
                  {row.displayValue || formatCompact(row.value, row.label)}
                </div>
                <div style={{height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden'}}>
                  <div className="bar" style={{width: barW, height: '100%', background: color, borderRadius: 3, boxShadow: isActive ? `0 0 14px ${color}88` : 'none'}} />
                </div>
              </div>
            );
          })}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
