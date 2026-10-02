import React,{useContext} from 'react';
import {AbsoluteFill,Sequence,Freeze,OffthreadVideo,Audio,Img,staticFile,useCurrentFrame,Internals} from 'remotion';
import {cardById,sourceFrame} from './model.mjs';
import {nativeRegistry} from './native-registry';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/700.css';

// A trimmed clip must keep the source card's dimensions/duration, not inherit the
// timeline clip's shorter duration. Pinned Remotion internals; covered by parity tests.
function SourceClock({card,children}:any){const context=useContext(Internals.SequenceContext);if(!context)throw new Error('Missing source clock');return <Internals.SequenceContext.Provider value={{...context,durationInFrames:card.frames,width:card.width,height:card.height}}>{children}</Internals.SequenceContext.Provider>;}

export function ClipVisual({clip,project}:any){
  const frame=useCurrentFrame();
  const card=cardById[clip.cardId];
  const style:React.CSSProperties={opacity:clip.opacity,transform:`translate(${clip.x}px,${clip.y}px) scale(${clip.scale})`,transformOrigin:'center'};
  const Native=nativeRegistry[clip.cardId];
  if(clip.cardId==='audio')return <Audio src={staticFile(clip.props.src)} startFrom={Math.round(clip.in)} playbackRate={clip.speed} volume={clip.volume}/>;
  if(clip.cardId==='text')return <AbsoluteFill style={{...style,justifyContent:'center',alignItems:'center',padding:60,fontFamily:'"Noto Sans SC",sans-serif',fontSize:clip.props.size,color:clip.props.color,whiteSpace:'pre-wrap',textAlign:'center',fontWeight:700}}>{clip.props.text}</AbsoluteFill>;
  if(clip.cardId==='background')return <AbsoluteFill style={{...style,background:clip.props.color}}/>;
  if(clip.cardId==='image')return <AbsoluteFill style={style}><Img src={staticFile(clip.props.src)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></AbsoluteFill>;
  if(clip.cardId==='video'||(card&&!card.native))return <AbsoluteFill style={style}><OffthreadVideo src={staticFile(card?card.media:clip.props.src)} startFrom={Math.round(clip.in)} playbackRate={clip.speed} volume={clip.volume} style={{width:'100%',height:'100%',objectFit:'contain'}}/></AbsoluteFill>;
  if(!Native||!card)return null;
  const fit=Math.min(project.width/card.width,project.height/card.height);
  const current=sourceFrame({...clip,start:0},frame,card.frames);
  return <AbsoluteFill style={style}><div style={{position:'absolute',width:card.width,height:card.height,left:(project.width-card.width*fit)/2,top:(project.height-card.height*fit)/2,transform:`scale(${fit})`,transformOrigin:'top left'}}>
    <Freeze frame={current}><SourceClock card={card}><Native {...clip.props}/></SourceClock></Freeze>
  </div></AbsoluteFill>;
}
export const MotionComposition:React.FC<{project:any}>=({project})=><AbsoluteFill style={{background:project.background}}>{project.tracks.filter((t:any)=>!t.hidden).flatMap((track:any)=>track.clips.map((clip:any)=><Sequence key={clip.id} from={clip.start} durationInFrames={clip.duration} name={`${track.name}: ${clip.cardId}`}><ClipVisual clip={clip} project={project}/></Sequence>))}</AbsoluteFill>;
