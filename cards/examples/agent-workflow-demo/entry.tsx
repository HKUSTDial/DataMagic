import React from 'react';
import {Composition, Freeze, Sequence, registerRoot, useCurrentFrame} from 'remotion';
import {BarChartRace, type BarChartRaceProps} from '../../templates/bar-chart-race/BarChartRace';
import sample from '../../templates/bar-chart-race/sample-data.json';
import {filmFont} from './film/fonts';
const Original:React.FC<BarChartRaceProps>=props=><BarChartRace {...props} fontFamily={filmFont}/>;
const Revised:React.FC<BarChartRaceProps>=props=><Freeze frame={Math.min(useCurrentFrame(),359)}><Sequence durationInFrames={360}><Original {...props}/></Sequence></Freeze>;
registerRoot(()=><><Composition id="AgentCoffeeV1" component={Original} defaultProps={sample} durationInFrames={360} fps={30} width={1920} height={1080}/><Composition id="AgentCoffeeV2" component={Revised} defaultProps={sample} durationInFrames={420} fps={30} width={1920} height={1080}/></>);
