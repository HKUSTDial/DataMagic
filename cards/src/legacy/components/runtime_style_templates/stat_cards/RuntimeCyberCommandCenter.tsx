import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimeCards, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const CyberCommandCenterDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('stat', scene, rawFrame, 30);
  const cards = runtimeCards(sceneContent, scene);
  const palette = paletteFor(sceneContent, true);
  const title = slotTitle(sceneContent);
  const hero = cards[0];
  if (!cards.length || !hero || !title) return null;
  const positions = [
    {x: 240, y: 248},
    {x: 474, y: 178},
    {x: 706, y: 276},
    {x: 530, y: 462},
    {x: 940, y: 398},
  ];
  const nodes = cards.slice(0, positions.length).map((card, index) => {
    const node = positions[index];
    return {
      ...node,
      label: card.label,
      value: card.displayValue || formatCompact(card.value, card.label),
      color: card.color || palette[index % palette.length],
    };
  });
  const pulse = 0.65 + Math.sin(frame / 8) * 0.18;
  const health = hero.displayValue || formatCompact(hero.value, hero.label);
  const emphasis = runtimeContractEase(animation);
  const heroActive = runtimeContractMatches(animation, hero.label, title);
  const heroOpacity = runtimeContractOpacity(animation, heroActive, 1);

  return (
    <AbsoluteFill style={{background: '#050914', color: '#dff7ff', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #050914 0%, #071426 52%, #050914 100%)'}} />
      <div style={{position: 'absolute', inset: 0, opacity: 0.22, backgroundImage: 'linear-gradient(rgba(34,211,238,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.18) 1px, transparent 1px)', backgroundSize: '38px 38px'}} />
      <EditableTransform id="runtime-cyber-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 80, top: 58, width: 660, fontSize: 43, lineHeight: 1.06, fontWeight: 900, letterSpacing: 0, color: '#e0faff', opacity: ease(frame, [0, 20], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', right: 82, top: 64, display: 'grid', gridTemplateColumns: 'repeat(3, 122px)', gap: 10}}>
        {cards.slice(0, 3).map((card, index) => {
          const isActive = runtimeContractMatches(animation, card.label);
          const itemOpacity = runtimeContractOpacity(animation, isActive, 1);
          return (
          <div key={`${card.label}-${index}`} style={{border: isActive ? `1px solid ${animation.accent}` : '1px solid rgba(34,211,238,0.35)', background: isActive ? 'rgba(34,211,238,0.14)' : 'rgba(8,19,37,0.72)', borderRadius: 8, padding: '12px 10px', color: isActive ? animation.accent : index === 2 ? '#fbbf24' : '#a5f3fc', fontSize: 13, fontWeight: 850, textAlign: 'center', opacity: ease(frame, [8 + index * 5, 28 + index * 5], [0, itemOpacity]), boxShadow: isActive ? `${animation.glow}, 0 0 0 ${2 + emphasis * 3}px rgba(34,211,238,0.12)` : 'none'}}>
            <span data-dm-text-editable>{truncate(`${card.label} ${card.displayValue || formatCompact(card.value, card.label)}`, 22)}</span>
          </div>
          );
        })}
      </div>
      <EditableTransform id="runtime-cyber-network-chart" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {nodes.flatMap((a, i) => nodes.slice(i + 1).map((b) => (
            <line key={`${a.label}-${b.label}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(34,211,238,0.16)" strokeWidth={1.5} />
          )))}
          {nodes.map((node, index) => {
            const p = ease(frame, [16 + index * 8, 42 + index * 8], [0, 1]);
            const isActive = runtimeContractMatches(animation, node.label);
            const nodeOpacity = runtimeContractOpacity(animation, isActive, 1);
            const color = isActive ? animation.accent : node.color;
            return (
              <g key={`${node.label}-${index}`} opacity={p * nodeOpacity}>
                {isActive ? <circle cx={node.x} cy={node.y} r={72 + emphasis * 10} fill="none" stroke={animation.accent} strokeWidth={2} opacity={0.38 + emphasis * 0.24} filter={animation.glow} /> : null}
                <circle cx={node.x} cy={node.y} r={(isActive ? 54 : 44) + pulse * 10} fill={color} opacity={isActive ? 0.16 : 0.08} />
                <circle cx={node.x} cy={node.y} r={isActive ? 29 : 24} fill="#071426" stroke={color} strokeWidth={isActive ? 5 : 4} filter={isActive ? animation.glow : undefined} />
                <circle cx={node.x} cy={node.y} r={7} fill={color} />
                <text data-dm-text-editable x={node.x} y={node.y + 58} textAnchor="middle" fontSize={15} fontWeight={isActive ? 950 : 850} fill="#dff7ff">{truncate(node.label, 14)}</text>
                <text data-dm-text-editable x={node.x} y={node.y + 80} textAnchor="middle" fontSize={13} fontWeight={850} fill={color}>{truncate(node.value, 12)}</text>
              </g>
            );
          })}
          {heroActive ? <circle cx={640} cy={408} r={134 + emphasis * 8} fill="none" stroke={animation.accent} strokeWidth={2} opacity={0.36 + emphasis * 0.22} filter={animation.glow} /> : null}
          <circle cx={640} cy={408} r={118} fill="none" stroke={heroActive ? animation.accent : 'rgba(34,211,238,0.22)'} strokeWidth={heroActive ? 3 : 2} strokeDasharray="10 12" transform={`rotate(${frame * 0.8} 640 408)`} opacity={heroOpacity} />
          <text data-dm-text-editable x={640} y={410} textAnchor="middle" fontSize={health.length > 8 ? 44 : 60} fontWeight={920} fill={heroActive ? animation.accent : '#ffffff'} opacity={heroOpacity} filter={heroActive ? animation.glow : undefined}>{truncate(health, 12)}</text>
          <text data-dm-text-editable x={640} y={450} textAnchor="middle" fontSize={14} fontWeight={900} fill={heroActive ? '#dff7ff' : '#67e8f9'} letterSpacing={0} opacity={heroOpacity}>{truncate(hero.label.toUpperCase(), 24)}</text>
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
