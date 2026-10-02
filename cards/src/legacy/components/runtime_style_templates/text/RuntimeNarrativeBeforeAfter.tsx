import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeBeforeAfter: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {subtitle, kicker, bullets, payload} = contentFields(sceneContent, scene);
  const MUTED = '#64748b';
  const ACCENT = '#34d399';

  const beforeLabel = cleanText(payload.before_label, uiLabel(sceneContent, 'before', 'BEFORE'));
  const beforeValue = cleanText(payload.before_value, bullets[0]);
  const beforeDesc = cleanText(payload.before_desc);
  const afterLabel = cleanText(payload.after_label, uiLabel(sceneContent, 'after', 'AFTER'));
  const afterValue = cleanText(payload.after_value, bullets[1]);
  const afterDesc = cleanText(payload.after_desc);
  const delta = cleanText(payload.delta, subtitle);
  const displayKicker = cleanText(kicker, uiLabel(sceneContent, 'before_after', 'BEFORE / AFTER'));

  if (!beforeValue || !afterValue) return null;

  const valueStyle = (color: string): React.CSSProperties => {
    const longest = Math.max(beforeValue.length, afterValue.length);
    const fontSize = longest > 34 ? 38 : longest > 26 ? 44 : longest > 18 ? 54 : 68;
    return {
      width: 500,
      minHeight: 104,
      fontSize,
      fontWeight: 900,
      lineHeight: 1.08,
      letterSpacing: 0,
      color,
      overflowWrap: 'break-word',
      wordBreak: 'normal',
    };
  };

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)'}} />

      <EditableTransform id="runtime-ba-kicker" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '0.24em', color: '#475569', textTransform: 'uppercase', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(displayKicker, 32)}
        </div>
      </EditableTransform>

      {/* BEFORE panel */}
      <div style={{position: 'absolute', left: 96, top: 130, width: 500 * ease(frame, [8, 26], [0, 1]), height: 3, background: MUTED, borderRadius: 2}} />
      <EditableTransform id="runtime-ba-before-label" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 153, fontSize: 13, fontWeight: 800, letterSpacing: '0.2em', color: MUTED, textTransform: 'uppercase', opacity: ease(frame, [10, 28], [0, 1])}}>
          {truncate(beforeLabel, 24)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-ba-before-value" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 198, opacity: ease(frame, [16, 38], [0, 1]), ...valueStyle('#cbd5e1')}}>
          {truncate(beforeValue, 48)}
        </div>
      </EditableTransform>
      {beforeDesc ? (
        <EditableTransform id="runtime-ba-before-sub" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 326, width: 460, fontSize: 18, lineHeight: 1.55, fontWeight: 400, color: '#64748b', opacity: ease(frame, [22, 44], [0, 1])}}>
            {truncate(beforeDesc, 80)}
          </div>
        </EditableTransform>
      ) : null}

      {/* center arrow */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 234, textAlign: 'center', fontSize: 24, color: '#334155', opacity: ease(frame, [28, 48], [0, 1])}}>→</div>

      {/* AFTER panel */}
      <div style={{position: 'absolute', left: 688, top: 130, width: 500 * ease(frame, [16, 36], [0, 1]), height: 3, background: ACCENT, borderRadius: 2}} />
      <EditableTransform id="runtime-ba-after-label" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 688, top: 153, fontSize: 13, fontWeight: 800, letterSpacing: '0.2em', color: ACCENT, textTransform: 'uppercase', opacity: ease(frame, [20, 38], [0, 1])}}>
          {truncate(afterLabel, 24)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-ba-after-value" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 688, top: 198, opacity: ease(frame, [26, 48], [0, 1]), ...valueStyle('#f8fafc')}}>
          {truncate(afterValue, 48)}
        </div>
      </EditableTransform>
      {afterDesc ? (
        <EditableTransform id="runtime-ba-after-sub" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 688, top: 326, width: 460, fontSize: 18, lineHeight: 1.55, fontWeight: 400, color: '#94a3b8', opacity: ease(frame, [32, 54], [0, 1])}}>
            {truncate(afterDesc, 80)}
          </div>
        </EditableTransform>
      ) : null}

      {/* delta pill */}
      {delta ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 468, display: 'flex', justifyContent: 'center', opacity: ease(frame, [38, 60], [0, 1])}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 20, background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.25)'}}>
            <span style={{fontSize: 13, fontWeight: 700, color: ACCENT, letterSpacing: '0.05em'}}>
              {truncate(delta, 48)}
            </span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
