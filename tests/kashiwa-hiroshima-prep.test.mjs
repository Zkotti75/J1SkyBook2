import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {matchPages,renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-11-28-kashiwa-hiroshima.json'),home=read('data/clubs/kashiwa.json'),away=read('data/clubs/hiroshima.json'),audit=read('data/registration-audits/2026-11-17-kashiwa-hiroshima.json');
test('November 28 adds an independent initial preparation without replacing the two published assignments',()=>{
 const index=read('data/matches/index.json');assert.deepEqual(index.featured,{home:'kashiwa',away:'hiroshima',date:'2026-11-28'});assert.deepEqual(index.fixtures.map(f=>f.date),['2026-11-28']);
 assert.equal(d.as_of,'2026-11-28');assert.equal(d.competition,'j1');assert.equal(d.match_info.commentary.partner,'高志超');assert.equal(d.match_info.broadcast_hkt,'14:55');assert.equal(d.match_info.kickoff_jst,'16:00');assert.ok(d.match_info.kickoff_hkt.startsWith('15:00'));assert.ok(d.match_info.events.some(c=>c.text.includes('16:03')));assert.ok(d.match_info.lineups_as_of.includes('HKT'));assert.equal(d.match_info.officials.status,'confirmed');
 assert.equal(matchPages(d).length,10);assert.equal(Object.keys(d.section_status).length,10);assert.equal(new Set(d.standings.rows.map(r=>r.slug)).size,20);
 for(const slug of [d.home,d.away]){const t=d.teams[slug],league=t.game_log.filter(g=>g.competition==='J1');assert.equal(league.length,38);assert.equal(league.filter(g=>g.score).length,slug==='hiroshima'?16:15);assert.ok(t.game_log.filter(g=>(g.date||g.sort_date)>d.as_of).every(g=>g.score===null));assert.equal(t.lineup.starters.length,11);assert.equal(t.lineup.bench.length,9);for(const key of ['minutes','prior_minutes'])assert.equal(t.workload.minutes.reduce((s,p)=>s+p[key],0),990);}
 assert.equal(d.teams.kashiwa.game_log.find(g=>g.date==='2026-11-15').score,'5–4');assert.equal(d.cup_tournament.results.length,52);assert.ok(d.cup_tournament.semi_finals[0].label.includes('柏'));
 for(const p of matchPages(d)){const html=renderMatchPage({home,away,dossier:d,date:d.date,page:p.id});assert.ok(!/undefined|NaN/.test(html));assert.ok(html.includes(p.label));}
 const rotation=renderMatchPage({home,away,dossier:d,date:d.date,page:'rotation'});assert.ok(!rotation.includes('期間另有未賽賽事'));assert.ok(rotation.includes('2026-11-24'));assert.ok(rotation.includes('2026-11-25'));
 const quotes=renderMatchPage({home,away,dossier:d,date:d.date,page:'quotes'});assert.ok(!quotes.includes('11月15日賽後背景'));assert.ok(JSON.stringify(d.quote_events).includes('第二點'));
});
test('all 73 official registrations resolve to cards while new youth biographies remain incomplete',()=>{
 for(const [slug,club,count] of [['kashiwa',home,42],['hiroshima',away,31]]){const records=audit.clubs[slug].players;assert.equal(records.length,count);assert.equal(new Set(records.map(r=>r.playerId)).size,count);for(const r of records){const card=club.players.find(p=>p.number===r.uniformNo);assert.ok(card,r.playerName);assert.equal(card.id,r.permanent_card_id);assert.equal(r.selected_for_match,null);assert.equal(r.confirmed_lineup,null);assert.ok(r.competition_eligibility.includes('待'));}}
 const html=renderMatchPage({home,away,dossier:d,date:d.date,page:'players'});
 for(const n of ['47','48','49']){const p=away.players.find(p=>p.number===n);assert.ok(p.official_player_id);assert.equal(p.verification_status,'research_incomplete');assert.equal(p.verified_at,null);assert.ok(p.research_gaps.length>=3);assert.ok(p.name_source.includes('中文名未經'));assert.ok(p.career.every(r=>r.appearances===null&&r.goals===null));assert.ok(html.includes('#/club/hiroshima/player/'+n));}
 assert.equal(away.players.find(p=>p.number==='48').height,181);assert.ok(away.players.find(p=>p.number==='48').intro.includes('182／67'));assert.ok(away.players.find(p=>p.number==='47').intro.includes('𠩤'));
});

test('Nov25 evening refresh reconciles current matches, Harada ban, independent analytics and cup fixtures',()=>{
 const k=d.teams.kashiwa,h=d.teams.hiroshima;
 assert.equal(h.workload.match_date,'2026-11-25');assert.equal(h.workload.baseline_match_date,'2026-11-21');
 assert.equal(h.game_log.find(g=>g.date==='2026-11-25').score,'2–2');assert.equal(h.workload.minutes.find(p=>p.number==='9').minutes,4);assert.equal(h.workload.minutes.find(p=>p.number==='35').minutes,67);
 assert.ok(k.suspensions.some(r=>r.number==='42'&&r.text.includes('11月28日')));assert.ok(d.match_info.lineups_as_of.includes('HKT'));
 assert.equal(d.standings.rows.find(r=>r.slug==='hiroshima').points,32);assert.equal(d.standings.rows.find(r=>r.slug==='kashiwa').points,31);
 assert.ok(d.standings.checked_at_display.includes('21:59'));assert.ok(d.cup_tournament.semi_finals.some(r=>r.label==='柏太陽王 對 鹿島鹿角'));assert.ok(!d.cup_tournament.semi_finals.some(r=>r.label==='浦和紅鑽 對 柏太陽王'));
 for(const slug of [d.home,d.away])for(const r of d.teams[slug].registration_audit.players){assert.equal(r.selected_for_match,[...d.teams[slug].lineup.starters,...d.teams[slug].lineup.bench].some(p=>p.number===r.number));assert.ok((slug==='kashiwa'?home:away).players.some(p=>p.number===r.number));}
 assert.equal(home.players.find(p=>p.number==='23').weight,72);assert.equal(away.players.find(p=>p.number==='48').verification_status,'research_incomplete');
});
test('Nov28 opening copy is the last info section and preserves the opening section after official selection',()=>{
 const h=renderMatchPage({home,away,dossier:d,date:d.date,page:'info'}),i=h.lastIndexOf('<h3>開波廣告</h3>');assert.ok(i>0);assert.ok(h.includes('font-size:1.1em'));assert.ok(!h.slice(i+18).includes('<h3>'));assert.ok(h.includes('八十九分鐘'));assert.ok(h.includes('正式名單'));assert.equal(d.match_info.opening_broadcast.heading,'開波廣告');
});


test('Nov28 official 40 selections resolve to distinct cards and the workload view separates bans and unexplained absences',()=>{
 assert.equal(d.match_info.officials.roles.length,6);assert.equal(d.match_info.officials.roles[0].name_ja,'椎野 大地');
 const rotation=renderMatchPage({home,away,dossier:d,date:d.date,page:'rotation'});
 for(const [slug,club] of [['kashiwa',home],['hiroshima',away]]){
  const t=d.teams[slug],selected=[...t.lineup.starters,...t.lineup.bench];assert.equal(new Set(selected.map(p=>p.official_player_id)).size,20);
  for(const p of selected){assert.equal(p.player_id,club.players.find(c=>c.number===p.number).id);assert.ok(rotation.includes('#/club/'+slug+'/player/'+p.number));}
  assert.equal(t.workload_absences.pending,false);assert.deepEqual(t.workload_absences.confirmed_rest,[]);
 }
 assert.ok(!d.teams.kashiwa.lineup.starters.some(p=>p.number==='42'));assert.ok(!d.teams.kashiwa.workload_absences.unexplained.some(p=>p.number==='42'));
 assert.ok(rotation.includes('未有可靠來源確認休息安排'));assert.ok(d.match_info.referee_tendencies[0].text.includes('2.50'));
});
