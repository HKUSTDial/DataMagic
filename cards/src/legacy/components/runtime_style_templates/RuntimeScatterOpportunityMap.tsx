import {RuntimeEntitySvgLabel} from './runtimeEntityVisuals';
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {EditableTransform} from '../scenes/EditableTransform';
import {
  paletteFor,
  runtimeAnimationContract,
  runtimeContractEase,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimeScatterPoints,
  slotTitle,
  truncate,
  valueExtent,
  type RuntimeStyleTemplateProps,
} from './runtimeSlots';
import {useNarrationSyncedFrame} from './narrationTiming';

const clampFrame = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing = Easing.out(Easing.cubic),
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const ScatterOpportunityMapDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safeFps = fps ?? 30;
  const animation = runtimeAnimationContract('scatter', scene, rawFrame, safeFps);
  const emphasis = runtimeContractEase(animation);
  const cardIn = spring({
    frame,
    fps: safeFps,
    config: {damping: 190, stiffness: 125},
    durationInFrames: 30,
  });
  const chart = {left: 98, top: 86, width: 742, height: 224};
  const palette = paletteFor(sceneContent, false);
  const runtimeRows = runtimeScatterPoints(sceneContent).slice(0, 10);
  const visualPoints = runtimeRows.map((point, index) => ({...point, size: point.size ?? 24, color: point.color || palette[index % palette.length]}));
  const xExt = valueExtent(visualPoints.map((point) => point.x));
  const yExt = valueExtent(visualPoints.map((point) => point.y));
  const sizeMax = Math.max(1, ...visualPoints.map((point) => Math.abs(point.size)));
  const toX = (x: number) => chart.left + ((x - xExt.min) / (xExt.max - xExt.min || 1)) * chart.width;
  const toY = (y: number) => chart.top + chart.height - ((y - yExt.min) / (yExt.max - yExt.min || 1)) * chart.height;
  const title = slotTitle(sceneContent);
  const xLabel = sceneContent?.data_binding?.x_axis?.label || sceneContent?.data_binding?.x?.label || sceneContent?.mapping?.x || '';
  const yLabel = sceneContent?.data_binding?.y_axis?.label || sceneContent?.data_binding?.y?.label || sceneContent?.mapping?.y || '';
  const isChinese = /[\u3400-\u9fff]/.test(`${title}${xLabel}${yLabel}`);
  if (!visualPoints.length || !title) return null;

  return (
    <AbsoluteFill
      style={{
        background: '#eef3f8',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        color: '#172033',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.95), transparent 28%), radial-gradient(circle at 82% 78%, rgba(47,107,255,0.11), transparent 26%)',
        }}
      />
      <EditableTransform id="scatter-map-card" role="group" style={{display: 'block'}}>
        <div
          style={{
            position: 'absolute',
            left: 112,
            top: 78,
            width: 1056,
            height: 462,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.96)',
            boxShadow: '0 34px 90px rgba(31,45,61,0.14), 0 1px 0 rgba(255,255,255,0.9) inset',
            opacity: clampFrame(frame, [0, 18], [0, 1]),
            transform: `translateY(${(1 - cardIn) * 18}px) scale(${0.985 + cardIn * 0.015})`,
          }}
        >
          <EditableTransform id="scatter-map-title" role="title" style={{display: 'block'}}>
            <div
              data-dm-text-editable
              style={{
                position: 'absolute',
                left: 72,
                top: 48,
                fontSize: 30,
                lineHeight: 1.08,
                fontWeight: 830,
                letterSpacing: 0,
                color: '#162032',
                width: 640,
                height: 34,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {truncate(title, 60)}
            </div>
          </EditableTransform>

          <EditableTransform id="scatter-map-metric" role="metric" style={{display: 'block'}}>
            <div
              style={{
                position: 'absolute',
                right: 72,
                top: 42,
                display: 'flex',
                gap: 16,
                opacity: clampFrame(frame, [32, 52], [0, 1]),
              }}
            >
              {[[String(visualPoints.length), isChinese ? '渠道' : 'segments']].map(([value, label]) => (
                <div
                  key={label}
                  style={{
                    minWidth: 84,
                    borderRadius: 14,
                    background: '#f5f7fb',
                    border: '1px solid rgba(23,32,51,0.08)',
                    padding: '10px 12px',
                    textAlign: 'center',
                  }}
                >
                  <div data-dm-text-editable style={{fontSize: 24, lineHeight: 1, fontWeight: 850, color: '#2f6bff'}}>
                    {value}
                  </div>
                  <div
                    data-dm-text-editable
                    style={{
                      marginTop: 6,
                      fontSize: 10,
                      fontWeight: 820,
                      letterSpacing: 0,
                      textTransform: 'uppercase',
                      color: '#94a3b8',
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </EditableTransform>

          <EditableTransform id="scatter-map-chart" role="chart" style={{display: 'block'}}>
            <svg
              width={900}
              height={342}
              viewBox="0 0 900 342"
              style={{position: 'absolute', left: 48, top: 108, overflow: 'visible'}}
            >
              <defs>
                <linearGradient id="scatter-trend-gradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#10c6a8" />
                  <stop offset="100%" stopColor="#2f6bff" />
                </linearGradient>
              </defs>
              <rect x={chart.left} y={chart.top} width={chart.width} height={chart.height} rx={18} fill="#f7f9fc" />
              <rect x={chart.left} y={chart.top} width={chart.width / 2} height={chart.height / 2} rx={16} fill="rgba(255,138,61,0.055)" />
              <rect x={chart.left + chart.width / 2} y={chart.top} width={chart.width / 2} height={chart.height / 2} rx={16} fill="rgba(16,198,168,0.07)" />
              <rect x={chart.left + chart.width / 2} y={chart.top + chart.height / 2} width={chart.width / 2} height={chart.height / 2} rx={16} fill="rgba(47,107,255,0.06)" />

              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const x = chart.left + ratio * chart.width;
                const y = chart.top + (1 - ratio) * chart.height;
                return (
                  <g key={ratio}>
                    <line x1={x} x2={x} y1={chart.top} y2={chart.top + chart.height} stroke="#e4e8f0" strokeWidth={ratio === 0.5 ? 2 : 1} />
                    <line x1={chart.left} x2={chart.left + chart.width} y1={y} y2={y} stroke="#e4e8f0" strokeWidth={ratio === 0.5 ? 2 : 1} />
                  </g>
                );
              })}

              {visualPoints.map((point, index) => {
                const p = spring({
                  frame: frame - 12 - index * 4,
                  fps: safeFps,
                  config: {damping: 180, stiffness: 150},
                  durationInFrames: 30,
                });
                const cx = toX(point.x);
                const cy = toY(point.y);
                const color = point.color;
                const r = (8 + (Math.abs(point.size) / sizeMax) * 18) * p;
                const isActive = runtimeContractMatches(animation, point.label);
                const isHero = isActive || index < 2;
                const activeRadius = r + 7 + emphasis * 6;
                const opacity = clampFrame(frame, [10 + index * 3, 28 + index * 3], [0, 1]) * runtimeContractOpacity(animation, isActive, 0.92);
                return (
                  <g key={point.label} opacity={opacity}>
                    <circle cx={cx} cy={cy} r={isActive ? activeRadius + 10 : r + 8} fill={isActive ? animation.accent : color} opacity={isActive ? 0.18 + emphasis * 0.08 : 0.11} />
                    {isActive ? (
                      <circle cx={cx} cy={cy} r={activeRadius + 2} fill="none" stroke={animation.accent} strokeWidth={2.2 + emphasis * 1.4} opacity={0.7} filter={animation.glow} />
                    ) : null}
                    <circle cx={cx} cy={cy} r={isActive ? r + 4 + emphasis * 3 : r} fill={isActive ? animation.accent : color} opacity={0.92} filter={isActive ? animation.glow : undefined} />
                    <circle cx={cx} cy={cy} r={isActive ? r + 4 + emphasis * 3 : r} fill="none" stroke={isActive ? '#ffffff' : 'transparent'} strokeWidth={isActive ? 3 : 0} />
                    <circle cx={cx - r * 0.26} cy={cy - r * 0.28} r={Math.max(2, r * 0.28)} fill="rgba(255,255,255,0.55)" />
                    {isHero && (
                      <RuntimeEntitySvgLabel
                        x={cx + r + 12}
                        y={cy + 5}
                        fontSize={15}
                        fontWeight={820}
                        fill={isActive ? animation.accent : '#1f2937'}
                        opacity={isActive ? 1 : clampFrame(frame, [58, 78], [0, 1])}
                        filter={isActive ? animation.glow : undefined}
                       sceneContent={sceneContent} label={point.label}>{truncate(point.label, 14)}</RuntimeEntitySvgLabel>
                    )}
                  </g>
                );
              })}

              {xLabel ? <text x={chart.left} y={chart.top + chart.height + 30} fontSize={12} fontWeight={800} fill="#94a3b8" letterSpacing={0}>{truncate(xLabel, 28).toUpperCase()}</text> : null}
              {yLabel ? <text x={chart.left - 58} y={chart.top + 18} fontSize={12} fontWeight={800} fill="#94a3b8" letterSpacing={0} transform={`rotate(-90 ${chart.left - 58} ${chart.top + 18})`}>{truncate(yLabel, 28).toUpperCase()}</text> : null}
            </svg>
          </EditableTransform>
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
