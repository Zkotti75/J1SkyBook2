const SEASON_START = '2026-08-07';
const state = { manifest: null, slot: 'home', clubs: new Map(), activeSlug: null, activeItem: null };

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const valueOrBlank = value => value === null || value === undefined || value === '' || value === '—' ? '<span class="empty">—</span>' : esc(value);

function ageOn(dateOfBirth, onDate = SEASON_START) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth || '')) return null;
  const dob = new Date(`${dateOfBirth}T00:00:00Z`);
  const ref = new Date(`${onDate}T00:00:00Z`);
  let age = ref.getUTCFullYear() - dob.getUTCFullYear();
  if (ref.getUTCMonth() < dob.getUTCMonth() || (ref.getUTCMonth() === dob.getUTCMonth() && ref.getUTCDate() < dob.getUTCDate())) age--;
  return age;
}

function routeFor(slug, item) {
  if (!item || item.type === 'team_info') return `#/club/${encodeURIComponent(slug)}`;
  const token = item.number === 'HC' || item.position === 'MANAGER' ? 'manager' : `player/${encodeURIComponent(item.number)}`;
  return `#/club/${encodeURIComponent(slug)}/${token}`;
}

function parseRoute() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] !== 'club') return {};
  return { slug: parts[1], kind: parts[2], token: parts[3] };
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${path}`);
  return response.json();
}

async function loadClub(slug) {
  if (state.clubs.has(slug)) return state.clubs.get(slug);
  const data = await fetchJson(`data/clubs/${slug}.json`);
  state.clubs.set(slug, data);
  return data;
}

function applyTheme(team) {
  document.documentElement.style.setProperty('--team', team.colors?.bg || '#0284c7');
  document.documentElement.style.setProperty('--team-text', team.colors?.text || '#fff');
}

function fillSelectors() {
  const teams = state.manifest.teams;
  for (const select of [$('#home-team'), $('#away-team')]) {
    select.innerHTML = teams.map(t => `<option value="${esc(t.slug)}">${esc(t.name_zh)}</option>`).join('');
  }
  $('#home-team').value = teams.some(t => t.slug === 'kashiwa') ? 'kashiwa' : teams[0].slug;
  $('#away-team').value = teams.some(t => t.slug === 'urawa') ? 'urawa' : teams[1]?.slug || teams[0].slug;
  syncFixtureButtons();
}

function manifestTeam(slug) { return state.manifest.teams.find(team => team.slug === slug); }

function syncFixtureButtons() {
  const home = manifestTeam($('#home-team').value);
  const away = manifestTeam($('#away-team').value);
  $('#home-button').textContent = home?.name_zh || '主隊';
  $('#away-button').textContent = away?.name_zh || '客隊';
  $('#home-button').classList.toggle('active', state.slot === 'home');
  $('#away-button').classList.toggle('active', state.slot === 'away');
}

async function activateSlot(slot) {
  state.slot = slot;
  syncFixtureButtons();
  const slug = $(`#${slot}-team`).value;
  location.hash = `#/club/${encodeURIComponent(slug)}`;
}

function statusBadges(item) {
  const raw = [item.registration_status, ...(item.registration_tags || [])].flat().filter(Boolean);
  const badges = [...new Set(raw.filter(v => v !== '本國球員'))];
  return badges.map(v => `<span class="badge">${esc(v)}</span>`).join('');
}

function rosterItems(data) {
  const players = [...(data.players || [])].sort((a,b) => Number(a.number) - Number(b.number));
  return [data.team, data.manager, ...players].filter(Boolean);
}

