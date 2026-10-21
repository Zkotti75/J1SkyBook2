import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage,inInterviewWindow} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-10-24-kashima-kashiwa.json');
const home=read('data/clubs/kashima.json'),away=read('data/clubs/kashiwa.json');
test('Saturday featured assignment reconciles eleven games with complete season logs',()=>{
 assert.deepEqual(read('data/matches/index.json').featured,{home:d.home,away:d.away,date:d.date});
 for(const side of ['kashima','kashiwa']){
  const t=d.teams[side],league=t.game_log.filter(r=>r.round),played=league.filter(r=>r.score);
  assert.equal(league.length,38);assert.equal(new Set(league.map(r=>r.round)).size,38);assert.equal(played.length,11);
  const sc=played.map(r=>r.score.split('–').map(Number));
  assert.equal(sc.reduce((a,r)=>a+r[0],0),t.stats.goals_for);assert.equal(sc.reduce((a,r)=>a+r[1],0),t.stats.goals_against);
  assert.equal(sc.filter(r=>r[0]>r[1]).length*3+sc.filter(r=>r[0]===r[1]).length,t.stats.points);
  assert.equal(league.find(r=>r.date===d.date).score,null);
  assert.ok(t.game_log.filter(r=>!r.date).every(r=>r.date_display.includes('待定')));
  for(const r of t.game_log){assert.ok(r.sort_date);if(r.sort_date>d.as_of)assert.equal(r.score,null);}
  assert.equal(t.previous_match_date,'2026-10-21');assert.equal(t.lineup.starters.length,0);
 }
 assert.equal(d.teams.kashima.game_log.find(r=>r.date==='2026-10-21').score,'2–2');
 assert.equal(d.teams.kashiwa.game_log.find(r=>r.date==='2026-10-21').score,'0–0');
 for(const r of d.standings.rows){assert.equal(r.points,r.wins*3+r.draws);assert.equal(r.played,r.wins+r.draws+r.losses);}
 assert.equal(d.standings.rows.length,20);
 assert.equal(d.standings.rows.reduce((a,r)=>a+r.goals_for,0),d.standings.rows.reduce((a,r)=>a+r.goals_against,0));
 assert.ok(d.standings.as_of.includes('並非第11節全輪完結'));
});
test('minute comparison distinguishes rotation, usual starts and nominal minutes',()=>{
 for(const [side,changes] of [['kashima',6],['kashiwa',4]]){
  const w=d.teams[side].workload;
  assert.equal(w.starting_changes,changes);assert.equal(w.starters.length,11);
  assert.equal(w.starters.filter(n=>!w.prior_starters.includes(n)).length,changes);
  assert.equal(w.minutes.reduce((s,p)=>s+p.minutes,0),990);
  assert.ok(w.minutes.every(p=>p.minutes>=0&&p.minutes<=90&&p.normal_starts<=10));
 }
 const h=d.teams.kashima.workload.minutes,a=d.teams.kashiwa.workload.minutes;
 assert.equal(h.find(p=>p.number===40).prior_minutes,18);assert.equal(h.find(p=>p.number===40).minutes,89);
 assert.equal(h.find(p=>p.number===55).minutes,90);
 assert.equal(a.find(p=>p.number===8).minutes,45);assert.equal(a.find(p=>p.number===8).normal_starts,10);
 assert.equal(a.find(p=>p.number===39).minutes,90);
});
test('Saturday pages render sourced research without fabricating new interviews or appointments',()=>{
 for(const {id} of MATCH_PAGES){const html=renderMatchPage({home,away,date:d.date,page:id,dossier:d});assert.ok(!html.includes('介面初稿'));assert.ok(!html.includes('undefined'));}
 for(const ev of d.quote_events)for(const q of ev.entries)assert.ok(inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));
 for(const row of d.quote_background)for(const q of [row.home,row.away].filter(Boolean)){assert.ok(!inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));assert.ok(q.paraphrase_zh);assert.ok(q.published_at<'2026-10-21');}
 const qhtml=renderMatchPage({home,away,date:d.date,page:'quotes',dossier:d});assert.ok(qhtml.includes('較早背景訪問'));assert.ok(qhtml.includes('21日兩隊賽後訪問欄尚未刊出'));
 assert.equal(d.match_info.officials.status,'awaiting_appointment');assert.ok(d.match_info.officials.roles.every(r=>!r.name_ja));
 assert.ok(d.teams.kashima.yellow_risk[0].text.includes('3黃'));assert.ok(d.teams.kashiwa.yellow_risk[0].text.includes('3黃'));
 assert.ok(d.teams.kashima.injuries[0].text.includes('後備'));assert.ok(d.teams.kashiwa.injuries[0].text.includes('10月9日'));
 function walk(v){if(!v||typeof v!=='object')return;if(v.text){assert.ok(v.sources?.length);assert.ok(v.as_of<=d.as_of);}for(const x of Object.values(v))walk(x);}walk(d);
 const html=renderMatchPage({home,away,date:d.date,page:'comparison',dossier:d});assert.ok(html.includes('首10輪先發'));assert.ok(html.includes('上仗角色'));
});
