// Shared, deterministic checks. An audit reports gaps; it never invents data.
export const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const hasUrl = source => typeof source?.url === 'string' && /^https?:\/\/\S+$/.test(source.url);
const sourceList = value => Array.isArray(value) && value.some(hasUrl);
const datedWithin = (value, start, end) => isDate(value) && value >= start && value <= end;

function daysBefore(date, days) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() - days);
  return value.toISOString().slice(0, 10);
}

export function auditClub(data, { asOf } = {}) {
  const slug = data.team?.slug || 'unknown';
  const blockers = [];
  const coverage = [];
  const freshness = [];
  const add = (list, ref, message) => list.push(`${slug} ${ref}: ${message}`);

  if (!sourceList(data.team?.sources)) add(blockers, 'team', 'no linked team source');
  if (!isDate(data.team?.roster_as_of)) add(blockers, 'team', 'missing or invalid roster_as_of');
  if (asOf && data.team?.roster_as_of < asOf) add(freshness, 'team', `roster last checked ${data.team.roster_as_of}`);
  if (!data.manager) add(blockers, 'manager', 'missing manager');

  for (const person of [data.manager, ...(data.players || [])].filter(Boolean)) {
    const ref = person === data.manager ? 'manager' : `#${person.number} ${person.name_zh || ''}`;
    if (person.verification_status === 'verified') {
      if (!sourceList(person.sources)) add(blockers, ref, 'verified profile has no linked source');
      if (!isDate(person.verified_at)) add(blockers, ref, 'verified profile has no valid verified_at');
    }
    if (!person.player_image) add(coverage, ref, 'image missing');
    if (person.analytics) {
      if (!isDate(person.analytics.as_of)) add(blockers, ref, 'analytics missing valid as_of');
      if (!person.analytics.competition) add(blockers, ref, 'analytics missing competition');
      if (!sourceList(person.analytics.sources)) add(blockers, ref, 'analytics has no linked source');
    } else if (person !== data.manager) add(coverage, ref, 'advanced analytics not researched');
    for (const [index, trivia] of (person.trivia || []).entries()) {
      if (!trivia.text) add(blockers, `${ref} trivia ${index + 1}`, 'missing text');
      if (!['confirmed', 'reported', 'anecdotal'].includes(trivia.reliability)) add(blockers, `${ref} trivia ${index + 1}`, 'invalid reliability');
      if (trivia.reliability !== 'anecdotal' && !hasUrl(trivia.source)) add(blockers, `${ref} trivia ${index + 1}`, 'confirmed/reported trivia has no linked source');
    }
    if (!(person.trivia || []).length && !person.quirky_trivia && person !== data.manager) add(coverage, ref, 'sourced trivia not researched');
    for (const [index, interview] of (person.recent_interviews || []).entries()) {
      const interviewRef = `${ref} interview ${index + 1}`;
      if (!isDate(interview.published_at)) add(blockers, interviewRef, 'missing valid published_at');
      if (!hasUrl({ url: interview.url })) add(blockers, interviewRef, 'missing source URL');
      if (interview.quote_zh && !interview.quote_ja && interview.quote_type === 'direct') add(blockers, interviewRef, 'translated direct quote has no original-language text');
    }
    if (asOf && person !== data.manager) {
      const start = daysBefore(asOf, 7);
      const current = (person.recent_interviews || []).filter(row => datedWithin(row.published_at, start, asOf));
      if (!current.length) add(freshness, ref, `no interview found in ${start}..${asOf}; record search even when none exists`);
      if (!person.analytics || person.analytics.as_of < start) add(freshness, ref, 'analytics older than seven-day match window');
      if (!person.match_week || person.match_week.fixture_date !== asOf || !datedWithin(person.match_week.as_of, start, asOf)) add(freshness, ref, 'match-week note not prepared for this fixture');
    }
    for (const [index, row] of (person.career || []).entries()) {
      const rowRef = `${ref} career ${index + 1}`;
      // A null year is an explicit unresolved career period, even if the club is known.
      if (row.season == null || row.season === '') add(blockers, rowRef, 'season unresolved');
      if (row.verification_status === 'verified' && !sourceList(row.sources)) add(blockers, rowRef, 'verified row has no linked source');
      if (row.appearances == null) add(coverage, rowRef, 'appearances not established');
      if (row.goals == null) add(coverage, rowRef, 'goals not established');
    }
  }
  if (asOf && data.team?.current_season?.as_of < asOf) add(freshness, 'team', `current season statistics last checked ${data.team.current_season.as_of}`);
  return { slug, blockers, coverage, freshness };
}
