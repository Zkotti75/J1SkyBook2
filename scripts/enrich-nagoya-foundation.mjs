import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const file = resolve('data/clubs/nagoya.json');
const data = JSON.parse(await readFile(file, 'utf8'));
const checked = '2026-09-19';

const source = (label, url) => ({ label, url, accessed_at: checked });
const managerSource = source(
  '名古屋官方：Petrović監督就任及完整指導履歷',
  'https://nagoya-grampus.jp/news/pressrelease/2025/1218post-2612.php',
);
const currentTeamSource = source(
  '名古屋官方：2026/27選手、職員及外借名單',
  'https://nagoya-grampus.jp/team/top/player/',
);
const seasonStructureSource = source(
  '名古屋官方：2026/27 Top Team體制',
  'https://nagoya-grampus.jp/news/pressrelease/2026/0630post-2771.php',
);
const stadiumSource = source(
  '名古屋官方：豐田體育場設施概要',
  'https://nagoya-grampus.jp/stadium/toyota-stadium/',
);
const accessSource = source(
  '名古屋官方：豐田體育場交通',
  'https://nagoya-grampus.jp/stadium/toyota-stadium/access.html',
);
const stadiumMapSource = source(
  '名古屋官方：豐田體育場場內地圖',
  'https://nagoya-grampus.jp/stadium/toyota-stadium/map.html',
);
const ticketSource = source(
  '名古屋官方：2026/27豐田體育場座位及參考票價',
  'https://nagoya-grampus.jp/ticket/price/',
);
const youthSource = source(
  '名古屋官方：U-18三名二種登錄球員',
  'https://nagoya-grampus.jp/news/pressrelease/2026/09182-357.php',
);
const yamanakaSource = source(
  '京都官方：山中亮輔期限付き移籍加入',
  'https://www.sanga-fc.jp/news/detail/21199',
);
const kawazuraSource = source(
  '水戶官方：河面旺成期限付き移籍加入',
  'https://www.mito-hollyhock.net/news/p=52815/',
);

data.generated_at = '2026-09-19T21:00:00+09:00';

data.team.stadium_info = {
  ...data.team.stadium_info,
  capacity: 40000,
  capacity_note: '球會官方設施概要標示40,000人；J.League另有入場可能數口徑，兩者不可混作同一數字。',
  venue_type: '足球／欖球專用球場',
  geography: '位於豐田市矢作川河畔，從豐田大橋步行接近球場時可清楚看到大型屋頂結構。',
  nearest_stations: [
    { station: '名鐵豐田線 豐田市站', walking_time: '約17分鐘' },
    { station: '愛知環狀鐵道 新豐田站', walking_time: '約21分鐘' },
  ],
  access_note: '兩站相鄰約2分鐘步程；由站前通直行、橫過豐田大橋即可到達。部分賽事設Park & Train，實施日及停車場須逐場確認。',
  accessibility: '官方設施概要列有225個殘疾人士席位，並支援輪椅使用者。',
  seat_map_url: 'https://nagoya-grampus.jp/ticket/price/',
  stadium_map_url: 'https://nagoya-grampus.jp/stadium/toyota-stadium/map.html',
  ticket_policy: '採用動態票價；官方頁所列價格只屬參考，實際售價須查看各場售票頁。',
  non_member_reference_prices_yen: {
    royal: '7,400–9,400',
    ss_reserved: '5,900–7,900',
    s_reserved: '4,700–6,700',
    a_reserved: '3,900–5,900',
    b_reserved: '3,900–5,900',
    c_reserved_adult: '3,100–5,100',
    level_3_adult: '3,100–5,100',
    level_4_adult: '2,300–4,300',
    home_end_north_adult: '2,500–4,500',
    home_end_south_adult: '2,300–4,300',
    away_reserved_adult: '2,500–4,500',
  },
  commentary_lens: [
    '主場北側球門後是名古屋核心打氣區；南側一樓設作客指定席。',
    '四樓最大傾斜角達38度；高角度鏡頭和現場視野適合觀察三後衛橫向距離與翼衛站位。',
    '可動式看台令北側球門後部分座位更接近草地，是豐田體育場的現場感特色。',
  ],
  sources: [stadiumSource, accessSource, stadiumMapSource, ticketSource],
};

