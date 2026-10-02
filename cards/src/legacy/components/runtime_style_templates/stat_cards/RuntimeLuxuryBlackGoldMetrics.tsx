import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {formatCompact, runtimeAnimationContract, runtimeContractEase, runtimeContractMatches, runtimeContractOpacity, runtimeCards, slotTitle, truncate, type RuntimePoint, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {useNarrationSyncedFrame} from '../narrationTiming';

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const normalizeGauge = (card: RuntimePoint | undefined): number => {
  if (!card) return 0;
  const abs = Math.abs(card.value);
  if (abs <= 1) return Math.max(0.08, Math.min(0.98, abs));
  if (abs <= 100) return Math.max(0.08, Math.min(0.98, abs / 100));
  return Math.max(0.08, Math.min(0.98, (abs % 100) / 100 || 0.5));
};

export const LuxuryBlackGoldMetricsDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const animation = runtimeAnimationContract('stat', scene, rawFrame, 30);
  const cards = runtimeCards(sceneContent, scene);
  const hero = cards[0];
  const rows = (cards.length > 1 ? cards.slice(1, 4) : cards.slice(0, 3));
  const progress = ease(frame, [18, 78], [0, 1]);
  const gauge = normalizeGauge(hero);
  const circumference = 2 * Math.PI * 142;
  const title = slotTitle(sceneContent) || hero?.label || '';
  const heroValue = hero?.displayValue || (hero ? formatCompact(hero.value, hero.label) : '');
  const heroLabel = hero?.label || '';
  if (!hero || !title || !heroValue || !heroLabel) return null;
  const heroActive = runtimeContractMatches(animation, heroLabel, title);
  const emphasis = runtimeContractEase(animation);
  const heroOpacity = runtimeContractOpacity(animation, heroActive, 1);

  return (
    <AbsoluteFill style={{background: '#080806', color: '#f8ead0', fontFamily: 'Inter, Helvetica, Arial, sans-serif', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #080806 0%, #18130c 56%, #050505 100%)'}} />
      <EditableTransform id="runtime-black-gold-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 82, top: 68, fontSize: 46, lineHeight: 1.06, fontWeight: 860, letterSpacing: 0, opacity: ease(frame, [0, 22], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <div data-dm-text-editable style={{position: 'absolute', left: 84, top: 138, width: 520, color: '#b99b62', fontSize: 16, lineHeight: 1.35, fontWeight: 720, opacity: ease(frame, [14, 36], [0, 1])}}>
        {truncate(sceneContent?.description || hero.subtitle || '', 112)}
      </div>
      <EditableTransform id="runtime-black-gold-gauge" role="chart" style={{display: 'block'}}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
          {heroActive ? <circle cx={420} cy={392} r={176 + emphasis * 10} fill="none" stroke={animation.accent} strokeWidth={2.5} opacity={0.34 + emphasis * 0.22} filter={animation.glow} /> : null}
          <circle cx={420} cy={392} r={142} fill="none" stroke="rgba(185,155,98,0.18)" strokeWidth={24} opacity={heroOpacity} />
          <circle cx={420} cy={392} r={142} fill="none" stroke={heroActive ? animation.accent : '#d6ad60'} strokeWidth={heroActive ? 28 : 24} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - gauge * progress)} transform="rotate(-90 420 392)" filter={heroActive ? animation.glow : undefined} opacity={heroOpacity} />
          <text data-dm-text-editable x={420} y={384} textAnchor="middle" fontSize={heroValue.length > 8 ? 48 : 72} fontWeight={920} fill={heroActive ? animation.accent : '#f8ead0'} opacity={heroOpacity}>{truncate(heroValue, 12)}</text>
          <text data-dm-text-editable x={420} y={430} textAnchor="middle" fontSize={14} fontWeight={900} letterSpacing={0} fill={heroActive ? '#f8ead0' : '#b99b62'} opacity={heroOpacity}>{truncate(heroLabel.toUpperCase(), 22)}</text>
          {rows.map((item, index) => {
            const isActive = runtimeContractMatches(animation, item.label);
            const itemOpacity = runtimeContractOpacity(animation, isActive, 1);
            return (
            <g key={`${item.label}-${index}`} opacity={ease(frame, [24 + index * 8, 48 + index * 8], [0, itemOpacity])}>
              <rect x={662} y={226 + index * 112} width={412} height={82} rx={8} fill={isActive ? 'rgba(214,173,96,0.10)' : 'rgba(255,255,255,0.035)'} stroke={isActive ? animation.accent : 'rgba(214,173,96,0.35)'} strokeWidth={isActive ? 2 : 1} />
              {isActive ? <rect x={654} y={218 + index * 112} width={428} height={98} rx={12} fill="none" stroke={animation.accent} strokeWidth={1.5} opacity={0.34 + emphasis * 0.24} filter={animation.glow} /> : null}
              <text data-dm-text-editable x={694} y={258 + index * 112} fontSize={13} fontWeight={900} letterSpacing={0} fill="#b99b62">{truncate(item.label.toUpperCase(), 28)}</text>
              <text data-dm-text-editable x={694} y={292 + index * 112} fontSize={32} fontWeight={920} fill={isActive ? animation.accent : '#f8ead0'}>{truncate(item.displayValue || formatCompact(item.value, item.label), 16)}</text>
              {item.subtitle ? <text data-dm-text-editable x={1008} y={282 + index * 112} textAnchor="end" fontSize={18} fontWeight={900} fill="#facc15">{truncate(item.subtitle, 16)}</text> : null}
            </g>
            );
          })}
        </svg>
      </EditableTransform>
    </AbsoluteFill>
  );
};
