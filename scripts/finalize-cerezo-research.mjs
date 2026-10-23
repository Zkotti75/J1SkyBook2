import {readFileSync,writeFileSync} from 'node:fs';
// Preserve known institutions without inventing calendar dates from age alone.
const file='scripts/set-cerezo-batch-06.mjs';
let text=readFileSync(file,'utf8');
text=text.replace("Y('2012-2014','大宮松鼠U-12',[s.official],'小四加入、小六暑假前離開；按學年約算，非全年在籍。')","Y(null,'大宮松鼠U-12',[s.official],'小四加入、小六暑假前離開；訪談未列確切年份。')");
text=text.replace("Y('2013-2021','西宮SS',[s.official],'4歲開始，起年按年齡約算。')","Y(null,'西宮SS',[s.official,s.league],'4歲開始，最遲2021在籍；未從年齡推算起年。')");
text=text.replace("'https://web.gekisaka.jp/news/youth/detail/?266890-266890-fl='),current}","'https://web.gekisaka.jp/news/youth/detail/?266890-266890-fl=','2019-02-22'),current}");
text=text.replaceAll('Gekisaka《閃光少年》，','2019-02-22 Gekisaka《閃光少年》，');
writeFileSync(file,text);
await import('./set-cerezo-batch-06.mjs');
const clubFile='data/clubs/cerezo-osaka.json';
const c=JSON.parse(readFileSync(clubFile,'utf8'));
const p=c.players.find(p=>p.number==='97');
p.career.find(r=>r.team==='馴柴足球少年團').sources.push(p.sources.find(s=>s.url==='https://www.jleague.jp/player/1635375/'));
p.career.find(r=>r.team==='馴柴足球少年團').notes='2008-2013以J.League逐年履歷為據，不由年齡反推。';
// Clarify the old roster summary where a later professional contract supersedes it.
c.team.roster_notes=c.team.roster_notes.map(n=>n.startsWith('Current squad 29人')?'Current squad 29人；逐張球員資料於2026-10-24完成研究。#42鹽尻及#45永添為二種；#43艾澤莫克韋已公告2026/27起職業合約，球會及Data Site仍有二種標記，差異見球員核查註記。':n);
writeFileSync(clubFile,JSON.stringify(c,null,2)+'\n');
