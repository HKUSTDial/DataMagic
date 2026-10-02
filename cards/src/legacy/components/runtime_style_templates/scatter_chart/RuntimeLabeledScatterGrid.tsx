import {RuntimeEntitySvgLabel, placeScatterIdentityLabels} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeScatterPoints, slotTitle, truncate, valueExtent, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const chart = {left: 196, top: 168, width: 880, height: 360};

export const LabeledScatterGridDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('scatter', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, false);
  const runtimeRows = runtimeScatterPoints(sceneContent).slice(0, 14);
  const points = runtimeRows.map((point, index) => ({...point, color: point.color || palette[index % palette.length]}));
  const xExt = valueExtent(points.map((point) => point.x));
  const yExt = valueExtent(points.map((point) => point.y));
  const px = (value: number) => chart.left + ((value - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
  const py = (value: number) => chart.top + chart.height - ((value - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
  const title = slotTitle(sceneContent);
  const xLabel = sceneContent?.data_binding?.x_axis?.label || sceneContent?.data_binding?.x?.label || sceneContent?.mapping?.x || '';
  const yLabel = sceneContent?.data_binding?.y_axis?.label || sceneContent?.data_binding?.y?.label || sceneContent?.mapping?.y || '';
  if (!points.length || !title) return null;
  const labels=placeScatterIdentityLabels(points.map(p=>({label:p.label,x:px(p.x),y:py(p.y),radius:13})),14,13);

  return (
    <AbsoluteFill style={{background: '#f7f9fc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #ffffff 0%, #eef4ff 48%, #f7f9fc 100%)'}} />
      <div style={{position: 'absolute', left: 60, top: 52, width: 1160, height: 504, borderRadius: 28, background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(148,163,184,0.14)', boxShadow: '0 26px 76px rgba(15,23,42,0.09)', opacity: ease(frame, [0, 16], [0, 1])}} />
      <EditableTransform id="lsg-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 104, top: 90, width: 820, fontSize: 42, fontWeight: 880, letterSpacing: '-0.04em', color: '#0f172a', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="lsg-axes" role="annotation" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: chart.left + chart.width / 2 - 60, top: chart.top + chart.height + 56, fontSize: 13, fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: ease(frame, [12, 28], [0, 1])}}>
          {xLabel}
        </div>
        <div data-dm-text-editable style={{position: 'absolute', left: chart.left - 92, top: chart.top + chart.height / 2 - 20, fontSize: 13, fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', transform: 'rotate(-90deg)', transformOrigin: 'center center', opacity: ease(frame, [12, 28], [0, 1])}}>
          {yLabel}
        </div>
      </EditableTransform>
      <EditableTransform id="lsg-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const xValue = xExt.min + tick * (xExt.max - xExt.min);
            const yValue = yExt.min + tick * (yExt.max - yExt.min);
            return (
              <g key={tick}>
                <line x1={chart.left} x2={chart.left + chart.width} y1={py(yValue)} y2={py(yValue)} stroke={tick === 0 ? '#94a3b8' : '#e6ebf2'} strokeWidth={tick === 0 ? 2 : 1} strokeDasharray={tick === 0 ? undefined : '4 6'} />
                <line x1={px(xValue)} x2={px(xValue)} y1={chart.top} y2={chart.top + chart.height} stroke={tick === 0 ? '#94a3b8' : '#e6ebf2'} strokeWidth={tick === 0 ? 2 : 1} strokeDasharray={tick === 0 ? undefined : '4 6'} />
              </g>
            );
          })}
          {points.map((point, index) => {
            const progress = ease(frame, [16 + index * 5, 42 + index * 5], [0, 1]);
            const isActive = runtimeContractMatches(animation, point.label);
            const radius = (isActive ? 13 : 10) * progress;
            const cx = px(point.x);
            const cy = py(point.y);
            return (
              <g key={`${point.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive, progress)}>
                <circle cx={cx} cy={cy} r={radius + (isActive ? 12 : 8)} fill={point.color} opacity={0.14} />
                <circle cx={cx} cy={cy} r={radius} fill={point.color} stroke="#ffffff" strokeWidth={2} filter={isActive ? animation.glow : undefined} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={labels[index].x} y={labels[index].y} textAnchor={labels[index].anchor} fontSize={13} fontWeight={isActive ? 900 : 760} fill={isActive ? animation.accent : '#334155'} sceneContent={sceneContent} label={point.label}>{truncate(point.label, 14)}</RuntimeEntitySvgLabel>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
