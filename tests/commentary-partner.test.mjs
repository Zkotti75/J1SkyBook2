import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {MATCH_PAGES,renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
test('each confirmed match displays its own partner and sourced short biography',()=>{
 const expected={'2026-11-11':'高志超','2026-11-15':'冼家裕'};
 for(const f of read('data/matches/index.json').fixtures){const d=read('data/matches/'+f.file),home=read('data/clubs/'+f.home+'.json'),away=read('data/clubs/'+f.away+'.json');if(!d.match_info.commentary?.partner){const h=renderMatchPage({home,away,date:f.date,page:'info',dossier:d});assert.ok(!h.includes('拍檔：'));continue;}assert.equal(d.match_info.commentary.partner,expected[f.date]);assert.ok(d.match_info.commentary.bio.every(x=>x.sources.length));for(const {id} of MATCH_PAGES){const h=renderMatchPage({home,away,date:f.date,page:id,dossier:d});assert.ok(h.includes('拍檔：'+expected[f.date]));if(id==='info'&&d.match_info.commentary.bio.length)assert.ok(h.includes(d.match_info.commentary.bio[0].text));assert.ok(!h.includes('carlos.fung'));}}
});
