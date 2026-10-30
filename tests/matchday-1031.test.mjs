import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync(new URL('../data/matches/2026-10-31-kashima-cerezo-osaka.json',import.meta.url)));
test('October 31 early sweep replaces tentative medical notes and dates weather/discipline',()=>{
 assert.equal(d.as_of,'2026-10-31');assert.ok(d.teams.kashima.injuries.some(c=>c.text.includes('右脛骨近端骨折')));assert.ok(d.teams.kashima.injuries.some(c=>c.text.includes('李奧施亞拉')&&c.text.includes('復出')));assert.ok(d.teams['cerezo-osaka'].injuries.some(c=>c.text.includes('橫山')&&c.text.includes('足踝')));assert.ok(d.teams.kashima.transfers.some(c=>c.text.includes('32')));assert.ok(d.match_info.weather.text.includes('預報'));assert.equal(d.match_info.lineups_as_of,null);assert.ok(d.teams.kashima.suspensions[0].text.includes('29日'));assert.ok(d.quote_events.flatMap(x=>x.entries).some(q=>q.speaker==='田中駿汰'&&q.published_at==='2026-10-30'));
});
