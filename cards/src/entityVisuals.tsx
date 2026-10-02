import React from 'react';
import {Img, staticFile} from 'remotion';

export type EntityVisual = {iconSrc?: string; color?: string};
export const entityImageSource = (src: string) => /^(https?:|data:|blob:)/.test(src) ? src : staticFile(src);

export const EntityIcon: React.FC<{src?: string; size?: number; style?: React.CSSProperties}> = ({src, size = 48, style}) => src
  ? <Img src={entityImageSource(src)} style={{width: size, height: size, objectFit: 'contain', flexShrink: 0, boxSizing: 'border-box', ...style}} />
  : null;
