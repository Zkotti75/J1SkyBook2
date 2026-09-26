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
