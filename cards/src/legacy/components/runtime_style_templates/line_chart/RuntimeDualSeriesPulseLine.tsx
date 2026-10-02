import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  firstString,
  formatCompact,
  linePath,
  runtimeAnimationContract,
  runtimeContractEase,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimePoints,
  paletteFor,
  slotTitle,
  styleTheme,
  truncate,
  valueExtent,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const splitSeriesFromContent = (sceneContent: any, scene: any) => {
  const points = runtimePoints(sceneContent, scene).slice(0, 24);
  const seriesMap = new Map<string, {name: string; color: string; values: number[]; labels: string[]}>();
  const palette = sceneContent?.style?.palette || ['#22d3ee', '#fbbf24', '#a78bfa'];
  for (const point of points) {
    const seriesName = firstString(point.series);
    if (!seriesName) continue;
    const existing = seriesMap.get(seriesName) ?? {
      name: seriesName,
      color: firstString(point.color, palette[seriesMap.size % palette.length], '#22d3ee'),
      values: [],
      labels: [],
    };
    existing.values.push(point.value);
    existing.labels.push(point.label);
    seriesMap.set(seriesName, existing);
  }
  const series = Array.from(seriesMap.values()).filter((item) => item.values.length >= 2).slice(0, 2);
  if (series.length >= 2) {
    const minLength = Math.min(...series.map((item) => item.values.length));
    return {
      labels: series[0].labels.slice(0, minLength),
      series: series.map((item) => ({...item, values: item.values.slice(0, minLength)})),
    };
  }
  return {labels: [], series: []};
};

