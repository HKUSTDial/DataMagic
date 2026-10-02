import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {ease} from '../../style_templates/shared';
import {formatCompact, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimeCards, slotTitle, truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

export const LightHeroNumberDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('stat', scene, rawFrame, 30);
  const cards = runtimeCards(sceneContent, scene);
  const hero = cards[0];
  const secondary = cards[1];
  const tertiary = cards[2];
  const title = slotTitle(sceneContent) || hero?.label || '';
  if (!hero || !title) return null;
  const heroActive = runtimeContractMatches(animation, hero.label, title);
  const heroEmphasis = runtimeContractEase(animation);
  const heroOpacity = runtimeContractOpacity(animation, heroActive, 1);

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a'}}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 60% 40%, rgba(219,234,254,0.7), transparent 55%), linear-gradient(145deg, #ffffff 0%, #eff6ff 55%, #f8fafc 100%)',
      }} />

      {/* Subtle top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #2563eb, #60a5fa, transparent)',
        opacity: ease(frame, [0, 16], [0, 1]),
      }} />

      {/* Card */}
      <div style={{
        position: 'absolute', left: 240, top: 140, width: 800, height: 360,
        borderRadius: 28,
        background: 'rgba(255,255,255,0.95)',
        border: heroActive ? `2px solid ${animation.accent}` : '1px solid rgba(148,163,184,0.12)',
        boxShadow: heroActive ? `0 24px 64px rgba(37,99,235,0.10), ${animation.glow}, 0 0 0 ${6 + heroEmphasis * 6}px rgba(37,99,235,0.12)` : '0 24px 64px rgba(37,99,235,0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
        opacity: ease(frame, [0, 20], [0, 1]),
        transform: `translateY(${(1 - ease(frame, [0, 24], [0, 1])) * 14}px)`,
      }}>
        {heroActive ? <div style={{position: 'absolute', left: 38, top: 76, width: 360, height: 174, borderRadius: 24, background: `rgba(37,99,235,${0.06 + heroEmphasis * 0.05})`, filter: 'blur(1px)'}} /> : null}

        <EditableTransform id="lhn-label" role="annotation" style={{display: 'block'}}>
          <div data-dm-text-editable style={{
            position: 'absolute', left: 60, top: 52,
            fontSize: 12, fontWeight: 860, letterSpacing: '0.22em',
            textTransform: 'uppercase' as const,
            color: '#2563eb',
            opacity: ease(frame, [8, 26], [0, heroOpacity]),
          }}>
            {truncate(title, 60)}
          </div>
        </EditableTransform>

        <EditableTransform id="lhn-number" role="metric" style={{display: 'block'}}>
          <div data-dm-text-editable style={{
            position: 'absolute', left: 60, top: 90,
            fontSize: 120, lineHeight: 1, fontWeight: 900,
            letterSpacing: '-0.05em',
            color: heroActive ? animation.accent : '#0f172a',
            opacity: ease(frame, [12, 36], [0, heroOpacity]),
            filter: heroActive ? animation.glow : undefined,
            transform: `scale(${heroActive ? 1 + heroEmphasis * 0.018 : 1})`,
            transformOrigin: 'left center',
          }}>
            {hero.displayValue || formatCompact(hero.value, hero.label)}
          </div>
        </EditableTransform>

        {/* Blue underline accent */}
        <div style={{
          position: 'absolute', left: 60, top: 230,
          width: 280 * ease(frame, [28, 50], [0, 1]),
          height: 4, borderRadius: 2,
          background: 'linear-gradient(90deg, #2563eb, #93c5fd)',
        }} />

        <EditableTransform id="lhn-subtitle" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{
            position: 'absolute', left: 60, top: 260,
            width: 620,
            fontSize: 20, lineHeight: 1.5, fontWeight: 450,
            color: '#64748b',
            opacity: ease(frame, [36, 58], [0, 1]),
          }}>
            {truncate(hero.subtitle || sceneContent?.description || '', 78)}
          </div>
        </EditableTransform>

        {/* Secondary stats */}
        <div style={{
          position: 'absolute', right: 60, top: 96,
          width: 190,
          display: 'grid',
          gap: 20,
          opacity: ease(frame, [32, 52], [0, 1]),
        }}>
          {[secondary, tertiary].filter(Boolean).map((card, index) => {
            const isActive = runtimeContractMatches(animation, card?.label);
            const itemOpacity = runtimeContractOpacity(animation, isActive, 1);
            return (
            <div
              key={card?.label || index}
              style={{
                textAlign: 'right',
                borderRadius: 14,
                padding: isActive ? '10px 12px' : 0,
                margin: isActive ? '-10px -12px 0 0' : 0,
                background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                opacity: itemOpacity,
                boxShadow: isActive ? `0 10px 26px rgba(37,99,235,${0.10 + heroEmphasis * 0.08})` : 'none',
                paddingBottom: index === 0 && tertiary ? 18 : 0,
                borderBottom: index === 0 && tertiary ? '1px solid rgba(148,163,184,0.24)' : 'none',
              }}
            >
              <div data-dm-text-editable style={{fontSize: 11, fontWeight: 860, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#94a3b8', marginBottom: 8}}>
                {truncate(card?.label || '', 18)}
              </div>
              <div data-dm-text-editable style={{fontSize: 34, fontWeight: 900, letterSpacing: 0, color: isActive ? animation.accent : index === 0 ? '#10b981' : '#2563eb'}}>
                {card ? card.displayValue || card.subtitle || formatCompact(card.value, card.label) : ''}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
