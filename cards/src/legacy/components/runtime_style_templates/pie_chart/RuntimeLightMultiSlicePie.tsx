import {RuntimeEntityLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimePoints, slotTitle, trimNumber, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const arc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number, inner: number) => {
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

export const LightMultiSlicePieDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('pie', scene, rawFrame, 30);
  const emphasis = runtimeContractEase(animation);
  const palette = paletteFor(sceneContent, false);
  const runtimeRows = runtimePoints(sceneContent, scene).filter((row) => row.value > 0).slice(0, 12);
  const slices = runtimeRows.map((row, index) => ({label: row.label, value: row.value, color: firstString(row.color, palette[index % palette.length])}));
  const total = slices.reduce((sum, row) => sum + row.value, 0) || 1;
  const max = Math.max(1, ...slices.map((row) => row.value));
  const title = slotTitle(sceneContent);
  if (!slices.length || !title) return null;
  const center = {x: 480, y: 360, radius: 220, inner: 100};
  let cumulative = 0;

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #eff6ff 50%, #f8fafc 100%)'}} />
      <EditableTransform id="lmsp-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 72, top: 52, width: 640, fontSize: 38, fontWeight: 860, letterSpacing: '-0.03em', color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="lmsp-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {slices.map((slice, index) => {
            const angle = (slice.value / total) * 360;
            const start = cumulative;
            const end = cumulative + angle * cl(frame, [12 + index * 3, 38 + index * 3], [0, 1]);
            cumulative += angle;
            const isActive = runtimeContractMatches(animation, slice.label);
            return (
              <g key={`${slice.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive, 1)}>
                {isActive ? (
                  <path d={arc(center.x, center.y, center.radius + 6, start, end, center.inner - 4)} fill={animation.accent} opacity={0.18 + emphasis * 0.12} />
                ) : null}
                <path
                  className="arc"
                  d={arc(center.x, center.y, center.radius + (isActive ? 4 : 0), start, end, center.inner - (isActive ? 4 : 0))}
                  fill={isActive ? animation.accent : slice.color}
                  opacity={isActive ? 1 : 0.88}
                  stroke={isActive ? '#ffffff' : undefined}
                  strokeWidth={isActive ? 4 : 0}
                  filter={isActive ? animation.glow : undefined}
                />
              </g>
            );
          })}
          <text x={center.x} y={center.y - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill="#94a3b8" opacity={cl(frame, [30, 48], [0, 1])}>{uiLabel(sceneContent, 'total', 'TOTAL')}</text>
          <text data-dm-text-editable x={center.x} y={center.y + 18} textAnchor="middle" fontSize={32} fontWeight={900} fill="#0f172a" opacity={cl(frame, [30, 48], [0, 1])}>
            {trimNumber(total, total >= 100 ? 0 : 1)}
          </text>
        </svg>
      </EditableTransform>
      <div style={{position: 'absolute', left: 760, top: 150, width: 440, opacity: cl(frame, [32, 52], [0, 1])}}>
        {slices.map((slice, index) => {
          const share = (slice.value / total) * 100;
          const isActive = runtimeContractMatches(animation, slice.label);
          return (
            <div key={`${slice.label}-legend`} style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: slices.length > 8 ? 8 : 12, padding: '8px 10px', borderRadius: 12, background: isActive ? 'rgba(219,234,254,0.95)' : 'transparent', border: isActive ? '1px solid rgba(37,99,235,0.34)' : '1px solid transparent', opacity: cl(frame, [28 + index * 3, 48 + index * 3], [0, 1]) * runtimeContractOpacity(animation, isActive, 1)}}>
              <div style={{width: isActive ? 20 : 14, height: 14, borderRadius: 4, background: isActive ? animation.accent : slice.color, flexShrink: 0, boxShadow: isActive ? `0 0 18px ${animation.accent}66` : 'none'}} />
              <div data-dm-text-editable style={{flex: 1, fontSize: slices.length > 8 ? 13 : 15, fontWeight: isActive ? 850 : 650, color: isActive ? '#0f172a' : '#334155'}}><RuntimeEntityLabel sceneContent={sceneContent} label={slice.label}>{truncate(slice.label, 20)}</RuntimeEntityLabel></div>
              <div data-dm-text-editable style={{fontSize: 15, fontWeight: 900, color: isActive ? animation.accent : '#0f172a'}}>{trimNumber(share, 1)}%</div>
              <div style={{width: 80, height: 6, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden'}}>
                <div className="bar" style={{width: `${(slice.value / max) * 100}%`, height: '100%', background: isActive ? animation.accent : slice.color, borderRadius: 3}} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