function renderSidebar(data, activeItem) {
  const all = rosterItems(data);
  const search = $('#player-search').value.trim().toLowerCase();
  const players = all.filter(item => item.type !== 'team_info' && item !== data.manager)
    .filter(item => !search || `${item.number} ${item.name_zh} ${item.name_ja || ''} ${item.name_en || ''}`.toLowerCase().includes(search));

  $('#shirt-grid').innerHTML = players.map(item => `<button class="shirt-button ${activeItem?.id === item.id ? 'active' : ''}" data-id="${esc(item.id)}" title="${esc(item.name_zh || item.name_en)}">${esc(item.number)}</button>`).join('');

  let html = `<button class="roster-item ${activeItem?.type === 'team_info' ? 'active' : ''}" data-id="${esc(data.team.id)}"><span class="roster-number">球會</span><span class="roster-name">${esc(data.team.name_zh)}</span><span class="roster-position">INFO</span></button>`;
  if (data.manager) html += `<button class="roster-item ${activeItem?.id === data.manager.id ? 'active' : ''}" data-id="${esc(data.manager.id)}"><span class="roster-number">HC</span><span class="roster-name">${esc(data.manager.name_zh || data.manager.name_en)}</span><span class="roster-position">領隊</span></button>`;
  for (const position of ['GK','DF','MF','FW']) {
    const group = players.filter(p => p.position === position);
    if (!group.length) continue;
    html += `<div class="roster-heading">${position}</div>`;
    html += group.map(p => `<button class="roster-item ${activeItem?.id === p.id ? 'active' : ''}" data-id="${esc(p.id)}"><span class="roster-number">#${esc(p.number)}</span><span class="roster-name">${esc(p.name_zh || p.name_en)}</span><span class="roster-position">${position}</span></button>`).join('');
  }
  if (!players.length && search) html += '<div class="empty-panel">沒有符合的球員</div>';
  $('#roster-list').innerHTML = html;
}

function careerRows(item) {
  if (Array.isArray(item.career) && item.career.length) return item.career;
  return (item.timeline || []).map(row => ({ season: row.period, team: row.team, competition: row.category, appearances: null, goals: null, status: '', notes: row.milestone }));
}

function renderSources(sources = []) {
  if (!sources.length) return '';
  return `<section class="section"><h3>資料來源</h3><div class="source-list">${sources.map((s,i) => s.url ? `<a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label || s.title || `來源 ${i+1}`)}</a>` : `<span class="source-link">${esc(s.label || s.title || `來源 ${i+1}`)}</span>`).join('')}</div></section>`;
}

