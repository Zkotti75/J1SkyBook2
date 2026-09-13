import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const file = resolve('data/clubs/urawa.json');
const data = JSON.parse(await readFile(file, 'utf8'));
const player = data.players.find(item => String(item.number) === '1');
if (!player) throw new Error('Urawa #1 was not found.');

const official = 'https://www.urawa-reds.co.jp/topteam/detail/?id=540';
const wikipedia = 'https://ja.wikipedia.org/wiki/%E8%A5%BF%E5%B7%9D%E5%91%A8%E4%BD%9C';
const jleagueProfile = 'https://www.jleague.jp/special/player/2021/shusaku_nishikawa.html';

Object.assign(player, {
  id: 'jleague_urawa_1',
  legacy_id: 'jleague_urawa_1',
  official_player_id: null,
  name_zh: '西川周作',
  name_ja: '西川 周作',
  name_en: 'Shusaku Nishikawa',
  position: 'GK',
  dob: '1986-06-18',
  season_start_age: 40,
  birthplace: '大分縣宇佐市',
  height: 183,
  weight: 81,
  foot: '左腳',
  nationality: '日本',
  joined: 2014,
  prev_club: 'サンフレッチェ広島',
  registration_status: '本國球員',
  registration_tags: [],
  tenure_status: '效力浦和第13季',
  national_team_detail: '日本大國腳31場；曾入選2008北京奧運、2011亞洲盃及2014世界盃陣容',
  intro: '踏入40歲仍維持高度穩定性的左腳門將。除了撲救，他的中長距離傳送、快速手拋及倒地後迅速再起身，都是浦和由守轉攻的重要起點。',
  player_image: '',
  verification_status: 'verified',
  verified_at: '2026-09-13',
  season_stats: [
    { season: '2025', competition: 'J1', appearances: 36, goals: 0, as_of: '2025-12-31', source: official },
    { season: '2026', competition: 'J1百年構想聯賽', appearances: 20, goals: 0, as_of: '2026-06-10', source: wikipedia },
    { season: '2026/27', competition: 'J1', appearances: 6, goals: 0, as_of: '2026-09-13', source: official }
  ],
  career: [
    ...['1995','1996','1997','1998'].map(season => ({ season, team: '宇佐市立四日市南小學校', competition: '小學／少年足球', appearances: null, goals: null, status: '育成年代', notes: season === '1995' ? '小學三年級開始踢足球；其後因正選門將缺席練習賽而首次被安排把關。' : '', verification_status: 'verified', sources: [{ label: 'J.League履歷訪問', url: jleagueProfile }] })),
    ...['1999','2000','2001'].map(season => ({ season, team: '宇佐FC Jrユース（宇佐市立駅川中學校）', competition: 'Junior Youth', appearances: null, goals: null, status: '育成年代', notes: '', verification_status: 'verified', sources: [{ label: '日本語Wikipedia', url: wikipedia }] })),
    ...['2002','2003'].map(season => ({ season, team: '大分トリニータU-18（大分東明高等學校）', competition: 'U-18／高中', appearances: null, goals: null, status: '青訓球員', notes: season === '2003' ? '入選日本U-18代表，逐步成為年代別代表主力門將。' : '', verification_status: 'verified', sources: [{ label: '日本語Wikipedia', url: wikipedia }] })),
    { season: '2004', team: '大分トリニータU-18／大分トリニータ', competition: 'U-18／J1', appearances: 0, goals: 0, status: '二種註冊', notes: '高中三年級獲一隊作二種註冊；聯賽曾進入後備名單但沒有上陣。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2005', team: '大分トリニータ', competition: 'J1', appearances: 21, goals: 0, status: '職業球員', notes: '7月2日聯賽首度正選後迅速取得正選席位。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }] },
    { season: '2006', team: '大分トリニータ', competition: 'J1', appearances: 30, goals: 0, status: '職業球員', notes: '', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }] },
    { season: '2007', team: '大分トリニータ', competition: 'J1', appearances: 11, goals: 0, status: '職業球員', notes: '承接前季左膝韌帶重傷，復出後亦受零碎傷患影響。', verification_status: 'verified', sources: [{ label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2008', team: '大分トリニータ', competition: 'J1', appearances: 22, goals: 0, status: '職業球員', notes: '隨隊奪得J.League Cup。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }] },
    { season: '2009', team: '大分トリニータ', competition: 'J1', appearances: 34, goals: 0, status: '職業球員', notes: '生涯首次聯賽全勤；季後完全轉會廣島。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2010', team: 'サンフレッチェ広島', competition: 'J1', appearances: 34, goals: 0, status: '職業球員', notes: '連續第二季聯賽全勤。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }] },
    { season: '2011', team: 'サンフレッチェ広島', competition: 'J1', appearances: 34, goals: 0, status: '職業球員', notes: '', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }] },
    { season: '2012', team: 'サンフレッチェ広島', competition: 'J1', appearances: 34, goals: 0, status: '職業球員', notes: '首奪J1冠軍及首次入選J1最佳十一人。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2013', team: 'サンフレッチェ広島', competition: 'J1', appearances: 33, goals: 0, status: '職業球員', notes: '協助廣島衛冕J1；聯賽只失29球。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2014', team: '浦和レッズ', competition: 'J1', appearances: 34, goals: 0, status: '完全轉會', notes: '加盟首季創下7場連續不失球，並以16場零封刷新當時J1單季門將紀錄。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2015', team: '浦和レッズ', competition: 'J1', appearances: 34, goals: 0, status: '職業球員', notes: '', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }] },
    { season: '2016', team: '浦和レッズ', competition: 'J1', appearances: 34, goals: 0, status: '職業球員', notes: '成為J.League首位連續兩場交出助攻的門將。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2017', team: '浦和レッズ', competition: 'J1', appearances: 34, goals: 0, status: '職業球員', notes: 'AFC Champions League冠軍。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }] },
    { season: '2018', team: '浦和レッズ', competition: 'J1', appearances: 34, goals: 0, status: '職業球員', notes: '達成J1累計400場。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2019', team: '浦和レッズ', competition: 'J1', appearances: 33, goals: 0, status: '職業球員', notes: '成為J1史上第二位連續200場踢足全場的球員。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2020', team: '浦和レッズ', competition: 'J1', appearances: 34, goals: 0, status: '隊長', notes: '', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }] },
    { season: '2021', team: '浦和レッズ', competition: 'J1', appearances: 32, goals: 0, status: '副隊長', notes: '以當時史上最年輕紀錄達成J1累計500場。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2022', team: '浦和レッズ', competition: 'J1', appearances: 32, goals: 0, status: '隊長', notes: '把J1累計零封紀錄推高至170場；AFC Champions League冠軍。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2023', team: '浦和レッズ', competition: 'J1', appearances: 34, goals: 0, status: '職業球員', notes: '聯賽全勤、球隊失球為J1最少；第6次入選最佳十一人。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2024', team: '浦和レッズ', competition: 'J1', appearances: 36, goals: 0, status: '季中接任隊長', notes: '成為J1史上第三位達成累計600場的球員。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2025', team: '浦和レッズ', competition: 'J1', appearances: 36, goals: 0, status: '副隊長', notes: '3月完成J1史上首次累計200場零封；4月升上J1歷來出場榜第二位。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2026', team: '浦和レッズ', competition: 'J1百年構想聯賽', appearances: 20, goals: 0, status: '職業球員', notes: '獲EAST Fair Play個人獎及4月最佳撲救。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }, { label: '日本語Wikipedia', url: wikipedia }] },
    { season: '2026/27', team: '浦和レッズ', competition: 'J1', appearances: 6, goals: 0, status: '職業球員', notes: '資料截至2026年9月13日；J1累計666場。', verification_status: 'verified', sources: [{ label: '浦和官方', url: official }] }
  ],
  honors: [
    'J1冠軍：2012、2013（サンフレッチェ広島）',
    'AFC Champions League冠軍：2017、2022（浦和レッズ）',
    '天皇盃冠軍：2018、2021（浦和レッズ）',
    'J.League Cup冠軍：2008（大分）、2016（浦和）',
    '亞洲盃冠軍：2011（日本代表）',
    'J1最佳十一人：6次（2012、2013、2014、2015、2016、2023）',
    'J1優秀球員獎：8次；Fair Play個人獎：3次'
  ],
  milestones: [
    '截至2026年9月13日，浦和官方列出的J1累計出場為666場；現列J1歷來出場榜第二位。',
    '2025年3月8日完成J1累計第200場零封，為歷史首人。',
    '2014年加盟浦和首季完成7場連續不失球；單季16場零封刷新當時J1門將紀錄。',
    '2016年成為J.League首位連續兩場取得助攻的門將。',
    '2019年成為J1史上第二位連續200場踢足全場的球員。'
  ],
  tactical_traits: [
    '左腳低平球門球及中長距離傳送精準，可直接發動快速反擊。',
    '接球後出球速度快；倒地完成第一下撲救後重新站立的速度仍是其觀察重點。',
    '2022年接受門將教練Joan Miret重新拆解基本動作後，表示每個動作都有解決方法，令比賽時更從容。'
  ],
  quirky_trivia: '小學三年級才開始踢足球；一次練習賽正選門將缺席，教練臨時指派他把關，成為其門將生涯起點。高中加入大分U-18後，因訓練場距離家鄉宇佐甚遠，轉到大分市讀書並開始宿舍生活。',
  sources: [
    { label: '浦和紅鑽官方球員檔案（現況及逐季數據）', url: official, accessed_at: '2026-09-13' },
    { label: 'J.League：西川周作的履歷', url: jleagueProfile, accessed_at: '2026-09-13' },
    { label: '日本語Wikipedia（生涯、獎項及紀錄）', url: wikipedia, accessed_at: '2026-09-13' }
  ]
});

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
console.log('Updated the verified Nishikawa baseline card.');
