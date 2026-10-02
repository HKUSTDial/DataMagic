import React from 'react';
import {Composition, Freeze, Sequence, registerRoot, useCurrentFrame} from 'remotion';
import {BarChartRace, type BarChartRaceProps} from '../../templates/bar-chart-race/BarChartRace';
import v1 from './v1.json';
import v2 from './v2.json';
import '@fontsource/inter/latin.css';
import '@fontsource/noto-sans-sc/chinese-simplified.css';

// The template's 360-frame clock stays intact; only the final frame is held longer.
const Revised: React.FC<BarChartRaceProps> = props => {
 const frame=useCurrentFrame();
 return <Freeze frame={Math.min(frame,359)}><Sequence durationInFrames={360}><BarChartRace {...props}/></Sequence></Freeze>;
};
registerRoot(()=> <>
 <Composition id="CoffeeRaceV1" component={BarChartRace} defaultProps={v1} durationInFrames={360} fps={30} width={1920} height={1080}/>
 <Composition id="CoffeeRaceV2" component={Revised} defaultProps={v2} durationInFrames={420} fps={30} width={1920} height={1080}/>
</>);
