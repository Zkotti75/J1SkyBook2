import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage,inInterviewWindow} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-10-25-kawasaki-okayama.json');
const home=read('data/clubs/kawasaki.json'),away=read('data/clubs/okayama.json');
test('Sunday assignment reconciles official totals, full schedules and rotation minutes',()=>{
 assert.deepEqual(read('data/matches/index.json').featured,{home:d.home,away:d.away,date:d.date});
 for(const [slug,changes] of [['kawasaki',5],['okayama',2]]){
  const t=d.teams[slug],league=t.game_log.filter(x=>x.round),played=league.filter(x=>x.score);
  assert.equal(league.length,38);assert.equal(new Set(league.map(x=>x.round)).size,38);assert.equal(played.length,11);
  const scores=played.map(x=>x.score.split('–').map(Number));
  assert.equal(scores.reduce((s,x)=>s+x[0],0),t.stats.goals_for);assert.equal(scores.reduce((s,x)=>s+x[1],0),t.stats.goals_against);
  assert.equal(scores.reduce((s,x)=>s+(x[0]>x[1]?3:x[0]===x[1]?1:0),0),t.stats.points);
  assert.equal(t.workload.starting_changes,changes);assert.equal(t.workload.minutes.reduce((s,x)=>s+x.minutes,0),990);
  assert.equal(t.workload.starters.filter(x=>!t.workload.prior_starters.includes(x)).length,changes);
  assert.equal(league.find(x=>x.date===d.date).score,null);
  assert.deepEqual(d.research_sweep.roster_audit[slug].missing_card_numbers,[]);
 }
});
test('Sunday research renders all pages with dated voices and honest pending selections',()=>{
 for(const {id} of MATCH_PAGES){const html=renderMatchPage({home,away,date:d.date,page:id,dossier:d});assert.ok(!html.includes('undefined'),id);assert.ok(!html.includes('介面初稿'),id);}
 const quotes=d.quote_events.flatMap(x=>x.entries);assert.equal(quotes.length,d.research_sweep.interview_entries);assert.ok(quotes.length>=20);
 for(const q of quotes)assert.ok(inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));
 assert.ok(quotes.some(q=>q.team_slug==='okayama'&&q.speaker==='藤井葉大'));
 assert.equal(d.match_info.officials.status,'confirmed');assert.ok(d.match_info.lineups_as_of);assert.ok(d.match_info.officials.roles.every(r=>r.name_ja));for(const slug of ['kawasaki','okayama']){const t=d.teams[slug];assert.equal(t.lineup.starters.length,11);assert.equal(t.lineup.bench.length,9);assert.equal(new Set([...t.lineup.starters,...t.lineup.bench].map(p=>p.number)).size,20);assert.deepEqual(t.formation.players.map(p=>p.number).sort((a,b)=>a-b),t.lineup.starters.map(p=>p.number).sort((a,b)=>a-b));}
 assert.ok(d.teams.okayama.yellow_risk.some(x=>x.text.includes('已')&&x.text.includes('宮本')));
 function walk(v){if(!v||typeof v!=='object')return;if(v.text){assert.ok(v.sources?.length);assert.ok(v.as_of<=d.as_of);}for(const x of Object.values(v))walk(x);}walk(d);
});
