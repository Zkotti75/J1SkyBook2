import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage,inInterviewWindow} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-10-21-kawasaki-kobe.json');
const home=read('data/clubs/kawasaki.json'),away=read('data/clubs/kobe.json');
test('Wednesday assignment has ten-round totals, complete logs and confirmed lineups',()=>{
 assert.deepEqual({home:d.home,away:d.away,date:d.date},{home:'kawasaki',away:'kobe',date:'2026-10-21'});
 for(const club of [home,away]){
  const t=d.teams[club.team.slug],league=t.game_log.filter(r=>r.round),played=league.filter(r=>r.score);
  assert.equal(league.length,38);assert.equal(new Set(league.map(r=>r.round)).size,38);assert.equal(played.length,10);
  const scores=played.map(r=>r.score.split('–').map(Number));
  assert.equal(scores.reduce((a,r)=>a+r[0],0),t.stats.goals_for);assert.equal(scores.reduce((a,r)=>a+r[1],0),t.stats.goals_against);
  assert.equal(scores.filter(r=>r[0]>r[1]).length*3+scores.filter(r=>r[0]===r[1]).length,t.stats.points);
  assert.equal(t.lineup.starters.length,11);assert.equal(t.lineup.bench.length,9);
  assert.equal(league.find(r=>r.date===d.date).score,null);
  for(const r of t.game_log){assert.ok(r.sort_date);if(r.sort_date>d.as_of)assert.equal(r.score,null);}
 }
 for(const r of d.standings.rows){assert.equal(r.played,10);assert.equal(r.points,r.wins*3+r.draws);}
 assert.equal(d.standings.rows.length,20);
 assert.equal(d.standings.rows.reduce((a,r)=>a+r.goals_for,0),d.standings.rows.reduce((a,r)=>a+r.goals_against,0));
 assert.equal(d.teams.kobe.game_log.find(r=>r.date==='2026-08-26').score,'2–1');
 assert.equal(d.teams.kobe.game_log.find(r=>r.date==='2026-09-23').score,'1–0');
 assert.equal(d.match_info.referee,'中村太');assert.ok(d.match_info.lineups_as_of);
});
test('Wednesday research renders every page, dates sources and keeps recent voices in window',()=>{
 for(const {id} of MATCH_PAGES){const h=renderMatchPage({home,away,date:d.date,page:id,dossier:d});assert.ok(!h.includes('球員資料待核對'));assert.ok(!h.includes('介面初稿'));}
 for(const event of d.quote_events)for(const q of event.entries)assert.ok(inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));
 function walk(v){if(!v||typeof v!=='object')return;if(v.text){assert.ok(v.sources?.length);assert.ok(v.as_of<=d.as_of);}for(const x of Object.values(v))walk(x);}walk(d);
 const h=renderMatchPage({home,away,date:d.date,page:'players',dossier:d});
 assert.ok(h.includes('岩本悠庵'));assert.ok(h.includes('#/club/kobe/player/23'));assert.ok(!h.includes('官方球員資料'));
 assert.ok(d.teams.kawasaki.yellow_risk[0].text.includes('各3張'));
 assert.ok(d.teams.kobe.rotation_notes[0].text.includes('只換1名'));
});

test('final sweep dates medical news and preserves honest roster and selection states',()=>{
 assert.equal(d.as_of,'2026-10-21');
 const noda=d.teams.kawasaki.injuries.find(x=>x.text.includes('野田裕人'));
 assert.ok(noda.text.includes('10月3日'));assert.equal(noda.sources[0].published_at,'2026-10-18');
 for(const n of ['17','23']){const p=away.players.find(x=>x.number===n);assert.ok(p);assert.equal(p.verification_status,'research_incomplete');assert.ok(p.research_gaps.length);}
 assert.equal(away.players.find(x=>x.number==='17').name_zh,'高橋壹晟');
 const i=away.players.find(x=>x.number==='23');assert.ok(i.tenure_status.includes('2029/30'));assert.ok(i.registration_status.includes('特別指定'));
 assert.ok(away.players.find(x=>x.number==='45').match_week.selection_status.includes('外借大分'));
 assert.ok(away.players.find(x=>x.number==='57').match_week.selection_status.includes('資格仍待確認'));
 assert.ok(d.quote_events.flatMap(x=>x.entries).filter(x=>x.published_at>='2026-10-19').length>=11);
 for(const q of d.quote_events.flatMap(x=>x.entries)){if(q.quote_zh)assert.ok(q.quote_ja);}
 assert.equal(d.match_info.weather.forecast_issued_at,'2026-10-21T18:00:00+09:00');
 assert.ok(d.match_info.lineups_as_of);
 for(const club of [home,away])for(const p of club.players){const r=p.season_stats?.find(x=>x.season==='2026/27'&&x.competition==='J1');if(r?.as_of==='2026-10-18'){assert.ok(r.appearances<=10);assert.ok(r.goals>=0);}}
});

test('pre-kickoff sweep confirms six officials with dated official evidence',()=>{
 const o=d.match_info.officials;
 assert.equal(o.status,'confirmed');assert.equal(o.roles.length,6);
 assert.ok(o.checked_at.endsWith('+08:00'));assert.ok(o.sources.some(s=>s.url.includes('frontale.co.jp')));
 assert.ok(o.roles.every(r=>r.name_ja));
 for(const page of ['officials','live']){
  const h=renderMatchPage({home,away,date:d.date,page,dossier:d});
  for(const label of ['主球證','旁證1','旁證2','第4球證','VAR','AVAR'])assert.ok(h.includes(label));
  assert.ok(h.includes('官方已確認'));assert.ok(h.includes(o.checked_at_display));
 }
 const fresh=d.quote_events[0].entries;
 assert.equal(fresh.length,5);assert.ok(fresh.every(q=>q.date_basis==='accessed'));
});

test('confirmed team sheets match all player-card selections and exact officials',()=>{
 const expected={kawasaki:['49','29','4','28','5','19','8','25','16','23','97'],kobe:['71','3','4','15','41','2','7','25','10','11','94']};
 for(const club of [home,away]){const c=club.team.slug,t=d.teams[c];assert.deepEqual(t.lineup.starters.map(r=>r.number),expected[c]);const selected=[...t.lineup.starters,...t.lineup.bench];assert.equal(new Set(selected.map(r=>r.number)).size,20);for(const r of selected){const p=club.players.find(p=>p.number===r.number);assert.ok(p);assert.ok(p.match_week.selection_status.includes(t.lineup.starters.includes(r)?'正選':'後備'));}}
 assert.deepEqual(d.match_info.officials.roles.map(r=>r.name_ja),['中村太','梅田智起','大川直也','桜井大介','川俣秀','石丸秀平']);
});
