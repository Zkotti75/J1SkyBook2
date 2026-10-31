import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage,inInterviewWindow} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-10-18-machida-fukuoka.json');
const home=read('data/clubs/machida.json'),away=read('data/clubs/fukuoka.json');
test('new assignment renders all pages and reconciles ninth-round totals',()=>{
 for(const {id} of MATCH_PAGES)assert.ok(!renderMatchPage({home,away,date:d.date,page:id,dossier:d}).includes('介面初稿'));
 assert.equal(d.standings.rows.length,20);
 assert.equal(d.standings.rows.reduce((n,r)=>n+r.goals_for,0),d.standings.rows.reduce((n,r)=>n+r.goals_against,0));
 for(const club of [home,away]){
 const t=d.teams[club.team.slug],rows=t.game_log.filter(r=>r.round),played=rows.filter(r=>r.score);
 assert.equal(rows.length,38);assert.equal(new Set(rows.map(r=>r.round)).size,38);assert.equal(played.length,9);
 const scores=played.map(r=>r.score.split('–').map(Number));
 assert.equal(scores.reduce((n,r)=>n+r[0],0),t.stats.goals_for);assert.equal(scores.reduce((n,r)=>n+r[1],0),t.stats.goals_against);
 assert.equal(scores.filter(r=>r[0]>r[1]).length,t.stats.wins);
 for(const r of t.game_log)if(r.date>d.as_of)assert.equal(r.score,null);
 for(const group of Object.values(t.players_to_watch))for(const p of group)assert.ok(club.players.some(a=>String(a.number)===String(p.number)));
 }
 for(const event of d.quote_events)for(const q of event.entries)assert.ok(inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));
 function walk(v){if(!v||typeof v!=='object')return;if(v.text){assert.ok(v.sources?.length);assert.ok(v.as_of<=d.as_of);}for(const a of Object.values(v))walk(a);}walk(d);
 assert.ok(d.teams.machida.suspensions[0].text.includes('10月18日'));
 assert.ok(d.teams.fukuoka.suspensions[0].text.includes('10月18日'));
});

test('current voices retain video attribution without external links or invented transcripts',()=>{
 const html=renderMatchPage({home,away,date:d.date,page:'quotes',dossier:d});
 assert.ok(!html.includes('href="https://'));assert.ok(!html.includes('NOiJbYcFX3c'));assert.ok(!html.includes('5-byfqXCrdE'));
 assert.ok(html.includes('未核對逐字稿'));assert.ok(html.includes('覆核日 2026-10-16'));
 assert.ok(!html.includes('10月10日｜'));
 assert.equal(home.players.find(p=>p.number==='5').name_zh,'迪沙域');
});

test('matchday lineups, bans and returnee agree with player cards',()=>{
 for(const club of [home,away]){
  const t=d.teams[club.team.slug];
  assert.equal(t.lineup.starters.length,11);
  const roster=[...t.lineup.starters,...t.lineup.bench].map(x=>x.text.match(/^#(\d+) /)[1]);
  assert.equal(new Set(roster).size,roster.length);
  for(const p of club.players){
   const selection=p.match_week?.selection_status || '';
   assert.equal(selection==='官方正選',t.lineup.starters.some(x=>x.text.startsWith(`#${p.number} `)));
   assert.equal(selection==='官方後備',t.lineup.bench.some(x=>x.text.startsWith(`#${p.number} `)));
  }
 }
 assert.ok(!d.teams.machida.lineup.starters.some(x=>x.text.startsWith('#18 ')));
 assert.ok(!d.teams.fukuoka.lineup.starters.some(x=>x.text.startsWith('#5 ')));
 assert.ok(d.teams.fukuoka.lineup.starters.some(x=>x.text.startsWith('#11 ')));
 const p=home.players.find(p=>p.number==='60');
 assert.equal(p.verification_status,'research_incomplete');
 assert.ok(p.sources.some(s=>s.url.includes('news-363694')));
 assert.ok(p.match_week.selection_status.includes('未列'));
 assert.equal(d.match_info.referee,'飯田淳平');
 assert.equal(d.teams.machida.stats.rank,4);
 for(const slug of ['machida','fukuoka'])assert.equal(d.teams[slug].game_log.find(r=>r.date===d.date).score,null);
 const html=renderMatchPage({home,away,date:d.date,page:'live',dossier:d});
 assert.ok(html.includes('小畑裕馬') && html.includes('前田快'));
});
