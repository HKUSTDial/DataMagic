import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type ReconstructionRow = {
  label: string;
  value: number;
  sourceText: string;
  iconSrc?: string;
};

export type SourceToReconstructionProps = {
  title: string;
  subtitle: string;
  sourceTitle: string;
  rows: ReconstructionRow[];
  unit: string;
  highlightIndex: number;
  takeaway: string;
  source: string;
  accentColor: string;
};

const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const PaperNoise: React.FC = () => (
  <svg aria-hidden="true" width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.34}}>
    <defs>
      <pattern id="paper-dots" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.7" fill="#7a746b" opacity="0.18" />
        <path d="M0 17.5H18" stroke="#857f76" strokeWidth="0.35" opacity="0.15" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#paper-dots)" />
  </svg>
);

export const SourceToReconstruction: React.FC<SourceToReconstructionProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stableFrame = Math.min(frame, 6 * fps);
  const highlight = Math.min(props.rows.length - 1, Math.max(0, props.highlightIndex));
  const max = Math.max(1, ...props.rows.map((row) => row.value));
  const intro = spring({frame: stableFrame, fps, durationInFrames: Math.round(0.7 * fps), config: {damping: 180}});
  const scan = interpolate(frame, [0.8 * fps, 2.25 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const reconstruct = interpolate(frame, [2.0 * fps, 4.4 * fps], [0, 1], {...clamp, easing: ease});
  const result = interpolate(frame, [3.55 * fps, 4.65 * fps], [0, 1], {...clamp, easing: ease});
  const takeawayIn = interpolate(frame, [5.05 * fps, 5.8 * fps], [0, 1], {...clamp, easing: ease});

  return (
    <AbsoluteFill style={{background: '#f2efe8', color: '#17201f', fontFamily, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 91% 9%, rgba(34,154,136,.13), transparent 31%), linear-gradient(145deg,#f8f6f1 0%,#ece9e1 100%)'}} />

      <header style={{position: 'absolute', left: 78, top: 64, right: 78, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: intro, transform: `translateY(${(1 - intro) * 18}px)`}}>
        <div>
          <div style={{fontSize: 16, fontWeight: 800, letterSpacing: 3.5, color: props.accentColor}}>SOURCE RECONSTRUCTION · 资料复刻</div>
          <h1 style={{fontSize: 52, lineHeight: 1.1, margin: '14px 0 8px', letterSpacing: -1.4}}>{props.title}</h1>
          <div style={{fontSize: 22, color: '#6b736f'}}>{props.subtitle}</div>
        </div>
        <div style={{marginTop: 4, border: '1px solid #c9c6bd', borderRadius: 999, padding: '11px 18px', color: '#666d69', fontSize: 15}}>程序化原稿 · 数据保持可编辑</div>
      </header>

      <section style={{position: 'absolute', left: 78, top: 236, width: 640, height: 704}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: '#d8d4cb', transform: 'rotate(-1.4deg) translate(-4px,8px)', opacity: 0.72}} />
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 20, background: '#fbfaf6', border: '1px solid #c8c4ba', boxShadow: '0 24px 70px rgba(39,45,42,.13)', transform: `rotate(${interpolate(reconstruct, [0, 1], [-0.65, 0])}deg) scale(${interpolate(reconstruct, [0, 1], [1, 0.965])})`}}>
          <PaperNoise />
          <div style={{position: 'relative', padding: '30px 34px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottom: '2px solid #292d2b'}}>
              <strong style={{fontSize: 24}}>{props.sourceTitle}</strong>
              <span style={{fontFamily: 'monospace', fontSize: 13, color: '#77756f'}}>TABLE / 04-A</span>
            </div>
            <div style={{marginTop: 18, display: 'grid', gridTemplateColumns: '1.12fr .72fr 1.5fr', padding: '12px 12px', borderTop: '1px solid #8e8c84', borderBottom: '1px solid #8e8c84', fontSize: 14, fontWeight: 800, color: '#686a66'}}>
              <span>项目</span><span style={{textAlign: 'right'}}>数值</span><span style={{paddingLeft: 24}}>原文摘录</span>
            </div>
            {props.rows.map((row, index) => {
              const rowScan = interpolate(scan, [index / props.rows.length, (index + 1) / props.rows.length], [0, 1], clamp);
              const isHighlighted = index === highlight;
              return (
                <div key={`${row.label}-${index}`} style={{position: 'relative', display: 'grid', gridTemplateColumns: '1.12fr .72fr 1.5fr', minHeight: 91, alignItems: 'center', padding: '0 12px', borderBottom: '1px solid #d2cfc6', fontSize: 18}}>
                  <div style={{position: 'absolute', left: 4, right: 4, top: 9, bottom: 9, borderRadius: 7, background: isHighlighted ? `${props.accentColor}18` : '#d2aa5d18', opacity: rowScan}} />
                  <strong style={{position: 'relative',display:'flex',alignItems:'center',gap:8}}><EntityIcon src={row.iconSrc} size={30}/>{row.label}</strong>
                  <span style={{position: 'relative', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700}}>{row.value}{props.unit}</span>
                  <span style={{position: 'relative', paddingLeft: 24, color: '#6f706b', fontSize: 15, lineHeight: 1.45}}>{row.sourceText}</span>
                </div>
              );
            })}
            <div style={{marginTop: 26, display: 'flex', justifyContent: 'space-between', color: '#85837d', fontSize: 14}}><span>原始资料快照</span><span>字段已逐行核对</span></div>
          </div>
          <div style={{position: 'absolute', top: interpolate(scan, [0, 1], [148, 655]), left: 0, right: 0, height: 3, background: props.accentColor, boxShadow: `0 0 22px 6px ${props.accentColor}55`, opacity: interpolate(scan, [0, .08, .94, 1], [0, 1, 1, 0], clamp)}} />
        </div>
      </section>

      <svg aria-hidden="true" width="1920" height="1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        {props.rows.map((row, index) => {
          const y1 = 420 + index * 91;
          const y2 = 386 + index * 103;
          const path = `M 710 ${y1} C 760 ${y1}, 757 ${y2}, 820 ${y2}`;
          return <path key={row.label} d={path} pathLength={1} fill="none" stroke={index === highlight ? props.accentColor : '#a8aaa4'} strokeWidth={index === highlight ? 3 : 1.4} strokeDasharray={`${reconstruct} 1`} opacity={0.25 + reconstruct * 0.75} />;
        })}
      </svg>

      <section style={{position: 'absolute', left: 810, top: 236, right: 78, height: 704, borderRadius: 24, overflow: 'hidden', background: '#132522', color: '#f8fbf9', boxShadow: '0 28px 80px rgba(19,37,34,.18)', opacity: result, transform: `translateX(${(1 - result) * 46}px)`}}>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 88% 10%,rgba(61,210,180,.18),transparent 36%),linear-gradient(145deg,#172e2a,#101c1b)'}} />
        <div style={{position: 'relative', padding: '30px 38px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div><div style={{fontSize: 15, color: '#8ab4aa', letterSpacing: 2.5}}>EDITABLE RECONSTRUCTION</div><strong style={{display: 'block', marginTop: 8, fontSize: 24}}>独立可编辑图表</strong></div>
            <div style={{fontSize: 14, color: '#8ba49e'}}>同源字段 · 顺序重构</div>
          </div>
          <div style={{marginTop: 29, display: 'grid', gap: 14}}>
            {props.rows.map((row, index) => {
              const barIn = interpolate(frame, [(3.55 + index * 0.16) * fps, (4.5 + index * 0.16) * fps], [0, row.value / max], {...clamp, easing: ease});
              const active = index === highlight;
              return (
                <div key={row.label} style={{display: 'grid', gridTemplateColumns: '165px 1fr 94px', alignItems: 'center', gap: 18, minHeight: 76}}>
                  <span style={{fontSize: 18, fontWeight: active ? 800 : 500, color: active ? '#fff' : '#b8c7c3',display:'flex',alignItems:'center',gap:8}}><EntityIcon src={row.iconSrc} size={30}/>{row.label}</span>
                  <div style={{position: 'relative', height: 30, borderRadius: 6, overflow: 'hidden', background: 'rgba(231,244,240,.08)'}}>
                    <div style={{height: '100%', width: `${barIn * 100}%`, borderRadius: 6, background: active ? `linear-gradient(90deg,${props.accentColor},#68dbc4)` : 'linear-gradient(90deg,#526d68,#76928b)'}} />
                    <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(90deg,transparent 24%,rgba(255,255,255,.11) 25%,transparent 26%,transparent 49%,rgba(255,255,255,.11) 50%,transparent 51%,transparent 74%,rgba(255,255,255,.11) 75%,transparent 76%)'}} />
                  </div>
                  <strong style={{fontSize: 23, textAlign: 'right', color: active ? '#66dcc3' : '#d9e2df'}}>{row.value}<small style={{fontSize: 15, marginLeft: 3}}>{props.unit}</small></strong>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 30, padding: '21px 24px', borderRadius: 13, background: 'rgba(255,255,255,.07)', borderLeft: `5px solid ${props.accentColor}`, opacity: takeawayIn, transform: `translateY(${(1 - takeawayIn) * 16}px)`}}>
            <div style={{fontSize: 14, color: '#89aaa2', marginBottom: 7, letterSpacing: 2}}>TAKEAWAY</div>
            <div style={{fontSize: 22, lineHeight: 1.45, fontWeight: 600}}>{props.takeaway}</div>
          </div>
        </div>
      </section>

      <footer style={{position: 'absolute', left: 78, right: 78, bottom: 64, display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #cbc8bf', color: '#747a76', fontSize: 14}}>
        <span>来源：{props.source}</span><span>原稿 → 字段匹配 → 可编辑图形</span>
      </footer>
    </AbsoluteFill>
  );
};
