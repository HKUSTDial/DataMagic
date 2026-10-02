import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MotionComposition} from './Composition';
import {newProject,endFrame} from './model.mjs';
const Root=()=> <Composition id="DataMagic-Motion" component={MotionComposition} fps={30} width={1920} height={1080} durationInFrames={300} defaultProps={{project:newProject()}} calculateMetadata={({props})=>({durationInFrames:endFrame(props.project),width:props.project.width,height:props.project.height})}/>;
registerRoot(Root);