data.team.secondary_stadium = {
  name: 'パロマ瑞穂スタジアム',
  name_zh: 'Paloma瑞穗體育場',
  role: '2026重開後的另一主場；並非每場名古屋主場賽事均在此舉行。',
  matchday_admission_reference: '2026-04-19揭幕戰官方公布入場可能數約28,500人。',
  access: [
    '名城線「瑞穗運動場東站」',
    '櫻通線「瑞穗運動場西站」',
    '名城線／櫻通線「新瑞橋站」',
  ],
  transport_note: '球會建議使用公共交通；周邊停車位有限。',
  sources: [
    source('名古屋官方：Paloma瑞穗體育場交通', 'https://nagoya-grampus.jp/news/game/2026/0414post-2714.php'),
    source('名古屋官方：2026揭幕戰入場可能數', 'https://nagoya-grampus.jp/news/pressrelease/2026/0419419-54.php'),
  ],
};

data.team.transfer_window = {
  scope: '2026正式異動及2026/27一隊登錄狀態；截至2026-09-19。',
  incoming: [
    {
      number: 31,
      position: 'MF',
      name_zh: '高嶺朋樹',
      name_ja: '高嶺 朋樹',
      previous_club: '北海道札幌岡薩多',
      deal_type: '移籍加入；官方已檢索頁面未列明完全轉會或外借，故不作推斷',
      impact: '左腳中場，官方個人頁把轉身、傳球及奪球列為主要武器；他亦表示曾受Petrović影響，可較快理解領隊的中場輪轉要求。',
      sources: [seasonStructureSource, source('名古屋官方：高嶺朋樹2026/27個人頁', 'https://nagoya-grampus.jp/team/top/player/2026-27/31-tomoki-takane.html')],
    },
  ],
  outgoing_and_loans: [
    {
      old_number: 66,
      current_number: 60,
      name_zh: '山中亮輔',
      destination: '京都不死鳥',
      deal_type: '外借',
      period: '2026-06-30至2027-06-30',
      impact: '左腳邊路傳中選項離隊；名古屋舊背號為66，京都背號為60。',
      sources: [currentTeamSource, yamanakaSource],
    },
    {
      old_number: 6,
      name_zh: '河面旺成',
      destination: '水戶蜀葵',
      deal_type: '外借',
      period: '2026-07-12至2027-06-30',
      impact: '左腳中堅／左路防守人腳外借，名古屋仍保留其註冊權。',
      sources: [currentTeamSource, kawazuraSource],
    },
    {
      old_number: null,
      name_zh: '貴田遼河',
      destination: 'AA Argentinos Juniors',
      deal_type: '外借',
      period: '官方現役頁未列期間',
      impact: '年輕前鋒到阿根廷累積比賽及海外發展經驗。',
      sources: [currentTeamSource],
    },
    {
      old_number: null,
      name_zh: '倍井謙',
      destination: 'KV Kortrijk',
      deal_type: '外借',
      period: '官方現役頁未列期間',
      impact: '邊路進攻球員在比利時接受海外聯賽考驗。',
      sources: [currentTeamSource],
    },
    {
      old_number: 44,
      name_zh: '森壯一朗',
      destination: '岡山綠雉',
      deal_type: '外借',
      period: '官方現役頁未列期間',
      impact: '年輕後衛在J1球會爭取出場時間。',
      sources: [currentTeamSource],
    },
    {
      old_number: 20,
      name_zh: '三國Kennedy Egbus',
      destination: '福岡黃蜂',
      deal_type: '外借',
      period: '官方現役頁未列期間',
      impact: '高大中堅外借後，名古屋現役一隊中路防守輪換相應收窄。',
      sources: [currentTeamSource],
    },
    {
      old_number: null,
      name_zh: '加藤玄',
      destination: 'RB大宮松鼠',
      deal_type: '外借',
      period: '官方現役頁未列期間',
      impact: '年輕球員在J2尋求成年隊比賽時間。',
      sources: [currentTeamSource],
    },
    {
      old_number: null,
      name_zh: '行德瑛',
      destination: 'AC長野Parceiro',
      deal_type: '外借',
      period: '官方現役頁未列期間',
      impact: '在J3累積成年職業賽事經驗。',
      sources: [currentTeamSource],
    },
    {
      old_number: 28,
      name_zh: '榊原杏太',
      destination: '金澤薩維根',
      deal_type: '外借',
      period: '官方現役頁未列期間',
      impact: '前線年輕球員以穩定上陣為主要發展目標。',
      sources: [currentTeamSource],
    },
    {
      old_number: 32,
      name_zh: '鈴木陽人',
      destination: 'FC岐阜',
      deal_type: '外借',
      period: '官方現役頁未列期間',
      impact: '中場在J3累積實戰分鐘。',
      sources: [currentTeamSource],
    },
    {
      old_number: 29,
      name_zh: '吉田溫紀',
      destination: 'FC琉球',
      deal_type: '外借',
      period: '官方現役頁未列期間',
      impact: '中場在J3延續職業比賽發展。',
      sources: [currentTeamSource],
    },
    {
      old_number: null,
      name_zh: 'Avelete Yves',
      name_ja: 'アヴェレーテ イーブス',
      destination: '未公布',
      deal_type: '雙方同意解除合約',
      period: '2026/27體制公布前',
      impact: '不再佔用2026/27一隊名額；官方體制公告未公布下一站。',
      sources: [seasonStructureSource],
    },
  ],
  registration_notes: [
    {
      status: '二種登錄',
      effective_from: '2026-09-19',
      players: [
        { name_zh: '足立惺洋', name_ja: '足立 惺洋', position: 'DF', number: null },
        { name_zh: '宮本新', name_ja: '宮本 新', position: 'DF', number: null },
        { name_zh: '瀧上晄史', name_ja: '瀧上 晄史', position: 'DF', number: null },
      ],
      note: '官方公告未提供一隊背號，故不建立虛構背號的player card。',
      sources: [youthSource],
    },
  ],
};

