import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { MATCH_PAGES, matchRoute, parseMatchRoute, renderMatchPage, formationGraphic, inInterviewWindow, validDate } from '../match.js';
const home = JSON.parse(await readFile(new URL('../data/clubs/kashiwa.json', import.meta.url)));
const away = JSON.parse(await readFile(new URL('../data/clubs/urawa.json', import.meta.url)));
const date = '2026-10-06';
const dossier = { home: 'kashiwa', away: 'urawa', date, as_of: date,
  teams: { kashiwa: { previous_match_date: '2026-10-01' }, urawa: { previous_match_date: '2026-10-02' } },
  preview: { sections: [{ title: '試驗標題', paragraphs: [{ text: '<script>unsafe</script>', kind: 'opinion', sources: [{url:'https://example.com',label:'測試來源'}] }] }] },
  quotes: [{ topic: '本場目標', home: { speaker: '測試人物', quote_ja: '原文', quote_zh: '中文', published_at: '2026-10-05', url: 'https://example.com' }, away: { speaker:'未來訪問',published_at:'2026-10-07',quote_ja:'未来',quote_zh:'未來' } }],
};
test('match links preserve fixture and page, invalid dates normalize', () => {
  assert.deepEqual(parseMatchRoute(matchRoute('kashiwa','urawa',date,'quotes')), {home:'kashiwa',away:'urawa',date,page:'quotes'});
  assert.equal(parseMatchRoute(matchRoute('kashiwa','urawa','2026-02-30','unknown')).date,'');
  assert.equal(validDate('2026-02-30'),false);
  assert.equal(validDate('2028-02-29'),true);
});
test('all match pages render with the correct teams and honest pending states', () => {
  for(const {id,label} of MATCH_PAGES) {
    const html=renderMatchPage({home,away,date:'',page:id});
    assert.ok(html.includes(label)); assert.ok(html.includes(home.team.name_zh));
    assert.ok(html.includes(away.team.name_zh)); assert.ok(html.includes('本場研究待補'));
  }
});
test('fixture dossier cannot leak to another date or opponent order', () => {
  assert.ok(renderMatchPage({home,away,date,page:'preview',dossier}).includes('試驗標題'));
  assert.ok(!renderMatchPage({home,away,date:'2026-10-07',page:'preview',dossier}).includes('試驗標題'));
  assert.ok(!renderMatchPage({home:away,away:home,date,page:'preview',dossier}).includes('試驗標題'));
});
test('quoted translations require originals and interview window excludes future/old interviews', () => {
  assert.equal(inInterviewWindow({published_at:'2026-10-01'},'2026-10-01',date),false);
  assert.equal(inInterviewWindow({published_at:'2026-10-01',context:'post_match'},'2026-10-01',date),true);
  assert.equal(inInterviewWindow({published_at:date},'2026-10-01',date),true);
  const html=renderMatchPage({home,away,date,page:'quotes',dossier});
  assert.ok(html.includes('測試人物')); assert.ok(html.includes('日文原句')); assert.ok(!html.includes('未來訪問'));
});
test('formations have eleven players and invalid shapes are not displayed', () => {
  const html=formationGraphic({shape:'4-2-3-1'},true);
  assert.equal((html.match(/class="pitch-player"/g)||[]).length,11);
  assert.ok(html.includes('並非球隊預測')); assert.ok(!formationGraphic({shape:'4-4-4'}).includes('football-pitch'));
});
test('preview escapes source text and labels opinion', () => {
  const html=renderMatchPage({home,away,date,page:'preview',dossier});
  assert.ok(html.includes('&lt;script&gt;')); assert.ok(!html.includes('<script>unsafe'));
  assert.ok(html.includes('作者觀點')); assert.ok(!html.includes('測試來源')); assert.ok(!html.includes('href="https://example.com')); 
});
test('standing page does not combine club snapshots into a current league table', () => {
  const html=renderMatchPage({home,away,date,page:'standings'});
  assert.ok(html.includes('同一時間截點')); assert.ok(!html.includes('standings-table'));
});

test('officials require confirmed source-backed identities and source-backed profiles',()=>{
 const copy=structuredClone(dossier);
 copy.match_info={officials:{status:'awaiting_appointment',sources:[{url:'https://example.com',label:'official'}],roles:[{id:'referee',name_ja:'未確認姓名',profile:{claims:[{text:'未確認履歷',as_of:date,sources:[{url:'https://example.com'}]}]}}]}};
 const render=()=>renderMatchPage({home,away,date,page:'officials',dossier:copy});
 assert.ok(!render().includes('未確認姓名'));assert.ok(!render().includes('未確認履歷'));
 copy.match_info.officials.status='confirmed';
 copy.match_info.officials.roles[0]={id:'referee',name_ja:'<script>name</script>',profile:{claims:[{text:'無來源履歷',as_of:date},{text:'已核對履歷',as_of:date,sources:[{url:'https://example.com'}]}]}};
 assert.ok(render().includes('&lt;script&gt;name&lt;/script&gt;'));assert.ok(!render().includes('<script>name'));
 assert.ok(!render().includes('無來源履歷'));assert.ok(render().includes('已核對履歷'));
 assert.ok(!renderMatchPage({home,away,date:'2026-10-07',page:'officials',dossier:copy}).includes('已核對履歷'));
 delete copy.match_info.officials.sources;assert.ok(!render().includes('已核對履歷'));
});

test('officials page preserves an existing sourced referee in earlier dossiers',()=>{
 const old=structuredClone(dossier);old.match_info={referee:'既有主球證',sources:[{url:'https://example.com/record',label:'官方紀錄'}]};
 const h=renderMatchPage({home,away,date,page:'officials',dossier:old});
 assert.ok(h.includes('既有主球證'));assert.ok(h.includes('官方已確認'));assert.ok(h.includes('其他職務尚未收錄'));
});

// The quick briefing belongs to section 01 only, including legacy routes.
test('quick read appears only on the match info screen', () => {
  for (const page of [...MATCH_PAGES.map(p => p.id), 'standings', 'history', 'tactics', 'officials', 'live']) {
    const html = renderMatchPage({ home, away, date, page, dossier });
    assert.equal(html.includes('class="quick-read"'), page === 'info', page);
  }
});

test('live flow keeps team identity, removes source blocks and filters actual three-yellow risk',()=>{
 const copy=structuredClone(dossier);
 copy.teams.kashiwa.yellow_risk=[{text:'有效累積3張：測試臨界球員',kind:'fact',sources:[{url:'https://example.com'}]},{text:'單黃牌比賽3場：非有效累積',kind:'reported',sources:[{url:'https://example.com'}]},{text:'有效累積2張',kind:'fact',sources:[{url:'https://example.com'}]}];
 const h=renderMatchPage({home,away,date,page:'availability',dossier:copy});
 assert.ok(h.includes('測試臨界球員'));assert.ok(!h.includes('非有效累積'));assert.ok(!h.includes('有效累積2張'));
 assert.ok(h.includes('column-team-label'));assert.ok(h.includes('team-column-home'));assert.ok(h.includes('team-column-away'));
 const p=renderMatchPage({home,away,date,page:'players',dossier:copy});assert.ok(!p.includes('球員基本／進階統計'));assert.ok(p.includes('關鍵球員'));
});
