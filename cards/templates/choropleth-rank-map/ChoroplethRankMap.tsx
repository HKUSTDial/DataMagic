import React from 'react';
import {geoNaturalEarth1, geoPath} from 'd3-geo';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import world from './world-110m.json';
import {EntityIcon} from '../../src/entityVisuals';

type RegionValue = {code: string; label: string; value: number; iconSrc?: string};
export type ChoroplethRankMapProps = {
  title: string;
  subtitle: string;
  regions: RegionValue[];
  unit: string;
  takeaway: string;
  source: string;
  accentColor: string;
  fontFamily?: string;
};

const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
const mapBox: [[number, number], [number, number]] = [[70, 225], [1435, 895]];

export const ChoroplethRankMap: React.FC<ChoroplethRankMapProps> = props => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, durationInFrames: Math.round(.7 * fps), config: {damping: 180}});
  const projection = geoNaturalEarth1().fitExtent(mapBox, world as never);
  const path = geoPath(projection);
  const values = new Map(props.regions.map(item => [item.code, item]));
  const max = Math.max(...props.regions.map(item => item.value));
  const ordered = [...props.regions].sort((a, b) => b.value - a.value);

  return <AbsoluteFill style={{backgroundColor: '#f5f7fa', color: '#131b24', fontFamily: props.fontFamily ?? fontFamily, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #eef4f8 52%, #f7f9fb 100%)'}} />
    <div style={{position: 'absolute', left: 76, top: 58, right: 76, opacity: intro}}>
      <div style={{color: props.accentColor, fontSize: 18, fontWeight: 700}}>GEOGRAPHIC DISTRIBUTION</div>
      <h1 style={{margin: '14px 0 8px', fontSize: 58, lineHeight: 1.1, letterSpacing: 0}}>{props.title}</h1>
      <p style={{margin: 0, color: '#687686', fontSize: 22}}>{props.subtitle}</p>
    </div>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id="map-shadow"><feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#334155" floodOpacity=".13" /></filter>
      </defs>
      <g filter="url(#map-shadow)">
        {(world as any).features.map((feature: any) => {
          const code = String(feature.properties.ADM0_A3 || feature.properties.ISO_A3 || '');
          const datum = values.get(code);
          const rankIndex = datum ? ordered.findIndex(item => item.code === code) : -1;
          const regionIn = datum ? spring({frame: frame - Math.round((.75 + rankIndex * .18) * fps), fps, durationInFrames: Math.round(.7 * fps), config: {damping: 170}}) : 0;
          const intensity = datum ? .25 + .75 * datum.value / max : 0;
          return <path key={feature.properties.NE_ID || code} d={path(feature) || undefined} fill={datum ? props.accentColor : '#dfe6ec'} fillOpacity={datum ? intensity * regionIn : .82} stroke="#fff" strokeWidth={datum ? 1.8 : .9} />;
        })}
      </g>
      {props.regions.map((datum, index) => {
        const feature = (world as any).features.find((item: any) => item.properties.ADM0_A3 === datum.code);
        if (!feature) return null;
        const [x, y] = path.centroid(feature);
        const markIn = spring({frame: frame - Math.round((1.1 + index * .18) * fps), fps, durationInFrames: Math.round(.55 * fps), config: {damping: 160}});
        return <g key={datum.code} opacity={markIn}>
          <circle cx={x} cy={y} r={8 + markIn * 5} fill="#fff" stroke={props.accentColor} strokeWidth="5" />
          <circle cx={x} cy={y} r={24} fill="none" stroke={props.accentColor} strokeWidth="2" opacity={.34} />
        </g>;
      })}
    </svg>
    <aside style={{position: 'absolute', right: 70, top: 250, width: 380, padding: '28px 28px 26px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,.95)', border: '1px solid #dce3ea', boxShadow: '0 22px 60px rgba(36,55,75,.14)'}}>
      <div style={{fontSize: 17, color: '#738090'}}>区域排名</div>
      <div style={{marginTop: 22, display: 'grid', gap: 12}}>{ordered.map((item, index) => {
        const itemIn = spring({frame: frame - Math.round((1.15 + index * .16) * fps), fps, durationInFrames: Math.round(.55 * fps), config: {damping: 170}});
        return <div key={item.code} style={{display: 'grid', gridTemplateColumns: '34px 1fr auto', alignItems: 'center', gap: 10, padding: '13px 0', borderBottom: '1px solid #edf0f3', opacity: itemIn, transform: `translateX(${(1 - itemIn) * 18}px)`}}><span style={{fontSize: 15, color: '#8b96a2'}}>#{index + 1}</span><div style={{display: 'flex', alignItems: 'center', gap: 10, minWidth: 0}}><EntityIcon src={item.iconSrc} size={34}/><strong style={{fontSize: 21}}>{item.label}</strong></div><span style={{fontSize: 24, fontWeight: 700, color: index === 0 ? props.accentColor : '#364553'}}>{item.value}{props.unit}</span></div>;
      })}</div>
      <div style={{marginTop: 23, padding: '18px 19px', borderLeft: `5px solid ${props.accentColor}`, backgroundColor: '#f5f8fb', fontSize: 19, lineHeight: 1.48}}>{props.takeaway}</div>
    </aside>
    <div style={{position: 'absolute', left: 76, right: 76, bottom: 39, paddingTop: 16, borderTop: '1px solid #ccd6df', display: 'flex', justifyContent: 'space-between', color: '#758392', fontSize: 15}}><span>来源：{props.source}</span><span>边界底图：Natural Earth 1:110m · 数值层独立可编辑</span></div>
  </AbsoluteFill>;
};
