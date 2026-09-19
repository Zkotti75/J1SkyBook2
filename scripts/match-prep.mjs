import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { auditClub, isDate } from './audit-club.mjs';

const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--') && a.includes('=')).map(a => a.slice(2).split(/=(.*)/s).slice(0, 2)));
const manifest = JSON.parse(await readFile(resolve('data/teams.json'), 'utf8'));
const find = input => manifest.teams.find(t => [t.slug, t.name_zh, t.name_ja, t.name_en].some(n => n?.toLowerCase() === input?.toLowerCase()));
const home = find(args.home);
const away = find(args.away);
const date = args.date;
const interviewCutoff = (() => { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - 7); return d.toISOString().slice(0, 10); })();
if (!home || !away || home.slug === away.slug || !isDate(date)) {
  console.error('Usage: npm run match:prep -- --home=fc-tokyo --away=machida --date=2026-09-26 [--format=json]');
  console.error('Use distinct club slugs or exact Chinese, Japanese or English names, and an ISO match date.');
  process.exit(2);
}

async function prepare(listed) {
  const data = JSON.parse(await readFile(resolve('data/clubs', `${listed.slug}.json`), 'utf8'));
  const audit = auditClub(data, { asOf: date });
  const season = manifest.competition;
  const players = data.players || [];
  const stalePlayers = players.filter(p => !isDate(p.verified_at) || p.verified_at < date);
  const statsMissing = players.filter(p => !(p.season_stats || []).some(s => s.season === '2026/27' && s.as_of >= date));
  const analyticsMissing = players.filter(p => !p.analytics?.as_of || p.analytics.as_of < interviewCutoff);
  const interviewsToSearch = players.filter(p => !(p.recent_interviews || []).some(i => i.published_at >= interviewCutoff && i.published_at <= date));
  const matchWeekMissing = players.filter(p => p.match_week?.fixture_date !== date);
  return {
    slug: listed.slug, name: listed.name_zh, season,
    roster_as_of: data.team.roster_as_of || null,
    manager: data.manager?.name_zh || null,
    player_count: players.length,
    stale_players: stalePlayers.map(p => `#${p.number} ${p.name_zh}`),
    current_stats_to_check: statsMissing.map(p => `#${p.number} ${p.name_zh}`),
    analytics_to_check: analyticsMissing.map(p => `#${p.number} ${p.name_zh}`),
    interviews_to_search: interviewsToSearch.map(p => `#${p.number} ${p.name_zh}`),
    match_week_to_prepare: matchWeekMissing.map(p => `#${p.number} ${p.name_zh}`),
    ...audit,
  };
}
const clubs = [await prepare(home), await prepare(away)];
if (args.format === 'json') console.log(JSON.stringify({ match_date: date, clubs }, null, 2));
else {
  console.log(`# Match preparation: ${home.name_zh} 對 ${away.name_zh} (${date})`);
  console.log('\nCheck official J.League and club squad lists, club announcements, match reports and standings as of the match date. Record the URL and check date for each change. Preserve TVB Hong Kong Chinese player names; do not infer unknown figures.');
  for (const c of clubs) {
    console.log(`\n## ${c.name} (${c.slug}) — ${c.player_count} players, manager ${c.manager || 'missing'}`);
    console.log(`Roster last checked: ${c.roster_as_of || 'unknown'}; ${c.blockers.length} strict blockers; ${c.coverage.length} coverage gaps.`);
    console.log('- Verify additions, departures, shirt numbers, loans, special registrations, suspensions and injuries against dated official announcements.');
    console.log('- Update team.current_season, recent_seasons, manager, transfers and relevant commentary notes with sources.');
    console.log('- Update each player’s current season statistics and source/as_of; revisit affected career rows.');
    console.log('- Edit data/clubs/' + c.slug + '.json, then run npm run validate:strict -- --club=' + c.slug + '.');
    if (c.freshness.length) console.log('Freshness: ' + c.freshness.join('; '));
    console.log(`Profiles to recheck (${c.stale_players.length}): ${c.stale_players.join(', ') || 'none'}`);
    console.log(`Current season stats to check (${c.current_stats_to_check.length}): ${c.current_stats_to_check.join(', ') || 'none'}`);
    console.log(`Advanced analytics to refresh (${c.analytics_to_check.length}): ${c.analytics_to_check.join(', ') || 'none'}`);
    console.log(`Past-seven-day interviews to search (${c.interviews_to_search.length}): ${c.interviews_to_search.join(', ') || 'none'}`);
    console.log(`Match-week notes to prepare (${c.match_week_to_prepare.length}): ${c.match_week_to_prepare.join(', ') || 'none'}`);
    console.log(`First strict blockers (${Math.min(10,c.blockers.length)}): ${c.blockers.slice(0,10).join('; ') || 'none'}`);
  }
  console.log('\nOnce both club files are updated, run npm run validate:strict. Keep unresolved career periods visible in the audit report.');
}
