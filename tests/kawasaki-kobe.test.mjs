import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage,inInterviewWindow} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-10-21-kawasaki-kobe.json');
const home=read('data/clubs/kawasaki.json'),away=read('data/clubs/kobe.json');
test('Wednesday assignment has ten-round totals, complete logs and unannounced lineups',()=>{
 assert.deepEqual(read('data/matches/index.json').featured,{home:d.home,away:d.away,date:d.date});
 for(const club of [home,away]){
  const t=d.teams[club.team.slug],league=t.game_log.filter(r=>r.round),played=league.filter(r=>r.score);
  assert.equal(league.length,38);assert.equal(new Set(league.map(r=>r.round)).size,38);assert.equal(played.length,10);
  const scores=played.map(r=>r.score.split('–').map(Number));
  assert.equal(scores.reduce((a,r)=>a+r[0],0),t.stats.goals_for);assert.equal(scores.reduce((a,r)=>a+r[1],0),t.stats.goals_against);
  assert.equal(scores.filter(r=>r[0]>r[1]).length*3+scores.filter(r=>r[0]===r[1]).length,t.stats.points);
  assert.equal(t.lineup.starters.length,0);assert.equal(t.lineup.bench.length,0);
  assert.equal(league.find(r=>r.date===d.date).score,null);
  for(const r of t.game_log){assert.ok(r.sort_date);if(r.sort_date>d.as_of)assert.equal(r.score,null);}
 }
 for(const r of d.standings.rows){assert.equal(r.played,10);assert.equal(r.points,r.wins*3+r.draws);}
 assert.equal(d.standings.rows.length,20);
 assert.equal(d.standings.rows.reduce((a,r)=>a+r.goals_for,0),d.standings.rows.reduce((a,r)=>a+r.goals_against,0));
 assert.equal(d.teams.kobe.game_log.find(r=>r.date==='2026-08-26').score,'2–1');
 assert.equal(d.teams.kobe.game_log.find(r=>r.date==='2026-09-23').score,'1–0');
 assert.equal(d.match_info.referee,null);assert.equal(d.match_info.lineups_as_of,null);
});
test('Wednesday research renders every page, dates sources and keeps recent voices in window',()=>{
 for(const {id} of MATCH_PAGES){const h=renderMatchPage({home,away,date:d.date,page:id,dossier:d});assert.ok(!h.includes('球員資料待核對'));assert.ok(!h.includes('介面初稿'));}
 for(const event of d.quote_events)for(const q of event.entries)assert.ok(inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));
 function walk(v){if(!v||typeof v!=='object')return;if(v.text){assert.ok(v.sources?.length);assert.ok(v.as_of<=d.as_of);}for(const x of Object.values(v))walk(x);}walk(d);
 const h=renderMatchPage({home,away,date:d.date,page:'players',dossier:d});
 assert.ok(h.includes('岩本悠庵'));assert.ok(h.includes('官方球員資料'));assert.ok(!h.includes('#/club/kobe/player/23'));
 assert.ok(d.teams.kawasaki.yellow_risk[0].text.includes('各3張'));
 assert.ok(d.teams.kobe.rotation_notes[0].text.includes('只換1名'));
});
