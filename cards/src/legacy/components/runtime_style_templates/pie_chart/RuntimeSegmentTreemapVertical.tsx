import {RuntimeEntitySvgLabel, RuntimeEntityLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, trimNumber, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export const SegmentTreemapVerticalDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('tile', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, true);
  const rows = runtimePoints(sceneContent, scene).filter((row) => row.value > 0).slice(0, 10);
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  const items = rows
    .map((row, index) => ({label: row.label, value: row.value, displayValue: row.displayValue, color: firstString(row.color, palette[index % palette.length])}))
    .sort((a, b) => b.value - a.value);
  const total = items.reduce((sum, row) => sum + row.value, 0) || 1;

  const stack = {left: 200, top: 145, width: 880, height: 375};
  let cursorY = stack.top;

  return (
    <AbsoluteFill style={{background: '#0f1419', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <EditableTransform id="stv-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 80, top: 60, width: 1000, fontSize: 38, fontWeight: 850, letterSpacing: 0, whiteSpace: 'nowrap', color: '#f8fafc', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="stv-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {items.map((item, index) => {
            const share = item.value / total;
            const fullH = share * stack.height;
            const progress = cl(frame, [12 + index * 4, 40 + index * 4], [0, 1]);
            const y = cursorY;
            cursorY += fullH;
            // Two lines plus an identity icon need a genuinely tall segment.
            // Small segments use the adjacent legend so their values stay visible.
            const showInside = fullH >= 60;
            const fontSize = Math.min(22, Math.max(14, fullH * 0.32));
            const percentSize = Math.min(28, Math.max(16, fullH * 0.38));
            const isActive = runtimeContractMatches(animation, item.label);
            return (
              <g key={`${item.label}-${index}`} opacity={progress * runtimeContractOpacity(animation, isActive, 1)}>
                <rect x={stack.left} y={y} width={stack.width} height={fullH} rx={4} fill={isActive ? animation.accent : item.color} opacity={isActive ? 1 : 0.92} stroke={isActive ? '#ffffff' : undefined} strokeWidth={isActive ? 3 : 0} filter={isActive ? animation.glow : undefined} />
                {index > 0 ? <line x1={stack.left} x2={stack.left + stack.width} y1={y} y2={y} stroke="#0f1419" strokeWidth={2} /> : null}
                {showInside ? (
                  <>
                    <RuntimeEntitySvgLabel data-dm-text-editable x={stack.left + 24} y={y + fullH / 2 - 4} fontSize={fontSize} fontWeight={isActive ? 920 : 800} fill="#ffffff" style={{pointerEvents: 'none'}} sceneContent={sceneContent} label={item.label}>{truncate(item.label, 28)}</RuntimeEntitySvgLabel>
                    <text data-dm-text-editable x={stack.left + 24} y={y + fullH / 2 + 22} fontSize={percentSize} fontWeight={900} fill="#ffffff" style={{fontVariantNumeric: 'tabular-nums', pointerEvents: 'none'}}>
                      {trimNumber(share * 100, 1)}%
                    </text>
                  </>
                ) : (
                  <RuntimeEntitySvgLabel data-dm-text-editable x={stack.left + stack.width + 16} y={y + fullH / 2 + 5} fontSize={13} fontWeight={700} fill="#cbd5e1" style={{pointerEvents: 'none'}} sceneContent={sceneContent} label={item.label}>
                    {truncate(item.label, 18)} · <tspan style={{fontVariantNumeric: 'tabular-nums', fill: isActive ? animation.accent : item.color}}>{trimNumber(share * 100, 1)}%</tspan>
                  </RuntimeEntitySvgLabel>
                )}
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
