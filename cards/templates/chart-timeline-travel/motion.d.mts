export type CameraState = {
  focusIndex: number;
  activeIndex: number;
  zoom: number;
  settled: boolean;
};

export const cameraStateAtFrame: (input: {
  frame: number;
  fps: number;
  periodCount: number;
}) => CameraState;

