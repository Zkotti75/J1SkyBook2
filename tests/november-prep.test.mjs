import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
for(const file of ['2026-11-01-yokohama-fm-kawasaki.json','2026-11-01-machida-gamba-osaka.json'])test(file+' has usable tables, reconciled minutes and no invented matchday lineup',()=>{
 const d=read('data/matches/'+file);assert.equal(d.standings.rows.length,20);assert.equal(d.head_to_head_results.length,5);
 for(const slug of [d.home,d.away]){
  const t=d.teams[slug],league=t.game_log.filter(r=>r.competition==='J1');assert.equal(league.length,38);assert.equal(league.filter(r=>r.score).length,12);
  assert.ok(t.game_log.filter(r=>r.score).length>=5);assert.ok(t.game_log.filter(r=>!r.score&&r.date>=d.date).length>=5);
  assert.equal(t.workload.minutes.reduce((n,p)=>n+p.minutes,0),990);
  assert.equal(t.workload.minutes.filter(p=>p.started).length,11);
  assert.ok(t.player_metrics.length>20);assert.ok(t.team_metrics.basic.length>=5);assert.ok(t.yellow_risk.length);assert.equal(t.lineup.starters.length,0);
 }
 for(const page of MATCH_PAGES){const h=renderMatchPage({home:read('data/clubs/'+d.home+'.json'),away:read('data/clubs/'+d.away+'.json'),date:d.date,page:page.id,dossier:d});assert.ok(!h.includes('undefined'));assert.ok(!h.includes('href="https://'));assert.equal(h.includes('class="quick-read"'),page.id==='info');}
});
