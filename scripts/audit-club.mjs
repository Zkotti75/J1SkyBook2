// Shared, deterministic checks. An audit reports gaps; it never invents data.
export const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const hasUrl = source => typeof source?.url === 'string' && /^https?:\/\/\S+$/.test(source.url);
const sourceList = value => Array.isArray(value) && value.some(hasUrl);

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
