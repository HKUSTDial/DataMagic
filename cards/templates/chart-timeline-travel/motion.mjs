const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const smoothstep = value => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const easeOutCubic = value => {
  const t = clamp(value, 0, 1);
  return 1 - (1 - t) ** 3;
};

/**
 * Deterministic camera timing shared by previews and tests. Each milestone gets
 * a short reading hold followed by a smooth travel. The last move uses a cubic
 * ease-out so the camera visibly brakes before the final conclusion.
 */
export const cameraStateAtFrame = ({frame, fps, periodCount}) => {
  if (!Number.isFinite(frame) || !Number.isFinite(fps) || fps <= 0) {
    throw new Error('frame and fps must be finite; fps must be greater than zero');
  }
  if (!Number.isInteger(periodCount) || periodCount < 2) {
    throw new Error('periodCount must be an integer of at least two');
  }

  const introFrames = Math.round(fps * 0.75);
  const holdFrames = Math.round(fps * 0.36);
  const travelFrames = Math.round(fps * 1.18);
  const segmentFrames = holdFrames + travelFrames;
  const elapsed = Math.max(0, frame - introFrames);
  const lastSegment = periodCount - 2;
  const rawSegment = Math.floor(elapsed / segmentFrames);

  if (rawSegment > lastSegment) {
    return {
      focusIndex: periodCount - 1,
      activeIndex: periodCount - 1,
      zoom: 1.065,
      settled: true,
    };
  }

  const segment = clamp(rawSegment, 0, lastSegment);
  const localFrame = elapsed - segment * segmentFrames;
  const travelProgress = clamp((localFrame - holdFrames) / travelFrames, 0, 1);
  const easedProgress = segment === lastSegment
    ? easeOutCubic(travelProgress)
    : smoothstep(travelProgress);
  const focusIndex = segment + easedProgress;
  const stopEmphasis = smoothstep(Math.abs(travelProgress - 0.5) * 2);
  const finalEmphasis = segment === lastSegment ? easedProgress : 0;

  return {
    focusIndex,
    activeIndex: clamp(Math.round(focusIndex), 0, periodCount - 1),
    zoom: 1 + stopEmphasis * 0.018 + finalEmphasis * 0.047,
    settled: false,
  };
};

