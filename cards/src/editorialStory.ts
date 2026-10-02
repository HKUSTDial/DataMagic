export type DatedValue = {label: string; value: number};
export type Contribution = {label: string; value: number; at: number; caption: string; iconSrc?: string};
export type TierItem = {id: string; label: string; before: number; after: number; at: number; iconSrc?: string};
export type Tier = {label: string; minimum: number};
export const checkedText = (value: string, limit: number) => {
  if (!value || value.length > limit) throw new Error(`Text must contain 1–${limit} characters.`);
};
export function validateSeries(points: DatedValue[], domain: [number, number], focus: number) {
  if (points.length < 4 || points.length > 7) throw new Error('Use 4–7 points.');
  if (!domain.every(Number.isFinite) || domain[0] >= 0 || domain[1] <= 0) throw new Error('Use a shared signed domain around zero.');
  if (!Number.isInteger(focus) || focus < 0 || focus >= points.length) throw new Error('Invalid focus index.');
  for (const point of points) {
    checkedText(point.label, 8);
    if (!Number.isFinite(point.value) || point.value < domain[0] || point.value > domain[1]) throw new Error('Series value outside shared domain.');
  }
}
export function contributionSteps(baseline: number, parts: Contribution[], maximum: number) {
  if (!Number.isFinite(baseline) || baseline < 0 || !Number.isFinite(maximum) || maximum <= 0 || baseline > maximum) throw new Error('Invalid contribution scale.');
  if (parts.length < 2 || parts.length > 3) throw new Error('Use 2–3 contributions.');
  let running = baseline;
  let previous = 2;
  const steps = parts.map(part => {
    checkedText(part.label, 10); checkedText(part.caption, 44);
    if (!Number.isFinite(part.value) || !Number.isFinite(part.at) || part.at < previous + 1 || part.at > 8) throw new Error('Invalid contribution value or reveal beat.');
    const start = running; running += part.value; previous = part.at;
    if (running < 0 || running > maximum) throw new Error('Cumulative value outside shared scale.');
    return {...part, start, end: running};
  });
  return {steps, final: running};
}
export function validateTiers(tiers: Tier[], items: TierItem[], maximum: number) {
  if (tiers.length !== 3 || items.length < 3 || items.length > 5) throw new Error('Use 3 tiers and 3–5 entities.');
  if (!Number.isFinite(maximum) || maximum <= 0) throw new Error('Invalid tier scale.');
  if (tiers.some((tier, i) => !Number.isFinite(tier.minimum) || tier.minimum < 0 || tier.minimum > maximum || (i > 0 && tier.minimum >= tiers[i-1].minimum)) || tiers[2].minimum !== 0) throw new Error('Tier thresholds must descend to zero.');
  tiers.forEach(tier => checkedText(tier.label, 8));
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('Entity IDs must be unique.');
  items.forEach(item => {
    checkedText(item.label, 8);
    if (![item.before, item.after].every(value => Number.isFinite(value) && value >= 0 && value <= maximum) || !Number.isFinite(item.at) || item.at < 3 || item.at > 8) throw new Error('Invalid entity value or update beat.');
  });
  const times = items.filter(item => item.before !== item.after).map(item => item.at).sort((a,b) => a-b);
  if (times.some((at,i) => i > 0 && at - times[i-1] < 1)) throw new Error('Updates must leave time to read.');
}
export const tierIndex = (tiers: Tier[], value: number) => {
  const index = tiers.findIndex(tier => value >= tier.minimum);
  if (index < 0) throw new Error('Value has no tier.');
  return index;
};
export const numeric = (value: number) => Number(value.toFixed(2)).toString();
