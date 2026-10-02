import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {calculateChartCamera} from '../../src/camera/chartCamera';

export type ChartFocusPushProps = {
  metadata: {
    nameZh: string;
    nameEn: string;
    descriptionZh: string;
    descriptionEn: string;
  };
  eyebrow: string;
  title: string;
  subtitle: string;
  labels: string[];
  values: number[];
  unit: string;
  anomalyIndex: number;
  insight: string;
  source: string;
  accentColor: string;
};

const FONT_STACK = '"Noto Sans SC", Inter, "PingFang SC", "Microsoft YaHei", sans-serif';
const STAGE = {width: 1760, height: 610};
const PLOT = {left: 180, top: 82, width: 1440, height: 320};

const linePath = (points: Array<{x: number; y: number}>) =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

export const ChartFocusPush: React.FC<ChartFocusPushProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const count = Math.min(props.labels.length, props.values.length);
  const values = props.values.slice(0, count);
  const labels = props.labels.slice(0, count);
  const safeAnomalyIndex = Math.min(Math.max(0, Math.round(props.anomalyIndex)), Math.max(0, count - 1));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(1, maxValue - minValue);
  const points = values.map((value, index) => ({
    x: PLOT.left + (index / Math.max(1, count - 1)) * PLOT.width,
    y: PLOT.top + PLOT.height - ((value - minValue) / range) * PLOT.height,
  }));
  const focusPoint = points[safeAnomalyIndex] ?? {x: PLOT.left, y: PLOT.top + PLOT.height / 2};
  const camera = calculateChartCamera({
    profile: 'slow_focus_push',
    frame,
    fps,
    durationInFrames,
    canvasWidth: STAGE.width,
    canvasHeight: STAGE.height,
    focusX: focusPoint.x,
    focusY: focusPoint.y,
  });

  const intro = spring({
    frame,
    fps,
    durationInFrames: Math.round(fps * 0.7),
    config: {damping: 200},
  });
  const drawProgress = interpolate(frame, [fps * 0.55, fps * 2.25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const focusReveal = interpolate(frame, [fps * 3.3, fps * 4.15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const anomalyValue = values[safeAnomalyIndex] ?? 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#f4f6f8', color: '#111a22', fontFamily: FONT_STACK, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(18, 35, 48, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 35, 48, 0.045) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

      <header style={{position: 'absolute', left: 80, top: 58, right: 80, height: 180, display: 'flex', justifyContent: 'space-between', gap: 64, opacity: intro, transform: `translateY(${(1 - intro) * 18}px)`}}>
        <div style={{maxWidth: 1160}}>
          <div style={{fontSize: 19, lineHeight: 1.3, fontWeight: 700, color: props.accentColor, letterSpacing: 0}}>{props.eyebrow}</div>
          <h1 style={{margin: '15px 0 8px', fontSize: 54, lineHeight: 1.12, fontWeight: 700, letterSpacing: 0}}>{props.title}</h1>
          <p style={{margin: 0, maxWidth: 1080, color: '#5b6872', fontSize: 23, lineHeight: 1.45, fontWeight: 500, letterSpacing: 0}}>{props.subtitle}</p>
        </div>
        <div style={{width: 350, alignSelf: 'flex-end', paddingBottom: 11, textAlign: 'right'}}>
          <div style={{fontSize: 16, color: '#71808b'}}>FOCUS METRIC</div>
          <div style={{marginTop: 4, fontSize: 54, lineHeight: 1, fontWeight: 700, color: props.accentColor}}>{anomalyValue}{props.unit}</div>
        </div>
      </header>

      <div style={{position: 'absolute', left: 80, top: 256, width: STAGE.width, height: STAGE.height, overflow: 'hidden', border: '1px solid #d6dde2', borderRadius: 8, backgroundColor: '#ffffff', boxShadow: '0 24px 58px rgba(23, 39, 52, 0.12)'}}>
        <div style={{position: 'absolute', width: STAGE.width, height: STAGE.height, transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`, transformOrigin: `${camera.origin.x}px ${camera.origin.y}px`}}>
          <svg width={STAGE.width} height={STAGE.height} viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} style={{display: 'block'}}>
            {[0, 0.25, 0.5, 0.75, 1].map(fraction => {
              const y = PLOT.top + PLOT.height * fraction;
              const value = maxValue - range * fraction;
              return <g key={fraction}>
                <line x1={PLOT.left} y1={y} x2={PLOT.left + PLOT.width} y2={y} stroke="#dfe5e9" strokeWidth={1.5} />
                <text x={PLOT.left - 24} y={y + 7} textAnchor="end" fontFamily={FONT_STACK} fontSize={17} fill="#73808a">{Math.round(value)}{props.unit}</text>
              </g>;
            })}

            <path d={linePath(points)} fill="none" stroke="#d7e0e6" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            <path d={linePath(points)} fill="none" stroke={props.accentColor} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${drawProgress} 1`} />

            {points.map((point, index) => {
              const pointProgress = interpolate(drawProgress, [index / Math.max(1, count), (index + 1) / Math.max(1, count)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const isFocus = index === safeAnomalyIndex;
              const projectedX = camera.origin.x + (point.x - camera.origin.x) * camera.scale + camera.x;
              const labelVisible = projectedX > 110 && projectedX < STAGE.width - 110;
              return <g key={`${labels[index]}-${index}`} opacity={pointProgress}>
                {isFocus ? <circle cx={point.x} cy={point.y} r={38 + focusReveal * 8} fill="none" stroke={props.accentColor} strokeWidth={3} opacity={0.18 + focusReveal * 0.35} /> : null}
                <circle cx={point.x} cy={point.y} r={isFocus ? 13 : 9} fill={isFocus ? props.accentColor : '#ffffff'} stroke={props.accentColor} strokeWidth={5} />
                <text x={point.x} y={PLOT.top + PLOT.height + 58} textAnchor="middle" fontFamily={FONT_STACK} fontSize={18} fontWeight={isFocus ? 700 : 500} fill={isFocus ? '#111a22' : '#687680'} opacity={labelVisible ? 1 : 0}>{labels[index]}</text>
              </g>;
            })}
          </svg>
        </div>

        <div style={{position: 'absolute', left: 70, top: 22, width: 420, height: 94, borderRadius: 7, overflow: 'hidden', backgroundColor: '#111a22', opacity: focusReveal, transform: `translateY(${(1 - focusReveal) * -12}px)`, color: '#fff'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 7, backgroundColor: props.accentColor}} />
          <div style={{padding: '17px 28px'}}>
            <div style={{fontSize: 17, lineHeight: 1.2, fontWeight: 700, color: props.accentColor}}>关键异常 · {labels[safeAnomalyIndex]}</div>
            <div style={{marginTop: 7, fontSize: 25, lineHeight: 1.2, fontWeight: 700}}>{anomalyValue}{props.unit}，需要进一步解释</div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 36, right: 36, bottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, padding: '15px 20px', borderTop: '1px solid #dce3e8', backgroundColor: 'rgba(255,255,255,0.94)', fontSize: 18}}>
          <span style={{fontWeight: 700, color: '#2d3942'}}>{props.insight}</span>
          <span style={{flexShrink: 0, color: '#72808a', fontSize: 15}}>镜头只强调，不改变数据几何</span>
        </div>
      </div>

      <footer style={{position: 'absolute', left: 80, right: 80, bottom: 35, paddingTop: 14, borderTop: '1px solid #ced6dc', display: 'flex', justifyContent: 'space-between', gap: 40, color: '#6b7882', fontSize: 15}}>
        <span>来源：{props.source}</span>
        <span>{props.metadata.nameZh} / {props.metadata.nameEn}</span>
      </footer>
    </AbsoluteFill>
  );
};
