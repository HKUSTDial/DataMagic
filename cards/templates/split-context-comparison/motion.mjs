const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smoothstep = value => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Deterministic eight-second comparison choreography. All values are fully
 * settled from frame 198 onward, leaving 42 static frames at 30 fps.
 */
export const comparisonMotionAtFrame = ({frame, fps}) => {
  if (!Number.isFinite(frame) || !Number.isFinite(fps) || fps <= 0) {
    throw new Error('frame and fps must be finite; fps must be greater than zero');
  }
  const phase = (startSeconds, endSeconds) => smoothstep(
    (frame - startSeconds * fps) / ((endSeconds - startSeconds) * fps),
  );
  return {
    title: phase(0, 0.65),
    split: phase(0.45, 1.45),
    subjects: phase(1.05, 2.05),
    metrics: phase(2.0, 3.1),
    difference: phase(3.35, 4.45),
    takeaway: phase(4.8, 5.8),
    settled: frame >= Math.round(6.6 * fps),
  };
};
