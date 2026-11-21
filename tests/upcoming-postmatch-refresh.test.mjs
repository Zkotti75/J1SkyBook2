import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {renderMatchPage,matchPages} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const dossiers=['2026-11-25-nagasaki-kawasaki','2026-11-28-kashiwa-hiroshima'].map(f=>read('data/matches/'+f+'.json'));
test('four independent Football LAB season samples retain verified values, ranks, patterns and cutoffs',()=>{
 const expected={nagasaki:['11.3',15,'1.038','1.383','10.8%','168.80','1 (5.9%)'],kawasaki:['14.9',6,'1.564','1.448','13.4%','249.34','0 (0.0%)'],kashiwa:['15.1',5,'1.480','1.347','14.6%','258.55','0 (0.0%)'],hiroshima:['18.7',1,'2.078','0.755','11.8%','306.45','2 (6.3%)']};
 const codes={nagasaki:'ngsk',kawasaki:'ka-f',kashiwa:'kasw',hiroshima:'hiro'};
 for(const d of dossiers)for(const [slug,t]of Object.entries(d.teams)){
  const m=t.team_metrics,e=expected[slug],get=(g,l)=>m[g].find(r=>r.label===l);
  assert.equal(get('basic','射門').value,e[0]);assert.equal(get('basic','射門').rank,e[1]);assert.equal(get('attack','xG').value,e[2]);assert.equal(get('defence','xGA').value,e[3]);assert.equal(get('basic','射門轉化率').value,e[4]);assert.equal(get('build_up','進攻CBP').value,e[5]);assert.equal(get('set_pieces','入球方式・十二碼').value,e[6]);
  for(const r of Object.values(m).flat()){assert.equal(r.as_of,'2026-11-13');assert.ok(r.sample.includes('首14場'));assert.ok(r.sources.every(s=>s.url==='https://www.football-lab.jp/'+codes[slug]));}
  assert.equal(m.set_pieces.length,20);assert.ok(!m.basic.some(r=>/跑動|衝刺/.test(r.label)));
 }
 const n=dossiers[0];const html=renderMatchPage({home:read('data/clubs/nagasaki.json'),away:read('data/clubs/kawasaki.json'),dossier:n,date:n.date,page:'analytics'});assert.ok(!/1\.507|1\.119|16\.4%/.test(html));assert.ok(html.includes('1.038'));assert.ok(html.includes('1.564'));
});
test('fresh results, 63 actual participant cards and timed workload remain separate from unknown next selections',()=>{
 let participants=0;
 for(const d of dossiers){assert.equal(matchPages(d).length,10);assert.equal(d.standings.rows.length,20);for(const [slug,t]of Object.entries(d.teams)){
  assert.equal(t.stats.played,15);assert.equal(t.game_log.filter(g=>g.competition==='J1'&&g.score).length,15);assert.equal(t.game_log.filter(g=>g.competition==='J1').length,38);assert.ok(t.game_log.filter(g=>g.date>'2026-11-21').every(g=>g.score===null));assert.deepEqual(t.lineup.starters,[]);assert.deepEqual(t.lineup.bench,[]);
  for(const key of ['minutes','prior_minutes'])assert.equal(t.workload.minutes.reduce((s,r)=>s+r[key],0),990);
  const cards=read('data/clubs/'+slug+'.json').players;for(const row of t.workload.minutes)assert.ok(cards.some(p=>p.number===row.number));participants+=d.participant_card_audit.teams[slug].actual_participants;
 }}assert.equal(participants,63);
 const h=dossiers[1].teams.hiroshima;assert.equal(h.game_log.find(g=>g.date==='2026-11-21').score,'2–2');assert.equal(h.workload.minutes.find(p=>p.number==='29').minutes,32);assert.equal(h.workload.minutes.find(p=>p.number==='22').minutes,58);assert.ok(h.injuries.find(p=>p.number==='29').text.includes('未確認原因'));
 const n=dossiers[0].teams.nagasaki;assert.ok(n.injuries.find(p=>p.number==='50').text.includes('韌帶損傷'));assert.equal(n.game_log.find(g=>g.date==='2026-11-21').score,'0–0');
});
