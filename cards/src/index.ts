import {registerRoot} from 'remotion';
import React from 'react';
import {ShotCraftRoot} from './Root';
import {RuntimeCardsRoot} from './runtime/RuntimeCardsRoot';
import './stableFonts';

registerRoot(() => React.createElement(React.Fragment, null,
  React.createElement(ShotCraftRoot), React.createElement(RuntimeCardsRoot)));