data.team.roster_notes = [
  'Current numbered Top Team 27人，以2026-09-19官方current page為準。',
  '山中亮輔由名古屋外借京都：名古屋舊背號66，京都背號60；河面旺成以名古屋#6外借水戶。',
  '官方current page另列貴田遼河、倍井謙、森壯一朗、三國Kennedy Egbus、加藤玄、行德瑛、榊原杏太、鈴木陽人及吉田溫紀為外借球員。',
  '2026-09-18足立惺洋、宮本新、瀧上晄史三名U-18球員完成二種登錄，9月19日起可出賽；公告未給一隊背號，因此不虛構shirt number。',
];

const currentRecentSeason = (data.team.recent_seasons || []).find(row => row.season === '2026/27');
if (currentRecentSeason) currentRecentSeason.finish = '第17（2勝0和6負；截至2026-09-19）';
data.team.commentary_notes = [
  '首8輪2勝6負、第17；截至第7輪的官方數據為平均控球56.7%、每場545.4次傳球，控球量與賽果之間的反差是直播主線。',
  '稻垣祥截至第7輪錄得80.9公里跑動及26次duels won，兩項均為隊內第一；中山克廣130次sprints第一；永井謙佑34.2km/h最高速第一。',
  '山岸祐也是2026百年構想聯賽J1 WEST神射手／Best XI，新季焦點是能否延續春季效率。',
  '三名9月18日完成二種登錄的U-18後衛增加Academy深度；官方未公布一隊背號，故不建立無背號player card。',
];

const additionalTeamSources = [
  currentTeamSource,
  seasonStructureSource,
  stadiumSource,
  accessSource,
  stadiumMapSource,
  ticketSource,
  youthSource,
  yamanakaSource,
  kawazuraSource,
];
const existingTeamUrls = new Set((data.team.sources || []).map(row => row.url));
data.team.sources.push(...additionalTeamSources.filter(row => !existingTeamUrls.has(row.url)));

