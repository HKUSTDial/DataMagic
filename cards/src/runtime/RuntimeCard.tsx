import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableSceneContext} from '../legacy/components/scenes/EditableTransform';
import {RuntimeStyleTemplateScene, hasRuntimeStyleTemplateAdapter} from '../legacy/components/scenes/RuntimeStyleTemplateScene';
import {RuntimeTextTemplateScene, hasRuntimeTextTemplateAdapter} from '../legacy/components/scenes/RuntimeTextTemplateScene';
import type {RuntimeStyleTemplateProps} from '../legacy/components/runtime_style_templates/runtimeSlots';

// Standalone data-bound render entry. Imported templates retain their original
// 1280x720 canvas; each composition supplies its own editable sample props.
export const RuntimeCard: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const id = sceneContent?.style_template_id;
  const text = hasRuntimeTextTemplateAdapter(id);
  if (!text && !hasRuntimeStyleTemplateAdapter(id)) throw new Error(`Unknown Cards template: ${id}`);
  const Component = text ? RuntimeTextTemplateScene : RuntimeStyleTemplateScene;
  const renderScene = {...scene, content:sceneContent};
  return <EditableSceneContext.Provider value={{scene:renderScene, sceneContent}}>
    <AbsoluteFill style={{background:sceneContent?.style?.background_color || '#f8fafc'}}>
      <Component sceneContent={sceneContent} scene={renderScene}/>
    </AbsoluteFill>
  </EditableSceneContext.Provider>;
};
