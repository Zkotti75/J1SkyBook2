import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {MATCH_PAGES,renderMatchPage,inInterviewWindow} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));const d=read('data/matches/2026-11-08-machida-hiroshima.json');const home=read('data/clubs/machida.json'),away=read('data/clubs/hiroshima.json');
test('November 8 sweep removes completed task and prospective results while reconciling records',()=>{
 const idx=read('data/matches/index.json');assert.deepEqual(idx.featured,{home:d.home,away:d.away,date:d.date});assert.ok(idx.fixtures.every(r=>r.date>='2026-11-08'));
 assert.equal(d.standings.rows.length,20);assert.equal(d.standings.rows.reduce((s,r)=>s+r.goals_for,0),d.standings.rows.reduce((s,r)=>s+r.goals_against,0));
 for(const slug of [d.home,d.away]){const t=d.teams[slug],j=t.game_log.filter(r=>r.competition==='J1'),done=j.filter(r=>r.score);assert.equal(j.length,38);assert.equal(done.length,13);const scores=done.map(r=>r.score.split(/[–-]/).map(Number));assert.equal(scores.reduce((s,r)=>s+r[0],0),t.stats.goals_for);assert.equal(scores.reduce((s,r)=>s+r[1],0),t.stats.goals_against);for(const r of t.game_log)if((r.sort_date||r.date)>d.as_of)assert.equal(r.score,null);assert.equal(t.workload.minutes.reduce((n,r)=>n+r.minutes,0),990);assert.equal(t.workload.minutes.reduce((n,r)=>n+r.prior_minutes,0),990);assert.equal(t.lineup.starters.length,11);assert.equal(t.lineup.bench.length,slug==='machida'?8:9);assert.equal(new Set([...t.lineup.starters,...t.lineup.bench].map(p=>p.number)).size,slug==='machida'?19:20);}
 assert.equal(d.teams.machida.game_log.find(r=>r.date==='2026-11-05').competition,'ACL Two');assert.equal(d.teams.machida.game_log.find(r=>r.date==='2026-11-05').score,'2–1');assert.equal(d.match_info.commentary.partner,'高志超');
});
test('confirmed workload sorts today selections and preserves match-only youth fallback',()=>{
 const h=renderMatchPage({home,away,dossier:d,date:d.date,page:'rotation'});assert.ok(!h.includes('並非本場預測名單'));assert.ok(!h.includes('賽前負荷參考・名單公布前'));assert.ok(h.includes('中2日'));assert.ok(h.includes('中7日'));assert.ok(h.includes('髙橋成海'));assert.ok(!h.includes('#/club/hiroshima/player/50'));assert.equal(d.teams.machida.lineup.starting_changes_vs_previous_match,7);assert.equal(d.teams.hiroshima.lineup.starting_changes_vs_previous_match,1);
 const starters=h.split('今日正選11人・上仗0分鐘優先')[1].split('今日後備・上仗0分鐘優先')[0];assert.ok(starters.indexOf('player/31')<starters.indexOf('player/7'));assert.ok(starters.indexOf('player/7')<starters.indexOf('player/88'));
 for(const t of Object.values(d.teams)){assert.equal(t.workload_absences.pending,false);assert.equal(t.workload_absences.confirmed_rest.length,0);assert.deepEqual(new Set(t.formation.players.map(p=>p.number)),new Set(t.lineup.starters.map(p=>p.number)));}
 assert.equal(d.match_info.officials.status,'confirmed');assert.equal(d.match_info.officials.roles.length,6);assert.equal(d.standings.rows.find(r=>r.slug==='kashiwa').points,31);
 const w=new Map(d.teams.machida.workload.minutes.map(r=>[r.number,r.minutes]));assert.equal(d.teams.machida.lineup.starters.reduce((a,p)=>a+w.get(p.number),0),403);
});
test('all match sections render with current registered-player focus and valid interview dates',()=>{
 for(const {id} of MATCH_PAGES){const h=renderMatchPage({home,away,dossier:d,date:d.date,page:id});assert.ok(!h.includes('undefined'));assert.ok(!h.includes('等待本場戰術研究'));}
 for(const q of d.quote_events.flatMap(x=>x.entries))assert.ok(inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));
 for(const t of Object.values(d.teams))for(const rows of Object.values(t.team_metrics))for(const r of rows)assert.ok(r.label&&String(r.value).length);
});
