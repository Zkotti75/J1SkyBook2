import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
test('November 21 team analytics keep independently sourced home and away values',()=>{
 const d=read('data/matches/2026-11-21-hiroshima-yokohama-fm.json');const h=d.teams.hiroshima.team_metrics,y=d.teams['yokohama-fm'].team_metrics;
 const value=(m,key,label)=>m[key].find(r=>r.label===label).value;
 assert.equal(value(h,'basic','射門'),'18.7');assert.equal(value(y,'basic','射門'),'11.1');assert.equal(value(h,'attack','xG'),'2.078');assert.equal(value(y,'attack','xG'),'1.269');assert.equal(value(y,'defence','xGA'),'1.498');assert.equal(value(y,'build_up','進攻CBP'),'169.17');assert.equal(value(y,'set_pieces','失球方式・間接死球'),'5 (33.3%)');
 for(const k of ['basic','attack','defence','build_up','set_pieces'])assert.notDeepEqual(h[k].map(r=>r.value),y[k].map(r=>r.value));
 for(const r of Object.values(y).flat())assert.ok(r.sources.every(s=>s.url.includes('/y-fm/')));
 const html=renderMatchPage({home:read('data/clubs/hiroshima.json'),away:read('data/clubs/yokohama-fm.json'),dossier:d,date:d.date,page:'analytics'});for(const v of ['18.7','11.1','2.078','1.269','1.498','169.17'])assert.ok(html.includes(v));
});
