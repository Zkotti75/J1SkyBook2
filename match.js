export const MATCH_PAGES = [
 {id:'info',label:'比賽相關資料',description:'天氣・球場・球證・故事線'},
 {id:'quotes',label:'兩隊球員／教練訪問',description:'教練優先・分類・最新在前'},
 {id:'comparison',label:'球隊成績比較',description:'球季・近五仗・未來五仗・對賽'},
 {id:'availability',label:'轉會／傷患／停賽',description:'人腳變動・累積黃牌'},
 {id:'analytics',label:'球隊統計分析',description:'基本・進階・死球・門將'},
 {id:'rotation',label:'球員體力負荷',description:'缺席主力・正選／後備・連續負荷'},
 {id:'players',label:'球員統計分析／資訊',description:'核心・每90分鐘・外援・青年'},
 {id:'preview',label:'比賽分析',description:'關鍵對位・觀察重點・情境調整'},
 {id:'logs',label:'聯賽榜／全季賽程',description:'完整戰績・勝和負・賽程'},
];
export const CUP_PAGE = {id:'cup',label:'盃賽專區',description:'完整籤表・晉級路線・全部賽果'};
export const matchPages = dossier => dossier?.cup_tournament || dossier?.competition === 'leaguecup' ? [...MATCH_PAGES,CUP_PAGE] : MATCH_PAGES;
const LEGACY_PAGES = ['standings','history','tactics','officials','live'].map(id=>({id,label:{standings:'聯賽榜',history:'對賽歷史',tactics:'戰術對位',officials:'球證與旁證',live:'即場速覽'}[id],description:'歷史連結'}));
const pageExists = id => [...MATCH_PAGES,CUP_PAGE,...LEGACY_PAGES].some(p=>p.id===id);
const e = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const blank = (text = '待賽前核實') => `<span class="research-pending">${e(text)}</span>`;
const field = v => v === null || v === undefined || v === '' ? blank() : e(v);
export function validDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value; }
export function matchRoute(home, away, date = '', page = 'info') { return `#/match/${encodeURIComponent(home)}/${encodeURIComponent(away)}/${validDate(date) ? date : 'undated'}/${pageExists(page) ? page : 'info'}`; }
export function parseMatchRoute(hash) {
  try {
    const [, home, away, date, page] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    return { home, away, date: validDate(date) ? date : '', page: pageExists(page) ? page : 'info' };
  } catch { return { page: 'info', date: '' }; }
}
function sources() { return ''; }

