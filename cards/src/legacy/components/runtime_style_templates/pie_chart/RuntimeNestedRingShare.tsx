import {RuntimeEntityLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, trimNumber, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const ringArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number, width: number) => {
  const inner = r - width;
  const toRad = (angle: number) => (angle - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const ix1 = cx + inner * Math.cos(toRad(endAngle));
  const iy1 = cy + inner * Math.sin(toRad(endAngle));
  const ix2 = cx + inner * Math.cos(toRad(startAngle));
  const iy2 = cy + inner * Math.sin(toRad(startAngle));
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} L${ix1},${iy1} A${inner},${inner},0,${large},0,${ix2},${iy2} Z`;
};

export const NestedRingShareDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('pie', scene, rawFrame, 30);
  const emphasis = runtimeContractEase(animation);
  const palette = paletteFor(sceneContent, false);
  const runtimeRows = runtimePoints(sceneContent, scene).filter((row) => row.value > 0).slice(0, 6);
  const rows = runtimeRows.map((row, index) => ({label: row.label, value: row.value, displayValue: row.displayValue, color: firstString(row.color, palette[index % palette.length])}));
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  const center = {x: 432, y: 388};
  const outerR = 248;
  const ringGap = 6;
  const ringW = Math.min(40, (outerR - 70) / rows.length - ringGap);

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #eef2ff 50%, #f8fafc 100%)'}} />
      <EditableTransform id="nrs-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 72, top: 52, width: 700, fontSize: 38, fontWeight: 860, letterSpacing: '-0.03em', color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="nrs-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {rows.map((row, index) => {
            const r = outerR - index * (ringW + ringGap);
            const share = row.value / total;
            const progress = cl(frame, [14 + index * 5, 44 + index * 5], [0, 1]);
            const end = share * 360 * progress;
            const isActive = runtimeContractMatches(animation, row.label);
            const activeLift = 0;
            const activeWidth = ringW + (isActive ? 8 + emphasis * 3 : 0);
            return (
              <g key={`${row.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive, 1)}>
                <path d={ringArc(center.x, center.y, r, 0, 359.9, ringW)} fill="#e8edf5" />
                {isActive ? (
                  <>
                    <path
                      d={ringArc(center.x, center.y, r + 3, 0, Math.max(0.1, end), activeWidth + 8)}
                      fill={animation.accent}
                      opacity={0.24 + emphasis * 0.18}
                    />
                    <path
                      d={ringArc(center.x, center.y, r, 0, Math.max(0.1, end), activeWidth + 3)}
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth={3}
                      opacity={0.62}
                    />
                  </>
                ) : null}
                <path
                  d={ringArc(center.x, center.y, r + activeLift, 0, Math.max(0.1, end), activeWidth)}
                  fill={isActive ? animation.accent : row.color}
                  opacity={isActive ? 1 : 0.92}
                  filter={isActive ? animation.glow : undefined}
                  stroke={isActive ? '#ffffff' : undefined}
                  strokeWidth={isActive ? 3 : 0}
                />
              </g>
            );
          })}
          <text x={center.x} y={center.y - 8} textAnchor="middle" fontSize={13} fontWeight={760} fill="#94a3b8" opacity={cl(frame, [28, 46], [0, 1])}>{uiLabel(sceneContent, 'share', 'SHARE')}</text>
          <text x={center.x} y={center.y + 22} textAnchor="middle" fontSize={30} fontWeight={900} fill="#0f172a" opacity={cl(frame, [28, 46], [0, 1])}>
            {rows.length}
          </text>
        </svg>
      </EditableTransform>
      <div style={{position: 'absolute', left: 744, top: 168, width: 452, opacity: cl(frame, [30, 50], [0, 1])}}>
        {rows.map((row, index) => {
          const share = (row.value / total) * 100;
          const isActive = runtimeContractMatches(animation, row.label);
          return (
            <div
              key={`${row.label}-legend`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 14,
                padding: '10px 12px',
                borderRadius: 14,
                background: isActive ? 'rgba(219,234,254,0.94)' : 'transparent',
                border: isActive ? '1px solid rgba(37,99,235,0.42)' : '1px solid transparent',
                boxShadow: isActive ? '0 18px 36px rgba(37,99,235,0.16)' : 'none',
                opacity: cl(frame, [26 + index * 4, 46 + index * 4], [0, 1]) * runtimeContractOpacity(animation, isActive, 1),
              }}
            >
              <div style={{width: isActive ? 22 : 16, height: 16, borderRadius: 5, background: isActive ? animation.accent : row.color, flexShrink: 0, boxShadow: isActive ? `0 0 18px ${animation.accent}66` : 'none'}} />
              <div data-dm-text-editable style={{flex: 1, fontSize: 17, fontWeight: isActive ? 820 : 680, color: isActive ? '#0f172a' : '#334155'}}><RuntimeEntityLabel sceneContent={sceneContent} label={row.label}>{truncate(row.label, 22)}</RuntimeEntityLabel></div>
              <div data-dm-text-editable style={{fontSize: 17, fontWeight: 900, color: isActive ? animation.accent : '#0f172a'}}>{row.displayValue || `${trimNumber(share, 1)}%`}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
