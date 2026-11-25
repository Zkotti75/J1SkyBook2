import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evaluatePlayerCard} from '../scripts/research-quality.mjs';
import {renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-11-25-nagasaki-kawasaki.json');
const home=read('data/clubs/nagasaki.json'),away=read('data/clubs/kawasaki.json');
test('Nov25 official 22 starters and 18 substitutes retain 40 independently checked card identities and vitals',()=>{
 const ids=[];
 for(const c of [home,away]){
  const slug=c.team.slug,t=d.teams[slug],audit=d.participant_card_audit.teams[slug];
  assert.equal(t.lineup.starters.length,11);assert.equal(t.lineup.bench.length,9);
  assert.equal(audit.identity_checked,20);assert.equal(audit.vitals_checked,20);assert.equal(audit.players.length,20);
  assert.ok(audit.sources.some(s=>s.url.endsWith('/112506/lineup/')));
  for(const r of [...t.lineup.starters,...t.lineup.bench]){
   const p=c.players.find(p=>p.id===r.player_id),a=audit.players.find(p=>p.player_id===r.player_id);
   assert.ok(p);assert.ok(a);assert.equal(p.number,r.number);assert.equal(a.number,r.number);
   assert.ok(a.name_match&&a.dob_match&&a.vitals_match);
   assert.deepEqual([p.height,p.weight],[a.official_height,a.official_weight]);
   const gate=evaluatePlayerCard(p,slug);assert.ok(gate.ok,gate.issues.join('; '));ids.push(a.official_id);
  }
 }
 assert.equal(new Set(ids).size,40);
});
test('Ueda card total uses nine primary J1 sheets and excludes other seasons and staff',()=>{
 const r=d.match_info.referee_statistics_audit;
 assert.equal(r.competition,'2026/27 J1');assert.equal(r.games.length,9);
 assert.equal(r.games.reduce((n,g)=>n+g.yellow,0),24);assert.equal(r.games.reduce((n,g)=>n+g.red,0),1);
 assert.equal(r.yellow_per_match,2.67);assert.ok(r.games.every(g=>g.url.startsWith('https://data.j-league.or.jp/SFMS02/')));
 const html=renderMatchPage({home,away,date:d.date,dossier:d,page:'info'});
 assert.ok(html.includes('24次球員警告'));assert.ok(html.includes('40人相符'));
});
test('Santana current identity source and separated league seasons replace stale source and totals',()=>{
 const p=home.players.find(p=>p.number==='9');assert.ok(!JSON.stringify(p).includes('/1631299/'));
 assert.ok(p.sources.some(s=>s.url==='https://www.jleague.jp/player/1632264/'));
 const special=p.career.find(r=>r.season==='2026特別'),current=p.career.find(r=>r.season==='2026/27');
 assert.deepEqual([special.appearances,special.goals],[15,6]);assert.deepEqual([current.appearances,current.goals],[12,4]);
 assert.equal(p.season_stats.find(r=>r.season==='2026/27').as_of,'2026-11-21');
});