function claim(item) {
  if (!item) return blank();
  if (typeof item === 'string') return `<p>${e(item)}</p>`;
  const labels = { fact: '已核實資料', reported: '媒體報道', opinion: '作者觀點', analysis: '天書分析' };
  return `<p>${e(item.text)}</p><div class="claim-meta">${e(labels[item.kind] || '來源待分類')}${item.as_of ? ` · ${e(item.as_of)}` : ''}</div><div class="source-list">${sources(item.sources)}</div>`;
}
function claims(items) { return items?.length ? items.map(claim).join('') : blank(); }
function clubHeading(club, side) {
  const t = club.team;
  return `<header class="comparison-club ${side}">${t.logo_url ? `<img src="${e(t.logo_url)}" alt="${e(t.name_zh)}會徽">` : ''}<div><small>${side === 'home' ? '主隊' : '客隊'}</small><h3>${e(t.name_zh)}</h3><span>${e(t.name_en)}</span></div><a class="club-link" href="#/club/${e(t.slug)}">球隊資料 ↗</a></header>`;
}
function pair(ctx, left, right, label = '') {
 const cell=(club,content,side)=>{const color=/^#[0-9a-f]{6}$/i.test(club.team.colors?.bg||'')?club.team.colors.bg:'#4277a5';return `<div class="comparison-cell team-column team-column-${side}" style="--column-team-color:${color}"><div class="column-team-label"><span class="column-team-dot"></span>${e(club.team.name_zh)}<small>${side==='home'?'主隊':'客隊'}</small></div>${content}</div>`;};
 return `${label ? `<h3 class="comparison-label">${e(label)}</h3>` : ''}<div class="comparison-pair">${cell(ctx.home,left,'home')}${cell(ctx.away,right,'away')}</div>`;
}
function card(title, content, meta = '') { return `<section class="match-section"><h3>${e(title)}</h3>${meta ? `<div class="section-meta">${e(meta)}</div>` : ''}${content}</section>`; }
function stats(club, snapshot) {
  const s = snapshot || club.team.current_season;
  if (!s || s.season !== '2026/27') return blank('尚未收錄本季數據');
  return `<div class="snapshot-label">${snapshot ? '已核對聯賽數據' : '館藏數據'} · 截至 ${field(s.as_of)} · ${e(s.competition || s.season)}</div><div class="match-metrics">${[['排名',s.rank],['積分',s.points],['已賽',s.matches],['入球',s.goals_for],['失球',s.goals_against],['得失球差',s.goal_difference]].map(([k,v]) => `<div><small>${k}</small><strong>${field(v)}</strong></div>`).join('')}</div><p class="record-line">${field(s.wins)} 勝　${field(s.draws)} 和　${field(s.losses)} 負</p><div class="source-list">${sources(snapshot?.sources || club.team.sources)}</div>`;
}
export function formationGraphic(formation, illustrative = false) {
  const lines = formation?.shape?.split('-').map(Number);
  if (!lines || lines.some(n => !Number.isInteger(n) || n < 1 || n > 5) || lines.reduce((a,b)=>a+b,0) !== 10) return blank('常用陣式未核實');
  const rows = [...lines].reverse().concat(1);
  let slot = 0;
  return `<div class="formation-caption">${e(formation.shape)} · ${illustrative ? '版面示意，並非球隊預測' : e(formation.label || '陣式資料')} ${formation.as_of ? `· ${e(formation.as_of)}` : ''}</div><div class="football-pitch" role="img" aria-label="${e(formation.shape)} ${illustrative ? '示意陣式' : e(formation.label || '陣式')}"><div class="pitch-centre"></div>${rows.map(n => `<div class="pitch-row">${Array.from({length:n},()=>{const p=formation.players?.[slot++];return `<div class="pitch-player"><span>${e(p?.number || '•')}</span>${p?.name ? `<small>${e(p.name)}</small>` : ''}</div>`;}).join('')}</div>`).join('')}</div><div class="source-list">${sources(formation.sources)}</div>`;
}
function archivedStyle(club) {
  const m = club.manager;
  if (!m?.tactical_traits?.length) return blank();
  return `<div class="snapshot-label">教練理念・館藏資料 ${e(m.verified_at || club.team.roster_as_of || '')}<br>此為既有教練研究，並非本場操練或陣式確認。</div><p><strong>${e(m.name_zh || m.name_en)}</strong></p>${m.tactical_traits.map(t=>`<p>${e(t)}</p>`).join('')}<div class="source-list">${sources(m.sources)}</div>`;
}
function workloadTable(w) {
  if (!w?.minutes?.length) return '';
  return `<p>${e(w.minutes_note)}</p><div class="table-wrap"><table class="match-table"><thead><tr><th>球員</th><th>${e(w.normal_starts_label || '統計期內正選次數')}</th><th>${e(w.baseline_match_date)} 分鐘</th><th>${e(w.match_date)} 分鐘</th><th>上仗角色</th></tr></thead><tbody>${w.minutes.map(p=>`<tr><td>#${e(p.number)} ${e(p.name)}</td><td>${field(p.normal_starts)}</td><td>${field(p.prior_minutes)}</td><td>${e(p.minutes)}</td><td>${p.started ? '正選' : p.minutes ? '後備上陣' : '未上陣'}</td></tr>`).join('')}</tbody></table></div><div class="source-list">${sources(w.sources)}</div>`;
}
function comparison(ctx) {
  const a = ctx.dossier?.teams?.[ctx.home.team.slug] || {}, b = ctx.dossier?.teams?.[ctx.away.team.slug] || {};
  let html = pair(ctx, stats(ctx.home,a.stats), stats(ctx.away,b.stats), '球季數據快覽');
  html += pair(ctx, claims(a.analytics), claims(b.analytics), '機會創造與防守・聯賽統計');
  html += pair(ctx, a.style?.length ? claims(a.style) : archivedStyle(ctx.home), b.style?.length ? claims(b.style) : archivedStyle(ctx.away), '常用踢法與近期變化');
  html += pair(ctx, formationGraphic(a.formation), formationGraphic(b.formation), '陣式圖');
  if (!a.formation && !b.formation) html += '<details class="formation-demo"><summary>查看陣式圖版面示意</summary><div class="comparison-pair">' + `<div class="comparison-cell">${formationGraphic({shape:'4-2-3-1'}, true)}</div><div class="comparison-cell">${formationGraphic({shape:'3-4-2-1'}, true)}</div></div></details>`;
  if (a.rotation_notes?.length || b.rotation_notes?.length) html += pair(ctx, claims(a.rotation_notes), claims(b.rotation_notes), '周中輪換與常用主力負荷');
  if (a.workload || b.workload) html += pair(ctx,workloadTable(a.workload),workloadTable(b.workload),'逐人分鐘比較・前兩場聯賽');
  for (const [key, label] of [['form','近期戰績與連勝／不敗走勢'],['scorers','本季入球領先球員'],['assists','本季助攻領先球員'],['transfers','近期轉會'],['suspensions','停賽'],['injuries','傷患與出場狀況'],['yellow_risk','黃牌累積・停賽邊緣']]) html += pair(ctx, claims(a[key]), claims(b[key]), label);
  return html;
}
function preview(ctx) {
  const p = ctx.dossier?.preview;
  if (!p?.sections?.length) return card('賽前深度分析', '<p>尚未有這場比賽的深度研究。選定比賽日期後，這裏會收錄日本媒體報道、操練觀察、採訪及戰術分析。</p><div class="preview-outline"><span>01　比賽背景與兩軍形勢</span><span>02　上仗留下的問題</span><span>03　操練與用人線索</span><span>04　關鍵對位與比賽走向</span><span>05　日本記者觀點</span></div>');
  return `${p.cues?.length ? card('評述重點',claims(p.cues)) : ''}<div class="preview-article">${p.sections.map(s => card(s.title,claims(s.paragraphs))).join('')}</div>`;
}
export function inInterviewWindow(quote, start, end) { return validDate(quote?.published_at) && validDate(start) && validDate(end) && (quote.published_at > start || (quote.published_at === start && quote.context === 'post_match')) && quote.published_at <= end; }
function quoteCell(q) {
  if (!q) return blank('未找到同題發言');
  return `<div class="quote-speaker">${e(q.speaker)} <small>${e(q.role || '')}</small></div>${q.topic ? `<h4>${e(q.topic)}</h4>` : ''}${q.quote_ja && q.quote_zh ? `<blockquote>「${e(q.quote_zh)}」</blockquote><details><summary>日文原句</summary><p lang="ja">${e(q.quote_ja)}</p></details>` : ''}${q.paraphrase_zh ? `<p><strong>訪問摘要：</strong>${e(q.paraphrase_zh)}</p>` : ''}<div class="claim-meta">${q.date_basis === 'accessed' ? '覆核日 ' : ''}${e(q.published_at)}${q.context === 'post_match' ? ' · 上仗賽後' : q.context === 'pre_match' ? ' · 本場賽前' : ''} · ${e(q.outlet || '')}</div>${q.date_note ? `<p class="quote-date-note">${e(q.date_note)}</p>` : ''}<div class="source-list">${sources(q.url ? [{url:q.url,label:q.outlet}] : [])}</div>`;
}
function quotes(ctx) {
  const d = ctx.dossier;
  if(d?.interview_layout==='team_columns'){const categories=[['last_game','關於上仗'],['upcoming','本場及對手'],['team','自身強弱項'],['players','個別球員']];const all=(d.quote_events||[]).flatMap(ev=>ev.entries||[]).filter(q=>inInterviewWindow(q,d.teams?.[q.team_slug]?.previous_match_date,ctx.date));return pair(ctx,...[ctx.home,ctx.away].map(club=>['監督','球員'].map(role=>card(role==='監督'?'主教練訪問':'球員訪問',categories.map(([key,label])=>{const rows=all.filter(q=>q.team_slug===club.team.slug&&(role==='監督'?q.role==='監督':q.role!=='監督')&&(q.category||'last_game')===key).sort((a,b)=>b.published_at.localeCompare(a.published_at));return rows.length?`<h4>${label}</h4>`+rows.map(q=>`<article class="event-quote"><strong>${e(q.speaker)}</strong><p>${e(q.paraphrase_zh||q.quote_zh||'')}</p><small>${e(q.published_at)} · ${e(q.outlet)}</small></article>`).join(''):'';}).join('')||blank('尚未取得可核對訪問'))).join('')));}
  const events = d?.quote_events || (d?.quotes || []).map(row => ({title:row.topic,entries:[row.home && {...row.home,team_slug:ctx.home.team.slug},row.away && {...row.away,team_slug:ctx.away.team.slug}].filter(Boolean)}));
  const content = [...events].sort((a,b)=>(b.date || '').localeCompare(a.date || '')).map(event => {
    const entries = (event.entries || []).filter(q => [ctx.home.team.slug,ctx.away.team.slug].includes(q.team_slug) && inInterviewWindow(q,d.teams?.[q.team_slug]?.previous_match_date,ctx.date));
    const videos=(event.videos || []).filter(v=>[ctx.home.team.slug,ctx.away.team.slug].includes(v.team_slug) && inInterviewWindow(v,d.teams?.[v.team_slug]?.previous_match_date,ctx.date));
    const videoHtml=videos.map(v=>`<article class="event-quote"><strong>${e(v.speaker)}</strong><p>官方訪問影片・未核對逐字稿</p>${sources([{url:v.url,label:v.outlet,published_at:v.published_at}])}</article>`).join('');
    return entries.length || videos.length ? card(event.title,`${event.summary ? `<p>${e(event.summary)}</p>` : ''}<div class="event-quotes">${entries.map(q=>`<article class="event-quote">${quoteCell(q)}</article>`).join('')}${videoHtml}</div>`,event.date || '') : '';
  }).join('');
  const background = (d?.quote_background || []).map(row=>pair(ctx,quoteCell(row.home),quoteCell(row.away),row.topic)).join('');
  return card('近期訪問・按事件整理','<p class="match-description">收錄上仗賽後至本場的發言，較新事件在前。每則保留人物、問題、日期及出處；短引句附日文原句，其餘標作訪問摘要。</p>') + (d?.quote_status ? card('本場採訪進度',claim(d.quote_status)) : '') + (content || card('近期訪問',blank('尚未收錄本場訪問'))) + (background ? card('較早背景訪問・按題並排', '<p>以下發言早於上仗，保留原日期，只供背景參考。</p>'+background) : '');
}
function focusPlayer(club, entry) {
  const p = club.players?.find(p => p.id === entry.player_id || String(p.number) === String(entry.number));
  if (!p) {
    const m = entry.match_profile;
    if (!m?.name_ja || !/^https:\/\//.test(m.official_url || '') || !entry.description?.some(c=>c.sources?.length)) return blank('球員資料待核對');
    return `<article class="focus-player"><div class="focus-player-heading"><div><small>#${e(entry.number)} · ${e(m.position)}</small><h4>${e(m.name_ja)}</h4><span>姓名沿用日文官方寫法</span></div></div>${claims(entry.description)}${claims(entry.stats)}${claims(entry.analytics)}<div class="source-list">${sources([{url:m.official_url,label:'官方球員資料 ↗'}])}</div></article>`;
  }
  return `<article class="focus-player"><div class="focus-player-heading">${p.player_image ? `<img src="${e(p.player_image)}" alt="${e(p.name_zh)}">` : ''}<div><small>#${e(p.number)} · ${e(p.position)}</small><h4><a href="#/club/${e(club.team.slug)}/player/${e(p.number)}">${e(p.name_zh || p.name_en)}</a></h4><span>${e(p.nationality || '')}</span></div></div>${claims(entry.description)}${claims(entry.stats)}${claims(entry.analytics)}</article>`;
}
function players(ctx) {
  const groups = [['stars','關鍵球員'],['foreign','非日本籍球員'],['youth','青訓及新晉球員']];
  const catalogue = pair(ctx, ...[ctx.home,ctx.away].map(c => {
    const foreigners = (c.players || []).filter(p=>p.nationality && p.nationality !== '日本');
    return foreigners.length ? foreigners.map(p=>`<a class="foreign-roster-link" href="#/club/${e(c.team.slug)}/player/${e(p.number)}"><strong>#${e(p.number)} ${e(p.name_zh || p.name_en)}</strong><span>${e(p.position)} · ${e(p.nationality)}</span></a>`).join('') : blank('館藏未列非日本籍球員');
  }), '館藏非日本籍球員名單・點擊查看完整卡');
  return '<p class="match-description">本場焦點由來源支持的研究選定；不會自動把名氣、國籍或年齡當作影響比賽的證據。</p>' + groups.map(([key,label]) => pair(ctx,...[ctx.home,ctx.away].map(c => {
    const rows = ctx.dossier?.teams?.[c.team.slug]?.players_to_watch?.[key];
    return rows?.length ? rows.map(r=>focusPlayer(c,r)).join('') : blank('尚未收錄本場焦點球員');
  }),label)).join('') + catalogue;
}
function gameLog(rows, date) {
  if (!rows?.length) return blank('全季逐場記錄尚未收錄');
  return `<div class="table-wrap"><table class="match-table"><thead><tr><th>日期</th><th>賽事</th><th>主／客</th><th>對手</th><th>賽果</th><th>備註</th></tr></thead><tbody>${[...rows].sort((a,b)=>(a.sort_date || a.date).localeCompare(b.sort_date || b.date)).map(r=>`<tr class="${r.date === date ? 'selected-fixture' : ''}"><td>${e(r.date_display || r.date)}</td><td>${e(r.competition)}</td><td>${e(r.venue)}</td><td>${e(r.opponent)}</td><td>${r.score == null ? blank('未賽') : e(r.score) + (()=>{const [a,b]=r.score.split(/[–−-]/).map(Number);return Number.isFinite(a)&&Number.isFinite(b)?` <strong>${a>b?'勝':a<b?'負':'和'}</strong>`:'';})()}</td><td>${e(r.comment||r.note||'')}</td></tr>`).join('')}</tbody></table></div>`;
}
function standings(ctx) {
  const snapshot = ctx.dossier?.standings;
  if (!snapshot?.rows?.length) return card('2026/27 J1 聯賽榜', '<p>尚未收錄完整、同一時間截點的聯賽榜。兩軍比較頁的館藏數據不會拼接成即時排名。</p>');
  return card('2026/27 J1 聯賽榜', `<div class="table-wrap"><table class="standings-table"><thead><tr><th>排名</th><th>球隊</th><th>賽</th><th>勝</th><th>和</th><th>負</th><th>得</th><th>失</th><th>差</th><th>分</th></tr></thead><tbody>${snapshot.rows.map(r=>`<tr class="${[ctx.home.team.slug,ctx.away.team.slug].includes(r.slug) ? 'selected-fixture' : ''}">${['rank','name_zh','played','wins','draws','losses','goals_for','goals_against','goal_difference','points'].map(k=>`<td>${field(r[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="source-list">${sources(snapshot.sources)}</div>`, `資料截至 ${snapshot.as_of || '未註明'}`);
}
function history(ctx) { return card('歷次交鋒', claims(ctx.dossier?.head_to_head)) + pair(ctx,claims(ctx.dossier?.teams?.[ctx.home.team.slug]?.storylines),claims(ctx.dossier?.teams?.[ctx.away.team.slug]?.storylines),'倒戈球員・里程碑・背景故事'); }
function tactics(ctx) {
  const rows = ctx.dossier?.tactical_matchups;
  return rows?.length ? rows.map(r=>pair(ctx,claim(r.home),claim(r.away),r.topic)).join('') : ['前場壓迫與後場組織','邊路進攻與防守覆蓋','攻守轉換','角球與罰球','後備調動'].map(topic=>pair(ctx,blank('等待本場戰術研究'),blank('等待本場戰術研究'),topic)).join('');
}
function officials(ctx) {
  const info = ctx.dossier?.match_info || {};
  const o = info.officials || (info.referee ? {status:'partially_confirmed',roles:[{id:'referee',name_ja:info.referee,status:'confirmed'}],sources:info.sources,note:'此場既有紀錄只收錄主球證；其他職務尚未收錄。'} : null);
  const definitions = [['referee','主球證'],['assistant_1','旁證1'],['assistant_2','旁證2'],['fourth_official','第4球證'],['var','VAR'],['avar','AVAR']];
  const sourced = o?.sources?.some(s => /^https?:\/\//.test(s.url || ''));
  const rows = definitions.map(([id,label]) => {
    const r = o?.roles?.find(r => r.id === id) || {};
    const confirmed = Boolean(sourced && (o.status === 'confirmed' || (o.status === 'partially_confirmed' && r.status === 'confirmed')) && r.name_ja);
    return { ...r, id, label, confirmed };
  });
  const table = `<div class="table-wrap"><table class="match-table"><thead><tr><th>職務</th><th>姓名</th><th>確認狀態</th></tr></thead><tbody>${rows.map(r => `<tr><td>${e(r.label)}</td><td>${r.confirmed ? e(r.name_zh || r.name_ja) + (r.name_zh && r.name_zh !== r.name_ja ? `<small lang="ja">（${e(r.name_ja)}）</small>` : '') : blank('待官方公布')}</td><td>${r.confirmed ? '官方已確認' : '委任未確認'}</td></tr>`).join('')}</tbody></table></div>`;
  const profiles = rows.filter(r => r.confirmed).map(r => {
    const c = (r.profile?.claims || []).filter(c => c.text && validDate(c.as_of) && c.as_of <= ctx.date && c.sources?.some(s=>/^https?:\/\//.test(s.url || '')));
    return c.length ? card(`${r.label}｜${r.name_zh || r.name_ja}`,claims(c)) : '';
  }).join('');
  return card('球證與旁證', `${o?.note ? `<p>${e(o.note)}</p>` : '<p>尚未收錄本場球證組委任資料。</p>'}${table}${o?.profile_note ? `<p>${e(o.profile_note)}</p>` : ''}<div class="source-list">${sources(o?.sources)}</div>`, o?.checked_at_display ? `最後核對 ${o.checked_at_display}` : '') + profiles;
}
function live(ctx) {
  const info = ctx.dossier?.match_info || {};
  return commentaryTeam(ctx)+card('比賽基本資料', `<div class="match-metrics">${[['開賽時間',info.kickoff_hkt],['場地',info.stadium],...(!info.officials ? [['球證',info.referee]] : []),['正選公布',info.lineups_as_of]].map(([label,v])=>`<div><small>${label}</small><strong>${field(v)}</strong></div>`).join('')}</div>${info.selection_note ? `<p>${e(info.selection_note)}</p>` : ''}<div class="source-list">${sources(info.sources)}</div>`) + officials(ctx) + (info.weather ? card('比賽日天氣',claim(info.weather)) : '') + pair(ctx,...[ctx.home,ctx.away].map(c=>{
    const side=ctx.dossier?.teams?.[c.team.slug]?.lineup;
    return card('官方正選',claims(side?.starters)) + card('後備',claims(side?.bench)) + card('即場評述重點',claims(side?.cues));
  }), '官方陣容與評述筆記');
}
export function renderMatchPage(input) {
  const ctx = { ...input, dossier: input.dossier?.home === input.home.team.slug && input.dossier?.away === input.away.team.slug && input.dossier?.date === input.date ? input.dossier : null };
  const page = [...matchPages(ctx.dossier),...LEGACY_PAGES].find(p=>p.id===ctx.page) || MATCH_PAGES[0];
  const content = {cup:cupTournament,info:matchInfo,availability,analytics:teamAnalytics,rotation,comparison:c=>c.dossier?.interview_layout==='team_columns'?resultsComparison(c):comparison(c),preview:c=>preview(c)+tactics(c)+scenarioAnalysis(c),quotes,players:c=>players(c),logs:c=>standings(c)+'<p class="match-description">只列2026/27正式賽季，包含全部38輪聯賽及已確定盃賽。比分以該隊為先；2027賽程按來源保留暫定日期或日期範圍，可能調整。</p>'+pair(c,...[c.home,c.away].map(club=>gameLog(c.dossier?.teams?.[club.team.slug]?.game_log,c.date))),standings,history,tactics,officials,live}[page.id](ctx);
  return `<article class="panel match-panel"><header class="match-hero"><div><div class="eyebrow">MATCH CENTRE / 2026–27</div><h2>${e(ctx.home.team.name_zh)} <span>對</span> ${e(ctx.away.team.name_zh)}</h2><p>${e(page.label)} · ${e(page.description)}</p></div><div class="match-date-label">下一場評述<strong>${e(ctx.date)}</strong><span>${e(ctx.dossier?.match_info?.kickoff_hkt || '')}</span>${ctx.dossier?.match_info?.commentary?.partner?`<span class="partner-header">拍檔：${e(ctx.dossier.match_info.commentary.partner)}</span>`:''}</div></header><div class="match-content"><div class="match-status ${ctx.dossier ? 'ready' : ''}"><span>${ctx.dossier ? '本場研究' : '介面初稿・本場研究待補'}</span><p>${ctx.dossier ? `核對日期 ${e(ctx.dossier.as_of || '未註明')}。${e(ctx.dossier.coverage_note || '各項來源與截點請見內文。')}` : '可先試用頁面與切換功能。球季數據為既有館藏截點；本場訪問、傷停、預測及即時排名尚未核實。'}</p></div><div class="comparison-headings">${clubHeading(ctx.home,'home')}${clubHeading(ctx.away,'away')}</div>${page.id === 'info' ? quickRead(ctx) : ''}${content}</div></article>`;
}

function sides(ctx, fn, title) { return pair(ctx,...[ctx.home,ctx.away].map(club=>fn(ctx.dossier?.teams?.[club.team.slug]||{},club)),title); }
function quickRead(ctx) {
 const d=ctx.dossier,info=d?.match_info||{};
 const cue=d?.preview?.cues?.slice(0,3)||[];
 return `<details class="quick-read" open><summary>本場速讀 <small>核對 ${e(d?.as_of||'待核對')}</small></summary><div class="quick-read-grid"><div><strong>正式名單</strong><p>${info.lineups_as_of?e(info.lineups_as_of):'待官方公布'}</p></div><div><strong>球證組</strong><p>${info.officials?.status==='confirmed'?'已確認':'待官方公布'}</p></div>${[ctx.home,ctx.away].map(club=>{const t=d?.teams?.[club.team.slug]||{};return `<div><strong>${e(club.team.name_zh)}・人腳</strong><p>${t.lineup?.starting_changes_vs_previous_match!=null?e(t.lineup.starting_changes_vs_previous_match)+'名正選變動':'本場輪換待名單確認'}</p>${(t.injuries||[]).slice(0,1).map(x=>`<p>${e(x.text)}</p>`).join('')}</div>`;}).join('')}</div>${cue.length?claims(cue):'<p>故事重點見比賽資料；戰術觀察見比賽分析。</p>'}<div class="quick-links">${matchPages(d).map(p=>`<a href="${matchRoute(ctx.home.team.slug,ctx.away.team.slug,ctx.date,p.id)}">${e(p.label)}</a>`).join('')}</div></details>`;
}
function commentaryTeam(ctx) {
 const c=ctx.dossier?.match_info?.commentary;
 if(!c?.partner)return '';
 return card('本場評述拍檔',`<div class="commentary-partner"><strong>${e(c.host || '史葛')} ＋ ${e(c.partner)}</strong><small>評述編排已確認 · ${e(c.confirmed_at || '')}</small></div>${claims(c.bio)}`);
}
function matchInfo(ctx) {
 const i=ctx.dossier?.match_info||{};
 return commentaryTeam(ctx)+card('比賽基本資料',`<div class="match-metrics">${[['開球（香港時間）',i.kickoff_hkt],['球場',i.stadium],['資料最後核對',ctx.dossier?.research_sweep?.checked_at||ctx.dossier?.as_of]].map(([k,v])=>`<div><small>${k}</small><strong>${field(v)}</strong></div>`).join('')}</div>`)+card('天氣／溫度',i.weather?claim(i.weather):blank('比賽日預報及球場實測待核對'))+card('主場球場・容量／草地／尺寸',claims(i.stadium_facts))+officials(ctx)+card('球證執法傾向',claims(i.referee_tendencies))+card('特別活動／本場意義',claims(i.events))+card('客隊球迷旅程',claims(i.visitor_travel))+sides(ctx,t=>claims(t.milestones)+claims(t.storylines),'倒戈・里程碑・有趣背景')+card('本場故事線',claims(ctx.dossier?.storylines||ctx.dossier?.preview?.cues));
}
function threeYellowPlayers(team) {
 return (team.yellow_risk||[]).filter(x=>
  (x.yellow_cards===3 && x.verification_status==='verified' && x.active_accumulation===true) ||
  (/有效累積\s*3\s*張/.test(x.text||'') && x.kind==='fact' && x.sources?.length)
 );
}
function availability(ctx) {
 const cup=ctx.dossier?.competition==='leaguecup';
 return [['transfers','新加盟／離隊／借用'],['injuries','傷患及復出'],['suspensions','停賽報告'],['yellow_risk',cup?'聯賽盃紀律・獨立警告紀錄':'累積3黃・再領黃牌即停賽']].map(([key,title])=>sides(ctx,t=>key==='yellow_risk'?(cup?claims(t.discipline_notes):(threeYellowPlayers(t).length?claims(threeYellowPlayers(t)):blank('未有已核實的累積3黃名單'))):claims(t[key]),title)).join('')
 + ([ctx.home,ctx.away].some(c=>ctx.dossier?.teams?.[c.team.slug]?.international_duty?.length)?sides(ctx,t=>claims(t.international_duty),'國家隊徵召及退出・與傷患／輪休分開'): '');
}

function matchRows(rows, date, upcoming=false) {
 if(!rows?.length)return blank('尚未收錄已核對賽程');
 if(upcoming) rows=rows.map((r,i)=>({...r,comment:[r.comment||r.note,i>0&&validDate(r.date)&&validDate(rows[i-1].date)?'中'+Math.max(0,Math.round((Date.parse(r.date)-Date.parse(rows[i-1].date))/86400000)-1)+'日':''].filter(Boolean).join('；')}));
 return gameLog(rows,date)+rows.filter(r=>r.comment||r.note).map(r=>`<p class="fixture-note">${e(r.date_display||r.date)}：${e(r.comment||r.note)}</p>`).join('')+(upcoming?'<p class="section-meta">休息日數按日期相隔減一計；跨國行程及加時負荷另看輪換報告。</p>':'');
}
function resultsComparison(ctx) {
 return sides(ctx,(t,c)=>stats(c,t.stats),'本季聯賽成績')+sides(ctx,t=>{const rows=[...(t.game_log||[])].filter(r=>r.score&&r.date&&r.date<=ctx.dossier.as_of).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);return matchRows(rows,ctx.date)+claims(t.form);},'最近5場・各項正式賽事')+sides(ctx,t=>matchRows([...(t.game_log||[])].filter(r=>r.score==null&&(r.sort_date||r.date)>=ctx.dossier.as_of).sort((a,b)=>(a.sort_date||a.date).localeCompare(b.sort_date||b.date)).slice(0,5),ctx.date,true),'未來5場')+sides(ctx,t=>claims(t.home_away_record),'主隊主場／客隊作客走勢')+card('最近5次對賽',ctx.dossier?.head_to_head_results?.length?matchRows(ctx.dossier.head_to_head_results.slice(0,5),ctx.date)+claims(ctx.dossier?.head_to_head):claims(ctx.dossier?.head_to_head));
}
function metricTable(rows, title) {
 if(!rows?.length)return card(title,blank('待Football LAB統計核對'));
 return card(title,`<div class="table-wrap"><table class="match-table"><thead><tr><th>指標</th><th>數值（聯賽排名）</th><th>口徑／樣本</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${e(r.label)}</td><td>${field(r.value)}${r.rank!=null?'（'+e(r.rank)+'）':''}</td><td>${e(r.unit||'')} ${e(r.sample||'')} ${e(r.as_of||'')}</td></tr>`).join('')}</tbody></table></div>${rows.map(r=>r.interpretation?`<p>${e(r.label)}：${e(r.interpretation)}</p>`:'').join('')}<div class="source-list">${sources(rows.flatMap(r=>r.sources||[]))}</div>`);
}
function teamAnalytics(ctx) {
 return '<p class="match-description">數值附聯賽排名、樣本及截點；每場、總量與每90分鐘分開呈現。來源未提供排名時留白。</p>'+['basic','attack','build_up','defence','set_pieces','timing','goalkeeping'].map((key,n)=>sides(ctx,t=>metricTable(t.team_metrics?.[key],['基本數據','進攻效率・xG','組織・推進・進攻方向','防守效率・xGA','死球攻守','入失球時段','門將'][n]),['基本','進攻','組織','防守','死球','時段','門將'][n])).join('')+sides(ctx,t=>claims(t.analytics),'已核對統計解讀');
}
function workloadRows(team, selected) {
 const w=team.workload||{}, rows=w.minutes||[];
 // Only complete 90-minute team totals establish zero minutes for omitted non-participants.
 const complete=rows.reduce((n,r)=>n+(Number.isFinite(r.minutes)?r.minutes:0),0)===990 && rows.reduce((n,r)=>n+(Number.isFinite(r.prior_minutes)?r.prior_minutes:0),0)===990;
 return (selected||[]).filter(p=>p?.number!=null).map(p=>{
  const r=rows.find(r=>String(r.number)===String(p.number));
  return {number:String(p.number),name:p.text?.replace(/^#\d+\s*/, '')||r?.name||'',minutes:r?.minutes??(complete?0:null),prior_minutes:r?.prior_minutes??(complete?0:null),started:r?.started,appearance_last:r?.appearance_last,has_card:p.has_card};
 }).sort((a,b)=>(a.minutes??Infinity)-(b.minutes??Infinity)||(a.prior_minutes??Infinity)-(b.prior_minutes??Infinity)||Number(a.number)-Number(b.number));
}
function loadTable(rows,slug) {
 if(!rows.length)return '<p>官方本場名單尚未公布。</p>';
 return `<div class="table-wrap"><table class="match-table"><thead><tr><th>球員</th><th>上仗分鐘 ↑</th><th>前仗分鐘</th><th>兩場合計</th><th>負荷速讀</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.has_card===false?`#${e(r.number)} ${e(r.name)}<small>永久球員卡待補</small>`:`<a href="#/club/${e(slug)}/player/${e(r.number)}">#${e(r.number)} ${e(r.name)}</a>`}</td><td><strong>${r.minutes===0?(r.appearance_last?'0・補時入替':'0・上仗未上陣'):field(r.minutes)}</strong></td><td>${field(r.prior_minutes)}</td><td>${r.minutes!=null&&r.prior_minutes!=null?r.minutes+r.prior_minutes:'未核實'}</td><td>${r.minutes===0?(r.appearance_last?'曾於補時入替；0名義分鐘':'上仗沒有比賽分鐘'):r.minutes===90&&r.prior_minutes===90?'連續兩場踢足':r.minutes===90?'上仗踢足90分鐘':r.minutes!=null?'上仗'+(r.started?'正選':'後備')+'上陣':'分鐘待核對'}</td></tr>`).join('')}</tbody></table></div>`;
}
function workloadContext(t,date) {
 const w=t.workload;if(!w)return '<p>近期逐人分鐘尚未核對。</p>';
 const describe=d=>{const g=t.game_log?.find(g=>g.date===d);return e(d)+(g?'・'+e(g.competition)+'・'+e(g.venue)+'對'+e(g.opponent):'');};
 const rest=validDate(w.match_date)&&validDate(date)?Math.round((Date.parse(date)-Date.parse(w.match_date))/86400000)-1:null;
 return `<p><strong>上仗：${describe(w.match_date)}</strong>${rest!=null?'｜中'+rest+'日':''}</p><p>前仗：${describe(w.baseline_match_date)}</p><p class="section-meta">${e(w.minutes_note||'分鐘不含補時。')} 0分鐘只代表未上陣，不代表已證實體能充足。</p>`;
}
function absentRegulars(t) {
 const a=t.workload_absences;
 if(!a || a.pending)return '<p>本場正式名單尚未公布，暫不能確定缺席常規主力或輪休者；傷情及停賽見04。</p>';
 return `<p class="section-meta">${e(a.criteria)}</p>`+card('已確認休息／輪換',a.confirmed_rest?.length?claims(a.confirmed_rest):'<p>未有可靠來源確認休息安排。</p>')+card('未入選常規正選・原因未公布',a.unexplained?.length?claims(a.unexplained):'<p>未有符合條件的未解釋缺席常規正選。</p>')+'<p class="section-meta">傷患、停賽及其他已確認原因另列04；未公布原因者不標作輪休。</p>';
}
function recentWorkloadRows(t) {
 return (t.workload?.minutes||[]).map(r=>({...r,name:r.name||''})).sort((a,b)=>a.minutes-b.minutes||a.prior_minutes-b.prior_minutes||Number(a.number)-Number(b.number));
}
function rotation(ctx) {
 return '<p class="match-description">按今日名單看近期體力負荷：先看缺席主力，再看正選與後備。兩份名單各按上仗分鐘由少至多排列；不將比賽分鐘直接當作疲勞診斷。</p>'
 +sides(ctx,t=>absentRegulars(t),'未入選常規主力・休息／輪換核對')
 +sides(ctx,t=>workloadContext(t,ctx.date),'最近兩場・賽程與恢復間隔')
 +([ctx.home,ctx.away].every(c=>ctx.dossier?.teams?.[c.team.slug]?.lineup?.starters?.some(p=>p.number!=null))?'':sides(ctx,(t,c)=>t.lineup?.starters?.some(p=>p.number!=null)?'': '<p>正式名單公布前參考：只列最近兩場曾上陣者，並非本場預測名單。</p>'+loadTable(recentWorkloadRows(t),c.team.slug),'賽前負荷參考・名單公布前'))
 +sides(ctx,(t,c)=>loadTable(workloadRows(t,t.lineup?.starters),c.team.slug),'今日正選11人・上仗0分鐘優先')
 +sides(ctx,(t,c)=>loadTable(workloadRows(t,t.lineup?.bench),c.team.slug),'今日後備・上仗0分鐘優先')
 +sides(ctx,(t,c)=>{const selected=[...(t.lineup?.starters||[]),...(t.lineup?.bench||[])];const confirmed=selected.some(p=>p.number!=null);const rows=(confirmed?workloadRows(t,selected):recentWorkloadRows(t)).filter(r=>r.minutes>0&&r.prior_minutes>0).sort((a,b)=>(b.minutes+b.prior_minutes)-(a.minutes+a.prior_minutes));return '<p>'+(confirmed?'只列今日入選、最近兩場均有上陣者。':'正式名單未公布；此處只列最近兩場均上陣者，並非本場入選名單。')+'按兩場合計由高至低；逐人樣本為兩場，不推算更長連續紀錄。</p>'+loadTable(rows,c.team.slug);},'連續上陣與高負荷・最近兩場')
 +sides(ctx,t=>claims(t.lineup?.cues),'本場輪換重點')
 +'<details class="formation-demo"><summary>查看本場陣式與站位</summary>'+sides(ctx,t=>formationGraphic(t.formation),'官方陣式')+'</details>';
}
function playerStats(ctx) { return sides(ctx,t=>metricTable(t.player_metrics,'球員基本／進階統計')+claims(t.scorers)+claims(t.assists),'球員數據・總量及每90分鐘')+sides(ctx,t=>claims(t.goalkeeper_analysis),'門將比較'); }
function scenarioAnalysis(ctx) { return card('開場三個觀察重點',claims(ctx.dossier?.opening_checks))+['leading','trailing','level'].map((key,n)=>card(['領先時可能調整','落後時可能調整','僵持時可能調整'][n],claims(ctx.dossier?.scenarios?.[key]))).join(''); }

function cupTournament(ctx) {
 const c=ctx.dossier?.cup_tournament;
 if(!c)return blank('本場沒有盃賽資料');
 const score=r=>`${e(r.score_a)}–${e(r.score_b)}${r.pk_a!=null?`（十二碼 ${e(r.pk_a)}–${e(r.pk_b)}）`:''}`;
 const leg=g=>`<p><small>${e(g.date)} · 日本 ${e(g.time_jst)}</small><br>${e(g.home)} 對 ${e(g.away)}<br><strong>${g.score==null?'未賽':e(g.score)}</strong><small> · ${e(g.stadium)}</small></p>`;
 const bracket=`<div class="cup-bracket"><section><h4>八強 · 兩回合</h4>${c.quarter_finals.map(q=>`<div class="cup-tie"><h5>${e(q.title)}｜${q.teams.map(e).join('／')}</h5>${q.legs.map(leg).join('')}<small>晉級：待定</small></div>`).join('')}</section><section><h4>四強 · 兩回合</h4>${c.semi_finals.map(q=>`<div class="cup-tie"><h5>${e(q.id==='SF1'?'四強1':'四強2')}</h5><p>${e(q.label)}</p><small>${q.dates.map(e).join('、')}</small></div>`).join('')}</section><section><h4>決賽 · 單場</h4><div class="cup-tie"><h5>${e(c.final.date)}</h5><p>${e(c.final.label)}</p><p>${e(c.final.stadium)}</p><small>開球時間待公布</small></div></section></div>`;
 const routes=sides(ctx,(t,club)=>{const r=c.routes[club.team.slug];return `<p>${e(r.entry)}</p>${r.matches.length?r.matches.map(m=>`<div class="cup-tie"><small>${e(m.date)} · ${e(m.round)}</small><p>${e(m.team_a)} <strong>${score(m)}</strong> ${e(m.team_b)}</p><small>已晉級下一輪</small></div>`).join(''):'<p>種子直接入八強，沒有此前賽果。</p>'}`},'兩隊如何晉級');
 const results=`<details class="cup-results"><summary>首階段全部 ${c.results.length} 場賽果</summary><p>${e(c.result_order_note)}</p><div class="table-wrap"><table class="match-table"><thead><tr><th>日期</th><th>輪次</th><th>隊伍A</th><th>比分</th><th>隊伍B</th></tr></thead><tbody>${c.results.map(r=>`<tr><td>${e(r.date)}</td><td>${e(r.round)}</td><td>${e(r.team_a)}</td><td>${score(r)}</td><td>${e(r.team_b)}</td></tr>`).join('')}</tbody></table></div></details>`;
 return card(c.name,`<p>截至 ${e(c.as_of)}；八強未開賽，總比分及晉級球隊待定。</p>${c.rules.map(r=>`<p>${e(r)}</p>`).join('')}`)+card('淘汰賽完整籤表',bracket)+routes+card('已完成比賽',results);
}
