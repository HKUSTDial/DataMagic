import {cancelRender,continueRender,delayRender} from 'remotion';
import data from '../../../out/workflow-fonts.json';

// Embedded local font bytes: all rendering workers load exactly the same faces.
// Never capture a frame while fallback fonts are still in use.
export const filmFont='DataMagic Workflow';
if(typeof document!=='undefined'){
 const handle=delayRender('Load complete, deterministic workflow fonts');
 Promise.all(([400,700] as const).map(async weight=>{
  const face=new FontFace(filmFont,`url(data:font/woff2;base64,${data[String(weight) as '400'|'700']})`,{weight:String(weight),style:'normal'});
  const loaded=await face.load();document.fonts.add(loaded);
 })).then(async()=>{
  await document.fonts.ready;
  for(const weight of [400,700])if(!document.fonts.check(`${weight} 38px "${filmFont}"`))throw new Error(`Workflow font ${weight} unavailable`);
  continueRender(handle);
 }).catch(error=>cancelRender(error));
}
