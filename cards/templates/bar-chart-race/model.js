/** @typedef {{id: string, label: string, color: string, iconSrc?: string}} RaceEntity */
/** @typedef {{time: string, values: Record<string, number>}} RaceSnapshot */
/** @typedef {{title: string, subtitle: string, unit: string, source: string, topN: number, decimals: number, locale: string, entities: RaceEntity[], snapshots: RaceSnapshot[], highlightId?: string}} RaceProps */

/** @param {number} value @param {number} min @param {number} max */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
/** @param {number} from @param {number} to @param {number} amount */
const lerp = (from, to, amount) => from + (to - from) * amount;
/** @param {number} value */
const smoothstep = value => value * value * (3 - 2 * value);

/** @param {Record<string, number>} values @param {string[]} entityIds */
export const buildRankMap = (values, entityIds) => {
  const sorted = [...entityIds].sort((left, right) => {
    const delta = (values[right] ?? 0) - (values[left] ?? 0);
    return delta || left.localeCompare(right);
  });
  return new Map(sorted.map((id, index) => [id, index]));
};

/** @param {RaceProps} input */
export const validateRaceProps = input => {
  if (!input || typeof input !== 'object') throw new Error('Race props must be an object.');
  if (!Array.isArray(input.entities) || input.entities.length < 2) throw new Error('At least two entities are required.');
  if (!Array.isArray(input.snapshots) || input.snapshots.length < 2) throw new Error('At least two snapshots are required.');
  const ids = input.entities.map(entity => entity.id);
  if (new Set(ids).size !== ids.length) throw new Error('Entity ids must be unique.');
  if (input.highlightId !== undefined && !ids.includes(input.highlightId)) throw new Error('highlightId must identify an existing entity.');
  for (const entity of input.entities) {
    if (!entity.id || !entity.label || !entity.color) throw new Error('Every entity needs id, label, and color.');
  }
  const times = input.snapshots.map(snapshot => snapshot.time);
  if (new Set(times).size !== times.length) throw new Error('Snapshot times must be unique.');
  for (const snapshot of input.snapshots) {
    if (!snapshot.time || !snapshot.values || typeof snapshot.values !== 'object') throw new Error('Every snapshot needs time and values.');
    for (const [id, value] of Object.entries(snapshot.values)) {
      if (!ids.includes(id)) throw new Error(`Unknown entity id: ${id}`);
      if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid value for ${id} at ${snapshot.time}.`);
    }
  }
  if (!Number.isInteger(input.topN) || input.topN < 2 || input.topN > input.entities.length) throw new Error('topN is outside the entity range.');
  return input;
};

/** @param {RaceProps} input @param {number} rawProgress */
export const createRaceFrame = (input, rawProgress) => {
  validateRaceProps(input);
  const progress = clamp(rawProgress, 0, 1);
  const lastIndex = input.snapshots.length - 1;
  const scaled = progress * lastIndex;
  const startIndex = Math.min(Math.floor(scaled), lastIndex - 1);
  const endIndex = Math.min(startIndex + 1, lastIndex);
  const localProgress = progress === 1 ? 1 : scaled - startIndex;
  const eased = smoothstep(localProgress);
  const start = input.snapshots[startIndex];
  const end = input.snapshots[endIndex];
  const entityIds = input.entities.map(entity => entity.id);
  const startRanks = buildRankMap(start.values, entityIds);
  const endRanks = buildRankMap(end.values, entityIds);
  const interpolatedRows = input.entities.map(entity => {
    const startValue = start.values[entity.id] ?? 0;
    const endValue = end.values[entity.id] ?? 0;
    const startRank = startRanks.get(entity.id) ?? entityIds.length - 1;
    const endRank = endRanks.get(entity.id) ?? entityIds.length - 1;
    const rank = lerp(startRank, endRank, eased);
    return {
      ...entity,
      value: lerp(startValue, endValue, eased),
      rank,
      rankDelta: startRank - endRank,
      opacity: clamp(input.topN + 0.45 - rank, 0, 1),
    };
  });
  const currentValues = Object.fromEntries(interpolatedRows.map(row => [row.id, row.value]));
  const currentRanks = buildRankMap(currentValues, entityIds);
  const rankedRows = interpolatedRows.map(row => ({
    ...row,
    displayRank: currentRanks.get(row.id) ?? entityIds.length - 1,
  }));
  const rows = rankedRows.map(row => {
    const nearestHigherPriority = rankedRows
      .filter(other => other.displayRank < row.displayRank)
      .map(other => Math.abs(other.rank - row.rank))
      .reduce((nearest, distance) => Math.min(nearest, distance), Infinity);
    return {
      ...row,
      contentOpacity: clamp((nearestHigherPriority - 0.18) / 0.4, 0, 1),
    };
  });
  const maxValue = Math.max(1, ...rows.map(row => row.value));
  const leader = [...rows].sort((a, b) => a.displayRank - b.displayRank)[0];
  return {
    progress,
    segmentProgress: eased,
    startIndex,
    endIndex,
    time: localProgress < 0.5 ? start.time : end.time,
    rows,
    maxValue,
    leader,
  };
};

/** @param {number} value @param {string} locale @param {number} decimals */
export const formatRaceValue = (value, locale = 'zh-CN', decimals = 0) => new Intl.NumberFormat(locale, {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
}).format(value);
