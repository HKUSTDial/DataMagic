import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, paletteFor, runtimeAnimationContract, runtimeCards, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

export const BasicStatCardsDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animation = runtimeAnimationContract('stat', scene, rawFrame, fps ?? 30);
  const emphasis = runtimeContractEase(animation);
  const palette = paletteFor(sceneContent, true);
  const cards = runtimeCards(sceneContent, scene).slice(0, 4).map((card, index) => ({
    ...card,
    color: card.color || palette[index % palette.length],
  }));
  const title = slotTitle(sceneContent);
  if (!cards.length || !title) return null;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#f8fafc', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #111827 52%, #020617 100%)'}} />
      <EditableTransform id="runtime-basic-stat-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 92, top: 76, width: 820, fontSize: 44, lineHeight: 1.04, fontWeight: 880, letterSpacing: '-0.04em', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-basic-stat-cards" role="group" style={{display: 'block'}}>
        <div style={{position: 'absolute', left: 92, top: 210, width: 1096, display: 'grid', gridTemplateColumns: `repeat(${Math.min(cards.length, 4)}, 1fr)`, gap: 22}}>
          {cards.map((card, index) => {
            const reveal = ease(frame, [18 + index * 7, 48 + index * 7], [0, 1]);
            const isActive = runtimeContractMatches(animation, card.label);
            return (
              <div key={`${card.label}-${index}`} style={{height: 250, borderRadius: 24, background: isActive ? `rgba(255,255,255,${0.12 + emphasis * 0.05})` : 'rgba(255,255,255,0.08)', border: `1px solid ${isActive ? animation.accent : 'rgba(255,255,255,0.14)'}`, boxShadow: isActive ? animation.glow : '0 24px 62px rgba(0,0,0,0.26)', padding: 26, boxSizing: 'border-box', opacity: reveal * runtimeContractOpacity(animation, isActive), transform: `translateY(${(1 - reveal) * 16}px)`}}>
                <div style={{width: 42, height: 6, borderRadius: 999, background: isActive ? animation.accent : card.color, marginBottom: 30}} />
                <div data-dm-text-editable style={{fontSize: 13, fontWeight: 850, letterSpacing: '0.16em', textTransform: 'uppercase', color: isActive ? '#ffffff' : '#cbd5e1', marginBottom: 18}}>
                  {truncate(card.label, 18)}
                </div>
                <div data-dm-text-editable style={{fontSize: cards.length > 3 ? 42 : 50, lineHeight: 1, fontWeight: 920, letterSpacing: '-0.05em', color: isActive ? animation.accent : '#ffffff', marginBottom: 16}}>
                  {card.displayValue || formatCompact(card.value, card.label)}
                </div>
                {card.subtitle ? (
                  <div data-dm-text-editable style={{fontSize: 15, lineHeight: 1.25, fontWeight: 720, color: '#94a3b8'}}>
                    {truncate(card.subtitle, 34)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
