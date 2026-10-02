export const chartCameraProfiles = {
  slow_focus_push: {
    start: 0.24,
    end: 0.84,
    startScale: 1,
    endScale: 1.14,
    focusStrength: 0.82,
    panX: [0, 0] as const,
    panY: [0, 0] as const,
  },
  overview_pan: {
    start: 0.08,
    end: 0.9,
    startScale: 1.035,
    endScale: 1.055,
    focusStrength: 0.3,
    panX: [0.035, -0.035] as const,
    panY: [0, 0] as const,
  },
  parallax_data_glide: {
    start: 0.1,
    end: 0.88,
    startScale: 1.02,
    endScale: 1.08,
    focusStrength: 0.48,
    panX: [0.028, -0.03] as const,
    panY: [0.012, -0.014] as const,
  },
  timeline_travel: {
    start: 0.08,
    end: 0.9,
    startScale: 1.08,
    endScale: 1.12,
    focusStrength: 0.68,
    panX: [0.09, -0.09] as const,
    panY: [0, 0] as const,
  },
  crash_focus: {
    start: 0.14,
    end: 0.3,
    startScale: 1,
    endScale: 1.48,
    focusStrength: 1,
    panX: [0, 0] as const,
    panY: [0, 0] as const,
  },
  crane_rise_reveal: {
    start: 0.08,
    end: 0.72,
    startScale: 1.38,
    endScale: 1,
    focusStrength: 1,
    panX: [0, 0] as const,
    panY: [0.025, 0] as const,
  },
  pull_back_isolation: {
    start: 0.28,
    end: 0.82,
    startScale: 1,
    endScale: 0.92,
    focusStrength: 0.2,
    panX: [0, 0] as const,
    panY: [0, 0] as const,
  },
} as const;

export type ChartCameraProfile = keyof typeof chartCameraProfiles;

export type ChartCameraInput = {
  profile: ChartCameraProfile;
  frame: number;
  fps: number;
  durationInFrames: number;
  canvasWidth: number;
  canvasHeight: number;
  focusX: number;
  focusY: number;
};

export type ChartCameraTransform = {
  scale: number;
  x: number;
  y: number;
  origin: {x: number; y: number};
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

/**
 * Calculates a deterministic chart-camera transform for a rendered frame.
 * Coordinates are local to the element receiving the CSS transform.
 */
export const calculateChartCamera = ({
  profile,
  frame,
  fps,
  durationInFrames,
  canvasWidth,
  canvasHeight,
  focusX,
  focusY,
}: ChartCameraInput): ChartCameraTransform => {
  if (fps <= 0 || durationInFrames <= 0 || canvasWidth <= 0 || canvasHeight <= 0) {
    throw new Error('Camera timing and canvas dimensions must be positive.');
  }

  const config = chartCameraProfiles[profile];
  const lastFrame = Math.max(1, durationInFrames - 1);
  const normalizedFrame = clamp01(frame / lastFrame);
  const moveDuration = Math.max(1 / (fps * lastFrame), config.end - config.start);
  const linearProgress = clamp01((normalizedFrame - config.start) / moveDuration);

  // Crash focus intentionally lands fast, then settles by three percent.
  const easedProgress = profile === 'crash_focus'
    ? Math.min(1, smoothstep(linearProgress * 1.18))
    : smoothstep(linearProgress);
  const settle = profile === 'crash_focus'
    ? 1 + Math.sin(Math.PI * linearProgress) * 0.03
    : 1;

  const scale = mix(config.startScale, config.endScale, easedProgress) * settle;
  const origin = {x: canvasWidth / 2, y: canvasHeight / 2};
  const boundedFocusX = Math.min(canvasWidth, Math.max(0, focusX));
  const boundedFocusY = Math.min(canvasHeight, Math.max(0, focusY));
  const focusOffsetX = (origin.x - boundedFocusX) * (scale - 1) * config.focusStrength;
  const focusOffsetY = (origin.y - boundedFocusY) * (scale - 1) * config.focusStrength;
  const panX = mix(config.panX[0], config.panX[1], easedProgress) * canvasWidth;
  const panY = mix(config.panY[0], config.panY[1], easedProgress) * canvasHeight;

  return {
    scale,
    x: focusOffsetX + panX,
    y: focusOffsetY + panY,
    origin,
  };
};
