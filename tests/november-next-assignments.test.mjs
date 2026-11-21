import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {matchPages,renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
test('November 21 and 25 assignments preserve all sections, full schedules and honest preparation states',()=>{
 const index=read('data/matches/index.json');assert.deepEqual(index.fixtures.filter(f=>['2026-11-21','2026-11-25'].includes(f.date)).map(f=>f.date),['2026-11-21','2026-11-25']);assert.equal(index.featured.home,'hiroshima');
 for(const f of index.fixtures.filter(f=>['2026-11-21','2026-11-25'].includes(f.date))){assert.equal(matchPages(f).length,10);const d=read('data/matches/'+f.file),home=read('data/clubs/'+f.home+'.json'),away=read('data/clubs/'+f.away+'.json');
  assert.equal(d.as_of,f.date==='2026-11-21'?'2026-11-21':'2026-11-15');if(d.date==='2026-11-25')assert.equal(d.match_info.lineups_as_of,null);else assert.ok(d.match_info.lineups_as_of);assert.equal(d.competition,'j1');assert.equal(matchPages(d).length,10);assert.equal(Object.keys(d.section_status).length,10);assert.equal(new Set(d.standings.rows.map(r=>r.slug)).size,20);
  assert.equal(d.match_info.commentary.partner,f.date==='2026-11-21'?'高志超':'黃耀富');
  for(const t of Object.values(d.teams)){assert.equal(t.game_log.filter(g=>g.competition==='J1').length,38);assert.equal(t.game_log.filter(g=>g.competition==='J1'&&g.score).length,14);assert.ok(t.game_log.filter(g=>(g.date||g.sort_date)>'2026-11-15').every(g=>g.score===null));assert.equal(t.lineup.starters.length,d.date==='2026-11-21'?11:0);assert.equal(t.lineup.bench.length,d.date==='2026-11-21'?9:0);assert.equal(t.workload_absences.pending,d.date!=='2026-11-21');assert.ok(t.workload.minutes.every(r=>r.minutes>0||r.prior_minutes>0));for(const k of ['minutes','prior_minutes'])assert.equal(t.workload.minutes.reduce((s,r)=>s+r[k],0),990);}
  for(const page of matchPages(d)){const h=renderMatchPage({home,away,dossier:d,date:d.date,page:page.id});assert.ok(!/undefined|NaN/.test(h));}
  const cup=renderMatchPage({home,away,dossier:d,date:d.date,page:'cup'});assert.ok(cup.includes('全部 52 場'));assert.ok(cup.includes('晉級：浦和紅鑽'));assert.ok(cup.includes('晉級：柏太陽王'));assert.ok(!cup.includes('晉級：待定'));
 }
 const d=read('data/matches/2026-11-25-nagasaki-kawasaki.json');assert.equal(d.teams.kawasaki.game_log.find(g=>g.date==='2026-11-15').score,'4–5');assert.ok(d.coverage_gaps.some(g=>g.includes('11月21日')));assert.equal(d.teams.nagasaki.game_log.find(g=>g.date==='2026-09-29').venue,'客');const rotation=renderMatchPage({home:read('data/clubs/nagasaki.json'),away:read('data/clubs/kawasaki.json'),dossier:d,date:d.date,page:'rotation'});assert.ok(rotation.includes('期間另有未賽賽事'));assert.ok(!rotation.includes('｜中17日'));assert.ok(rotation.includes('2026-11-21'));
});

 test('November 19 refresh separates confirmed injury and suspension from reported availability',()=>{
 const d=read('data/matches/2026-11-21-hiroshima-yokohama-fm.json'),y=d.teams['yokohama-fm'],h=d.teams.hiroshima;
 const yamane=y.injuries.find(x=>x.number==='28');assert.equal(yamane.kind,'fact');assert.ok(yamane.text.includes('19分鐘'));assert.ok(yamane.text.includes('未公布日期'));assert.ok(yamane.sources.some(s=>s.url.endsWith('/10930')));assert.ok(yamane.sources.some(s=>s.url.includes('matchdata')));
 assert.deepEqual(y.suspensions.map(x=>x.number),['33','23']);assert.ok(y.suspensions.every(x=>x.match_date==='2026-11-21'&&x.availability_status==='suspended'));
 assert.equal(y.injuries.find(x=>x.number==='22').kind,'reported');assert.equal(h.injuries.find(x=>x.number==='37').kind,'reported');
 if(d.date==='2026-11-25')assert.equal(d.match_info.lineups_as_of,null);else assert.ok(d.match_info.lineups_as_of);for(const t of Object.values(d.teams)){assert.equal(t.lineup.starters.length,11);assert.equal(t.lineup.bench.length,9);}
 });

test('November 21 actual full squads reconcile all 40 permanent cards including yesterday youth registration',()=>{
const d=read('data/matches/2026-11-21-hiroshima-yokohama-fm.json');assert.equal(d.selection_audit.selected_count,40);assert.equal(d.match_info.officials.roles.length,6);assert.deepEqual(d.match_info.officials.roles.map(r=>r.id),['referee','assistant_1','assistant_2','fourth_official','var','avar']);assert.ok(d.match_info.officials.roles.every(r=>r.name_ja&&r.status==='confirmed'));
for(const slug of [d.home,d.away]){const c=read('data/clubs/'+slug+'.json');for(const p of [...d.teams[slug].lineup.starters,...d.teams[slug].lineup.bench]){assert.equal(p.has_card,true);assert.ok(c.players.find(q=>q.number===p.number&&q.id===p.player_id));}}
const c=read('data/clubs/yokohama-fm.json'),p=c.players.find(p=>p.number==='56');assert.equal(p.verification_status,'research_incomplete');assert.equal(p.official_player_id,'1659407');assert.ok(d.teams['yokohama-fm'].lineup.bench.some(p=>p.number==='56'));assert.ok(d.teams['yokohama-fm'].lineup.starters.some(p=>p.number==='54'));assert.ok(d.teams['yokohama-fm'].lineup.bench.some(p=>p.number==='55'));
const audit=d.selection_audit.card_evidence_audit;assert.equal(audit.players.length,40);assert.equal(audit.linked_cards,40);assert.equal(audit.biography_gate_pass,28);assert.equal(audit.biography_incomplete,12);
for(const r of audit.players){const card=read('data/clubs/'+r.team+'.json').players.find(p=>p.id===r.player_id);assert.equal(card.verification_status,r.biography_status);if(!r.biography_gate_pass){assert.equal(card.verification_status,'research_incomplete');assert.ok(card.research_gaps.length);}}
assert.ok(p.national_team_detail.includes('日本U15'));assert.ok(p.milestones.some(m=>m.includes('2024-08-12')));assert.ok(p.sources.some(s=>s.url.includes('jfa.jp')));assert.equal(p.foot,null);
assert.equal(d.standings.rows.find(r=>r.slug==='kashiwa').played,15);assert.equal(d.standings.rows.find(r=>r.slug==='kashiwa').goal_difference,10);
});

test('November 21 opening broadcast is the final Info section with larger read-aloud text',()=>{
 const d=read('data/matches/2026-11-21-hiroshima-yokohama-fm.json');
 const h=renderMatchPage({home:read('data/clubs/hiroshima.json'),away:read('data/clubs/yokohama-fm.json'),dossier:d,date:d.date,page:'info'});
 assert.equal(d.match_info.opening_broadcast.paragraphs.length,5);
 assert.ok(h.lastIndexOf('<h3>開波廣告</h3>')>h.lastIndexOf('<h3>本場故事線</h3>'));
 assert.ok(!h.slice(h.lastIndexOf('<h3>開波廣告</h3>')+18).includes('<h3>'));
 assert.ok(h.includes('font-size:1.1em'));assert.ok(h.includes('四十九次機會'));assert.ok(h.includes('中野就斗啱啱隨日本隊海外遠征'));
 const other=read('data/matches/2026-11-25-nagasaki-kawasaki.json');assert.equal(other.match_info.opening_broadcast,undefined);
});

test('matchday essentials cover forty official records while senior loan rows preserve honest biography state',()=>{
 const d=read('data/matches/2026-11-21-hiroshima-yokohama-fm.json');assert.equal(d.selection_audit.essentials_refresh.all_40_official_essentials_checked,true);
 for(const r of d.selection_audit.card_evidence_audit.players){const p=read('data/clubs/'+r.team+'.json').players.find(p=>p.id===r.player_id);assert.equal(p.essentials_verification.status,'verified_essentials_only');assert.ok(p.essentials_verification.sources.some(s=>s.accessed_at==='2026-11-21'));}
 const y=read('data/clubs/yokohama-fm.json').players;for(const [n,w] of [['24',68],['25',62],['32',72],['34',72],['41',63],['47',65]])assert.equal(y.find(p=>p.number===n).weight,w);
 const k=y.find(p=>p.number==='34');assert.ok(k.career.some(r=>r.season==='2023'&&r.team==='愛媛FC'&&r.status==='外借'));assert.ok(k.career.some(r=>r.season==='2024'&&r.team==='甲府風林'&&r.status==='外借'));
 const n=y.find(p=>p.number==='43');assert.ok(n.career.some(r=>r.team==='FC Wacker Innsbruck U23'&&r.appearances===19&&r.goals===21));assert.ok(n.career.some(r=>r.team==='FC Wacker Innsbruck'&&r.appearances===5&&r.goals===1));assert.ok(!n.intro.includes('效力奧地利薩爾斯堡'));
 assert.equal(y.find(p=>p.number==='41').verification_status,'research_incomplete');assert.ok(y.find(p=>p.number==='41').intro.includes('2027正式加盟內定'));
 const h=read('data/clubs/hiroshima.json').players;assert.equal(h.find(p=>p.number==='18').height,172);assert.equal(h.find(p=>p.number==='9').weight,93);
});
