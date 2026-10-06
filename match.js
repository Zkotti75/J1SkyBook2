export const MATCH_PAGES = [
  { id: 'comparison', label: '兩軍比較', description: '踢法・陣式・近況・人腳' },
  { id: 'preview', label: '賽前深度分析', description: '日本報道與賽前故事線' },
  { id: 'quotes', label: '賽前聲音', description: '教練與球員・按話題對照' },
  { id: 'players', label: '焦點球員', description: '核心・外援・青訓新星' },
  { id: 'logs', label: '全季賽程與戰績', description: '兩隊逐場記錄' },
  { id: 'standings', label: '聯賽榜', description: '排名與積分形勢' },
  { id: 'history', label: '對賽歷史與故事線', description: '往績・倒戈・里程碑' },
  { id: 'tactics', label: '戰術對位', description: '壓迫・邊路・死球' },
  { id: 'live', label: '即場速覽', description: '正選・後備・評述重點' },
];
const e = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const blank = (text = '待賽前核實') => `<span class="research-pending">${e(text)}</span>`;
const field = v => v === null || v === undefined || v === '' ? blank() : e(v);
export function validDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value; }
export function matchRoute(home, away, date = '', page = 'comparison') { return `#/match/${encodeURIComponent(home)}/${encodeURIComponent(away)}/${validDate(date) ? date : 'undated'}/${MATCH_PAGES.some(p => p.id === page) ? page : 'comparison'}`; }
export function parseMatchRoute(hash) {
  try {
    const [, home, away, date, page] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    return { home, away, date: validDate(date) ? date : '', page: MATCH_PAGES.some(p => p.id === page) ? page : 'comparison' };
  } catch { return { page: 'comparison', date: '' }; }
}
function sources(items = []) {
  return items.filter(s => /^https?:\/\//.test(s.url || '')).map(s => `<a class="source-link" href="${e(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.label || s.outlet || '資料來源')}${s.published_at || s.accessed_at ? ` · ${e(s.published_at || s.accessed_at)}` : ''}</a>`).join('');
}
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
function pair(ctx, left, right, label = '') { return `${label ? `<h3 class="comparison-label">${e(label)}</h3>` : ''}<div class="comparison-pair"><div class="comparison-cell">${left}</div><div class="comparison-cell">${right}</div></div>`; }
function card(title, content, meta = '') { return `<section class="match-section"><h3>${e(title)}</h3>${meta ? `<div class="section-meta">${e(meta)}</div>` : ''}${content}</section>`; }
function stats(club) {
  const s = club.team.current_season;
  if (!s || s.season !== '2026/27') return blank('尚未收錄本季數據');
  return `<div class="snapshot-label">館藏數據 · 截至 ${field(s.as_of)} · ${e(s.competition || s.season)}</div><div class="match-metrics">${[['排名',s.rank],['積分',s.points],['已賽',s.matches],['入球',s.goals_for],['失球',s.goals_against],['得失球差',s.goal_difference]].map(([k,v]) => `<div><small>${k}</small><strong>${field(v)}</strong></div>`).join('')}</div><p class="record-line">${field(s.wins)} 勝　${field(s.draws)} 和　${field(s.losses)} 負</p><div class="source-list">${sources(club.team.sources)}</div>`;
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
function comparison(ctx) {
  const a = ctx.dossier?.teams?.[ctx.home.team.slug] || {}, b = ctx.dossier?.teams?.[ctx.away.team.slug] || {};
  let html = pair(ctx, stats(ctx.home), stats(ctx.away), '球季數據快覽');
  html += pair(ctx, a.style?.length ? claims(a.style) : archivedStyle(ctx.home), b.style?.length ? claims(b.style) : archivedStyle(ctx.away), '常用踢法與近期變化');
  html += pair(ctx, formationGraphic(a.formation), formationGraphic(b.formation), '陣式圖');
  if (!a.formation && !b.formation) html += '<details class="formation-demo"><summary>查看陣式圖版面示意</summary><div class="comparison-pair">' + `<div class="comparison-cell">${formationGraphic({shape:'4-2-3-1'}, true)}</div><div class="comparison-cell">${formationGraphic({shape:'3-4-2-1'}, true)}</div></div></details>`;
  for (const [key, label] of [['form','近期戰績與連勝／不敗走勢'],['scorers','本季入球領先球員'],['assists','本季助攻領先球員'],['transfers','近期轉會'],['suspensions','停賽'],['injuries','傷患與出場狀況'],['yellow_risk','黃牌累積・停賽邊緣']]) html += pair(ctx, claims(a[key]), claims(b[key]), label);
  return html;
}
function preview(ctx) {
  const p = ctx.dossier?.preview;
  if (!p?.sections?.length) return card('賽前深度分析', '<p>尚未有這場比賽的深度研究。選定比賽日期後，這裏會收錄日本媒體報道、操練觀察、採訪及戰術分析。</p><div class="preview-outline"><span>01　比賽背景與兩軍形勢</span><span>02　上仗留下的問題</span><span>03　操練與用人線索</span><span>04　關鍵對位與比賽走向</span><span>05　日本記者觀點</span></div>');
  return `${p.cues?.length ? card('評述重點',claims(p.cues)) : ''}<div class="preview-article">${p.sections.map(s => card(s.title,claims(s.paragraphs))).join('')}</div>`;
}
export function inInterviewWindow(quote, start, end) { return validDate(quote?.published_at) && validDate(start) && validDate(end) && quote.published_at > start && quote.published_at <= end; }
function quoteCell(q) {
  if (!q) return blank('未找到同題發言');
  return `<div class="quote-speaker">${e(q.speaker)} <small>${e(q.role || '')}</small></div>${q.quote_ja && q.quote_zh ? `<blockquote>「${e(q.quote_zh)}」</blockquote><details><summary>日文原句</summary><p lang="ja">${e(q.quote_ja)}</p></details>` : `<p>${e(q.paraphrase_zh || '原文未核實')}</p>`}<div class="claim-meta">${e(q.published_at)} · ${e(q.outlet || '')}${q.paraphrase_zh && !q.quote_ja ? ' · 訪問摘要' : ''}</div><div class="source-list">${sources(q.url ? [{url:q.url,label:q.outlet}] : [])}</div>`;
}
function quotes(ctx) {
  const d = ctx.dossier, topics = d?.quotes || [];
  const content = topics.map(row => {
    const home = inInterviewWindow(row.home, d.teams?.[ctx.home.team.slug]?.previous_match_date, ctx.date) ? row.home : null;
    const away = inInterviewWindow(row.away, d.teams?.[ctx.away.team.slug]?.previous_match_date, ctx.date) ? row.away : null;
    return home || away ? pair(ctx, quoteCell(home), quoteCell(away), row.topic) : '';
  }).join('');
  return card('同一話題・兩邊聲音', '<p class="match-description">只收錄各隊上仗之後至本場的訪問；按話題配對，保留出處與日期。</p>') + (content || ['本場目標','對手與戰術','球員狀態與用人'].map(topic => pair(ctx,blank('尚未收錄本場訪問'),blank('尚未收錄本場訪問'),topic)).join(''));
}
function focusPlayer(club, entry) {
  const p = club.players?.find(p => p.id === entry.player_id || String(p.number) === String(entry.number));
  if (!p) return blank('球員資料待核對');
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
  return `<div class="table-wrap"><table class="match-table"><thead><tr><th>日期</th><th>賽事</th><th>主／客</th><th>對手</th><th>賽果</th></tr></thead><tbody>${[...rows].sort((a,b)=>a.date.localeCompare(b.date)).map(r=>`<tr class="${r.date === date ? 'selected-fixture' : ''}"><td>${e(r.date)}</td><td>${e(r.competition)}</td><td>${e(r.venue)}</td><td>${e(r.opponent)}</td><td>${field(r.score)}${r.source ? `<a href="${e(r.source)}" target="_blank" rel="noopener noreferrer" aria-label="比賽來源"> ↗</a>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
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
function live(ctx) {
  const info = ctx.dossier?.match_info || {};
  return card('比賽基本資料', `<div class="match-metrics">${[['開賽時間',info.kickoff_hkt],['場地',info.stadium],['球證',info.referee],['正選公布',info.lineups_as_of]].map(([label,v])=>`<div><small>${label}</small><strong>${field(v)}</strong></div>`).join('')}</div><div class="source-list">${sources(info.sources)}</div>`) + pair(ctx,...[ctx.home,ctx.away].map(c=>{
    const side=ctx.dossier?.teams?.[c.team.slug]?.lineup;
    return card('官方正選',claims(side?.starters)) + card('後備',claims(side?.bench)) + card('即場評述重點',claims(side?.cues));
  }), '官方陣容與評述筆記');
}
export function renderMatchPage(input) {
  const ctx = { ...input, dossier: input.dossier?.home === input.home.team.slug && input.dossier?.away === input.away.team.slug && input.dossier?.date === input.date ? input.dossier : null };
  const page = MATCH_PAGES.find(p=>p.id===ctx.page) || MATCH_PAGES[0];
  const content = {comparison,preview,quotes,players,logs:c=>pair(c,...[c.home,c.away].map(club=>gameLog(c.dossier?.teams?.[club.team.slug]?.game_log,c.date))),standings,history,tactics,live}[page.id](ctx);
  return `<article class="panel match-panel"><header class="match-hero"><div><div class="eyebrow">MATCH CENTRE / 2026–27</div><h2>${e(ctx.home.team.name_zh)} <span>對</span> ${e(ctx.away.team.name_zh)}</h2><p>${e(page.label)} · ${e(page.description)}</p></div><label class="match-date-label">比賽日期<input id="match-date" type="date" value="${e(ctx.date)}"></label></header><div class="match-content"><div class="match-status ${ctx.dossier ? 'ready' : ''}"><span>${ctx.dossier ? '本場研究' : '介面初稿・本場研究待補'}</span><p>${ctx.dossier ? `更新至 ${e(ctx.dossier.as_of || '未註明')}。各項來源與截點請見內文。` : '可先試用頁面與切換功能。球季數據為既有館藏截點；本場訪問、傷停、預測及即時排名尚未核實。'}</p></div><div class="comparison-headings">${clubHeading(ctx.home,'home')}${clubHeading(ctx.away,'away')}</div>${content}</div></article>`;
}
