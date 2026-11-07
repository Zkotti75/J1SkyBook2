import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATCH_PAGES,renderMatchPage} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const d=read('data/matches/2026-11-07-fc-tokyo-kashima.json');
const home=read('data/clubs/fc-tokyo.json'),away=read('data/clubs/kashima.json');
const render=dossier=>renderMatchPage({home,away,dossier,date:d.date,page:'rotation'});
test('workload view separates missing regulars, sorted current squads and consecutive workload',()=>{
 assert.equal(MATCH_PAGES.find(p=>p.id==='rotation').label,'球員體力負荷');
 const h=render(d);
 assert.ok(h.indexOf('未入選常規主力')<h.indexOf('今日正選11人'));
 const starters=h.slice(h.indexOf('今日正選11人'),h.indexOf('今日後備'));
 assert.equal((starters.match(/<tbody>/g)||[]).length,2);
 assert.equal((starters.match(/<tr>/g)||[]).length,24); // two headers plus 22 players
 assert.ok(starters.indexOf('#33 俵積田')<starters.indexOf('#15 大森'));
 assert.ok(starters.indexOf('#5 關川')<starters.indexOf('#7 小川'));
 assert.ok(starters.includes('#25 小池'));
 assert.ok(h.includes('連續兩場踢足'));
 assert.ok(!h.includes('本季使用率・正選／上陣／分鐘'));
 assert.ok(h.includes('不能判定輪休'));
});
test('missing participant rows are not silently zeroed for incomplete minute samples',()=>{
 const copy=structuredClone(d);copy.teams.kashima.workload.minutes.shift();
 const h=render(copy);const start=h.slice(h.indexOf('今日正選11人'),h.indexOf('今日後備'));
 assert.ok(start.includes('分鐘待核對'));
});
