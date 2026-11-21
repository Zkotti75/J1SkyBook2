import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {matchPages,renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-11-28-kashiwa-hiroshima.json'),home=read('data/clubs/kashiwa.json'),away=read('data/clubs/hiroshima.json'),audit=read('data/registration-audits/2026-11-17-kashiwa-hiroshima.json');
test('November 28 adds an independent initial preparation without replacing the two published assignments',()=>{
 const index=read('data/matches/index.json');assert.deepEqual(index.featured,{home:'nagasaki',away:'kawasaki',date:'2026-11-25'});assert.deepEqual(index.fixtures.map(f=>f.date),['2026-11-21','2026-11-25','2026-11-28']);
 assert.equal(d.as_of,'2026-11-21');assert.equal(d.competition,'j1');assert.equal(d.match_info.commentary.partner,'高志超');assert.equal(d.match_info.broadcast_hkt,'14:55');assert.equal(d.match_info.kickoff_jst,'16:00');assert.ok(d.match_info.kickoff_hkt.startsWith('15:00'));assert.ok(d.match_info.events.some(c=>c.text.includes('16:03')));assert.equal(d.match_info.lineups_as_of,null);assert.equal(d.match_info.officials.status,'pending');
 assert.equal(matchPages(d).length,10);assert.equal(Object.keys(d.section_status).length,10);assert.equal(new Set(d.standings.rows.map(r=>r.slug)).size,20);
 for(const slug of [d.home,d.away]){const t=d.teams[slug],league=t.game_log.filter(g=>g.competition==='J1');assert.equal(league.length,38);assert.equal(league.filter(g=>g.score).length,15);assert.ok(t.game_log.filter(g=>(g.date||g.sort_date)>'2026-11-21').every(g=>g.score===null));assert.deepEqual(t.lineup.starters,[]);assert.deepEqual(t.lineup.bench,[]);for(const key of ['minutes','prior_minutes'])assert.equal(t.workload.minutes.reduce((s,p)=>s+p[key],0),990);}
 assert.equal(d.teams.kashiwa.game_log.find(g=>g.date==='2026-11-15').score,'5–4');assert.equal(d.cup_tournament.results.length,52);assert.ok(d.cup_tournament.semi_finals[0].label.includes('柏'));
 for(const p of matchPages(d)){const html=renderMatchPage({home,away,dossier:d,date:d.date,page:p.id});assert.ok(!/undefined|NaN/.test(html));assert.ok(html.includes(p.label));}
 const rotation=renderMatchPage({home,away,dossier:d,date:d.date,page:'rotation'});assert.ok(rotation.includes('期間另有未賽賽事'));assert.ok(rotation.includes('2026-11-24'));assert.ok(rotation.includes('2026-11-25'));
 const quotes=renderMatchPage({home,away,dossier:d,date:d.date,page:'quotes'});assert.ok(!quotes.includes('11月15日賽後背景'));assert.ok(JSON.stringify(d.quote_events).includes('第二點'));
});
test('all 73 official registrations resolve to cards while new youth biographies remain incomplete',()=>{
 for(const [slug,club,count] of [['kashiwa',home,42],['hiroshima',away,31]]){const records=audit.clubs[slug].players;assert.equal(records.length,count);assert.equal(new Set(records.map(r=>r.playerId)).size,count);for(const r of records){const card=club.players.find(p=>p.number===r.uniformNo);assert.ok(card,r.playerName);assert.equal(card.id,r.permanent_card_id);assert.equal(r.selected_for_match,null);assert.equal(r.confirmed_lineup,null);assert.ok(r.competition_eligibility.includes('待'));}}
 const html=renderMatchPage({home,away,dossier:d,date:d.date,page:'players'});
 for(const n of ['47','48','49']){const p=away.players.find(p=>p.number===n);assert.ok(p.official_player_id);assert.equal(p.verification_status,'research_incomplete');assert.equal(p.verified_at,null);assert.ok(p.research_gaps.length>=3);assert.ok(p.name_source.includes('中文名未經'));assert.ok(p.career.every(r=>r.appearances===null&&r.goals===null));assert.ok(html.includes('#/club/hiroshima/player/'+n));}
 assert.equal(away.players.find(p=>p.number==='48').height,181);assert.ok(away.players.find(p=>p.number==='48').intro.includes('182／67'));assert.ok(away.players.find(p=>p.number==='47').intro.includes('𠩤'));
});
