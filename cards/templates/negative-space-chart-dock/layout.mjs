const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const intersectionArea = (a, b, gap = 0) => {
  const bx = b.x - gap;
  const by = b.y - gap;
  const br = b.x + b.width + gap;
  const bb = b.y + b.height + gap;
  return Math.max(0, Math.min(a.x + a.width, br) - Math.max(a.x, bx))
    * Math.max(0, Math.min(a.y + a.height, bb) - Math.max(a.y, by));
};

/** Resolve an authored safe region into a chart dock that cannot cover focalBox. */
export const resolveDockRegion = ({
  focalBox,
  safeRegion,
  canvasWidth = 1920,
  canvasHeight = 1080,
  padding = 64,
  gap = 36,
  minWidth = 500,
  minHeight = 400,
}) => {
  const bounds = {x: padding, y: padding, width: canvasWidth - padding * 2, height: canvasHeight - padding * 2};
  const clipped = {
    x: clamp(safeRegion.x, bounds.x, bounds.x + bounds.width),
    y: clamp(safeRegion.y, bounds.y, bounds.y + bounds.height),
    width: Math.max(0, Math.min(safeRegion.x + safeRegion.width, bounds.x + bounds.width) - Math.max(safeRegion.x, bounds.x)),
    height: Math.max(0, Math.min(safeRegion.y + safeRegion.height, bounds.y + bounds.height) - Math.max(safeRegion.y, bounds.y)),
  };
  if (clipped.width >= minWidth && clipped.height >= minHeight && intersectionArea(clipped, focalBox, gap) === 0) {
    return {...clipped, relocated: false};
  }

  const left = {x: bounds.x, y: bounds.y, width: focalBox.x - gap - bounds.x, height: bounds.height};
  const rightX = focalBox.x + focalBox.width + gap;
  const right = {x: rightX, y: bounds.y, width: bounds.x + bounds.width - rightX, height: bounds.height};
  const top = {x: bounds.x, y: bounds.y, width: bounds.width, height: focalBox.y - gap - bounds.y};
  const bottomY = focalBox.y + focalBox.height + gap;
  const bottom = {x: bounds.x, y: bottomY, width: bounds.width, height: bounds.y + bounds.height - bottomY};
  const candidates = [left, right, top, bottom]
    .filter(region => region.width >= minWidth && region.height >= minHeight)
    .sort((a, b) => b.width * b.height - a.width * a.height);
  if (candidates.length === 0) {
    throw new Error('No non-overlapping chart dock fits focalBox inside the 64px safe area');
  }
  return {...candidates[0], relocated: true};
};

export const boxesOverlap = (a, b, gap = 0) => intersectionArea(a, b, gap) > 0;

const smoothstep = value => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

export const dockMotionAtFrame = ({frame, fps}) => {
  if (!Number.isFinite(frame) || !Number.isFinite(fps) || fps <= 0) throw new Error('Invalid frame or fps');
  const phase = (start, end) => smoothstep((frame / fps - start) / (end - start));
  return {
    scene: phase(0, 1.2),
    panel: phase(1.15, 2.25),
    bars: phase(2.25, 3.8),
    callout: phase(4.15, 5.45),
    settled: frame >= Math.round(6.5 * fps),
  };
};
