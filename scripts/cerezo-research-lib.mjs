import { readFileSync, writeFileSync } from 'node:fs';
export const date='2026-10-24';
export const file='data/clubs/cerezo-osaka.json';
export const load=()=>JSON.parse(readFileSync(file,'utf8'));
export const save=c=>writeFileSync(file,JSON.stringify(c,null,2)+'\n','utf8');
export const S=(label,url,published_at)=>({label,url,accessed_at:date,...(published_at?{published_at}:{})});
export const roster=S('J.League Data Site：大阪櫻花現役登錄及累計紀錄','https://data.j-league.or.jp/SFIX02/search?lang=ja&selectValue=1&selectValueTeam=20');
export const R=(season,team,competition,appearances,goals,sources,notes='',status='正式球員')=>({season,team,competition,appearances,goals,status,notes,verification_status:'verified',sources});
export const Y=(season,team,sources,notes='')=>R(season,team,'Youth / school / college',null,null,sources,notes,'育成');
export const T=(period,team,milestone)=>({period,team,category:'生涯轉折',milestone});
export function finish(p,s){
 p.sources=[...new Map([...Object.values(s).filter(x=>x&&typeof x==='object'&&x.url),roster].map(x=>[x.url,x])).values()];
 p.identity_sources=[s.official,s.league,roster];p.identity_reviewed_at=date;
 p.preferred_foot_sources=s.foot?[s.foot]:[];
 p.wikipedia_research={preferred_language:s.language||'ja',consulted:[s.wiki],note:'先以指定語言Wikipedia作路線索引，再以官方登錄、公告及聯賽／可靠逐季數據核對。'};
 p.career_audit={reviewed_at:date,scope:'最早已知足球機構至2026/27；純育成按機構合併，職業每季及季中／同期隊伍分列。',earliest_known_year:p.career[0].season?Number(p.career[0].season.slice(0,4)):null,sources:[s.official,s.wiki,s.league],notes:p.audit_notes||[]};delete p.audit_notes;
 p.verification_status='verified';p.verified_at=date;p.research_gaps=[];
 p.status_tag_sources=[roster];p.status_tags_reviewed_at=date;
 p.tactical_sources=p.tactical_sources||[s.feature||s.official];
 p.season_stats=p.career.filter(r=>/^(2024|2025|2026)/.test(r.season||'')&&!/Youth|school|college/i.test(r.competition)).map(r=>({season:r.season,competition:r.competition,appearances:r.appearances,goals:r.goals,as_of:'2026-10-23',sources:r.sources}));
}
export function confirmedNames(c){
 const names={'15':'靴蘭迪斯','19':'沙巴治','36':'艾雲'};
 for(const [n,name]of Object.entries(names)){const p=c.players.find(p=>p.number===n);p.name_zh=name;p.name_source='用戶 Scott Yang 於2026-10-24直接確認的TVB香港中文顯示名。';}
 c.team.roster_notes=c.team.roster_notes.map(s=>s==='新夏季外援TVB主資料庫未覆蓋，因此保留官方英文名，不採legacy自行音譯。'?'#15靴蘭迪斯、#19沙巴治、#36艾雲：香港中文顯示名由用戶於2026-10-24直接確認。':s);
 const f='data/research-progress/cerezo-osaka.json',q=JSON.parse(readFileSync(f,'utf8'));
 for(const b of q.batches)for(const p of b.players)if(names[p.number])p.name_zh=names[p.number];
 writeFileSync(f,JSON.stringify(q,null,2)+'\n');
}
