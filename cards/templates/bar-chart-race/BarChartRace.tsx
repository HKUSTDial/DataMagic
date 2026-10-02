import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {createRaceFrame, formatRaceValue} from './model';

type Entity = {id: string; label: string; color: string; iconSrc?: string};
type Snapshot = {time: string; values: Record<string, number>};

export type BarChartRaceProps = {
  title: string;
  subtitle: string;
  unit: string;
  source: string;
  topN: number;
  decimals: number;
  locale: string;
  entities: Entity[];
  snapshots: Snapshot[];
  highlightId?: string;
  fontFamily?: string;
};

const fontFamily = 'Inter, "Noto Sans SC", sans-serif';

export const BarChartRace: React.FC<BarChartRaceProps> = props => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const introFrames = Math.round(0.75 * fps);
  const finalHoldFrames = Math.round(1.6 * fps);
  const raceProgress = interpolate(
    frame,
    [introFrames, durationInFrames - finalHoldFrames],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear},
  );
  const state = createRaceFrame(props, raceProgress);
  const entrance = spring({frame, fps, config: {damping: 200}, durationInFrames: introFrames});
  const chartTop = 238;
  const rowHeight = 88;
  const rankLeft = 76;
  const labelLeft = 150;
  const barLeft = 404;
  const barMaxWidth = 1040;
  const yearPanelLeft = 1534;
  const accent = '#14b8a6';

  return (
    <AbsoluteFill style={{backgroundColor: '#f4f7f9', color: '#172126', fontFamily: props.fontFamily ?? fontFamily, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 76, right: 76, top: 58, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: entrance}}>
        <div style={{maxWidth: 1180}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, color: '#087f72', fontSize: 21, lineHeight: 1.2, fontWeight: 700}}>
            <span style={{width: 36, height: 5, backgroundColor: accent, display: 'inline-block'}} />
            DATAMAGIC CARDS · ADVANCED SERIES
          </div>
          <h1 style={{fontSize: 58, lineHeight: 1.12, margin: '18px 0 8px', fontWeight: 700, letterSpacing: 0}}>{props.title}</h1>
          <p style={{margin: 0, color: '#617078', fontSize: 23, lineHeight: 1.5}}>{props.subtitle}</p>
        </div>
        <div style={{borderLeft: '1px solid #cbd5da', paddingLeft: 28, marginTop: 12, width: 265}}>
          <div style={{color: '#78868d', fontSize: 16}}>当前领先</div>
          <div style={{marginTop: 8, fontSize: 26, fontWeight: 700, color: state.leader.color}}>{state.leader.label}</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 76, right: 76, top: 222, height: 1, backgroundColor: '#d9e1e5'}} />

      {state.rows.map(row => {
        const width = Math.max(3, (row.value / state.maxValue) * barMaxWidth);
        const y = chartTop + row.rank * rowHeight;
        const valueLeft = Math.min(barLeft + width + 18, yearPanelLeft - 145);
        const rankNumber = row.displayRank + 1;
        const rankTone = row.rankDelta > 0 ? '#0f9f82' : row.rankDelta < 0 ? '#e05d48' : '#7b8990';
        const highlighted = props.highlightId === row.id;
        const iconSrc = row.iconSrc ? (/^(https?:|data:|blob:)/.test(row.iconSrc) ? row.iconSrc : staticFile(row.iconSrc)) : undefined;
        return (
          <div key={row.id} style={{position: 'absolute', left: 0, top: 0, zIndex: props.entities.length - row.displayRank, width: '100%', height: rowHeight - 10, transform: `translateY(${y}px)`, opacity: row.opacity * entrance}}>
            <div style={{position: 'absolute', left: rankLeft - 8, top: 13, width: 58, padding: '7px 8px', backgroundColor: 'rgba(244,247,249,.94)', color: rankNumber <= 3 ? '#172126' : '#829097', fontSize: 24, fontWeight: 700, textAlign: 'right', opacity: row.contentOpacity}}>{String(rankNumber).padStart(2, '0')}</div>
            <div style={{position: 'absolute', left: labelLeft - 8, top: 8, width: 234, padding: '5px 8px', backgroundColor: 'rgba(244,247,249,.94)', display: 'flex', alignItems: 'center', gap: 12, opacity: row.contentOpacity}}>
              {iconSrc ? <Img src={iconSrc} style={{width: 56, height: 56, objectFit: 'contain', flexShrink: 0}} /> : <span style={{width: 12, height: 44, backgroundColor: row.color, display: 'inline-block', flexShrink: 0}} />}
              <div>
                <div style={{fontSize: 25, fontWeight: 700, whiteSpace: 'nowrap'}}>{row.label}</div>
                <div style={{fontSize: 14, marginTop: 4, color: rankTone}}>{row.rankDelta > 0 ? `↑ 上升 ${row.rankDelta}` : row.rankDelta < 0 ? `↓ 下降 ${Math.abs(row.rankDelta)}` : '— 排名稳定'}</div>
              </div>
            </div>
            <div style={{position: 'absolute', left: barLeft, top: 14, width: barMaxWidth, height: 52, backgroundColor: '#e7edf0'}} />
            <div style={{position: 'absolute', left: barLeft, top: 14, width, height: 52, backgroundColor: row.color, opacity: props.highlightId && !highlighted ? 0.72 : 1, boxShadow: highlighted || rankNumber === 1 ? `0 9px 22px ${row.color}38` : 'none', outline: highlighted ? `2px solid ${row.color}` : undefined, outlineOffset: highlighted ? 3 : undefined}}>
              <span style={{position: 'absolute', right: 0, top: 0, width: 5, height: '100%', backgroundColor: 'rgba(255,255,255,.72)'}} />
            </div>
            <div style={{position: 'absolute', left: valueLeft - 5, top: 13, padding: '5px', backgroundColor: 'rgba(244,247,249,.9)', color: '#172126', fontSize: 25, fontWeight: 700, whiteSpace: 'nowrap', opacity: row.contentOpacity}}>
              {formatRaceValue(row.value, props.locale, props.decimals)}
            </div>
          </div>
        );
      })}

      <div style={{position: 'absolute', left: yearPanelLeft, top: 310, width: 310, height: 342, borderLeft: '1px solid #cbd5da', paddingLeft: 40}}>
        <div style={{fontSize: 18, color: '#718087'}}>时间节点</div>
        <div style={{fontSize: 96, lineHeight: 1, fontWeight: 700, color: '#172126', marginTop: 14}}>{state.time}</div>
        <div style={{marginTop: 34, width: 220, height: 6, backgroundColor: '#dce4e8'}}>
          <div style={{height: '100%', width: `${state.progress * 100}%`, backgroundColor: accent}} />
        </div>
        <div style={{fontSize: 16, color: '#718087', marginTop: 14}}>已完成 {Math.round(state.progress * 100)}%</div>
        <div style={{marginTop: 50, paddingTop: 20, borderTop: '1px solid #d7dfe3'}}>
          <div style={{fontSize: 15, color: '#718087'}}>领先值</div>
          <div style={{fontSize: 34, fontWeight: 700, color: state.leader.color, marginTop: 6}}>{formatRaceValue(state.leader.value, props.locale, props.decimals)} <span style={{fontSize: 17, color: '#718087'}}>{props.unit}</span></div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 76, right: 76, bottom: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#65747b', fontSize: 16}}>
        <div>来源：{props.source}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}><span style={{width: 9, height: 9, backgroundColor: accent, display: 'inline-block'}} />数值、标签与排名均由结构化数据逐帧计算</div>
      </div>
    </AbsoluteFill>
  );
};
