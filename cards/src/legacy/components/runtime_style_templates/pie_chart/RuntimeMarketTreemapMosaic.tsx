import {RuntimeEntitySvgLabel} from '../runtimeEntityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {
  firstString,
  paletteFor,
  runtimeAnimationContract,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimePoints,
  slotTitle,
  trimNumber,
  truncate,
  type RuntimeStyleTemplateProps,
} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const cl = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

type Tile = {label: string; value: number; displayValue?: string; color: string; x: number; y: number; w: number; h: number; isHero: boolean};

const layoutTreemap = (
  items: Array<{label: string; value: number; displayValue?: string; color: string}>,
): Tile[] => {
  const geometry = [
    {x: 92, y: 142, w: 454, h: 264},
    {x: 562, y: 142, w: 292, h: 264},
    {x: 870, y: 142, w: 318, h: 152},
    {x: 870, y: 310, w: 150, h: 200},
    {x: 1036, y: 310, w: 152, h: 200},
  ];
  return items.slice(0, geometry.length).map((item, index) => ({
    ...item,
    ...geometry[index],
    isHero: index === 0,
  }));
};

export const MarketTreemapMosaicDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('tile', scene, rawFrame, 30);
  const palette = paletteFor(sceneContent, false);
  const rows = runtimePoints(sceneContent, scene).filter((row) => row.value > 0).slice(0, 5);
  const title = slotTitle(sceneContent);
  if (!rows.length || !title) return null;

  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  const items = rows.map((row, index) => ({label: row.label, value: row.value, displayValue: row.displayValue, color: firstString(row.color, palette[index % palette.length])}));
  const tiles = layoutTreemap(items);

  return (
    <AbsoluteFill style={{background: '#111827', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #111827 0%, #1f2937 54%, #0f172a 100%)'}} />
      <EditableTransform id="mtm-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 92, top: 64, width: 980, fontSize: 42, fontWeight: 890, letterSpacing: 0, color: '#ffffff', opacity: cl(frame, [0, 18], [0, 1]), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="mtm-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="runtimeTreemapShade" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#000000" />
            </linearGradient>
          </defs>
          {tiles.map((tile, index) => {
            const share = (tile.value / total) * 100;
            const reveal = cl(frame, [12 + index * 3, 36 + index * 3], [0, 1]);
            const cx = tile.x + tile.w / 2;
            const cy = tile.y + tile.h / 2;
            const isActive = runtimeContractMatches(animation, tile.label);
            const opacity = runtimeContractOpacity(animation, isActive);
            const displayValue = tile.displayValue || `${trimNumber(share, 1)}%`;
            const shareText = `${trimNumber(share, 1)}%`;
            const valueText = displayValue === shareText ? shareText : `${displayValue} · ${shareText}`;
            const pad = 20;
            const availW = tile.w - pad * 2;
            const percentFs = Math.min(52, Math.floor(availW / Math.max(1, valueText.length * 0.56)));
            const labelFs = Math.min(20, Math.floor(availW / Math.max(1, tile.label.length * 0.7)));
            const showValue = percentFs >= 14 && tile.h > 64;
            const showLabel = labelFs >= 11 && tile.h > 86;
            return (
              <g key={`${tile.label}-${index}`} opacity={reveal * opacity} transform={`translate(${cx} ${cy}) scale(${0.88 + reveal * 0.12}) translate(${-cx} ${-cy})`}>
                <rect
                  x={tile.x}
                  y={tile.y}
                  width={Math.max(2, tile.w)}
                  height={Math.max(2, tile.h)}
                  rx={24}
                  fill={tile.color}
                  opacity={0.92}
                  stroke={isActive || tile.isHero ? '#ff6b6b' : 'rgba(255,255,255,0.10)'}
                  strokeWidth={isActive || tile.isHero ? 4 : 1}
                  filter={isActive ? animation.glow : tile.isHero ? 'drop-shadow(0 0 12px rgba(255,107,107,0.45))' : undefined}
                />
                <rect x={tile.x + 1} y={tile.y + 1} width={Math.max(2, tile.w - 2)} height={Math.max(2, tile.h - 2)} rx={23} fill="url(#runtimeTreemapShade)" opacity={0.28} />
                <clipPath id={`runtime-tile-clip-${index}`}>
                  <rect x={tile.x} y={tile.y} width={Math.max(2, tile.w)} height={Math.max(2, tile.h)} rx={24} />
                </clipPath>
                <g clipPath={`url(#runtime-tile-clip-${index})`}>
                {showLabel ? (
                  <>
                    <RuntimeEntitySvgLabel data-dm-text-editable x={tile.x + pad} y={tile.y + pad + labelFs} fontSize={labelFs} fontWeight={880} fill="#ffffff" style={{pointerEvents: 'none'}} sceneContent={sceneContent} label={tile.label}>{truncate(tile.label, Math.max(6, Math.floor(tile.w / 11)))}</RuntimeEntitySvgLabel>
                    {showValue ? (
                    <text data-dm-text-editable x={tile.x + pad} y={tile.y + tile.h - pad} fontSize={percentFs} fontWeight={920} fill="#ffffff" style={{pointerEvents: 'none'}}>
                      {valueText}
                    </text>
                    ) : null}
                  </>
                ) : null}
                </g>
              </g>
            );
          })}
        </svg>
      </EditableTransform>
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 38,
        margin: '0 auto',
        width: 420,
        height: 40,
        borderRadius: 999,
        border: '1px solid rgba(148,163,184,0.32)',
        color: 'rgba(255,255,255,0.88)',
        display: 'grid',
        placeItems: 'center',
        fontSize: 13,
        fontWeight: 640,
        letterSpacing: 0,
        opacity: cl(frame, [42, 62], [0, 1]),
      }}>
        Share distribution by category
      </div>
    </AbsoluteFill>
  );
};
