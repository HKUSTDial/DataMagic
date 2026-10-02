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
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeContractMatches, runtimeContractOpacity, runtimeCards, slotTitle, truncate, valueExtent, type RuntimeStyleTemplateProps} from './runtimeSlots';
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

const buildLinePath = (
  values: number[],
  left: number,
  top: number,
  width: number,
  height: number,
) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  return values
    .map((value, index) => {
      const x = left + (index / (values.length - 1)) * width;
      const y = top + height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
};

export const KpiMicroDashboardDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safeFps = fps ?? 30;
  const animation = runtimeAnimationContract('stat', scene, rawFrame, safeFps);
  const cardSpring = spring({
    frame,
    fps: safeFps,
    config: {damping: 190, stiffness: 125},
    durationInFrames: 32,
  });
  const cards = runtimeCards(sceneContent, scene);
  const palette = paletteFor(sceneContent, false);
  const hero = cards[0];
  const segmentRows = cards.length > 1
    ? cards.slice(1, 4).map((card, index) => ({
      label: card.label,
      value: card.value,
      color: card.color || palette[(index + 1) % palette.length],
      displayValue: card.displayValue,
    }))
    : [];
  const numberValue = Math.round(clampFrame(frame, [18, 58], [0, hero?.value ?? 0], Easing.out(Easing.quad)));
  const lineProgress = clampFrame(frame, [24, 76], [0, 1]);
  const chart = {left: 44, top: 18, width: 500, height: 110};
  const runtimeTrend = hero?.sparkline && hero.sparkline.length >= 2 ? hero.sparkline : [];
  const linePath = runtimeTrend.length >= 2 ? buildLinePath(runtimeTrend, chart.left, chart.top, chart.width, chart.height) : '';
  const areaPath = linePath ? `${linePath} L ${chart.left + chart.width} ${chart.top + chart.height} L ${chart.left} ${chart.top + chart.height} Z` : '';
  const title = slotTitle(sceneContent) || hero?.label || '';
  if (!hero || !title) return null;
  const heroActive = runtimeContractMatches(animation, hero.label, title);

  return (
    <AbsoluteFill
      style={{
        background: '#f5f6f8',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        color: '#202124',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 22% 20%, rgba(255,255,255,0.98), transparent 28%), radial-gradient(circle at 82% 82%, rgba(20,200,183,0.12), transparent 24%), radial-gradient(circle at 72% 18%, rgba(255,79,147,0.1), transparent 26%)',
        }}
      />
      <EditableTransform id="kpi-dashboard-card" role="group" style={{display: 'block'}}>
        <div
          style={{
            position: 'absolute',
            left: 128,
            top: 78,
            width: 1024,
            height: 432,
            borderRadius: 30,
            background: '#ffffff',
            border: heroActive ? `2px solid ${animation.accent}` : '1px solid rgba(15,23,42,0.04)',
            boxShadow: heroActive ? `0 34px 84px rgba(31,35,40,0.13), ${animation.glow}` : '0 34px 84px rgba(31,35,40,0.13), 0 1px 0 rgba(255,255,255,0.92) inset',
            opacity: clampFrame(frame, [0, 18], [0, 1]),
            transform: `translateY(${(1 - cardSpring) * 16}px) scale(${0.985 + cardSpring * 0.015})`,
          }}
        >
          <EditableTransform id="kpi-dashboard-title" role="title" style={{display: 'block'}}>
            <div
              data-dm-text-editable
              style={{
                position: 'absolute',
                left: 70,
                top: 58,
                fontSize: 19,
                fontWeight: 820,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#9aa0aa',
              }}
            >
              {truncate(title, 60)}
            </div>
          </EditableTransform>

          <EditableTransform id="kpi-dashboard-main-metric" role="metric" style={{display: 'block'}}>
            <div
              data-dm-text-editable
              style={{
                position: 'absolute',
                left: 66,
                top: 94,
                fontSize: 88,
                lineHeight: 0.95,
                fontWeight: 850,
                letterSpacing: '-0.065em',
                color: '#202124',
                transform: `scale(${0.92 + spring({
                  frame: frame - 12,
                  fps: safeFps,
                  config: {damping: 180, stiffness: 140},
                  durationInFrames: 32,
                }) * 0.08 + (heroActive ? 0.025 : 0)})`,
              }}
            >
              {hero.displayValue || numberValue.toLocaleString('en-US')}
            </div>
          </EditableTransform>

          <div
            style={{
              position: 'absolute',
              left: 72,
              top: 188,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              padding: '8px 12px',
              borderRadius: 999,
              background: '#e9fbf8',
              color: '#0d9488',
              fontSize: 13,
              fontWeight: 800,
              opacity: clampFrame(frame, [36, 54], [0, 1]),
            }}
          >
            <span style={{width: 8, height: 8, borderRadius: '50%', background: '#14c8b7'}} />
            {hero.subtitle}
          </div>

          {runtimeTrend.length >= 2 ? <EditableTransform
            id="kpi-dashboard-trend"
            role="chart"
            style={{
              position: 'absolute',
              left: 40,
              top: 230,
              width: 600,
              height: 168,
              display: 'block',
            }}
          >
            <svg
              width={600}
              height={168}
              viewBox="0 0 600 168"
              style={{display: 'block', overflow: 'visible'}}
            >
              <defs>
                <linearGradient id="kpi-area-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={hero.color || '#14c8b7'} stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#14c8b7" stopOpacity={0} />
                </linearGradient>
              </defs>
              {[0, 1, 2].map((tick) => (
                <line
                  key={tick}
                  x1={chart.left}
                  x2={chart.left + chart.width}
                  y1={chart.top + tick * (chart.height / 2)}
                  y2={chart.top + tick * (chart.height / 2)}
                  stroke="#eef0f4"
                  strokeWidth={1}
                />
              ))}
              <g
                style={{
                  opacity: lineProgress,
                  transform: `scaleX(${lineProgress})`,
                  transformOrigin: `${chart.left}px ${chart.top + chart.height}px`,
                }}
              >
                <path d={areaPath} fill="url(#kpi-area-gradient)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke={hero.color || '#14c8b7'}
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </EditableTransform> : null}

          <EditableTransform id="kpi-dashboard-segments" role="chart" style={{display: 'block'}}>
            <div
              style={{
                position: 'absolute',
                right: 70,
                top: 96,
                width: 282,
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
              }}
            >
              {segmentRows.map((item, index) => {
                const progress = clampFrame(frame, [28 + index * 7, 58 + index * 7], [0, 1]);
                const ext = valueExtent(segmentRows.map((row) => row.value));
                const width = Math.min(100, ((item.value - ext.min) / (ext.max - ext.min || 1)) * 80 + 20);
                const isActive = runtimeContractMatches(animation, item.label);
                return (
                  <div key={item.label} style={{padding: '10px 12px', margin: '-10px -12px 0', borderRadius: 16, background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent', border: isActive ? `1px solid ${animation.accent}44` : '1px solid transparent', opacity: runtimeContractOpacity(animation, isActive || heroActive, 1)}}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        opacity: progress,
                      }}
                    >
                      <div
                        data-dm-text-editable
                        style={{
                          fontSize: 16,
                          fontWeight: isActive ? 900 : 780,
                          color: isActive ? '#202124' : '#3b3f46',
                        }}
                      >
                        {truncate(item.label, 18)}
                      </div>
                      <div
                        data-dm-text-editable
                        style={{
                          fontSize: 18,
                          fontWeight: 840,
                          color: isActive ? animation.accent : item.color,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {item.displayValue || formatCompact(item.value, item.label)}
                      </div>
                    </div>
                    <div
                      style={{
                        height: 16,
                        borderRadius: 999,
                        background: '#eef0f4',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${width * progress}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: isActive ? animation.accent : item.color,
                          boxShadow: isActive ? `0 0 14px ${animation.accent}55` : 'none',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </EditableTransform>
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
