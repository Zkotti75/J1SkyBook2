// Shared, deterministic checks. An audit reports gaps; it never invents data.
import { isUndatedYouthRow } from './career-youth.mjs';
export const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const hasUrl = source => typeof source?.url === 'string' && /^https?:\/\/\S+$/.test(source.url);
const sourceList = value => Array.isArray(value) && value.some(hasUrl);
const datedWithin = (value, start, end) => isDate(value) && value >= start && value <= end;
const normalizeHost = url => {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
};

// Club pages are authoritative for identity, registration, shirt number, vitals
// and portraits. They are not sufficient as the main source for commentary copy.
const clubOfficialHosts = {
  'cerezo-osaka': ['cerezo.jp'],
  chiba: ['jefunited.co.jp'],
  'fc-tokyo': ['fctokyo.co.jp'],
  fukuoka: ['avispa.co.jp'],
  'gamba-osaka': ['gamba-osaka.net'],
  hiroshima: ['sanfrecce.co.jp'],
  kashima: ['antlers.co.jp'],
  kashiwa: ['reysol.co.jp'],
  kawasaki: ['frontale.co.jp'],
  kobe: ['vissel-kobe.co.jp'],
  kyoto: ['sanga-fc.jp'],
  machida: ['zelvia.co.jp'],
  mito: ['mito-hollyhock.net'],
  nagasaki: ['v-varen.com'],
  nagoya: ['nagoya-grampus.jp'],
  okayama: ['fagiano-okayama.com'],
  shimizu: ['s-pulse.co.jp'],
  'tokyo-verdy': ['verdy.co.jp'],
  urawa: ['urawa-reds.co.jp'],
  'yokohama-fm': ['f-marinos.com']
};

const genericPlayerCopy = [
  /加入前主要球隊[／/]育成路線/,
  /主要前度[／/]加入路線/,
  /現役(?:GK|DF|MF|FW)，#\d+/,
  /直播上的主要觀察點是#\d+與(?:GK|DF|MF|FW)功能/
];

function nonClubSourceHosts(person, slug) {
  const clubHosts = new Set(clubOfficialHosts[slug] || []);
  return new Set((person.sources || [])
    .filter(hasUrl)
    .map(source => normalizeHost(source.url))
    .filter(host => host && !clubHosts.has(host)));
}

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

  const repeatedCommentary = new Map();

  for (const person of [data.manager, ...(data.players || [])].filter(Boolean)) {
    const ref = person === data.manager ? 'manager' : `#${person.number} ${person.name_zh || ''}`;
    if (person.verification_status === 'verified') {
      if (!sourceList(person.sources)) add(blockers, ref, 'verified profile has no linked source');
      if (!isDate(person.verified_at)) add(blockers, ref, 'verified profile has no valid verified_at');
      if (person !== data.manager && nonClubSourceHosts(person, slug).size < 2) {
        add(blockers, ref, 'verified commentary profile needs at least two distinct non-club source domains');
      }
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
    if (person !== data.manager) {
      const serialized = JSON.stringify(person);
      if (genericPlayerCopy.some(pattern => pattern.test(serialized))) add(blockers, ref, 'contains generated placeholder or generic position copy');
      if ((person.intro || '').trim().length < 60) add(coverage, ref, 'commentary introduction is too thin');
      if ((person.timeline || []).length < 3) add(coverage, ref, 'career narrative has fewer than three dated stages');
      if ((person.milestones || []).length < 3) add(coverage, ref, 'fewer than three verified commentary milestones');
      if ((person.tactical_traits || []).length < 3) add(coverage, ref, 'fewer than three player-specific tactical observations');
      if (!(person.trivia || []).length && (person.quirky_trivia || '').trim().length < 35) add(coverage, ref, 'human-interest story not researched');
      if ((person.career || []).length < 3) add(blockers, ref, 'career table is a summary rather than a season-by-season history');
      if (!isDate(person.status_tags_reviewed_at)) add(coverage, ref, 'player status tags have not been reviewed');
      if (person.status_tags_reviewed_at && !sourceList(person.status_tag_sources)) add(blockers, ref, 'reviewed player status tags have no linked source');

      for (const text of [person.intro, ...(person.tactical_traits || [])]) {
        const normalized = (text || '').replace(/\s+/g, ' ').trim();
        if (normalized.length < 35) continue;
        const refs = repeatedCommentary.get(normalized) || [];
        refs.push(ref);
        repeatedCommentary.set(normalized, refs);
      }
    }
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
      if ((row.season == null || row.season === '') && !isUndatedYouthRow(row)) add(blockers, rowRef, 'season unresolved');
      if (row.verification_status === 'verified' && !sourceList(row.sources)) add(blockers, rowRef, 'verified row has no linked source');
      // Coaching history does not have player appearances or goals. Keeping the
      // shared row shape is useful, but null manager figures are not coverage gaps.
      if (person !== data.manager && row.appearances == null && !isUndatedYouthRow(row)) add(coverage, rowRef, 'appearances not established');
      if (person !== data.manager && row.goals == null && !isUndatedYouthRow(row)) add(coverage, rowRef, 'goals not established');
    }
  }
  for (const refs of repeatedCommentary.values()) {
    if (refs.length > 1) {
      for (const ref of refs) add(blockers, ref, `commentary copy is duplicated across ${refs.length} player profiles`);
    }
  }
  if (asOf && data.team?.current_season?.as_of < asOf) add(freshness, 'team', `current season statistics last checked ${data.team.current_season.as_of}`);
  return { slug, blockers, coverage, freshness };
}
