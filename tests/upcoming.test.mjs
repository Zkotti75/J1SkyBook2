import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage,inInterviewWindow} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-10-18-machida-fukuoka.json');
const home=read('data/clubs/machida.json'),away=read('data/clubs/fukuoka.json');
test('new assignment renders all pages and reconciles ninth-round totals',()=>{
 for(const {id} of MATCH_PAGES)assert.ok(!renderMatchPage({home,away,date:d.date,page:id,dossier:d}).includes('介面初稿'));
 assert.equal(d.standings.rows.length,20);
 assert.equal(d.standings.rows.reduce((n,r)=>n+r.goals_for,0),d.standings.rows.reduce((n,r)=>n+r.goals_against,0));
 for(const club of [home,away]){
 const t=d.teams[club.team.slug],rows=t.game_log.filter(r=>r.round),played=rows.filter(r=>r.score);
 assert.equal(rows.length,38);assert.equal(new Set(rows.map(r=>r.round)).size,38);assert.equal(played.length,9);
 const scores=played.map(r=>r.score.split('–').map(Number));
 assert.equal(scores.reduce((n,r)=>n+r[0],0),t.stats.goals_for);assert.equal(scores.reduce((n,r)=>n+r[1],0),t.stats.goals_against);
 assert.equal(scores.filter(r=>r[0]>r[1]).length,t.stats.wins);
 for(const r of t.game_log)if(r.date>d.as_of)assert.equal(r.score,null);
 for(const group of Object.values(t.players_to_watch))for(const p of group)assert.ok(club.players.some(a=>String(a.number)===String(p.number)));
 }
 for(const event of d.quote_events)for(const q of event.entries)assert.ok(inInterviewWindow(q,d.teams[q.team_slug].previous_match_date,d.date));
 function walk(v){if(!v||typeof v!=='object')return;if(v.text){assert.ok(v.sources?.length);assert.ok(v.as_of<=d.as_of);}for(const a of Object.values(v))walk(a);}walk(d);
 assert.ok(d.teams.machida.suspensions[0].text.includes('10月18日'));
 assert.ok(d.teams.fukuoka.suspensions[0].text.includes('10月18日'));
});