function renderSeasonStats(stats = []) {
  if (!stats.length) return '';
  return `<section class="section"><h3>近季數據比較</h3><div class="table-wrap"><table class="stats-table"><thead><tr><th>球季</th><th>賽事</th><th>上陣</th><th>入球</th><th>助攻</th><th>分鐘</th><th>資料截至</th></tr></thead><tbody>${stats.map(row => `<tr><td>${valueOrBlank(row.season)}</td><td>${valueOrBlank(row.competition)}</td><td class="numeric">${valueOrBlank(row.appearances)}</td><td class="numeric">${valueOrBlank(row.goals)}</td><td class="numeric">${valueOrBlank(row.assists)}</td><td class="numeric">${valueOrBlank(row.minutes)}</td><td>${valueOrBlank(row.as_of)}</td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderAnalytics(analytics) {
  if (!analytics || (!analytics.metrics?.length && !analytics.insights?.length)) return '';
  const metrics = analytics.metrics || [];
  const insights = analytics.insights || [];
  return `<section class="section"><h3>進階數據分析</h3>
    <div class="section-meta">${esc(analytics.competition || '賽事未註明')} · 資料截至 ${valueOrBlank(analytics.as_of)}${analytics.minutes != null ? ` · 樣本 ${esc(analytics.minutes)} 分鐘` : ''}</div>
    ${metrics.length ? `<div class="metric-grid">${metrics.map(metric => `<div class="metric-card"><label>${esc(metric.label)}</label><strong>${valueOrBlank(metric.value)}${metric.unit ? ` ${esc(metric.unit)}` : ''}</strong>${metric.per90 != null ? `<span>每90分鐘 ${esc(metric.per90)}</span>` : ''}${metric.percentile != null ? `<span>同位置第 ${esc(metric.percentile)} 百分位</span>` : ''}</div>`).join('')}</div>` : ''}
    ${insights.length ? `<ul class="fact-list analysis-list">${insights.map(insight => `<li>${esc(typeof insight === 'string' ? insight : insight.text)}</li>`).join('')}</ul>` : ''}
    ${renderSources(analytics.sources)}
  </section>`;
}

function renderTrivia(trivia = []) {
  const rows = Array.isArray(trivia) ? trivia : [];
  if (!rows.length) return '';
  const labels = { confirmed: '直接確認', reported: '媒體報道', anecdotal: '軼聞' };
  return `<section class="section"><h3>背景與趣聞</h3><div class="story-grid">${rows.map(row => {
    const item = typeof row === 'string' ? { text: row, reliability: 'anecdotal' } : row;
    const source = item.source?.url ? `<a href="${esc(item.source.url)}" target="_blank" rel="noopener">來源</a>` : '';
    return `<div class="story-card"><p>${esc(item.text)}</p><div class="story-meta"><span>${esc(labels[item.reliability] || '來源待分類')}</span>${source}</div></div>`;
  }).join('')}</div></section>`;
}

function renderInterviews(interviews = []) {
  if (!interviews.length) return '';
  return `<section class="section"><h3>最近一週發言</h3><div class="interview-list">${interviews.map(item => `<article class="interview-card">
    <div class="story-meta"><span>${valueOrBlank(item.published_at)}</span><span>${esc(item.outlet || '')}</span><span>${esc(item.context || '')}</span></div>
    ${item.quote_zh ? `<blockquote>「${esc(item.quote_zh)}」</blockquote>` : ''}
    ${item.quote_ja ? `<details><summary>查看日文原句</summary><p lang="ja">${esc(item.quote_ja)}</p></details>` : ''}
    ${item.paraphrase_zh ? `<p><strong>直播重點：</strong>${esc(item.paraphrase_zh)}</p>` : ''}
    ${item.url ? `<a class="source-link" href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.outlet || '訪問來源')}</a>` : ''}
  </article>`).join('')}</div></section>`;
}

function renderMatchWeek(matchWeek) {
  if (!matchWeek) return '';
  const notes = [...(matchWeek.recent_form || []), ...(matchWeek.matchup_notes || []), ...(matchWeek.milestones || [])];
  if (!notes.length && !matchWeek.selection_status) return '';
  return `<section class="section match-week"><h3>賽前更新</h3><div class="section-meta">${esc(matchWeek.opponent || '對手待定')} · ${valueOrBlank(matchWeek.fixture_date)} · 更新 ${valueOrBlank(matchWeek.as_of)}</div>${matchWeek.selection_status ? `<div class="notice selection-note">${esc(matchWeek.selection_status)}</div>` : ''}${notes.length ? `<ul class="fact-list">${notes.map(note => `<li>${esc(note)}</li>`).join('')}</ul>` : ''}${renderSources(matchWeek.sources)}</section>`;
}

function renderTeam(data) {
  const t = data.team;
  const stadium = t.stadium_info || {};
  const honors = t.performance_history || t.honors || [];
  const current = t.current_season || {};
  const recent = t.recent_seasons || [];
  const history = t.history_timeline || [];
  return `<article class="panel">
    <header class="hero"><div class="hero-main"><div><div class="hero-number">J1 CLUB PROFILE</div><h2>${esc(t.name_zh)}</h2><div class="english">${esc(t.name_ja || '')}${t.name_ja && t.name_en ? ' · ' : ''}${esc(t.name_en || '')}</div><div class="badges"><span class="badge ${t.data_status !== 'verified' ? 'audit-badge' : ''}">${esc(t.data_status === 'verified' ? '已核實' : '資料審核中')}</span></div></div></div>${t.logo_url ? `<img class="team-logo" src="${esc(t.logo_url)}" alt="${esc(t.name_zh)}會徽">` : ''}</header>
    <div class="content">
      ${t.data_status !== 'verified' ? '<div class="notice">此球會資料正在逐項核實。未有來源支持的欄位不會標作已確認。</div>' : ''}
      <div class="vitals">
        <div class="vital"><label>主場城市</label><strong>${valueOrBlank(t.hometown)}</strong></div>
        <div class="vital"><label>城市人口</label><strong>${valueOrBlank(t.hometown_population)}</strong></div>
        <div class="vital"><label>主場球場</label><strong>${valueOrBlank(stadium.name_zh || stadium.name)}</strong></div>
        <div class="vital"><label>場館座位</label><strong>${stadium.capacity ? `${Number(stadium.capacity).toLocaleString('zh-HK')} 人` : '<span class="empty">—</span>'}</strong></div>
        <div class="vital"><label>成立</label><strong>${valueOrBlank(t.established)}</strong></div>
        <div class="vital"><label>名單核實日期</label><strong>${valueOrBlank(t.roster_as_of || t.verified_at)}</strong></div>
      </div>
      ${current.rank ? `<section class="section"><h3>2026/27 現況</h3><div class="vitals">
        <div class="vital"><label>排名</label><strong>第 ${esc(current.rank)} 名</strong></div>
        <div class="vital"><label>戰績</label><strong>${esc(current.wins)}勝 ${esc(current.draws)}和 ${esc(current.losses)}負</strong></div>
        <div class="vital"><label>積分</label><strong>${esc(current.points)}</strong></div>
        <div class="vital"><label>得失球差</label><strong>${current.goal_difference > 0 ? '+' : ''}${esc(current.goal_difference)}</strong></div>
        <div class="vital"><label>監督</label><strong>${valueOrBlank(current.manager)}</strong></div>
        <div class="vital"><label>資料截至</label><strong>${valueOrBlank(current.as_of)}</strong></div>
      </div></section>` : ''}
      ${t.name_history ? `<section class="section"><h3>隊名由來</h3><p>${esc(t.name_history)}</p></section>` : ''}
      ${t.team_history ? `<section class="section"><h3>球會歷史</h3><p>${esc(t.team_history)}</p></section>` : ''}
      ${history.length ? `<section class="section"><h3>歷史里程碑</h3><ul class="fact-list">${history.map(row => `<li><strong>${esc(row.year)}</strong>　${esc(row.event)}</li>`).join('')}</ul></section>` : ''}
      ${honors.length ? `<section class="section"><h3>球會主要榮譽</h3><div class="achievement-grid">${honors.map(h => `<div class="achievement">${esc(h)}</div>`).join('')}</div></section>` : ''}
      ${recent.length ? `<section class="section"><h3>近季聯賽成績</h3><div class="table-wrap"><table><thead><tr><th>球季</th><th>賽事</th><th>成績</th></tr></thead><tbody>${recent.map(row => `<tr><td>${valueOrBlank(row.season)}</td><td>${valueOrBlank(row.competition)}</td><td>${valueOrBlank(row.finish)}</td></tr>`).join('')}</tbody></table></div></section>` : ''}
      ${stadium.interesting_facts?.length ? `<section class="section"><h3>球場資料</h3><ul class="fact-list">${stadium.interesting_facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul></section>` : ''}
      ${renderSources(t.sources)}
    </div>
  </article>`;
}

function renderPerson(data, item) {
  const team = data.team;
  const calculatedAge = item.season_start_age ?? ageOn(item.dob);
  const career = careerRows(item);
  const honors = item.honors || [];
  const milestones = item.milestones || [];
  const traits = item.tactical_traits || [];
  const sources = item.sources || [];
  const isManager = item.position === 'MANAGER' || item.position === 'HC';
  const vitalsHtml = isManager
    ? `<div class="vitals">
        <div class="vital"><label>出生日期</label><strong>${valueOrBlank(item.dob)}</strong></div>
        <div class="vital"><label>開季年齡（2026-08-07）</label><strong>${calculatedAge === null ? '<span class="empty">—</span>' : `${calculatedAge} 歲`}</strong></div>
        <div class="vital"><label>出生地 / 國籍</label><strong>${valueOrBlank(item.birthplace)} / ${valueOrBlank(item.nationality)}</strong></div>
        <div class="vital"><label>就任</label><strong>${valueOrBlank(item.joined)} ${item.tenure_status ? `· ${esc(item.tenure_status)}` : ''}</strong></div>
        <div class="vital"><label>前任球會</label><strong>${valueOrBlank(item.prev_club)}</strong></div>
        <div class="vital"><label>教練牌照</label><strong>${valueOrBlank(item.license)}</strong></div>
      </div>`
    : `<div class="vitals">
        <div class="vital"><label>出生日期</label><strong>${valueOrBlank(item.dob)}</strong></div>
        <div class="vital"><label>開季年齡（2026-08-07）</label><strong>${calculatedAge === null ? '<span class="empty">—</span>' : `${calculatedAge} 歲`}</strong></div>
        <div class="vital"><label>出生地</label><strong>${valueOrBlank(item.birthplace)}</strong></div>
        <div class="vital"><label>身高 / 體重</label><strong>${item.height ? `${esc(item.height)} cm` : '—'} / ${item.weight ? `${esc(item.weight)} kg` : '—'}</strong></div>
        <div class="vital"><label>國籍 / 慣用腳</label><strong>${valueOrBlank(item.nationality)} / ${valueOrBlank(item.foot)}</strong></div>
        <div class="vital"><label>加盟 / 效力</label><strong>${valueOrBlank(item.joined)} ${item.tenure_status ? `· ${esc(item.tenure_status)}` : ''}</strong></div>
        <div class="vital"><label>前屬球會</label><strong>${valueOrBlank(item.prev_club)}</strong></div>
        <div class="vital"><label>代表隊</label><strong>${valueOrBlank(item.national_team_detail)}</strong></div>
      </div>`;
  return `<article class="panel">
    <header class="hero"><div class="hero-main">${item.player_image ? `<img class="player-photo" src="${esc(item.player_image)}" alt="${esc(item.name_zh || item.name_en)}" onerror="this.hidden=true">` : ''}<div><div class="hero-number">${isManager ? 'HEAD COACH' : `#${esc(item.number)} · ${esc(item.position)}`}</div><h2>${esc(item.name_zh || item.name_en)}</h2><div class="english">${esc(item.name_ja || '')}${item.name_ja && item.name_en ? ' · ' : ''}${esc(item.name_en || '')}</div><div class="badges">${statusBadges(item)}${item.verification_status !== 'verified' ? '<span class="badge audit-badge">待逐項核實</span>' : ''}</div></div></div>${team.logo_url ? `<img class="team-logo" src="${esc(team.logo_url)}" alt="${esc(team.name_zh)}會徽">` : ''}</header>
    <div class="content">
      ${item.verification_status !== 'verified' ? '<div class="notice">此卡由舊版資料遷移，現正按官方身份資料及外部生涯來源逐項審核；空白代表未能可靠核實。</div>' : ''}
      ${vitalsHtml}
      ${item.intro ? `<section class="section"><h3>${isManager ? '領隊簡介' : '球員簡介'}</h3><p>${esc(item.intro)}</p></section>` : ''}
      ${renderMatchWeek(item.match_week)}
      ${renderInterviews(item.recent_interviews)}
      ${renderSeasonStats(item.season_stats)}
      ${renderAnalytics(item.analytics)}
      ${honors.length ? `<section class="section"><h3>獎項與主要成就</h3><div class="achievement-grid">${honors.map(h => `<div class="achievement">${esc(h)}</div>`).join('')}</div></section>` : ''}
      ${milestones.length ? `<section class="section"><h3>紀錄與里程碑</h3><ul class="fact-list">${milestones.map(m => `<li>${esc(m)}</li>`).join('')}</ul></section>` : ''}
      ${renderTrivia(item.trivia)}
      ${!item.trivia?.length && item.quirky_trivia ? `<section class="section"><h3>背景與趣聞</h3><p>${esc(item.quirky_trivia)}</p></section>` : ''}
      <section class="section"><h3>${isManager ? '球員／執教履歷（逐季）' : '生涯履歷（逐季）'}</h3>${career.length ? `<div class="table-wrap"><table><thead><tr><th>球季</th><th>球會／學校</th><th>聯賽／組別</th><th>上陣</th><th>入球</th><th>身份</th><th>備註</th></tr></thead><tbody>${career.map(row => `<tr><td>${valueOrBlank(row.season || row.period)}</td><td>${valueOrBlank(row.team || row.club)}</td><td>${valueOrBlank(row.competition || row.league || row.category)}</td><td class="numeric">${valueOrBlank(row.appearances)}</td><td class="numeric">${valueOrBlank(row.goals)}</td><td>${valueOrBlank(row.status)}</td><td>${valueOrBlank(row.notes || row.milestone)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">尚未有可核實的生涯履歷。</p>'}</section>
      ${traits.length ? `<section class="section"><h3>${isManager ? '戰術及執教理念' : '技術及發展資料'}</h3><ul class="fact-list">${traits.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}
      ${renderSources(sources)}
    </div>
  </article>`;
}

function findRouteItem(data, route) {
  if (route.kind === 'manager') return data.manager || data.team;
  if (route.kind === 'player') return (data.players || []).find(p => String(p.number) === String(route.token) || p.id === route.token) || data.team;
  return data.team;
}

async function renderRoute() {
  const route = parseRoute();
  const fallback = state.manifest.teams[0].slug;
  const slug = state.manifest.teams.some(t => t.slug === route.slug) ? route.slug : fallback;
  state.activeSlug = slug;
  $('#detail').innerHTML = $('#loading-template').innerHTML;
  try {
    const data = await loadClub(slug);
    const active = findRouteItem(data, route);
    state.activeItem = active;
    applyTheme(data.team);
    renderSidebar(data, active);
    $('#detail').innerHTML = active.type === 'team_info' ? renderTeam(data) : renderPerson(data, active);
    document.title = `${active.name_zh || data.team.name_zh}｜J1 SkyBook`;
  } catch (error) {
    console.error(error);
    const team = manifestTeam(slug);
    $('#roster-list').innerHTML = '';
    $('#shirt-grid').innerHTML = '';
    $('#detail').innerHTML = `<article class="panel empty-panel"><h2>${esc(team?.name_zh || slug)}</h2><p>資料檔尚未建立或無法載入。</p></article>`;
  }
}

function openItemById(id) {
  const data = state.clubs.get(state.activeSlug);
  const item = rosterItems(data).find(x => x.id === id);
  if (item) location.hash = routeFor(state.activeSlug, item);
}

async function init() {
  state.manifest = await fetchJson('data/teams.json');
  fillSelectors();
  const initial = parseRoute();
  if (!initial.slug) location.replace(`#/club/${encodeURIComponent($('#home-team').value)}`);
  else await renderRoute();

  addEventListener('hashchange', renderRoute);
  $('#home-button').addEventListener('click', () => activateSlot('home'));
  $('#away-button').addEventListener('click', () => activateSlot('away'));
  $('#home-team').addEventListener('change', () => { syncFixtureButtons(); if (state.slot === 'home') activateSlot('home'); });
  $('#away-team').addEventListener('change', () => { syncFixtureButtons(); if (state.slot === 'away') activateSlot('away'); });
  $('#back-to-team').addEventListener('click', () => { if (state.activeSlug) location.hash = `#/club/${state.activeSlug}`; });
  $('#open-team-picker').addEventListener('click', () => $('#home-team').focus());
  $('#player-search').addEventListener('input', () => { const data = state.clubs.get(state.activeSlug); if (data) renderSidebar(data, state.activeItem); });
  $('#roster-list').addEventListener('click', event => { const button = event.target.closest('[data-id]'); if (button) openItemById(button.dataset.id); });
  $('#shirt-grid').addEventListener('click', event => { const button = event.target.closest('[data-id]'); if (button) openItemById(button.dataset.id); });
}

init().catch(error => {
  console.error(error);
  $('#detail').innerHTML = '<article class="panel empty-panel"><h2>資料庫載入失敗</h2><p>請重新整理頁面，或檢查網站部署狀態。</p></article>';
});
