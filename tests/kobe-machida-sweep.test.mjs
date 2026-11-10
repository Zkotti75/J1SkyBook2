import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {matchPages,renderMatchPage,inInterviewWindow} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));const d=read('data/matches/2026-11-11-kobe-machida.json'),home=read('data/clubs/kobe.json'),away=read('data/clubs/machida.json');const render=page=>renderMatchPage({home,away,date:d.date,dossier:d,page});
test('November 10 sweep reconciles official results and retains future fixtures without predicted selections',()=>{
 assert.equal(d.as_of,'2026-11-10');assert.equal(d.match_info.kickoff_jst,'19:00');assert.equal(d.match_info.lineups_as_of,null);assert.equal(d.match_info.officials.status,'pending');assert.equal(d.match_info.commentary.partner,'高志超');
 assert.equal(d.standings.rows.length,20);assert.ok(d.standings.rows.every(r=>r.played===14));assert.equal(d.standings.rows.reduce((a,r)=>a+r.goals_for,0),d.standings.rows.reduce((a,r)=>a+r.goals_against,0));
 for(const t of Object.values(d.teams)){const league=t.game_log.filter(g=>g.competition.startsWith('J1'));assert.equal(league.length,38);const done=league.filter(g=>g.score);assert.equal(done.length,14);const scores=done.map(g=>g.score.split(/[–-]/).map(Number));assert.equal(scores.reduce((a,r)=>a+r[0],0),t.stats.goals_for);assert.equal(scores.reduce((a,r)=>a+r[1],0),t.stats.goals_against);assert.equal(t.lineup.starters.length,0);assert.equal(t.lineup.bench.length,0);assert.equal(t.workload_absences.pending,true);for(const g of t.game_log)if((g.sort_date||g.date)>d.as_of)assert.equal(g.score,null);assert.ok(t.international_duty.length);assert.ok(t.team_metrics.attack.some(r=>r.label==='預期入球 xG'));}
 assert.equal(d.teams.kobe.stats.points,27);assert.equal(d.teams.machida.stats.points,29);assert.equal(d.cup_tournament.results.length,52);assert.equal(matchPages(d).length,10);
});
test('workload uses previous two actual matches and distinguishes a stoppage-time appearance from nonparticipation',()=>{
 for(const t of Object.values(d.teams)){assert.equal(t.workload.match_date,'2026-11-08');assert.equal(t.workload.minutes.reduce((n,r)=>n+r.minutes,0),990);assert.equal(t.workload.minutes.reduce((n,r)=>n+r.prior_minutes,0),990);}
 const komatsu=d.teams.kobe.workload.minutes.find(r=>r.number==='29');assert.equal(komatsu.minutes,0);assert.equal(komatsu.appearance_last,true);const r=render('rotation');assert.ok(r.includes('0・補時入替'));assert.ok(r.includes('中2日'));assert.ok(r.includes('並非本場預測名單'));
 assert.equal(d.teams.machida.workload.minutes.find(r=>r.number==='99').minutes,31);assert.equal(d.teams.kobe.workload.baseline_match_date,'2026-11-03');assert.equal(d.teams.machida.workload.baseline_match_date,'2026-11-05');
});
test('all ten sections render with current interviews and separate cup availability and uncertainty',()=>{
 const entries=d.quote_events.flatMap(e=>e.entries);assert.equal(entries.length,9);for(const q of entries){assert.ok(inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));assert.ok(q.url.startsWith('https://'));assert.ok(q.paraphrase_zh);assert.equal(q.quote_ja,undefined);}
 for(const p of matchPages(d)){const h=render(p.id);assert.ok(!h.includes('undefined'));assert.ok(!h.includes('等待本場戰術研究'));assert.ok(h.includes(p.label));}
 const avail=render('availability');assert.ok(avail.includes('國家隊徵召及退出'));assert.ok(avail.includes('聯賽盃紀律'));assert.ok(!avail.includes('累積3黃・再領黃牌即停賽'));
 assert.ok(render('quotes').includes('米高・史基比'));assert.ok(render('quotes').includes('黑田剛'));assert.ok(render('analytics').includes('0.64'));assert.ok(render('logs').includes('第14輪全部完場'));
});
