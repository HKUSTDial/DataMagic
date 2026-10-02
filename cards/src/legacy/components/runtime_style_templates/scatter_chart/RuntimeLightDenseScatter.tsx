import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeScatterPoints, slotTitle, truncate, valueExtent, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const chart = {left: 140, top: 100, width: 980, height: 480};

export const LightDenseScatterDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('scatter', scene, rawFrame, fps ?? 30);
  const palette = paletteFor(sceneContent, false);
  const runtimeRows = runtimeScatterPoints(sceneContent).slice(0, 30);
  const points = runtimeRows.map((point, index) => ({...point, color: point.color || palette[index % palette.length]}));
  const xExt = valueExtent(points.map((point) => point.x));
  const yExt = valueExtent(points.map((point) => point.y));
  const xFor = (value: number) => chart.left + ((value - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
  const yFor = (value: number) => chart.top + chart.height - ((value - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
  const title = slotTitle(sceneContent);
  const xLabel = sceneContent?.data_binding?.x_axis?.label || sceneContent?.data_binding?.x?.label || sceneContent?.mapping?.x || '';
  const yLabel = sceneContent?.data_binding?.y_axis?.label || sceneContent?.data_binding?.y?.label || sceneContent?.mapping?.y || '';
  if (!points.length || !title) return null;

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 45%, #f8fafc 100%)'}} />
      <EditableTransform id="lds-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 72, top: 44, width: 780, fontSize: 36, fontWeight: 860, letterSpacing: '-0.03em', color: '#0f172a', opacity: cl(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="lds-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const xValue = xExt.min + tick * (xExt.max - xExt.min);
            const yValue = yExt.min + tick * (yExt.max - yExt.min);
            return (
              <g key={tick}>
                <line x1={chart.left} x2={chart.left + chart.width} y1={yFor(yValue)} y2={yFor(yValue)} stroke="#e2e8f0" strokeWidth={1} />
                <line x1={xFor(xValue)} x2={xFor(xValue)} y1={chart.top} y2={chart.top + chart.height} stroke="#e2e8f0" strokeWidth={1} />
                <text x={chart.left - 10} y={yFor(yValue) + 4} textAnchor="end" fontSize={11} fill="#94a3b8">{Math.round(yValue)}</text>
                <text x={xFor(xValue)} y={chart.top + chart.height + 20} textAnchor="middle" fontSize={11} fill="#94a3b8">{Math.round(xValue)}</text>
              </g>
            );
          })}
          {xLabel ? <text data-dm-text-editable x={chart.left + chart.width / 2} y={chart.top + chart.height + 44} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">{truncate(xLabel, 28)}</text> : null}
          {yLabel ? <text data-dm-text-editable x={chart.left - 64} y={chart.top + chart.height / 2} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b" transform={`rotate(-90, ${chart.left - 64}, ${chart.top + chart.height / 2})`}>{truncate(yLabel, 28)}</text> : null}
          {points.map((point, index) => {
            const p = spring({frame: frame - 10 - index * 3, fps: fps ?? 30, config: {damping: 200, stiffness: 120}, durationInFrames: 20});
            const isActive = runtimeContractMatches(animation, point.label);
            const fill = isActive ? animation.accent : point.color;
            const cx = xFor(point.x);
            const cy = yFor(point.y);
            return (
              <g key={`${point.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive, p)}>
                <circle className="bubble" cx={cx} cy={cy} r={isActive ? 24 : 16} fill={fill} opacity={isActive ? 0.2 : 0.12} />
                <circle className="dot" cx={cx} cy={cy} r={isActive ? 10 : 7} fill={fill} opacity={isActive ? 1 : 0.9} stroke={isActive ? '#ffffff' : undefined} strokeWidth={isActive ? 2 : 0} filter={isActive ? animation.glow : undefined} />
                <RuntimeEntitySvgLabel data-dm-text-editable x={cx + 12} y={cy - 8} fontSize={11} fontWeight={isActive ? 900 : 700} fill={fill} sceneContent={sceneContent} label={point.label}>{truncate(point.label, 8)}</RuntimeEntitySvgLabel>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
