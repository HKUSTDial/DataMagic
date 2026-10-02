import {RuntimeEntitySvgLabel, placeScatterIdentityLabels} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeScatterPoints, slotTitle, truncate, valueExtent, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

const chart = {left: 200, top: 176, width: 860, height: 350};

export const MultiEntityScatterMatrixDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('scatter', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, true);
  const runtimeRows = runtimeScatterPoints(sceneContent).slice(0, 20);
  const points = runtimeRows.map((point, index) => ({...point, color: point.color || palette[index % palette.length]}));
  const xExt = valueExtent(points.map((point) => point.x));
  const yExt = valueExtent(points.map((point) => point.y));
  const xMid = xExt.min + (xExt.max - xExt.min) / 2;
  const yMid = yExt.min + (yExt.max - yExt.min) / 2;
  const px = (value: number) => chart.left + ((value - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
  const py = (value: number) => chart.top + chart.height - ((value - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
  const title = slotTitle(sceneContent);
  const xLabel = sceneContent?.data_binding?.x_axis?.label || sceneContent?.data_binding?.x?.label || sceneContent?.mapping?.x || '';
  const yLabel = sceneContent?.data_binding?.y_axis?.label || sceneContent?.data_binding?.y?.label || sceneContent?.mapping?.y || '';
  if (!points.length || !title) return null;
  const labels=placeScatterIdentityLabels(points.map(p=>({label:p.label,x:px(p.x),y:py(p.y),radius:12})),12,12);
  const labelStride = points.length > 12 ? 2 : 1;

  return (
    <AbsoluteFill style={{background: '#0a0f1c', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#e2e8f0', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(900px 460px at 80% -8%, rgba(96,165,250,0.16), transparent 58%), linear-gradient(160deg, #0a0f1c 0%, #101a2e 60%, #0a0f1c 100%)'}} />
      <EditableTransform id="mesm-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 76, width: 900, fontSize: 42, fontWeight: 880, letterSpacing: '-0.035em', color: '#f8fafc', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="mesm-axes" role="annotation" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: chart.left + chart.width / 2 - 60, top: chart.top + chart.height + 54, fontSize: 13, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: ease(frame, [12, 28], [0, 1])}}>
          {xLabel}
        </div>
        <div data-dm-text-editable style={{position: 'absolute', left: chart.left - 96, top: chart.top + chart.height / 2 - 20, fontSize: 13, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', transform: 'rotate(-90deg)', transformOrigin: 'center center', opacity: ease(frame, [12, 28], [0, 1])}}>
          {yLabel}
        </div>
      </EditableTransform>
      <EditableTransform id="mesm-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <rect x={chart.left} y={chart.top} width={chart.width} height={chart.height} fill="rgba(148,163,184,0.04)" stroke="rgba(148,163,184,0.18)" strokeWidth={1} />
          <line x1={px(xMid)} x2={px(xMid)} y1={chart.top} y2={chart.top + chart.height} stroke="rgba(148,163,184,0.22)" strokeWidth={1} strokeDasharray="5 7" />
          <line x1={chart.left} x2={chart.left + chart.width} y1={py(yMid)} y2={py(yMid)} stroke="rgba(148,163,184,0.22)" strokeWidth={1} strokeDasharray="5 7" />
          {points.map((point, index) => {
            const progress = ease(frame, [14 + index * 4, 40 + index * 4], [0, 1]);
            const isActive = runtimeContractMatches(animation, point.label);
            const radius = (isActive ? 12 : 9) * progress;
            const cx = px(point.x);
            const cy = py(point.y);
            const labelOnLeft = cx > chart.left + chart.width - 120;
            const labelX = labelOnLeft ? cx - radius - 8 : cx + radius + 7;
            return (
              <g key={`${point.label}-${index}`} opacity={runtimeContractOpacity(animation, isActive, progress)}>
                <circle cx={cx} cy={cy} r={radius + (isActive ? 12 : 7)} fill={point.color} opacity={0.16} />
                <circle cx={cx} cy={cy} r={radius} fill={point.color} stroke="#0a0f1c" strokeWidth={1.5} filter={isActive ? animation.glow : undefined} />
                {index % labelStride === 0 || isActive ? (
                  <RuntimeEntitySvgLabel data-dm-text-editable x={labels[index].x} y={labels[index].y} textAnchor={labels[index].anchor} fontSize={12} fontWeight={isActive ? 900 : 720} fill={isActive ? animation.accent : '#cbd5e1'} sceneContent={sceneContent} label={point.label}>{truncate(point.label, 12)}</RuntimeEntitySvgLabel>
                ) : null}
              </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
