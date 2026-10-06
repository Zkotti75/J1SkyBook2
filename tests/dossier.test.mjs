import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage} from '../match.js';
const read = path => JSON.parse(fs.readFileSync(new URL(`../${path}`,import.meta.url)));
const index=read('data/matches/index.json');
const d=read(`data/matches/${index.fixtures[0].file}`);
const home=read('data/clubs/chiba.json'),away=read('data/clubs/nagasaki.json');
test('assignment and dossier agree, with no unresearched opponent selected',()=>{
  for(const k of ['home','away','date'])assert.equal(index.featured[k],d[k]);
  assert.equal(index.fixtures.length,1);
  for(const {id} of MATCH_PAGES){
    const html=renderMatchPage({home,away,page:id,date:d.date,dossier:d});
    assert.ok(!html.includes('球員資料待核對'),id);
    assert.ok(!html.includes('介面初稿'),id);
  }
});
test('league totals reconcile with all eight results in each team log',()=>{
  const rows=d.standings.rows;assert.equal(rows.length,20);
  assert.equal(rows.reduce((n,r)=>n+r.goals_for,0),rows.reduce((n,r)=>n+r.goals_against,0));
  for(const r of rows){
    assert.equal(r.played,r.wins+r.draws+r.losses);
    assert.equal(r.points,r.wins*3+r.draws);
    assert.equal(r.goal_difference,r.goals_for-r.goals_against);
  }
  for(const slug of [d.home,d.away]){
    const t=d.teams[slug],league=t.game_log.filter(r=>r.round);
    assert.equal(league.length,38);assert.equal(new Set(league.map(r=>r.round)).size,38);
    const played=league.filter(r=>r.score); assert.equal(played.length,8);
    const totals=played.map(r=>r.score.split('–').map(Number));
    assert.equal(totals.reduce((n,r)=>n+r[0],0),t.stats.goals_for);
    assert.equal(totals.reduce((n,r)=>n+r[1],0),t.stats.goals_against);
    for(const r of t.game_log)if(r.sort_date>d.as_of)assert.equal(r.score,null);
  }
});
test('claims retain dated sources and only researched players are rendered',()=>{
  function walk(v){
    if(!v || typeof v!=='object')return;
    if(v.text){assert.ok(['fact','reported','opinion','analysis'].includes(v.kind));assert.ok(v.sources?.length);assert.ok(v.as_of<=d.as_of);}
    if(v.url)assert.ok(v.url.startsWith('https://'));
    for(const x of Object.values(v))walk(x);
  }
  walk(d);
  for(const [slug,club] of [['chiba',home],['nagasaki',away]]){
    for(const group of Object.values(d.teams[slug].players_to_watch))for(const p of group)assert.ok(club.players.some(x=>String(x.number)===String(p.number)));
  }
});
test('future lineups and interview pairings remain unfilled',()=>{
  for(const team of Object.values(d.teams))assert.equal(team.lineup.starters.length,0);
  assert.ok(d.quotes.every(r=>!r.home));
  for(const row of d.quotes)assert.ok(row.away.published_at<=d.as_of);
  assert.ok(d.teams.chiba.suspensions.some(c=>c.text.includes('10月7日')&&c.text.includes('不可直接')));
});
