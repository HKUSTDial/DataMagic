import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type PresenterSide = 'left' | 'right';

export type PresenterChartDatum = {
  label: string;
  value: number;
  context: string;
};

export type PresenterChartStageProps = {
  title: string;
  subtitle: string;
  presenterSide: PresenterSide;
  presenterName: string;
  presenterRole: string;
  activeBeat: number;
  chartData: PresenterChartDatum[];
  unit: string;
  takeaway: string;
  source: string;
  accentColor: string;
};

const fontFamily = 'Inter, "Noto Sans SC", sans-serif';
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.22, 1, 0.36, 1);

type PresenterFigureProps = {
  side: PresenterSide;
  accentColor: string;
  entrance: number;
  gesture: number;
};

const PresenterFigure: React.FC<PresenterFigureProps> = ({side, accentColor, entrance, gesture}) => {
  const direction = side === 'left' ? 1 : -1;
  return (
    <svg aria-label="程序化主持人轮廓" width="520" height="610" viewBox="0 0 520 610" style={{display: 'block', overflow: 'visible', transform: `translateY(${(1 - entrance) * 35}px) scaleX(${direction})`, opacity: entrance}}>
      <defs>
        <linearGradient id="presenter-jacket" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#293840" />
          <stop offset="1" stopColor="#10191e" />
        </linearGradient>
        <linearGradient id="presenter-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2e4d5" />
          <stop offset="1" stopColor="#d6c2b0" />
        </linearGradient>
      </defs>
      <ellipse cx="248" cy="576" rx="190" ry="26" fill="#07171b" opacity="0.28" />
      <circle cx="248" cy="168" r="87" fill="#d5ad91" />
      <path d="M170 164C166 90 203 54 260 58C320 62 347 106 332 169C312 123 277 105 219 112C204 139 189 157 170 164Z" fill="#172329" />
      <path d="M183 174C196 236 223 265 251 265C284 265 315 230 324 170C304 191 284 203 250 203C219 203 197 191 183 174Z" fill="#d5ad91" />
      <path d="M214 191C235 204 266 204 286 190" fill="none" stroke="#9d6c5c" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <circle cx="220" cy="163" r="5" fill="#26333a" /><circle cx="281" cy="163" r="5" fill="#26333a" />
      <path d="M230 268L250 298L270 268V325H230Z" fill="url(#presenter-shirt)" />
      <path d="M111 570C115 384 147 282 226 258L250 309L276 258C359 279 393 386 401 570Z" fill="url(#presenter-jacket)" />
      <path d="M226 258L250 309L216 343L190 278Z" fill="#344750" /><path d="M276 258L250 309L286 343L314 279Z" fill="#344750" />
      <path d="M250 309V560" stroke="#61727a" strokeWidth="3" opacity="0.42" />
      <path d="M160 355C116 400 93 456 73 510" fill="none" stroke="#1c2a31" strokeWidth="56" strokeLinecap="round" />
      <circle cx="69" cy="521" r="27" fill="#d5ad91" />
      <g style={{transformOrigin: '349px 350px', transform: `rotate(${-44 * gesture}deg)`}}>
        <path d="M345 352C383 392 412 432 446 476" fill="none" stroke="#1b2930" strokeWidth="57" strokeLinecap="round" />
        <circle cx="454" cy="485" r="27" fill="#d5ad91" />
        <path d="M465 480L507 458" stroke="#d5ad91" strokeWidth="14" strokeLinecap="round" />
      </g>
      <path d="M111 570H401" stroke={accentColor} strokeWidth="8" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
};

export const PresenterChartStage: React.FC<PresenterChartStageProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stableFrame = Math.min(frame, 6 * fps);
  const active = Math.min(props.chartData.length - 1, Math.max(0, props.activeBeat));
  const max = Math.max(1, ...props.chartData.map((item) => item.value));
  const presenterLeft = props.presenterSide === 'left';
  const presenterIn = spring({frame: stableFrame, fps, durationInFrames: Math.round(0.8 * fps), config: {damping: 180}});
  const headlineIn = spring({frame: stableFrame - Math.round(0.2 * fps), fps, durationInFrames: Math.round(0.75 * fps), config: {damping: 170}});
  const stageIn = spring({frame: stableFrame - Math.round(0.7 * fps), fps, durationInFrames: Math.round(0.9 * fps), config: {damping: 180}});
  const gesture = interpolate(frame, [2.15 * fps, 3.15 * fps], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const activeIn = interpolate(frame, [3.0 * fps, 4.35 * fps], [0, 1], {...clamp, easing: ease});
  const takeawayIn = interpolate(frame, [4.85 * fps, 5.7 * fps], [0, 1], {...clamp, easing: ease});
  const stageLeft = presenterLeft ? 655 : 78;
  const presenterX = presenterLeft ? 78 : 1322;

  return (
    <AbsoluteFill style={{background: '#07171b', color: '#f5fbf9', fontFamily, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${presenterLeft ? '17%' : '83%'} 33%,${props.accentColor}26,transparent 34%),linear-gradient(135deg,#0b2025,#071316 62%,#0b1d21)`}} />
      <div style={{position: 'absolute', inset: 0, opacity: 0.22, backgroundImage: 'linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px)', backgroundSize: '74px 74px'}} />
      <div style={{position: 'absolute', left: 64, right: 64, top: 64, height: 2, background: `linear-gradient(90deg,transparent,${props.accentColor},transparent)`, opacity: 0.8}} />

      <header style={{position: 'absolute', left: stageLeft + 26, top: 90, width: 1110, opacity: headlineIn, transform: `translateY(${(1 - headlineIn) * 20}px)`}}>
        <div style={{fontSize: 15, fontWeight: 800, letterSpacing: 3.5, color: props.accentColor}}>PRESENTER × DATA STAGE</div>
        <h1 style={{fontSize: 48, lineHeight: 1.13, margin: '13px 0 7px', letterSpacing: -1.2}}>{props.title}</h1>
        <div style={{fontSize: 20, color: '#9bb0ad'}}>{props.subtitle}</div>
      </header>

      <div style={{position: 'absolute', left: presenterX, top: 286, width: 520, height: 610}}>
        <div style={{position: 'absolute', left: 74, top: 55, width: 365, height: 365, borderRadius: '50%', border: `1px solid ${props.accentColor}55`, boxShadow: `0 0 100px ${props.accentColor}1f`}} />
        <PresenterFigure side={props.presenterSide} accentColor={props.accentColor} entrance={presenterIn} gesture={gesture} />
        <div style={{position: 'absolute', left: presenterLeft ? 24 : 228, bottom: 5, width: 270, padding: '15px 18px', borderRadius: 12, background: 'rgba(7,17,20,.88)', border: '1px solid rgba(255,255,255,.12)', opacity: presenterIn}}>
          <strong style={{display: 'block', fontSize: 18}}>{props.presenterName}</strong>
          <span style={{display: 'block', marginTop: 4, color: '#91aaa6', fontSize: 14}}>{props.presenterRole}</span>
        </div>
      </div>

      <section style={{position: 'absolute', left: stageLeft, top: 260, width: 1187, height: 635, borderRadius: 24, overflow: 'hidden', background: 'rgba(15,37,40,.92)', border: '1px solid rgba(164,220,209,.16)', boxShadow: '0 28px 90px rgba(0,0,0,.28)', opacity: stageIn, transform: `translateX(${(1 - stageIn) * (presenterLeft ? 42 : -42)}px)`}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg,rgba(255,255,255,.035),transparent 60%)'}} />
        <div style={{position: 'relative', padding: '31px 38px 26px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div><span style={{color: '#7f9995', fontSize: 14, letterSpacing: 2}}>ACTIVE BEAT</span><strong style={{display: 'block', marginTop: 7, fontSize: 23}}>重点讲解：{props.chartData[active]?.label}</strong></div>
            <div style={{padding: '10px 14px', borderRadius: 9, background: `${props.accentColor}1f`, color: '#b9eee3', fontSize: 14}}>BEAT {String(active + 1).padStart(2, '0')} / {String(props.chartData.length).padStart(2, '0')}</div>
          </div>

          <div style={{height: 378, marginTop: 23, display: 'flex', alignItems: 'flex-end', gap: 23, padding: '22px 20px 0', borderLeft: '1px solid rgba(202,231,226,.2)', borderBottom: '1px solid rgba(202,231,226,.2)', backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize: '100% 82px'}}>
            {props.chartData.map((item, index) => {
              const enterStart = (1.25 + index * 0.16) * fps;
              const bar = interpolate(frame, [enterStart, enterStart + 0.85 * fps], [0, item.value / max], {...clamp, easing: ease});
              const isActive = index === active;
              const emphasis = isActive ? activeIn : 0;
              return (
                <div key={item.label} style={{position: 'relative', flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
                  <strong style={{marginBottom: 10, fontSize: isActive ? 26 : 20, color: isActive ? '#eafffa' : '#9eb0ad', transform: `translateY(${-6 * emphasis}px)`}}>{item.value}<small style={{fontSize: 13, marginLeft: 3}}>{props.unit}</small></strong>
                  <div style={{position: 'relative', width: '74%', height: `${Math.max(3, bar * 282)}px`, minHeight: 3, borderRadius: '12px 12px 2px 2px', background: isActive ? `linear-gradient(180deg,#67e2ca,${props.accentColor})` : 'linear-gradient(180deg,#51716d,#2f4846)', boxShadow: isActive ? `0 0 ${45 * emphasis}px ${props.accentColor}55` : 'none', transform: `scaleX(${isActive ? 1 + 0.08 * emphasis : 1})`}}>
                    {isActive && <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 5, borderRadius: 5, background: '#dcfff8'}} />}
                  </div>
                  <span style={{height: 47, paddingTop: 12, fontSize: 16, fontWeight: isActive ? 800 : 500, color: isActive ? '#f5fffd' : '#a8b7b4'}}>{item.label}</span>
                  {isActive && <div style={{position: 'absolute', left: '50%', bottom: Math.min(303, 76 + bar * 282), width: 210, marginLeft: -105, padding: '11px 13px', borderRadius: 10, background: '#f4fbf8', color: '#17312d', fontSize: 14, lineHeight: 1.35, textAlign: 'center', opacity: activeIn, transform: `translateY(${(1 - activeIn) * 18}px)`}}>{item.context}</div>}
                </div>
              );
            })}
          </div>

          <div style={{marginTop: 20, display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: 17, padding: '16px 19px', borderRadius: 12, background: 'rgba(255,255,255,.06)', borderLeft: `5px solid ${props.accentColor}`, opacity: takeawayIn, transform: `translateY(${(1 - takeawayIn) * 15}px)`}}>
            <strong style={{fontSize: 13, letterSpacing: 2, color: '#87aaa4'}}>结论</strong>
            <span style={{fontSize: 20, lineHeight: 1.42, fontWeight: 600}}>{props.takeaway}</span>
          </div>
        </div>
      </section>

      <footer style={{position: 'absolute', left: 78, right: 78, bottom: 64, display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(209,237,231,.18)', color: '#78908c', fontSize: 14}}>
        <span>来源：{props.source}</span><span>主持人轮廓与图表均为程序化元素</span>
      </footer>
    </AbsoluteFill>
  );
};
