// A named, sourced academy/school affiliation may have no published dates or match totals.
// Professional and mixed youth/professional placeholders remain invalid.
export const isUndatedYouthRow = row =>
  (row?.season == null || row.season === '') &&
  row?.appearances == null && row?.goals == null &&
  typeof row?.team === 'string' && row.team.trim().length > 1 &&
  !/加入前|育成路線|未詳|unknown/i.test(row.team) &&
  /小學|小学|中學|中学|高校|高中|學校|学校|少年|兒童|青訓|academy|youth|junior|u-\d\d|大學|大学|college/i.test(row.competition || '') &&
  !/職業|professional|senior/i.test(row.competition || '') &&
  Array.isArray(row.sources) && row.sources.some(source => /^https?:\/\/\S+$/.test(source?.url || ''));

// Only a purely developmental affiliation with no season statistics may span years.
export const isYouthOnlyRow = row =>
  /小學|小学|中學|中学|高校|高中|學校|学校|少年|兒童|青訓|academy|youth|junior|u-\d\d|大學|大学|college/i.test(row?.competition || '') &&
  !/J[1-3]|職業|professional|senior|一隊|聯賽|杯|盃|特別指定|二種/i.test(`${row?.competition || ''} ${row?.status || ''}`) &&
  row?.appearances == null && row?.goals == null;

export const yearSpan = season => {
  const match = /^(\d{4})(?:[–—-](\d{4}))?$/.exec(String(season || ''));
  if (!match) return null;
  const start = Number(match[1]);
  const end = Number(match[2] || match[1]);
  return end >= start && end - start <= 25 ? { start, end } : null;
};
