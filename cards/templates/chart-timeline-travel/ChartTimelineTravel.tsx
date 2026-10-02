import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {cameraStateAtFrame} from './motion.mjs';

type LocalizedText = {
  zh: string;
  en: string;
};

type TimelinePeriod = {
  id: string;
  label: LocalizedText;
  value: number;
  unit: string;
  note: LocalizedText;
  accent: string;
};

export type ChartTimelineTravelProps = {
  locale: 'zh' | 'en';
  eyebrow: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  periods: TimelinePeriod[];
  finalTakeaway: LocalizedText;
  source: LocalizedText;
};

export const CHART_TIMELINE_TRAVEL_SIZE = {width: 1920, height: 1080} as const;

const FONT_FAMILY = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", Inter, sans-serif';
const STAGE_WIDTH = 3460;
const STAGE_HEIGHT = 650;
const FIRST_X = 360;
const PERIOD_GAP = 650;
const PLOT_TOP = 190;
const PLOT_BOTTOM = 470;
const CAMERA_TARGET_X = 790;

const localize = (value: LocalizedText, locale: 'zh' | 'en') => value[locale];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const buildSmoothPath = (points: Array<{x: number; y: number}>) => points.reduce((path, point, index) => {
  if (index === 0) return `M ${point.x} ${point.y}`;
  const previous = points[index - 1];
  const controlX = (previous.x + point.x) / 2;
  return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
}, '');

