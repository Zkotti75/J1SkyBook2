import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {MATCH_PAGES,renderMatchPage,parseMatchRoute,matchRoute} from '../match.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const home=read('data/clubs/kashima.json'),away=read('data/clubs/cerezo-osaka.json');
const d=read('data/matches/2026-10-31-kashima-cerezo-osaka.json');
const render=(page,data=d)=>renderMatchPage({home,away,date:d.date,dossier:data,page});
test('nine sections match commentary order and first opening is information',()=>{
 assert.deepEqual(MATCH_PAGES.map(p=>p.id),['info','quotes','comparison','availability','analytics','rotation','players','preview','logs']);assert.equal(parseMatchRoute(matchRoute(d.home,d.away,d.date)).page,'info');
 for(const p of MATCH_PAGES){const h=render(p.id);assert.equal(h.includes('本場速讀'),p.id==='info');assert.ok(h.includes(p.label));assert.ok(!h.includes('undefined'));}
});
test('interviews have independent columns, coaches first, dated sources without links',()=>{
 const data=structuredClone(d);data.quote_events=[{entries:[{team_slug:d.home,speaker:'球員測試',role:'球員',category:'team',published_at:'2026-10-25',paraphrase_zh:'球員內容',outlet:'來源',url:'https://secret-source.example'},{team_slug:d.home,speaker:'教練測試',role:'監督',category:'last_game',published_at:'2026-10-24',context:'post_match',paraphrase_zh:'教練內容',outlet:'來源',url:'https://secret-source.example'}]}];
 const h=render('quotes',data);assert.ok(h.indexOf('教練內容')<h.indexOf('球員內容'));assert.ok(h.includes('2026-10-25 · 來源'));assert.ok(!h.includes('secret-source.example'));
});
test('recent/future tables select five and show results, notes and rest intervals',()=>{
 const data=structuredClone(d);data.teams[d.home].game_log=Array.from({length:7},(_,i)=>({date:`2026-10-${String(10+i).padStart(2,'0')}`,competition:'J1',venue:'主',opponent:'歷史'+i,score:i===6?'0–1':i===5?'1–1':'2–0'})).concat(Array.from({length:7},(_,i)=>({date:`2026-11-${String(1+i*3).padStart(2,'0')}`,competition:'J1',venue:'客',opponent:'未來'+i,score:null})));
 const h=render('comparison',data);assert.ok(!h.includes('歷史0'));assert.ok(h.includes('歷史6'));assert.ok(!h.includes('未來6'));assert.ok(h.includes('中2日'));assert.ok(h.includes('>負<'));assert.ok(h.includes('>和<'));assert.ok(h.includes('>勝<'));
});
test('advanced metrics retain rank, sample, date and safe interpretation',()=>{
 const data=structuredClone(d);data.teams[d.home].team_metrics={attack:[{label:'xG',value:1.75,rank:3,unit:'每場',sample:'12場',as_of:'2026-10-25',interpretation:'<unsafe>',sources:[{label:'Football LAB',url:'https://www.football-lab.jp/'}]}]};
 const h=render('analytics',data);assert.ok(h.includes('1.75（3）'));assert.ok(h.includes('12場'));assert.ok(h.includes('&lt;unsafe&gt;'));assert.ok(!h.includes('<unsafe>'));
});
