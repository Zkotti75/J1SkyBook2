import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {renderMatchPage,MATCH_PAGES} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
test('all three news sweeps retain sources, current interview dates and no invented squads',()=>{
 for(const f of read('data/matches/index.json').fixtures){const d=read('data/matches/'+f.file);assert.equal(d.research_sweep.as_of,'2026-10-25');assert.ok(d.research_sweep.interview_entries>=1);for(const slug of [d.home,d.away])assert.equal(d.teams[slug].lineup.starters.length,0);for(const q of d.quote_events.flatMap(e=>e.entries)){assert.ok(q.published_at<=d.as_of);assert.ok(q.url.startsWith('https://'));}const home=read('data/clubs/'+d.home+'.json'),away=read('data/clubs/'+d.away+'.json');for(const p of MATCH_PAGES)assert.ok(!renderMatchPage({home,away,dossier:d,date:d.date,page:p.id}).includes('undefined'));}
});