export const ChartTimelineTravel: React.FC<ChartTimelineTravelProps> = props => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = props.periods.length;
  const camera = cameraStateAtFrame({frame, fps, periodCount: count});
  const intro = spring({
    frame,
    fps,
    durationInFrames: Math.round(fps * 0.7),
    config: {damping: 200},
  });

  const values = props.periods.map(period => period.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = Math.max(1, maximum - minimum);
  const points = props.periods.map((period, index) => ({
    x: FIRST_X + index * PERIOD_GAP,
    y: PLOT_BOTTOM - ((period.value - minimum) / range) * (PLOT_BOTTOM - PLOT_TOP),
  }));
  const focusX = FIRST_X + camera.focusIndex * PERIOD_GAP;
  const translateX = CAMERA_TARGET_X - focusX * camera.zoom;
  const activePeriod = props.periods[camera.activeIndex];
  const linePath = buildSmoothPath(points);
  const lineProgress = clamp(camera.focusIndex / Math.max(1, count - 1), 0.002, 1);
  const finalHold = interpolate(
    camera.focusIndex,
    [count - 1.12, count - 1],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f2f4f7',
        color: '#121a24',
        fontFamily: FONT_FAMILY,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(25, 40, 56, 0.045) 1px, transparent 1px)',
          backgroundSize: '100% 54px',
        }}
      />

      <header
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 54,
          height: 128,
          opacity: intro,
          transform: `translateY(${(1 - intro) * 16}px)`,
        }}
      >
        <div style={{color: '#0a7f78', fontSize: 18, fontWeight: 800}}>
          {localize(props.eyebrow, props.locale)}
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12}}>
          <h1 style={{margin: 0, maxWidth: 1110, fontSize: 54, lineHeight: 1.08, letterSpacing: 0}}>
            {localize(props.title, props.locale)}
          </h1>
          <p style={{margin: '0 0 3px', width: 560, color: '#617080', fontSize: 21, lineHeight: 1.48, textAlign: 'right'}}>
            {localize(props.subtitle, props.locale)}
          </p>
        </div>
      </header>

      <div
        style={{
          position: 'absolute',
          left: 48,
          top: 202,
          width: 1328,
          height: 692,
          overflow: 'hidden',
          borderTop: '1px solid #ccd4dc',
          borderBottom: '1px solid #ccd4dc',
        }}
      >
        <div
          data-layer="camera-stage"
          style={{
            position: 'absolute',
            left: 0,
            top: 18,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            transform: `translate3d(${translateX}px, 0, 0) scale(${camera.zoom})`,
            transformOrigin: '0 50%',
          }}
        >
          <svg width={STAGE_WIDTH} height={STAGE_HEIGHT} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = PLOT_BOTTOM - ratio * (PLOT_BOTTOM - PLOT_TOP);
              return <line key={index} x1="80" y1={y} x2={STAGE_WIDTH - 80} y2={y} stroke="#d6dde4" strokeWidth="1" strokeDasharray="5 12" />;
            })}
            <path d={linePath} fill="none" stroke="#c5cdd5" strokeWidth="8" opacity="0.42" strokeLinecap="round" />
            <path
              d={linePath}
              fill="none"
              stroke="#0a7f78"
              strokeWidth="9"
              pathLength={1}
              strokeDasharray={`${lineProgress} 1`}
              strokeLinecap="round"
            />

            {points.map((point, index) => {
              const period = props.periods[index];
              const distance = Math.abs(camera.focusIndex - index);
              const reached = camera.focusIndex >= index - 0.08;
              const prominence = clamp(1 - distance * 0.52, 0.24, 1);
              const cardOpacity = reached && distance < 0.52
                ? clamp(1 - distance / 0.52, 0, 1)
                : 0;
              const cardAbove = index % 2 === 0;
              const cardY = cardAbove ? 22 : 505;
              const connectorEnd = cardAbove ? 146 : 505;
              return (
                <g key={period.id}>
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={point.x}
                    y2={connectorEnd}
                    stroke={period.accent}
                    strokeWidth="2"
                    opacity={reached ? prominence * 0.78 : 0.12}
                    strokeDasharray="5 7"
                  />
                  <circle cx={point.x} cy={point.y} r={reached ? 15 : 9} fill={reached ? period.accent : '#d7dde3'} stroke="#fff" strokeWidth="6" />
                  <circle cx={point.x} cy={point.y} r={26} fill="none" stroke={period.accent} strokeWidth="2" opacity={distance < 0.38 ? 0.48 : 0} />
                  <text x={point.x} y={PLOT_BOTTOM + 52} textAnchor="middle" fontFamily={FONT_FAMILY} fontSize="19" fontWeight="700" fill={distance < 0.55 ? '#121a24' : '#7b8793'}>
                    {localize(period.label, props.locale)}
                  </text>
                  <rect x={point.x - 144} y={cardY} width="288" height="124" rx="6" fill="#fff" stroke={period.accent} strokeWidth="3" opacity={cardOpacity} />
                  <text x={point.x - 118} y={cardY + 38} fontFamily={FONT_FAMILY} fontSize="17" fontWeight="700" fill={period.accent} opacity={cardOpacity}>
                    {String(index + 1).padStart(2, '0')} · {localize(period.label, props.locale)}
                  </text>
                  <text x={point.x - 118} y={cardY + 94} fontFamily={FONT_FAMILY} fontSize="42" fontWeight="800" fill="#121a24" opacity={cardOpacity}>
                    {period.value}<tspan dx="6" fontSize="21" fill="#65717d">{period.unit}</tspan>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <aside
        style={{
          position: 'absolute',
          right: 72,
          top: 236,
          width: 392,
          height: 624,
          paddingLeft: 36,
          borderLeft: `5px solid ${activePeriod.accent}`,
        }}
      >
        <div style={{fontSize: 17, color: '#71808e', fontWeight: 700}}>
          {String(camera.activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </div>
        <div style={{marginTop: 52, color: activePeriod.accent, fontSize: 25, fontWeight: 800}}>
          {localize(activePeriod.label, props.locale)}
        </div>
        <div style={{marginTop: 16, fontSize: 92, lineHeight: 1, fontWeight: 800}}>
          {activePeriod.value}
          <span style={{marginLeft: 9, color: '#667482', fontSize: 34}}>{activePeriod.unit}</span>
        </div>
        <p style={{margin: '36px 0 0', minHeight: 118, color: '#4f5e6c', fontSize: 25, lineHeight: 1.58}}>
          {localize(activePeriod.note, props.locale)}
        </p>
        <div style={{marginTop: 54, display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 8}}>
          {props.periods.map((period, index) => (
            <div key={period.id} style={{height: 8, backgroundColor: index <= camera.activeIndex ? period.accent : '#d7dde3'}} />
          ))}
        </div>
        <div style={{marginTop: 42, opacity: finalHold, transform: `translateY(${(1 - finalHold) * 12}px)`}}>
          <div style={{fontSize: 15, color: '#7b8793', fontWeight: 700}}>{props.locale === 'zh' ? '最终结论' : 'FINAL TAKEAWAY'}</div>
          <div style={{marginTop: 12, padding: '17px 0', borderTop: '1px solid #cdd5dd', borderBottom: '1px solid #cdd5dd', fontSize: 22, lineHeight: 1.48, fontWeight: 700}}>
            {localize(props.finalTakeaway, props.locale)}
          </div>
        </div>
      </aside>

      <footer
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 38,
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 15,
          borderTop: '1px solid #ccd4dc',
          color: '#778491',
          fontSize: 15,
        }}
      >
        <span>{props.locale === 'zh' ? '来源' : 'Source'}：{localize(props.source, props.locale)}</span>
        <span>{props.locale === 'zh' ? '镜头依次巡航，并在最终时期减速停稳' : 'The camera travels milestone by milestone, then brakes into the final period'}</span>
      </footer>
    </AbsoluteFill>
  );
};
