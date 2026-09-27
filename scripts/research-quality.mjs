import { isUndatedYouthRow } from './career-youth.mjs';

const officialHosts = {
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

const genericCopy = [
  /加入前主要球隊[／/]育成路線/,
  /主要前度[／/]加入路線/,
  /現役(?:GK|DF|MF|FW)，#\d+/,
  /直播上的主要觀察點是#\d+與(?:GK|DF|MF|FW)功能/
];

export const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
export const hasUrl = source => typeof source?.url === 'string' && /^https?:\/\/\S+$/.test(source.url);

export function normalizeHost(url) {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'wikipedia.org' || host.endsWith('.wikipedia.org')) return 'wikipedia.org';
    return host;
  } catch {
    return '';
  }
}

export function nonClubSourceHosts(player, slug) {
  const clubHosts = new Set(officialHosts[slug] || []);
  return new Set((player.sources || [])
    .filter(hasUrl)
    .map(source => normalizeHost(source.url))
    .filter(host => host && ![...clubHosts].some(club => host === club || host.endsWith(`.${club}`))));
}

export function evaluatePlayerCard(player, slug) {
  const issues = [];
  const coverage = [];
  const ref = `#${player.number || '?'} ${player.name_zh || player.name_en || ''}`.trim();
  const requiredIdentity = ['id', 'number', 'name_zh', 'name_ja', 'name_en', 'position', 'dob'];
  for (const key of requiredIdentity) if (!player[key]) issues.push(`${ref}: missing ${key}`);
  if (!['GK', 'DF', 'MF', 'FW'].includes(player.position)) issues.push(`${ref}: invalid position`);
  if (player.verification_status !== 'verified') issues.push(`${ref}: verification_status is not verified`);
  if (!isDate(player.verified_at)) issues.push(`${ref}: verified_at is missing or invalid`);
  if (!(player.sources || []).some(hasUrl)) issues.push(`${ref}: profile has no linked sources`);
  for (const source of player.sources || []) {
    if (hasUrl(source) && !isDate(source.accessed_at)) issues.push(`${ref}: source ${source.url} has no valid accessed_at date`);
  }

  const outsideHosts = nonClubSourceHosts(player, slug);
  if (outsideHosts.size < 2) issues.push(`${ref}: fewer than two distinct non-current-club source domains`);

  const serialized = JSON.stringify(player);
  if (genericCopy.some(pattern => pattern.test(serialized))) issues.push(`${ref}: generated or generic commentary copy remains`);
  if ((player.intro || '').trim().length < 60) issues.push(`${ref}: commentary introduction is too thin`);
  if ((player.career || []).length < 3) issues.push(`${ref}: career table is a summary, not a season-by-season history`);
  const audit = player.career_audit;
  const undatedFirstYouth = isUndatedYouthRow(player.career?.[0]);
  if (!audit || !isDate(audit.reviewed_at) || !(audit.sources || []).some(hasUrl) ||
      !(Number.isInteger(audit.earliest_known_year) || (undatedFirstYouth && audit.earliest_known_year == null))) {
    issues.push(`${ref}: full career route has not been explicitly audited against an early-youth source`);
  } else if (!undatedFirstYouth && Number(player.career?.[0]?.season) !== audit.earliest_known_year) {
    issues.push(`${ref}: first career row does not match the audited earliest known season`);
  }
  const years = new Set((player.career || []).map(row => /^\d{4}/.exec(String(row.season || ''))?.[0]).filter(Boolean));
  const firstYear = Number((player.career || []).find(row => /^\d{4}/.test(String(row.season || '')))?.season?.slice(0, 4));
  if (Number.isInteger(firstYear) && firstYear >= 1900 && firstYear <= 2026) {
    for (let year = firstYear; year <= 2026; year++) {
      if (!years.has(String(year))) issues.push(`${ref}: career table omits ${year}`);
    }
  }
  for (const [index, row] of (player.career || []).entries()) {
    if ((row.season == null || row.season === '') && !isUndatedYouthRow(row)) issues.push(`${ref}: career row ${index + 1} has no season`);
    if (/[–—-].*\d{4}|至今|present/i.test(row.season || '')) issues.push(`${ref}: career row ${index + 1} is not a single-season entry`);
    if (/\s[／/]\s|大學／|高校／/.test(row.team || '')) issues.push(`${ref}: career row ${index + 1} conflates separate clubs or schools`);
    if (row.verification_status === 'verified' && !(row.sources || []).some(hasUrl)) issues.push(`${ref}: verified career row ${index + 1} has no linked source`);
    if (row.appearances != null && (!Number.isInteger(row.appearances) || row.appearances < 0)) issues.push(`${ref}: career row ${index + 1} has invalid appearances`);
    if (row.goals != null && (!Number.isInteger(row.goals) || row.goals < 0)) issues.push(`${ref}: career row ${index + 1} has invalid goals`);
  }

  const age = Number(player.season_start_age ?? player.age);
  const milestoneMinimum = Number.isFinite(age) && age < 21 ? 2 : 3;
  if ((player.milestones || []).length < milestoneMinimum) issues.push(`${ref}: insufficient concrete milestones`);
  if ((player.tactical_traits || []).length < 3) issues.push(`${ref}: fewer than three player-specific tactical observations`);
  if (!(player.trivia || []).length && (player.quirky_trivia || '').trim().length < 35) issues.push(`${ref}: human-interest research is missing`);

  if (!player.birthplace) coverage.push(`${ref}: birthplace not established`);
  if (player.height == null || player.weight == null) coverage.push(`${ref}: height/weight incomplete`);
  if (!player.player_image) coverage.push(`${ref}: official portrait missing`);
  if (!(player.season_stats || []).length) coverage.push(`${ref}: recent season statistics not populated`);
  if (!isDate(player.status_tags_reviewed_at)) coverage.push(`${ref}: status tags not yet audited`);

  return { ref, ok: issues.length === 0, issues, coverage, outsideHosts: [...outsideHosts].sort() };
}

export function estimatePlayerWeight(player) {
  const age = Number(player.season_start_age ?? player.age);
  const nonJapanese = player.nationality && !['日本', 'Japan', 'Japanese'].includes(player.nationality);
  return (Number.isFinite(age) && age >= 31) || (nonJapanese && Number.isFinite(age) && age >= 27) ? 2 : 1;
}
