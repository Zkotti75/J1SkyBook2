import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage,inInterviewWindow} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-11-07-fc-tokyo-kashima.json');
const clubs=Object.fromEntries([d.home,d.away].map(s=>[s,read('data/clubs/'+s+'.json')]));
test('November 7 assignment has reconciled full-season records and same-cutoff standings',()=>{
 const index=read('data/matches/index.json');assert.deepEqual(index.featured,{home:d.home,away:d.away,date:d.date});
 assert.ok(index.fixtures.every(f=>f.date>='2026-11-06'));
 assert.equal(d.match_info.commentary.partner,'黃耀富');
 assert.equal(d.standings.rows.length,20);
 assert.equal(d.standings.rows.reduce((n,r)=>n+r.goals_for,0),d.standings.rows.reduce((n,r)=>n+r.goals_against,0));
 for(const s of [d.home,d.away]){
  const t=d.teams[s],rows=t.game_log.filter(r=>r.competition==='J1'),played=rows.filter(r=>r.score);
  assert.equal(rows.length,38);assert.equal(new Set(rows.map(r=>r.round)).size,38);assert.equal(played.length,13);
  const scores=played.map(r=>r.score.split('–').map(Number));
  assert.equal(scores.reduce((n,r)=>n+r[0],0),t.stats.goals_for);
  assert.equal(scores.reduce((n,r)=>n+r[1],0),t.stats.goals_against);
  assert.equal(t.stats.wins*3+t.stats.draws,t.stats.points);
  const table=d.standings.rows.find(r=>r.slug===s);assert.equal(table.points,t.stats.points);assert.equal(table.goals_for,t.stats.goals_for);assert.equal(table.goals_against,t.stats.goals_against);
  for(const r of t.game_log)if(r.sort_date>d.as_of)assert.equal(r.score,null);
  assert.equal(t.workload.minutes.reduce((n,r)=>n+r.minutes,0),990);assert.equal(t.workload.minutes.reduce((n,r)=>n+r.prior_minutes,0),990);
  assert.equal(t.previous_lineup.starting_changes,s==='kashima'?8:1);
 }
});
test('active roster statistics match usage and focus cards, with foreign-club spells excluded',()=>{
 for(const s of [d.home,d.away]){
  const t=d.teams[s];assert.equal(t.usage_metrics.length,s==='kashima'?38:32);
  for(const r of t.usage_metrics){const number=r.label.match(/^#(\d+)/)[1],card=clubs[s].players.find(p=>p.number===number),season=card.season_stats.find(r=>r.season==='2026/27'&&r.competition==='J1');assert.ok(season);assert.equal(season.as_of,'2026-11-06');}
  for(const group of Object.values(t.players_to_watch))for(const p of group){assert.ok(clubs[s].players.some(c=>String(c.number)===String(p.number)));assert.ok(p.description.length&&p.stats.length);}
 }
 const omori=clubs.kashima.players.find(p=>p.number==='19').season_stats.find(r=>r.season==='2026/27'&&r.competition==='J1');assert.equal(omori.appearances,1);assert.equal(omori.minutes,45);
 const araki=clubs.kashima.players.find(p=>p.number==='71');assert.equal(araki.registration_status,'已轉會離隊');
});
test('yellow risks exclude a two-yellow dismissal and unpublished teams stay unfilled',()=>{
 assert.deepEqual(d.teams['fc-tokyo'].yellow_risk.map(x=>x.number),['10']);assert.deepEqual(d.teams.kashima.yellow_risk.map(x=>x.number),['6','40']);
 for(const t of Object.values(d.teams)){assert.equal(t.lineup.starters.length,0);assert.equal(t.lineup.bench.length,0);for(const x of t.yellow_risk){assert.equal(x.yellow_cards,3);assert.equal(x.cards_to_suspension,1);assert.ok(x.sources.length);}}
 assert.equal(d.match_info.officials.status,'awaiting_appointment');assert.equal(d.match_info.officials.roles.length,0);
});
test('all nine sections render without source links or repeated quick-read panels',()=>{
 for(const {id} of MATCH_PAGES){const h=renderMatchPage({home:clubs[d.home],away:clubs[d.away],dossier:d,date:d.date,page:id});assert.ok(!h.includes('undefined'));assert.ok(!h.includes('href="https://'));assert.equal(h.includes('class="quick-read"'),id==='info');}
 for(const q of d.quote_events.flatMap(x=>x.entries))assert.ok(inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));
});

test('recent voices and total head-to-head record are visible in their intended sections',()=>{
 const ctx={home:clubs[d.home],away:clubs[d.away],dossier:d,date:d.date};
 const quotes=renderMatchPage({...ctx,page:'quotes'});assert.ok(quotes.includes('主教練訪問'));
 for(const q of d.quote_events.flatMap(x=>x.entries))assert.ok(quotes.includes(q.paraphrase_zh));
 const results=renderMatchPage({...ctx,page:'comparison'});assert.ok(results.includes('鹿島27勝10和13負'));
});
