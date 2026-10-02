import {EntityIcon} from '../../src/entityVisuals';
import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {reveal,sceneFont} from '../../src/sceneTiming';
import {checkedText,contributionSteps,numeric,type Contribution} from '../../src/editorialStory';
export type ContrastContributionStoryProps={title:string;question:string;hookLabel:string;hook:{before:number;after:number};takeaway:string;source:string;baselineLabel:string;baselineIconSrc?:string;baseline:number;finalLabel:string;finalIconSrc?:string;unit:string;maximum:number;contributions:Contribution[]};
export const ContrastContributionStory:React.FC<ContrastContributionStoryProps>=p=>{
  const t=useCurrentFrame()/useVideoConfig().fps;const result=contributionSteps(p.baseline,p.contributions,p.maximum);
  checkedText(p.title,28);checkedText(p.question,44);checkedText(p.takeaway,44);
  if (!Number.isFinite(p.hook.before)||p.hook.before<=0||!Number.isFinite(p.hook.after)||p.hook.after<0) throw new Error('Hook values must be non-negative with a positive baseline.');
  const hookRate=(p.hook.after-p.hook.before)/p.hook.before*100;
  const hookValue=`${hookRate>0?'+':''}${numeric(hookRate)}%`;
  const chart=reveal(t,2,.8);const closing=reveal(t,9.2,.6);const width=1360/(result.steps.length+2);const y=(v:number)=>400-v/p.maximum*320;
  return <AbsoluteFill style={{background:'#f4eedf',color:'#252b39',fontFamily:sceneFont,overflow:'hidden'}}>
    <header style={{position:'absolute',left:76,right:76,top:48,display:'flex',justifyContent:'space-between',fontSize:19,color:'#7b7770',letterSpacing:2}}><span>DATAMAGIC / 反差与解释</span><span>用同一账本核对变化</span></header>
    <div style={{position:'absolute',left:96,top:195,opacity:1-chart}}><div style={{fontSize:30,color:'#777a6c'}}>{p.hookLabel}</div><strong style={{display:'block',fontSize:174,lineHeight:1.15,color:'#226f65',marginTop:16}}>{hookValue}</strong><div style={{fontSize:48,marginTop:20,maxWidth:1450,lineHeight:1.5}}>{p.question}</div></div>
    <section style={{position:'absolute',left:76,right:76,top:134,height:674,padding:'32px 44px',boxSizing:'border-box',background:'#fffdf6',borderRadius:26,border:'1px solid #dbd4c4',boxShadow:'0 24px 60px #65543114',opacity:chart,transform:`translateY(${(1-chart)*24}px)`}}>
      <h1 style={{margin:'0 0 13px',fontSize:45,lineHeight:1.3}}>{p.title}</h1><div style={{fontSize:23,color:'#777c73'}}>共同尺度 0–{p.maximum}{p.unit} · 各段变化可相加核对</div>
      <svg width="1620" height="485" viewBox="0 0 1620 485" style={{marginTop:8,overflow:'visible'}}>
        {[0,p.maximum/2,p.maximum].map(v=><g key={v}><line x1="70" x2="1550" y1={y(v)} y2={y(v)} stroke="#e3e1d4"/><text x="52" y={y(v)+7} textAnchor="end" fill="#898980" fontSize="20">{numeric(v)}</text></g>)}
        <rect x="110" y={y(p.baseline)} width={width*.56} height={400-y(p.baseline)} fill="#82969a" rx="5"/><text x={110+width*.28} y={y(p.baseline)-17} textAnchor="middle" fontSize="30" fontWeight="700">{numeric(p.baseline)}</text><foreignObject x={110+width*.28-18} y={416} width={36} height={36}><EntityIcon src={p.baselineIconSrc} size={36}/></foreignObject><text x={110+width*.28} y="470" textAnchor="middle" fontSize="23">{p.baselineLabel}</text>
        {result.steps.map((step,i)=>{const progress=reveal(t,step.at,.7);const left=110+(i+1)*width;const end=step.start+(step.end-step.start)*progress;return <g key={i} opacity={progress}>
          <line x1={left-width*.44} x2={left} y1={y(step.start)} y2={y(step.start)} stroke="#b7bdb5" strokeDasharray="6 5"/>
          <rect x={left} y={y(Math.max(step.start,end))} width={width*.56} height={Math.abs(y(step.start)-y(end))} rx="5" fill={step.value>=0?'#238477':'#c47553'}/>
          <text x={left+width*.28} y={y(Math.max(step.start,step.end))-17} textAnchor="middle" fontSize="30" fontWeight="700">{step.value>0?'+':''}{numeric(step.value)}</text>
          <foreignObject x={left+width*.28-18} y={416} width={36} height={36}><EntityIcon src={step.iconSrc} size={36}/></foreignObject><text x={left+width*.28} y="470" textAnchor="middle" fontSize="23">{step.label}</text>
        </g>;})}
        <g opacity={closing}><rect x={110+(result.steps.length+1)*width} y={y(result.final)} width={width*.56} height={400-y(result.final)} rx="5" fill="#334c65"/><text x={110+(result.steps.length+1.28)*width} y={y(result.final)-17} textAnchor="middle" fontSize="34" fontWeight="700">{numeric(result.final)}</text><foreignObject x={110+(result.steps.length+1.28)*width-18} y={416} width={36} height={36}><EntityIcon src={p.finalIconSrc} size={36}/></foreignObject><text x={110+(result.steps.length+1.28)*width} y="470" textAnchor="middle" fontSize="23">{p.finalLabel}</text></g>
      </svg>
    </section>
    <div style={{position:'absolute',left:76,right:76,top:851,minHeight:100,padding:'22px 28px',boxSizing:'border-box',background:t>=9.2?'#d2e2d4':'#e5dfd1',borderRadius:14,fontSize:29,lineHeight:1.5}}>{t>=9.2?p.takeaway:[...p.contributions].reverse().find(part=>t>=part.at)?.caption||p.question}</div>
    <footer style={{position:'absolute',bottom:34,left:76,right:76,fontSize:17,color:'#827f74'}}>{p.source}</footer>
  </AbsoluteFill>;
};
