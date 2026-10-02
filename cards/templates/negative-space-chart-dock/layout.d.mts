export type Box = {x: number; y: number; width: number; height: number};
export type DockRegion = Box & {relocated: boolean};
export const resolveDockRegion: (input: {
  focalBox: Box;
  safeRegion: Box;
  canvasWidth?: number;
  canvasHeight?: number;
  padding?: number;
  gap?: number;
  minWidth?: number;
  minHeight?: number;
}) => DockRegion;
export const boxesOverlap: (a: Box, b: Box, gap?: number) => boolean;
export type DockMotion = {scene: number; panel: number; bars: number; callout: number; settled: boolean};
export const dockMotionAtFrame: (input: {frame: number; fps: number}) => DockMotion;