data.manager.player_image = 'https://nagoya-grampus.jp/team/top/player/2026-27/images-bustshot/staff-mihailo-petrovic.png';
data.manager.image_source = currentTeamSource;
data.manager.license = null;
data.manager.license_note = '已檢索的名古屋官方就任公告未列教練牌照，因此不保留未獲官方證實的牌照名稱。';
data.manager.timeline = [
  { period: '1993–1994', team: 'SV Pöllau', category: '監督', milestone: '在奧地利展開指導生涯。' },
  { period: '1994–1998', team: 'Sturm Graz Amateure', category: '監督', milestone: '執教Sturm Graz預備隊。' },
  { period: '1998–1999', team: 'NK Primorje', category: '監督', milestone: '轉到斯洛文尼亞執教。' },
  { period: '1999–2000', team: 'NK Domžale', category: '監督', milestone: '斯洛文尼亞球會主帥。' },
  { period: '2000–2001', team: 'NK Primorje', category: '監督', milestone: '第二度執教Primorje。' },
  { period: '2001–2002', team: 'Olimpija Ljubljana', category: '監督', milestone: '執教盧布爾雅那球會。' },
  { period: '2002–2003', team: 'NK Mura', category: '監督', milestone: '繼續在斯洛文尼亞執教。' },
  { period: '2003-09–2006-05', team: 'Sturm Graz', category: '監督', milestone: '執教奧地利甲組球會。' },
  { period: '2006-06–2011', team: '廣島三箭', category: '監督', milestone: '首次來日執教，建立具辨識度的三後衛進攻體系。' },
  { period: '2012–2017-07', team: '浦和紅鑽', category: '監督', milestone: '2016贏得J.League Cup。' },
  { period: '2018–2024', team: '北海道札幌岡薩多', category: '監督', milestone: '長期執教札幌。' },
  { period: '2026–', team: '名古屋鯨魚', category: '監督', milestone: '休息一年後接掌名古屋。' },
];

const managerAssignments = [
  ['1993', 'SV Pöllau', '全年'],
  ['1994', 'SV Pöllau', '任期至年內交接'],
  ['1994', 'Sturm Graz Amateure', '年內上任'],
  ['1995', 'Sturm Graz Amateure', ''],
  ['1996', 'Sturm Graz Amateure', ''],
  ['1997', 'Sturm Graz Amateure', ''],
  ['1998', 'Sturm Graz Amateure', '任期至年內交接'],
  ['1998', 'NK Primorje', '年內上任'],
  ['1999', 'NK Primorje', '任期至年內交接'],
  ['1999', 'NK Domžale', '年內上任'],
  ['2000', 'NK Domžale', '任期至年內交接'],
  ['2000', 'NK Primorje', '年內第二度上任'],
  ['2001', 'NK Primorje', '任期至年內交接'],
  ['2001', 'Olimpija Ljubljana', '年內上任'],
  ['2002', 'Olimpija Ljubljana', '任期至年內交接'],
  ['2002', 'NK Mura', '年內上任'],
  ['2003', 'NK Mura', '任期至年內交接'],
  ['2003', 'Sturm Graz', '9月上任'],
  ['2004', 'Sturm Graz', ''],
  ['2005', 'Sturm Graz', ''],
  ['2006', 'Sturm Graz', '任期至5月'],
  ['2006', '廣島三箭', '6月上任'],
  ...Array.from({ length: 5 }, (_, i) => [String(2007 + i), '廣島三箭', '']),
  ...Array.from({ length: 5 }, (_, i) => [String(2012 + i), '浦和紅鑽', '']),
  ['2017', '浦和紅鑽', '任期至7月'],
  ...Array.from({ length: 7 }, (_, i) => [String(2018 + i), '北海道札幌岡薩多', '']),
  ['2026', '名古屋鯨魚', '百年構想聯賽'],
  ['2026/27', '名古屋鯨魚', 'J1'],
];

data.manager.career = managerAssignments.map(([season, team, notes]) => ({
  season,
  team,
  competition: '教練履歷',
  appearances: null,
  goals: null,
  status: '監督',
  notes,
  verification_status: 'verified',
  sources: [managerSource],
}));
data.manager.sources = [managerSource, currentTeamSource, seasonStructureSource];
data.manager.verified_at = checked;
data.manager.milestones = [
  '官方履歷顯示他1993年在SV Pöllau展開指導生涯，2006年6月首次來日接掌廣島。',
  '其後先後執教浦和、札幌；休息一年後於2026年接掌名古屋。',
  '截至2026-09-19，名古屋在2026/27 J1首8輪錄得2勝0和6負、排名第17。',
];

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
console.log('Updated Nagoya club foundation, transfers, stadium and manager record.');
