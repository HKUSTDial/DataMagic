import React from 'react';
import {geoInterpolate, geoNaturalEarth1, geoPath} from 'd3-geo';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import world from './world-110m.json';

type Coordinate = [number, number];
type Route = {label: string; destination: Coordinate; value: number; color: string};
export type MapRouteAccumulationProps = {
  title: string;
  subtitle: string;
  origin: {label: string; coordinate: Coordinate};
  routes: Route[];
  unit: string;
  takeaway: string;
  source: string;
};

const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
const mapBox: [[number, number], [number, number]] = [[55, 225], [1490, 930]];

const routePath = (projection: ReturnType<typeof geoNaturalEarth1>, from: Coordinate, to: Coordinate) => {
  const interpolateGeo = geoInterpolate(from, to);
  const coordinates = Array.from({length: 42}, (_, index) => interpolateGeo(index / 41));
  // Let d3-geo clip and split the line at the antimeridian. Projecting points
  // first would connect +180 and -180 with an invalid line across the frame.
  return geoPath(projection)({type: 'LineString', coordinates} as never) || '';
};

export const MapRouteAccumulation: React.FC<MapRouteAccumulationProps> = props => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, durationInFrames: Math.round(.7 * fps), config: {damping: 180}});
  const projection = geoNaturalEarth1().fitExtent(mapBox, world as never);
  const path = geoPath(projection);
  const originPoint = projection(props.origin.coordinate) as [number, number];
  const routeProgress = props.routes.map((_, index) => interpolate(frame, [fps * (1 + index * .7), fps * (2.5 + index * .7)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}));
  const cumulative = props.routes.reduce((sum, route, index) => sum + route.value * routeProgress[index], 0);
  const maxTotal = props.routes.reduce((sum, route) => sum + route.value, 0);

  return <AbsoluteFill style={{backgroundColor: '#0b1420', color: '#f7fbff', fontFamily, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 45% 45%, rgba(28,80,112,.34), transparent 55%)'}} />
    <div style={{position: 'absolute', left: 76, top: 58, right: 76, opacity: intro}}><div style={{color: '#57d6c7', fontSize: 18, fontWeight: 700}}>FLOW ACROSS GEOGRAPHY</div><h1 style={{margin: '14px 0 8px', fontSize: 58, lineHeight: 1.1, letterSpacing: 0}}>{props.title}</h1><p style={{margin: 0, color: '#94a5b7', fontSize: 22}}>{props.subtitle}</p></div>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      <g>{(world as any).features.map((feature: any) => <path key={feature.properties.NE_ID} d={path(feature) || undefined} fill="#182737" stroke="#314356" strokeWidth=".9" />)}</g>
      {props.routes.map((route, index) => {
        const d = routePath(projection, props.origin.coordinate, route.destination);
        const end = projection(route.destination) as [number, number];
        const head = projection(geoInterpolate(props.origin.coordinate, route.destination)(routeProgress[index])) as [number, number];
        return <g key={route.label}>
          <path d={d} fill="none" stroke={route.color} strokeWidth={7} opacity={.9} pathLength={1} strokeDasharray={`${routeProgress[index]} 1`} strokeLinecap="round" />
          <circle cx={head[0]} cy={head[1]} r={8} fill="#fff" stroke={route.color} strokeWidth={5} opacity={routeProgress[index] > 0 && routeProgress[index] < 1 ? 1 : 0} />
          <circle cx={end[0]} cy={end[1]} r={routeProgress[index] * 10} fill={route.color} stroke="#fff" strokeWidth="3" />
        </g>;
      })}
      <circle cx={originPoint[0]} cy={originPoint[1]} r="13" fill="#57d6c7" stroke="#fff" strokeWidth="5" />
      <circle cx={originPoint[0]} cy={originPoint[1]} r="30" fill="none" stroke="#57d6c7" strokeWidth="3" opacity=".45" />
    </svg>
    <div style={{position: 'absolute', left: originPoint[0] + 20, top: originPoint[1] - 50, padding: '9px 13px', borderRadius: 5, backgroundColor: 'rgba(5,13,22,.82)', fontSize: 18, fontWeight: 700}}>{props.origin.label}</div>
    <aside style={{position: 'absolute', right: 68, top: 248, width: 385, padding: '30px', borderRadius: 8, border: '1px solid #314456', backgroundColor: 'rgba(8,18,29,.93)', boxShadow: '0 24px 70px rgba(0,0,0,.3)'}}>
      <div style={{fontSize: 16, color: '#8294a7'}}>累计流量</div><div style={{marginTop: 10, fontSize: 70, lineHeight: 1, fontWeight: 700}}>{Math.round(cumulative).toLocaleString()}<span style={{marginLeft: 7, fontSize: 27, color: '#57d6c7'}}>{props.unit}</span></div>
      <div style={{marginTop: 17, height: 8, borderRadius: 4, backgroundColor: '#263747', overflow: 'hidden'}}><div style={{height: '100%', width: `${cumulative / maxTotal * 100}%`, backgroundColor: '#57d6c7'}} /></div>
      <div style={{marginTop: 29, display: 'grid', gap: 15}}>{props.routes.map((route, index) => <div key={route.label} style={{display: 'grid', gridTemplateColumns: '12px 1fr auto', gap: 11, alignItems: 'center', opacity: .35 + routeProgress[index] * .65}}><span style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: route.color}} /><span style={{fontSize: 18}}>{route.label}</span><strong style={{fontSize: 19}}>{route.value}{props.unit}</strong></div>)}</div>
      <div style={{marginTop: 28, padding: '18px', borderLeft: '5px solid #57d6c7', backgroundColor: '#132332', color: '#cfdae4', fontSize: 19, lineHeight: 1.48}}>{props.takeaway}</div>
    </aside>
    <div style={{position: 'absolute', left: 76, right: 76, bottom: 38, paddingTop: 16, borderTop: '1px solid #304153', display: 'flex', justifyContent: 'space-between', color: '#7f91a4', fontSize: 15}}><span>来源：{props.source}</span><span>边界底图：Natural Earth 1:110m · 路径采用大圆插值</span></div>
  </AbsoluteFill>;
};
