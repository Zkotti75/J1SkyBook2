import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {MATCH_PAGES,matchPages,renderMatchPage,parseMatchRoute,matchRoute} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
test('cup fixtures retain all nine sections and add a complete separate bracket',()=>{
 assert.equal(MATCH_PAGES.length,9);assert.equal(matchPages({}).length,9);
 const index=read('data/matches/index.json');assert.ok(index.fixtures.length>=1);
 for(const f of index.fixtures){const d=read('data/matches/'+f.file),home=read('data/clubs/'+f.home+'.json'),away=read('data/clubs/'+f.away+'.json'),c=d.cup_tournament;
 assert.equal(matchPages(d).length,10);assert.equal(parseMatchRoute(matchRoute(f.home,f.away,f.date,'cup')).page,'cup');
 for(const p of matchPages(d)){const html=renderMatchPage({home,away,date:d.date,dossier:d,page:p.id});assert.ok(!html.includes('undefined'));assert.ok(html.includes(p.label));}
 assert.equal(d.standings.rows.length,20);for(const t of Object.values(d.teams)){assert.equal(t.game_log.filter(g=>g.competition.startsWith('J1')).length,38);assert.equal(t.lineup.starters.length,d.match_info.lineups_as_of?11:0);assert.ok(t.research_baseline.as_of);}
 assert.equal(c.results.length,52);assert.equal(new Set(c.results.map(r=>r.source)).size,52);assert.equal(c.quarter_finals.length,4);assert.equal(c.quarter_finals.flatMap(q=>q.legs).length,8);assert.ok(c.quarter_finals.flatMap(q=>q.legs).filter(g=>g.date>d.as_of).every(g=>g.score===null));
 assert.deepEqual(c.semi_finals.map(s=>s.from),[['A','B'],['C','D']]);assert.deepEqual(Object.values(c.routes).map(r=>r.matches.length),[0,1,1,3]);const m=c.routes.machida.matches[0];assert.equal(m.score_a,0);assert.equal(m.score_b,0);assert.equal(m.pk_b,5);assert.equal(c.final.date,'2027-05-08');
 const cup=renderMatchPage({home,away,date:d.date,dossier:d,page:'cup'});assert.ok(cup.includes('全部 52 場'));assert.ok(cup.includes('非主客次序'));
 }
});
