import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {renderMatchPage,matchPages} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const dossiers=['2026-11-25-nagasaki-kawasaki','2026-11-28-kashiwa-hiroshima'].map(f=>read('data/matches/'+f+'.json'));
test('four independent Football LAB season samples retain verified values, ranks, patterns and cutoffs',()=>{
 const expected={nagasaki:['11.1',17,'1.026','1.395','10.2%','179.62','1 (5.9%)'],kawasaki:['15.1',5,'1.557','1.431','12.8%','268.36','0 (0.0%)'],kashiwa:['15.0',6,'1.470','1.286','13.8%','280.58','0 (0.0%)'],hiroshima:['18.7',1,'2.061','0.813','11.7%','320.23','2 (5.9%)']};
 const codes={nagasaki:'ngsk',kawasaki:'ka-f',kashiwa:'kasw',hiroshima:'hiro'};
 for(const d of dossiers)for(const [slug,t]of Object.entries(d.teams)){
  const m=t.team_metrics,e=expected[slug],get=(g,l)=>m[g].find(r=>r.label===l);
  assert.equal(get('basic','射門').value,e[0]);assert.equal(get('basic','射門').rank,e[1]);assert.equal(get('attack','xG').value,e[2]);assert.equal(get('defence','xGA').value,e[3]);assert.equal(get('basic','射門轉化率').value,e[4]);assert.equal(get('build_up','進攻CBP').value,e[5]);assert.equal(get('set_pieces','入球方式・十二碼').value,e[6]);
  for(const r of Object.values(m).flat()){assert.equal(r.as_of,'2026-11-22');assert.ok(r.sample.includes('首15場'));assert.ok(r.sources.every(s=>s.url==='https://www.football-lab.jp/'+codes[slug]));}
  assert.equal(m.set_pieces.length,20);assert.ok(!m.basic.some(r=>/跑動|衝刺/.test(r.label)));
 }
 const n=dossiers[0];const html=renderMatchPage({home:read('data/clubs/nagasaki.json'),away:read('data/clubs/kawasaki.json'),dossier:n,date:n.date,page:'analytics'});assert.ok(!/1\.507|1\.119|16\.4%/.test(html));assert.ok(html.includes('1.026'));assert.ok(html.includes('1.557'));
});
test('fresh results, actual participant cards and timed workload remain separate from announced selections',()=>{
 let participants=0;
 for(const d of dossiers){assert.equal(matchPages(d).length,10);assert.equal(d.standings.rows.length,20);for(const [slug,t]of Object.entries(d.teams)){
  assert.equal(t.stats.played,d.date==='2026-11-28'&&slug==='hiroshima'?16:15);assert.equal(t.game_log.filter(g=>g.competition==='J1'&&g.score).length,t.stats.played);assert.equal(t.game_log.filter(g=>g.competition==='J1').length,38);assert.ok(t.game_log.filter(g=>g.date>d.as_of).every(g=>g.score===null));assert.equal(t.lineup.starters.length,11);assert.equal(t.lineup.bench.length,9);
  for(const key of ['minutes','prior_minutes'])assert.equal(t.workload.minutes.reduce((s,r)=>s+r[key],0),990);
  const cards=read('data/clubs/'+slug+'.json').players;for(const row of t.workload.minutes)assert.ok(cards.some(p=>p.number===row.number));participants+=(d.participant_card_audit.previous_match_audit||d.participant_card_audit).teams[slug].actual_participants;
 }}assert.equal(participants,70);assert.equal(dossiers[1].teams.kashiwa.game_log.find(g=>g.date==='2026-11-24').score,'2–1');
 const h=dossiers[1].teams.hiroshima;assert.equal(h.game_log.find(g=>g.date==='2026-11-21').score,'2–2');assert.equal(h.workload.minutes.find(p=>p.number==='29').prior_minutes,32);assert.equal(h.workload.minutes.find(p=>p.number==='22').minutes,55);assert.ok(h.injuries.find(p=>p.number==='29').text.includes('未確認原因'));
 const n=dossiers[0].teams.nagasaki;assert.ok(n.injuries.find(p=>p.number==='50').text.includes('韌帶損傷'));assert.equal(n.game_log.find(g=>g.date==='2026-11-21').score,'0–0');
});

test('Nov24 pre-match refresh keeps conditional milestones, official selection uncertainty and U21 identities distinct',()=>{
 const d=dossiers[0],n=d.teams.nagasaki,k=d.teams.kawasaki;
 assert.equal(d.as_of,'2026-11-25');assert.ok(d.match_info.lineups_as_of);assert.equal(n.lineup.starters.length,11);assert.equal(k.lineup.bench.length,9);
 assert.ok(n.injuries.find(r=>r.number==='25').text.includes('64分鐘'));assert.equal(n.workload.minutes.find(r=>r.number==='25').minutes,26);
 assert.ok(k.milestones.some(r=>r.text.includes('149')&&r.text.includes('若本場有上陣')));assert.ok(n.milestones.some(r=>r.text.includes('48')&&r.text.includes('若本場射入兩球')));
 const notes=k.lineup.cues.map(r=>r.text).join(' ');assert.ok(notes.includes('#25川村求不是一隊#25山市秀翔'));assert.ok(notes.includes('#36廣瀬寧生不是一隊#36本間凜'));assert.ok(notes.includes('野田裕人63分鐘'));assert.ok(notes.includes('林駿佑90分鐘'));
 assert.ok(n.suspensions[0].sources.some(s=>s.url.endsWith('/35431/')));assert.ok(n.suspensions[0].text.includes('本場正式名單'));
 assert.ok(d.head_to_head.some(r=>r.text.includes('U21長崎0–4U21川崎')));assert.ok(d.head_to_head.some(r=>r.text.includes('成年一隊聯賽')));
 assert.equal(d.quote_events[0].entries[0].date_basis,'accessed');assert.ok(d.refresh_checkpoint.remaining.some(r=>r.includes('長崎U21逐人分鐘')));
});
