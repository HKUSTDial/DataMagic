const WINDOW = 14 * 24 * 60 * 60 * 1000;
const recent = (date, now) => {
  const timestamp = Date.parse(date || '');
  return Number.isFinite(timestamp) && timestamp <= now && now - timestamp < WINDOW;
};
export function cardStatus(card, history = {}, now = Date.now()) {
  if (recent(history.added?.[card.slug], now)) return 'new';
  if (recent(history.updated?.[card.slug], now)) return 'updated';
  return '';
}
export function sortRecentCards(cards, history = {}, now = Date.now()) {
  const priority = card => ({new: 2, updated: 1}[cardStatus(card, history, now)] || 0);
  return [...cards].sort((a, b) => priority(b) - priority(a) || (priority(a) === 0 ? 0 :
    (Date.parse(history.added?.[b.slug] || history.updated?.[b.slug] || '') || 0) -
    (Date.parse(history.added?.[a.slug] || history.updated?.[a.slug] || '') || 0)));
}
