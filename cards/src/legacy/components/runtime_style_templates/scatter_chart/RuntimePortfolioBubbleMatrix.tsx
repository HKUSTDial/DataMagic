import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeScatterPoints, slotTitle, truncate, valueExtent, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const chart = {left: 238, top: 178, width: 760, height: 360};

export const PortfolioBubbleMatrixDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('scatter', scene, rawFrame, 30);
  const accent = firstString(animation.accent, '#6366f1');
  const palette = paletteFor(sceneContent, false);
  const runtimeRows = runtimeScatterPoints(sceneContent).slice(0, 16);
  const points = runtimeRows.map((point, index) => ({...point, size: point.size ?? 18, color: point.color || palette[index % palette.length]}));
  const xExt = valueExtent(points.map((point) => point.x));
  const yExt = valueExtent(points.map((point) => point.y));
  const sizeMax = Math.max(1, ...points.map((point) => Math.abs(point.size)));
  const sizeMin = Math.min(...points.map((point) => Math.abs(point.size)), sizeMax);
  const px = (value: number) => chart.left + ((value - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
  const py = (value: number) => chart.top + chart.height - ((value - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
  const radiusOf = (size: number) => 10 + ((Math.abs(size) - sizeMin) / Math.max(1, sizeMax - sizeMin)) * 24;
  const title = slotTitle(sceneContent);
  const xLabel = sceneContent?.data_binding?.x_axis?.label || sceneContent?.mapping?.x || '';
  const yLabel = sceneContent?.data_binding?.y_axis?.label || sceneContent?.mapping?.y || '';
  if (!points.length || !title) return null;

  const midX = chart.left + chart.width / 2;
  const midY = chart.top + chart.height / 2;

  return (
    <AbsoluteFill style={{background: '#fffdf7', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#172033'}}>

      <EditableTransform id="pbm-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 78, fontSize: 48, fontWeight: 860, letterSpacing: 0, color: '#172033', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>

      <EditableTransform id="pbm-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect x={172} y={142} width={936} height={438} rx={26} fill="#ffffff" filter="drop-shadow(0 30px 80px rgba(15,23,42,0.14))" />
          <line x1={midX} x2={midX} y1={chart.top} y2={chart.top + chart.height} stroke="#d9e2ec" strokeWidth={1.4} strokeDasharray="8 10" />
          <line x1={chart.left} x2={chart.left + chart.width} y1={midY} y2={midY} stroke="#d9e2ec" strokeWidth={1.4} strokeDasharray="8 10" />
          <rect x={chart.left} y={chart.top} width={chart.width} height={chart.height} rx={18} fill="none" stroke="#e5e7eb" strokeWidth={2} />

          {points.map((point, index) => {
            const progress = ease(frame, [16 + index * 5, 44 + index * 5], [0, 1]);
            const isActive = runtimeContractMatches(animation, point.label);
            const focus = animation.active && isActive ? Math.sin(Math.max(0, Math.min(1, animation.progress)) * Math.PI) : 0;
            const radius = radiusOf(point.size) * (isActive ? 1.14 : 1);
            const cx = px(point.x);
            const cy = py(point.y);
            const fill = isActive ? accent : point.color;
            const showLabel = isActive || radius > 20;
            return (
              <g key={`${point.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive, progress)}>
                <circle cx={cx} cy={cy} r={(radius + focus * 8) * progress} fill={fill} opacity={isActive ? 0.24 : 0.18} />
                <circle cx={cx} cy={cy} r={Math.max(10, radius * 0.34) * progress} fill={fill} filter={isActive ? animation.glow : undefined} />
                {showLabel ? (
                  <RuntimeEntitySvgLabel data-dm-text-editable x={cx} y={cy + radius + 24} textAnchor="middle" fontSize={15} fontWeight={840} fill="#334155" opacity={progress} sceneContent={sceneContent} label={point.label}>{truncate(point.label, 12)}</RuntimeEntitySvgLabel>
                ) : null}
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
