import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type StoryItem = {id: string; label: string; value: number; color?: string; iconSrc?: string};
export type StorySequenceGeneratorProps = {
  blueprintId: 'editorial_reveal' | 'change_and_race' | 'composition_to_detail' | 'cause_and_flow' | 'geographic_journey' | 'source_to_claim';
  title: string;
  question: string;
  takeaway: string;
  source: string;
  unit: string;
  accent: string;
  items: StoryItem[];
};

const font = 'Inter, "Noto Sans SC", sans-serif';
const fallbackColors = ['#52e0c4', '#ff775f', '#76a9ff', '#b184ff', '#f6c85f', '#7fd18b', '#ec8ad4', '#9aa9b7'];
const blueprintNames: Record<StorySequenceGeneratorProps['blueprintId'], string[]> = {
  editorial_reveal: ['提出问题', '放回情境', '展开证据', '聚焦结论'],
  change_and_race: ['交代起点', '观察大势', '进入竞赛', '停在反转点'],
  composition_to_detail: ['给出总量', '拆开构成', '寻找结构', '提炼发现'],
  cause_and_flow: ['交代结果', '拆分增减项', '追踪流向', '回答为什么'],
  geographic_journey: ['建立地点', '比较区域', '沿路径推进', '停在关键节点'],
  source_to_claim: ['展示原始来源', '重构成图', '交叉核验', '形成主张'],
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const fadeForShot = (frame: number, start: number, last: boolean) => {
  const local = frame - start;
  const fadeIn = interpolate(local, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = last ? 1 : interpolate(local, [76, 89], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return Math.min(fadeIn, fadeOut);
};

const Header: React.FC<{chapter: string; index: number; source: string}> = ({chapter, index, source}) => <>
  <div style={{position: 'absolute', left: 72, right: 72, top: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <div style={{fontSize: 14, fontWeight: 800, letterSpacing: 2.5, color: '#91a1ad'}}>DATA STORY · {String(index + 1).padStart(2, '0')} / 04</div>
    <div style={{fontSize: 13, color: '#71828e'}}>{chapter}</div>
  </div>
  <div style={{position: 'absolute', left: 72, right: 72, top: 86, height: 1, background: '#20313a'}}/>
  <div style={{position: 'absolute', left: 72, bottom: 30, fontSize: 12, color: '#62737e'}}>来源：{source}</div>
</>;

const StorySequenceGenerator: React.FC<StorySequenceGeneratorProps> = props => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const motionFrame = Math.min(frame, durationInFrames - Math.round(1.2 * fps));
  const rows = props.items.map((item, index) => ({...item, color: item.color || fallbackColors[index % fallbackColors.length]}));
  const sorted = [...rows].sort((left, right) => right.value - left.value);
  const max = Math.max(1, ...rows.map(item => Math.abs(item.value)));
  const total = rows.reduce((sum, item) => sum + item.value, 0);
  const focus = sorted[0];
  const chapters = blueprintNames[props.blueprintId] || blueprintNames.editorial_reveal;
  const shotStarts = [0, 90, 180, 270];
  const accent = props.accent || '#52e0c4';

  const shotOne = clamp((motionFrame - 8) / 52);
  const shotTwo = clamp((motionFrame - 96) / 62);
  const shotThree = clamp((motionFrame - 186) / 56);
  const shotFour = clamp((motionFrame - 278) / 38);

  return <AbsoluteFill style={{background: '#071116', color: '#f4f7f5', fontFamily: font, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 70% 42%, ${accent}18, transparent 36%), linear-gradient(135deg,#071116,#0a1c22 62%,#071116)`}}/>

    <AbsoluteFill style={{opacity: fadeForShot(frame, shotStarts[0], false)}}>
      <Header chapter={chapters[0]} index={0} source={props.source}/>
      <div style={{position: 'absolute', left: 120, top: 172, width: 980, transform: `scale(${1.045 - shotOne * .045})`, transformOrigin: 'left center'}}>
        <div style={{fontSize: 17, fontWeight: 800, color: accent, letterSpacing: 2}}>THE QUESTION</div>
        <h1 style={{margin: '22px 0 20px', fontSize: 72, lineHeight: 1.13, letterSpacing: -2}}>{props.question}</h1>
        <p style={{margin: 0, maxWidth: 850, fontSize: 24, lineHeight: 1.55, color: '#9baab2'}}>{props.title}</p>
      </div>
      <div style={{position: 'absolute', right: 118, top: 238, width: 470, height: 430, padding: 38, border: '1px solid #28404a', borderRadius: 22, background: '#0a181ecc', transform: `translateY(${(1 - shotOne) * 24}px)`, opacity: shotOne}}>
        <div style={{fontSize: 13, color: '#79909b', letterSpacing: 2}}>LEADING SIGNAL</div>
        <div style={{marginTop: 28, fontSize: 31, fontWeight: 750, color: focus.color,display:'flex',alignItems:'center',gap:12}}><EntityIcon src={focus.iconSrc} size={40}/>{focus.label}</div>
        <div style={{marginTop: 8, fontSize: 106, lineHeight: 1, fontWeight: 800}}>{focus.value}<span style={{marginLeft: 12, fontSize: 22, color: '#91a1aa'}}>{props.unit}</span></div>
        <div style={{marginTop: 34, height: 8, borderRadius: 9, background: '#193039'}}><div style={{width: `${shotOne * 100}%`, height: '100%', borderRadius: 9, background: accent}}/></div>
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{opacity: fadeForShot(frame, shotStarts[1], false)}}>
      <Header chapter={chapters[1]} index={1} source={props.source}/>
      <div style={{position: 'absolute', left: 72, top: 125, width: 520}}>
        <div style={{fontSize: 16, color: accent, fontWeight: 800, letterSpacing: 2}}>CONTEXT / SCALE</div>
        <h2 style={{margin: '18px 0 10px', fontSize: 48, lineHeight: 1.18}}>{props.title}</h2>
        <div style={{marginTop: 28, display: 'flex', alignItems: 'baseline', gap: 12}}><strong style={{fontSize: 82}}>{Math.round(total * 10) / 10}</strong><span style={{fontSize: 20, color: '#8da0aa'}}>{props.unit} · 总量</span></div>
      </div>
      <div style={{position: 'absolute', left: 650, right: 90, top: 132, bottom: 92, transform: `translateX(${30 - shotTwo * 48}px)`}}>
        {rows.slice(0, 8).map((item, index) => <div key={item.id} style={{position: 'absolute', left: (index % 4) * 280, top: Math.floor(index / 4) * 315, width: 250, height: 270, padding: 22, border: '1px solid #263b44', borderRadius: 18, background: '#0b1a20e8', opacity: interpolate(shotTwo, [index * .07, index * .07 + .35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `translateY(${(1 - shotTwo) * (16 + index * 3)}px)`}}>
          {item.iconSrc ? <EntityIcon src={item.iconSrc} size={44}/> : <div style={{width: 12, height: 12, borderRadius: '50%', background: item.color}}/>}<div style={{marginTop: item.iconSrc ? 42 : 74, fontSize: 21, color: '#9cabb2'}}>{item.label}</div><strong style={{display: 'block', marginTop: 8, fontSize: 51}}>{item.value}</strong><div style={{position: 'absolute', left: 22, right: 22, bottom: 22, height: 6, background: '#182b33', borderRadius: 4}}><div style={{width: `${Math.abs(item.value) / max * 100}%`, height: '100%', background: item.color, borderRadius: 4}}/></div>
        </div>)}
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{opacity: fadeForShot(frame, shotStarts[2], false)}}>
      <Header chapter={chapters[2]} index={2} source={props.source}/>
      <div style={{position: 'absolute', left: 86, top: 132, width: 420}}><span style={{fontSize: 15, color: accent, fontWeight: 800, letterSpacing: 2}}>EVIDENCE</span><h2 style={{margin: '16px 0 0', fontSize: 44, lineHeight: 1.2}}>差异集中在少数对象</h2><p style={{marginTop: 20, fontSize: 20, lineHeight: 1.6, color: '#91a1aa'}}>镜头逐步推向最关键的数据对象，同时保留其他对象作为比较尺度。</p></div>
      <div style={{position: 'absolute', left: 560, right: 110, top: 145, bottom: 105, transform: `scale(${1 + shotThree * .035}) translateX(${-shotThree * 12}px)`, transformOrigin: '68% 48%'}}>
        {sorted.slice(0, 7).map((item, index) => {
          const width = Math.abs(item.value) / max * 850;
          const isFocus = item.id === focus.id;
          return <div key={item.id} style={{position: 'absolute', left: 0, right: 0, top: index * 102, height: 76, opacity: interpolate(shotThree, [index * .05, index * .05 + .3], [.16, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            <div style={{position: 'absolute', left: 0, width: 190, top: 15, display:'flex', alignItems:'center', gap:8, fontSize: 20, fontWeight: isFocus ? 800 : 550, color: isFocus ? '#fff' : '#9aabb3'}}><EntityIcon src={item.iconSrc} size={32}/>{item.label}</div>
            <div style={{position: 'absolute', left: 210, right: 90, top: 27, height: 17, background: '#172b33', borderRadius: 12}}><div style={{width: width * shotThree, height: '100%', borderRadius: 12, background: isFocus ? accent : item.color, boxShadow: isFocus ? `0 0 30px ${accent}72` : 'none'}}/></div>
            <strong style={{position: 'absolute', left: 225 + width * shotThree, top: 13, padding: '5px 8px', background: '#071116', fontSize: 22}}>{Math.round(item.value * shotThree * 10) / 10}</strong>
          </div>;
        })}
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{opacity: fadeForShot(frame, shotStarts[3], true)}}>
      <Header chapter={chapters[3]} index={3} source={props.source}/>
      <div style={{position: 'absolute', left: 210, right: 210, top: 172, textAlign: 'center', transform: `translateY(${(1 - shotFour) * 22}px)`, opacity: shotFour}}>
        <div style={{fontSize: 15, color: accent, fontWeight: 800, letterSpacing: 3}}>THE TAKEAWAY</div>
        <h2 style={{maxWidth: 1280, margin: '30px auto 26px', fontSize: 62, lineHeight: 1.22, letterSpacing: -1.4}}>{props.takeaway}</h2>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, padding: '18px 25px', border: `1px solid ${accent}`, borderRadius: 15, background: '#0a1b20'}}><span style={{width: 13, height: 13, borderRadius: '50%', background: focus.color}}/><strong style={{fontSize: 23}}><EntityIcon src={focus.iconSrc} size={40}/>{focus.label}</strong><b style={{fontSize: 35, color: accent}}>{focus.value} {props.unit}</b></div>
      </div>
      <div style={{position: 'absolute', left: 270, right: 270, bottom: 116, display: 'flex', gap: 9, alignItems: 'end', justifyContent: 'center', opacity: shotFour}}>
        {sorted.slice(0, 8).map(item => <div key={item.id} style={{width: 118, display: 'grid', gap: 7, textAlign: 'center'}}><div style={{height: 8 + Math.abs(item.value) / max * 82, background: item.id === focus.id ? accent : item.color, borderRadius: '7px 7px 2px 2px'}}/><span style={{fontSize: 12, color: '#8da0aa', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{item.label}</span></div>)}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

export {StorySequenceGenerator};