export const DualSeriesPulseLineDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('line', scene, rawFrame, 30);
  const emphasisEase = runtimeContractEase(animation);
  const titleFrame = {left: 96, top: 58, width: 810, fontSize: 44, lineHeight: 1.06};
  const legendFrame = {left: 96, top: 162, height: 38};
  const chartFrame = {left: 96, top: 218, width: 1088, height: 292};
  const chart = {left: 76, top: 52, width: 940, height: 188};
  const progress = ease(frame, [18, 78], [0, 1]);
  const {labels, series} = splitSeriesFromContent(sceneContent, scene);
  const allValues = series.flatMap((item) => item.values);
  const extent = allValues.length ? valueExtent(allValues) : {min: 0, max: 100};
  const title = slotTitle(sceneContent);
  const theme = styleTheme(sceneContent);
  const dark = theme === 'dark';
  const palette = paletteFor(sceneContent, dark);
  const background = dark ? '#0f172a' : '#f8fafc';
  const foreground = dark ? '#f8fafc' : '#0f172a';
  const muted = dark ? 'rgba(248,250,252,0.64)' : 'rgba(15,23,42,0.62)';
  const panel = dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.82)';
  const panelStroke = dark ? 'rgba(255,255,255,0.09)' : 'rgba(15,23,42,0.1)';
  const gridStroke = dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.09)';
  const guideStroke = dark ? 'rgba(248,250,252,0.16)' : 'rgba(15,23,42,0.16)';
  const legendBg = dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)';
  const legendBorder = dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.1)';
  const wash = dark
    ? 'radial-gradient(circle at 24% 20%, rgba(34,211,238,0.16), transparent 28%), linear-gradient(135deg, #0f172a 0%, #111827 58%, #020617 100%)'
    : 'radial-gradient(circle at 24% 20%, rgba(37,99,235,0.11), transparent 30%), linear-gradient(135deg, #f8fafc 0%, #eef6ff 58%, #ffffff 100%)';
  if (series.length < 2 || labels.length < 2 || !title) return null;
  const styledSeries = series.map((item, index) => ({
    ...item,
    color: item.color || palette[index % palette.length],
  }));

  const pointsFor = (values: number[]) =>
    values.map((value, index) => ({
      x: chart.left + (index / Math.max(1, values.length - 1)) * chart.width,
      y: chart.top + chart.height - ((value - extent.min) / (extent.max - extent.min || 1)) * chart.height,
    }));
  const pathFor = (values: number[]) => {
    const points = pointsFor(values);
    const count = Math.max(2, Math.ceil(progress * points.length));
    return linePath(points.slice(0, count));
  };
  const activePointIndex = labels.findIndex((label) => runtimeContractMatches(animation, label));

  return (
    <AbsoluteFill style={{background, fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: foreground, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: wash}} />
      <EditableTransform id="pulse-line-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: titleFrame.left, top: titleFrame.top, width: titleFrame.width, fontSize: titleFrame.fontSize, lineHeight: titleFrame.lineHeight, fontWeight: 900, letterSpacing: '-0.045em', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="pulse-line-legend" role="metric" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: legendFrame.left, top: legendFrame.top, height: legendFrame.height, display: 'flex', gap: 12, opacity: ease(frame, [24, 46], [0, 1])}}>
          {styledSeries.map((item) => (
            <div key={item.name} style={{height: 38, borderRadius: 999, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 9, background: legendBg, border: `1px solid ${legendBorder}`}}>
              <span style={{width: 10, height: 10, borderRadius: 999, background: item.color}} />
              <span data-dm-text-editable style={{fontSize: 13, fontWeight: 820, color: muted}}>{truncate(item.name, 18)}</span>
            </div>
          ))}
        </div>
      </EditableTransform>
      <EditableTransform id="pulse-line-chart" role="chart" style={{position: 'absolute', left: chartFrame.left, top: chartFrame.top, width: chartFrame.width, height: chartFrame.height, display: 'block'}}>
        <svg width={chartFrame.width} height={chartFrame.height} viewBox={`0 0 ${chartFrame.width} ${chartFrame.height}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <rect x={0} y={0} width={chartFrame.width} height={chartFrame.height} rx={24} fill={panel} stroke={panelStroke} />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = chart.top + chart.height - tick * chart.height;
            return <line key={tick} x1={chart.left} x2={chart.left + chart.width} y1={y} y2={y} stroke={gridStroke} />;
          })}
          {styledSeries.map((item) => {
            const isSeriesActive = runtimeContractMatches(animation, item.name);
            const isPointActive = activePointIndex >= 0;
            const isActive = isSeriesActive || isPointActive;
            const hasActive = animation.active;
            return (
              <path key={item.name} className="chart-line" d={pathFor(item.values)} fill="none" stroke={isSeriesActive ? animation.accent : item.color} strokeWidth={isActive ? 5.2 + emphasisEase * 1.1 : 5} strokeLinecap="round" strokeLinejoin="round" opacity={hasActive && !isActive ? animation.mutedOpacity : 1} filter={isActive ? animation.glow : `drop-shadow(0 0 18px ${item.color}44)`} />
            );
          })}
          {activePointIndex >= 0 ? styledSeries.map((item) => {
            const point = pointsFor(item.values)[activePointIndex];
            if (!point) return null;
            const isSeriesActive = runtimeContractMatches(animation, item.name);
            return (
              <g key={`${item.name}-active-${activePointIndex}`} opacity={isSeriesActive || !runtimeContractMatches(animation, item.name) ? 1 : 0.72}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={8}
                  fill="none"
                  stroke={isSeriesActive ? animation.accent : item.color}
                  strokeWidth={2.2 + emphasisEase * 2.6}
                  filter={animation.glow}
                />
                <line
                  x1={point.x}
                  x2={point.x}
                  y1={chart.top}
                  y2={chart.top + chart.height}
                  stroke={guideStroke}
                  strokeWidth={1.2}
                  strokeDasharray="4 6"
                />
              </g>
            );
          }) : null}
          {labels.map((label, index) => (
            index % Math.max(1, Math.ceil(labels.length / 8)) === 0 || index === labels.length - 1 ? (
              <text key={`${label}-${index}`} data-dm-text-editable x={chart.left + (index / Math.max(1, labels.length - 1)) * chart.width} y={chart.top + chart.height + 34} textAnchor="middle" fontSize={14} fontWeight={820} fill={runtimeContractMatches(animation, label) ? animation.accent : muted}>
                {truncate(label, 10)}
              </text>
            ) : null
          ))}
          {styledSeries.map((item, seriesIndex) => {
            const lastValue = item.values[item.values.length - 1];
            const point = pointsFor(item.values)[item.values.length - 1];
            const isActive = runtimeContractMatches(animation, item.name);
            return (
              <text key={`${item.name}-value`} x={point.x + 10} y={point.y + (seriesIndex === 0 ? -12 : 22)} fontSize={13} fontWeight={860} fill={isActive ? animation.accent : item.color} opacity={ease(frame, [62, 82], [0, runtimeContractOpacity(animation, isActive, 0.8)])}>
                {formatCompact(lastValue, item.name)}
              </text>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
