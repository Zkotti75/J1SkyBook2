import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {matchPages,renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
test('November 21 and 25 assignments preserve all sections, full schedules and honest preparation states',()=>{
 const index=read('data/matches/index.json');assert.deepEqual(index.fixtures.map(f=>f.date),['2026-11-21','2026-11-25']);assert.equal(index.featured.home,'hiroshima');
 for(const f of index.fixtures){assert.equal(matchPages(f).length,10);const d=read('data/matches/'+f.file),home=read('data/clubs/'+f.home+'.json'),away=read('data/clubs/'+f.away+'.json');
  assert.equal(d.as_of,'2026-11-15');assert.equal(d.match_info.lineups_as_of,null);assert.equal(d.competition,'j1');assert.equal(matchPages(d).length,10);assert.equal(Object.keys(d.section_status).length,10);assert.equal(new Set(d.standings.rows.map(r=>r.slug)).size,20);
  assert.equal(d.match_info.commentary.partner,f.date==='2026-11-21'?'高志超':'黃耀富');
  for(const t of Object.values(d.teams)){assert.equal(t.game_log.filter(g=>g.competition==='J1').length,38);assert.equal(t.game_log.filter(g=>g.competition==='J1'&&g.score).length,14);assert.ok(t.game_log.filter(g=>(g.date||g.sort_date)>'2026-11-15').every(g=>g.score===null));assert.deepEqual(t.lineup.starters,[]);assert.deepEqual(t.lineup.bench,[]);assert.equal(t.workload_absences.pending,true);assert.ok(t.workload.minutes.every(r=>r.minutes>0||r.prior_minutes>0));for(const k of ['minutes','prior_minutes'])assert.equal(t.workload.minutes.reduce((s,r)=>s+r[k],0),990);}
  for(const page of matchPages(d)){const h=renderMatchPage({home,away,dossier:d,date:d.date,page:page.id});assert.ok(!/undefined|NaN/.test(h));}
  const cup=renderMatchPage({home,away,dossier:d,date:d.date,page:'cup'});assert.ok(cup.includes('全部 52 場'));assert.ok(cup.includes('晉級：浦和紅鑽'));assert.ok(cup.includes('晉級：柏太陽王'));assert.ok(!cup.includes('晉級：待定'));
 }
 const d=read('data/matches/2026-11-25-nagasaki-kawasaki.json');assert.equal(d.teams.kawasaki.game_log.find(g=>g.date==='2026-11-15').score,'4–5');assert.ok(d.coverage_gaps.some(g=>g.includes('11月21日')));assert.equal(d.teams.nagasaki.game_log.find(g=>g.date==='2026-09-29').venue,'客');const rotation=renderMatchPage({home:read('data/clubs/nagasaki.json'),away:read('data/clubs/kawasaki.json'),dossier:d,date:d.date,page:'rotation'});assert.ok(rotation.includes('期間另有未賽賽事'));assert.ok(!rotation.includes('｜中17日'));assert.ok(rotation.includes('2026-11-21'));
});
