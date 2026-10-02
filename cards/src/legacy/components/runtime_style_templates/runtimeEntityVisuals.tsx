import React from 'react';
import {Img, staticFile} from 'remotion';

export function placeScatterIdentityLabels(points: {label:string;x:number;y:number;radius:number}[], maxChars=16, font=13) {
  const placed: {left:number;right:number;top:number;bottom:number}[] = [];
  return points.map((point,index)=>{
    const width=Math.min(maxChars,Array.from(point.label).length)*font*.6+36;
    const candidates=[
      {x:point.x+point.radius+8,y:point.y-8,anchor:'start' as const},
      {x:point.x-point.radius-8,y:point.y-8,anchor:'end' as const},
      {x:point.x,y:point.y+point.radius+30,anchor:'middle' as const},
      {x:point.x,y:point.y-point.radius-14,anchor:'middle' as const},
    ].map(candidate=>{
      const left=candidate.anchor==='start'?candidate.x:candidate.anchor==='end'?candidate.x-width:candidate.x-width/2-12;
      const box={left,right:left+width,top:candidate.y-22,bottom:candidate.y+6};
      let score=(box.left<90||box.right>1190||box.top<140||box.bottom>620)?1000:0;
      for(const [j,other] of points.entries())if(j!==index){
        const dx=other.x-Math.max(box.left,Math.min(box.right,other.x)),dy=other.y-Math.max(box.top,Math.min(box.bottom,other.y));
        if(dx*dx+dy*dy<(other.radius+6)**2)score+=10;
      }
      for(const other of placed)if(box.left<other.right&&box.right>other.left&&box.top<other.bottom&&box.bottom>other.top)score+=20;
      return {...candidate,box,score};
    });
    candidates.sort((a,b)=>a.score-b.score);placed.push(candidates[0].box);return candidates[0];
  });
}

// Explicit, exact-label assets only: never guess a national flag or a brand mark.
export const runtimeEntityIcon = (sceneContent: any, label: string): string | undefined => {
  const explicit = sceneContent?.entity_icons?.[label];
  if (typeof explicit === 'string' && explicit) return explicit;
  const payload = sceneContent?.template_payload;
  const rows = [payload?.items, payload?.rows, payload?.cards, payload?.series, sceneContent?.data].flatMap((value) => Array.isArray(value) ? value : []);
  const entity = rows.find((row: any) => row?.label === label || row?.name === label);
  return typeof entity?.iconSrc === 'string' && entity.iconSrc ? entity.iconSrc : undefined;
};

const source = (src: string) => /^(https?:|data:|blob:)/.test(src) ? src : staticFile(src.replace(/^\//, ''));
const badge = (src: string): React.CSSProperties => src.includes('/brands/') ? {background:'#ffffff', borderRadius:5, padding:3, boxSizing:'border-box'} : {};

export const RuntimeEntityLabel: React.FC<{sceneContent: any; label: string; children?: React.ReactNode; size?: number}> = ({sceneContent, label, children, size = 26}) => {
  const src = runtimeEntityIcon(sceneContent, label);
  if (!src) return <>{children ?? label}</>;
  return <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, verticalAlign: 'middle', maxWidth: '100%'}}>
    <Img src={source(src)} style={{width: size, height: size, objectFit: 'contain', flexShrink: 0, ...badge(src)}} />
    <span>{children ?? label}</span>
  </span>;
};

export const RuntimeEntitySvgLabel: React.FC<React.SVGProps<SVGTextElement> & {sceneContent: any; label: string}> = ({sceneContent, label, children, ...props}) => {
  const src = runtimeEntityIcon(sceneContent, label);
  if (!src) return <text {...props}>{children ?? label}</text>;
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const font = Number(props.fontSize ?? 16);
  const size = Math.max(20, Math.min(28, font * 1.5));
  const display = typeof children === 'string' ? children : label;
  const width = Array.from(display).reduce((sum, ch) => sum + (/[\u4e00-\u9fff]/.test(ch) ? font : font * 0.56), 0);
  const anchor = props.textAnchor ?? 'start';
  const iconX = anchor === 'end' ? x - width - size - 8 : anchor === 'middle' ? x - width / 2 - size - 8 : x;
  return <g opacity={props.opacity}>
    <foreignObject x={iconX} y={y - font * 0.8 - (size - font) / 2} width={size} height={size}>
      <Img src={source(src)} style={{width: size, height: size, objectFit: 'contain', ...badge(src)}} />
    </foreignObject>
    <text {...props} opacity={1} x={anchor === 'start' ? x + size + 8 : props.x}>{children ?? label}</text>
  </g>;
};
