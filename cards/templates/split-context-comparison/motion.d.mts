export type ComparisonMotion = {
  title: number;
  split: number;
  subjects: number;
  metrics: number;
  difference: number;
  takeaway: number;
  settled: boolean;
};

export const comparisonMotionAtFrame: (input: {frame: number; fps: number}) => ComparisonMotion;
