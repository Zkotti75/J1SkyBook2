import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {matchPages,renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-11-15-kashiwa-kawasaki.json');
const audit=read('data/registration-audits/2026-11-12-kashiwa-kawasaki.json');
const home=read('data/clubs/kashiwa.json'),away=read('data/clubs/kawasaki.json');
test('Sunday refresh preserves ten sections, complete league schedule and honest pre-lineup state',()=>{
 assert.equal(d.as_of,'2026-11-12');assert.equal(d.match_info.lineups_as_of,null);
 assert.equal(d.match_info.commentary.partner,'冼家裕');
 assert.equal(matchPages(d).length,10);assert.equal(new Set(d.standings.rows.map(r=>r.slug)).size,20);
 for(const slug of ['kashiwa','kawasaki']){
  const t=d.teams[slug];assert.deepEqual(t.lineup.starters,[]);assert.deepEqual(t.lineup.bench,[]);assert.equal(t.workload_absences.pending,true);
  const league=t.game_log.filter(g=>g.competition.startsWith('J1'));assert.equal(league.length,38);assert.equal(league.filter(g=>g.score).length,14);
  assert.ok(t.game_log.filter(g=>(g.date||g.sort_date)>'2026-11-12').every(g=>g.score===null));
  for(const key of ['minutes','prior_minutes'])assert.equal(t.workload.minutes.reduce((s,p)=>s+p[key],0),990);
  for(const rows of Object.values(t.team_metrics))for(const r of rows){assert.ok(r.label);assert.equal(r.as_of,'2026-11-09');}
 }
 const last=d.teams.kawasaki.game_log.find(g=>g.date==='2026-11-01');assert.equal(last.score,'2–4');
 for(const page of matchPages(d)){const h=renderMatchPage({home,away,dossier:d,date:d.date,page:page.id});assert.ok(!/undefined|NaN/.test(h));}
 const q=renderMatchPage({home,away,dossier:d,date:d.date,page:'quotes'});assert.ok(q.includes('長谷部茂利'));assert.ok(q.includes('失球後沒有慌亂'));
 const cup=renderMatchPage({home,away,dossier:d,date:d.date,page:'cup'});assert.ok(cup.includes('柏總比分2–1'));assert.ok(!cup.includes('八強未開賽'));
 assert.deepEqual(d.cup_tournament.quarter_finals.map(q=>q.legs[0].score),['2–0','1–2','2–3','0–1']);
});
test('all 100 registered identities reconcile, including six priorities and 20 unnumbered youth',()=>{
 assert.equal(audit.clubs.kashiwa.players.length,42);assert.equal(audit.clubs.kawasaki.players.length,58);
 for(const [slug,club] of [['kashiwa',home],['kawasaki',away]]){
  const regs=audit.clubs[slug].players,ids=new Set();
  for(const r of regs){assert.equal(r.selected_for_match,null);assert.ok(!ids.has(r.playerId));ids.add(r.playerId);
   const card=r.uniformNo==null?club.registered_youth.find(p=>String(p.official_player_id)===String(r.playerId)):club.players.find(p=>p.number===r.uniformNo);
   assert.ok(card,r.playerName);assert.equal(card.id,r.permanent_card_id);
  }
 }
 assert.equal(away.registered_youth.length,20);
 for(const q of away.registered_youth){assert.equal(q.number,null);assert.equal(q.verification_status,'research_incomplete');assert.ok(q.research_gaps.length);assert.ok(q.career.every(r=>!/^(１２|１５|川崎フロンターレＵ)$/.test(r.team)));}
 for(const [club,nums] of [[home,[43,45,63,64]],[away,[37,39]]])for(const n of nums){const q=club.players.find(p=>p.number===String(n));assert.ok(q);assert.equal(q.registration_audit.as_of,'2026-11-12');}
 assert.equal(home.players.find(p=>p.number==='64').official_player_id,'1656722');
 const html=renderMatchPage({home,away,dossier:d,date:d.date,page:'players'});for(const p of away.registered_youth)assert.ok(html.includes('/registration/'+p.official_player_id));
});
