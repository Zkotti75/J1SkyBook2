import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../data/clubs/urawa.json', import.meta.url);
const data = JSON.parse(await readFile(file, 'utf8'));
const verifiedAt = '2026-09-14';

const source = (label, url) => ({ label, url });
const row = (season, team, competition, appearances, goals, status = '', notes = '', sources = []) => ({
  season,
  team,
  competition,
  appearances,
  goals,
  status,
  notes,
  verification_status: 'verified',
  sources
});
const annualRows = (start, end, team, competition, status, sources, notesByYear = {}) =>
  Array.from({ length: end - start + 1 }, (_, index) => {
    const season = String(start + index);
    return row(season, team, competition, null, null, status, notesByYear[season] || '', sources);
  });

function replacePlayer(number, replacement) {
  const index = data.players.findIndex(player => String(player.number) === String(number));
  if (index < 0) throw new Error(`Urawa player #${number} not found`);
  data.players[index] = { ...data.players[index], ...replacement };
}

const savioOfficial = source('浦和紅鑽官方球員檔案', 'https://www.urawa-reds.co.jp/topteam/detail/?id=546');
const savioJLeague = source('J.League官方球員檔案', 'https://www.jleague.jp/player/1627458/');
const savioWiki = source('日本語Wikipedia（育成、生涯及逐季紀錄）', 'https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%86%E3%82%A6%E3%82%B9%E3%83%BB%E3%82%B4%E3%83%B3%E3%82%B5%E3%82%A6%E3%83%B4%E3%82%A7%E3%82%B9%E3%83%BB%E3%82%B5%E3%83%B4%E3%82%A3%E3%82%AA');
const savioInterview = source('REDS Denki訪問（在日生活及釣魚故事）', 'https://magazine.reds-denki.com/101.html');
const savioFootballLab = source('Football LAB（2026/27進階數據）', 'https://www.football-lab.jp/uraw');

replacePlayer('10', {
  name_zh: '馬菲奧斯·沙維奧',
  name_ja: 'マテウス サヴィオ',
  name_en: 'Matheus Savio',
  position: 'MF',
  dob: '1997-04-15',
  age: 29,
  season_start_age: 29,
  birthplace: '巴西聖保羅州',
  height: 175,
  weight: 74,
  foot: '右腳',
  nationality: '巴西',
  joined: 2025,
  prev_club: '柏レイソル',
  registration_status: '外籍球員',
  registration_tags: [],
  tenure_status: '效力浦和第2季；2026/27改穿10號',
  national_team_detail: '巴西U-20代表7場1球（2016–2018）；未有成年巴西代表上陣紀錄',
  intro: '能任進攻中場、兩翼及影子前鋒的創造型攻擊手。擅長斜線穿透傳球、狹窄位置控球和禁區外起腳，同時願意全速回追；浦和連續兩個賽期均由他錄得隊內最多助攻。',
  timeline: [
    { period: '2013–2016', team: 'Desportivo Brasil／CR Flamengo青訓', category: '巴西青年足球', milestone: '由Desportivo Brasil轉入Flamengo青訓；18歲完成巴西頂級聯賽首戰。' },
    { period: '2015–2019', team: 'CR Flamengo及外借', category: 'Série A／Primeira Liga', milestone: '曾外借Estoril及CSA；2017贏得Campeonato Carioca。' },
    { period: '2019–2024', team: '柏レイソル', category: 'J2／J1', milestone: '外借半年後被買斷；由22號、11號到10號，2024入選J1最佳十一人。' },
    { period: '2025–', team: '浦和紅鑽', category: 'J1', milestone: '2025加盟及擔任副隊長；2026/27改穿10號。' }
  ],
  honors: [
    '2017 Campeonato Carioca冠軍（CR Flamengo）',
    '2019 J2冠軍（柏レイソル）',
    '2024 J1最佳十一人',
    '2022、2023 J1優秀球員獎',
    '2022年5月 J1月間最佳入球'
  ],
  milestones: [
    '2015年3月25日完成職業首戰；同年10月14日、18歲完成Campeonato Brasileiro Série A首戰。',
    '2019年夏季外借柏太陽王，半季J2上陣19場入7球，隨隊奪冠後正式加盟。',
    '2022 J1錄得32場6球4助攻；對清水的入球獲選五月最佳入球。',
    '2024 J1全38場上陣，9球7助攻，協助柏太陽王護級並首次入選最佳十一人。',
    '2025 J1為浦和上陣37場入4球；另於世界冠軍球會盃三場全數上陣。',
    '2026百年構想聯賽19場入2球，助攻數再次為浦和隊內最多。',
    '2026/27首五輪上陣5場入2球；數據截至2026年9月11日。'
  ],
  tactical_traits: [
    '主要以進攻中場或左翼起步，也能踢右翼及影子前鋒；右腳處理定位球和禁區外射門。',
    '浦和官方以「斜切球場的穿透傳球」形容他的招牌技術，並特別指出他失球後會全力回防。',
    '2026/27首五場錄得10次機會創造、5次中目標射門；兩個入球來自1.782預期入球。'
  ],
  quirky_trivia: '來日後愛上船釣；曾與Diego及前柏太陽王隊友Douglas輪流搏鬥約40分鐘，釣起約35公斤吞拿魚。他說一至兩小時毫無魚訊的等待也是精神訓練，能讓自己冷靜和享受同伴交流。',
  official_player_id: '1627458',
  player_image: 'https://www.urawa-reds.co.jp/wp-content/uploads/player_photo/1/546.png',
  season_stats: [
    { season: '2025', competition: 'J1（浦和）', appearances: 37, goals: 4, assists: null, minutes: null, as_of: '2025-12-31', source: savioOfficial.url },
    { season: '2026', competition: 'J1百年構想聯賽（浦和）', appearances: 19, goals: 2, assists: null, minutes: null, as_of: '2026-06-12', source: savioOfficial.url },
    { season: '2026/27', competition: 'J1（浦和）', appearances: 5, goals: 2, assists: 0, minutes: 299, as_of: '2026-09-11', source: savioJLeague.url }
  ],
  career: [
    ...annualRows(2013, 2014, 'Desportivo Brasil', '巴西青年足球', '育成年代', [savioWiki]),
    ...annualRows(2014, 2016, 'CR Flamengo', '巴西青年足球', '育成年代', [savioWiki], { '2015': '同年開始為一隊上陣。' }),
    row('2015', 'CR Flamengo', 'Campeonato Brasileiro Série A', 1, 0, '升上一隊', '3月完成職業首戰；10月完成Série A首戰。', [savioWiki]),
    row('2016', 'CR Flamengo', 'Campeonato Brasileiro Série A', 0, 0, '', '', [savioWiki]),
    row('2017', 'CR Flamengo', 'Campeonato Brasileiro Série A', 7, 1, '', 'Campeonato Carioca冠軍。', [savioWiki]),
    row('2017/18', 'GD Estoril Praia', 'Primeira Liga', 6, 1, '外借', '', [savioWiki]),
    row('2018', 'CR Flamengo', 'Campeonato Brasileiro Série A', 5, 1, '外借回歸', '', [savioWiki]),
    row('2019', 'CSA', 'Campeonato Brasileiro Série A', 8, 1, '外借', '由聯賽開幕起連續上陣8場。', [savioWiki]),
    row('2019', '柏レイソル', 'J2', 19, 7, '外借', '7月加盟；J2冠軍。', [savioOfficial, savioWiki]),
    row('2020', '柏レイソル', 'J1', 6, 0, '完全轉會', '', [savioOfficial, savioWiki]),
    row('2021', '柏レイソル', 'J1', 20, 2, '', '', [savioOfficial, savioWiki]),
    row('2022', '柏レイソル', 'J1', 32, 6, '', '另有4次助攻；J1優秀球員獎及五月最佳入球。', [savioOfficial, savioWiki]),
    row('2023', '柏レイソル', 'J1', 31, 7, '', 'J1優秀球員獎。', [savioOfficial, savioWiki]),
    row('2024', '柏レイソル', 'J1', 38, 9, '', '另有7次助攻；J1最佳十一人。', [savioOfficial, savioWiki]),
    row('2025', '浦和紅鑽', 'J1', 37, 4, '完全轉會／副隊長', '世界冠軍球會盃3場0球。', [savioOfficial, savioWiki]),
    row('2026', '浦和紅鑽', 'J1百年構想聯賽', 19, 2, '', '隊內助攻最多。', [savioOfficial, savioWiki]),
    row('2026/27', '浦和紅鑽', 'J1', 5, 2, '改穿10號', '0助攻、299分鐘；數據截至2026-09-11。', [savioOfficial, savioJLeague])
  ],
  sources: [savioOfficial, savioJLeague, savioWiki, savioInterview, savioFootballLab],
  verification_status: 'verified',
  verified_at: verifiedAt
});

const gustafsonOfficial = source('浦和紅鑽官方球員檔案', 'https://www.urawa-reds.co.jp/topteam/detail/?id=547');
const gustafsonJLeague = source('J.League官方球員檔案', 'https://www.jleague.jp/player/1645913/');
const gustafsonWiki = source('日本語Wikipedia（育成、生涯及逐季紀錄）', 'https://ja.wikipedia.org/wiki/%E3%82%B5%E3%83%9F%E3%83%A5%E3%82%A8%E3%83%AB%E3%83%BB%E3%82%B0%E3%82%B9%E3%82%BF%E3%83%95%E3%82%BD%E3%83%B3');
const gustafsonInterview = source('Sportsnavi專訪（家庭及傷患背景）', 'https://sports.yahoo.co.jp/column/detail/2024030900019-spnaviow');
const gustafsonLife = source('REDS Denki訪問（成長及在日生活）', 'https://magazine.reds-denki.com/106.html');

replacePlayer('11', {
  name_zh: '古斯達臣',
  name_ja: 'サミュエル グスタフソン',
  name_en: 'Samuel Gustafson',
  position: 'MF',
  dob: '1995-01-11',
  age: 31,
  season_start_age: 31,
  birthplace: '瑞典西約塔蘭省默恩達爾',
  height: 187,
  weight: 79,
  foot: '右腳',
  nationality: '瑞典',
  joined: 2024,
  prev_club: 'BK Häcken',
  registration_status: '外籍球員',
  registration_tags: [],
  tenure_status: '效力浦和第3季',
  national_team_detail: '瑞典代表13場0球（2022–2024）；瑞典U-21代表7場2球',
  intro: '身形高大的控制型中場，能以選位、護球和不同距離的傳球調節節奏。擅長在後場接應並越過第一道壓迫；2026年初受傷後五月復出，但尚未在2026/27 J1上陣。',
  timeline: [
    { period: '至2013', team: 'Fässbergs IF', category: '瑞典青年足球', milestone: '與雙胞胎弟弟Simon一同成長；青訓起始年未見可靠紀錄。' },
    { period: '2013–2016', team: 'BK Häcken', category: 'Allsvenskan', milestone: '職業首戰即入球；2015成為主力並贏得瑞典盃。' },
    { period: '2016–2021', team: 'Torino／Perugia／Hellas Verona／Cremonese', category: 'Serie A／Serie B', milestone: '在意大利五季，先後效力四會。' },
    { period: '2021–2023', team: 'BK Häcken', category: 'Allsvenskan', milestone: '回歸後贏得球會史上首個瑞典頂級聯賽冠軍及另一座瑞典盃。' },
    { period: '2024–', team: '浦和紅鑽', category: 'J1', milestone: '首兩季J1合共60場5球；2026年受季前傷患影響。' }
  ],
  honors: [
    '2015/16、2022/23 Svenska Cupen冠軍（BK Häcken）',
    '2022 Allsvenskan冠軍（BK Häcken；球會史上首個瑞典頂級聯賽冠軍）'
  ],
  milestones: [
    '2013年6月23日代表BK Häcken完成職業首戰，首戰即取得入球。',
    '2015 Allsvenskan上陣27場入5球，確立主力位置。',
    '2016年轉投Torino，其後在Serie A及Serie B合共上陣113場入2球。',
    '2022回歸BK Häcken後上陣28場入1球，協助球會首次贏得Allsvenskan。',
    '2022年11月17日對墨西哥正選踢足，完成瑞典成年代表首戰；累計13場。',
    '2024年2月23日完成J1首戰；3月17日對湘南取得J1首球。',
    '2024、2025兩季J1合共60場5球；2026百年構想聯賽因傷只上陣6場。',
    '2026/27截至9月11日尚未在J1上陣。'
  ],
  tactical_traits: [
    '主要擔任防守中場或中路節拍器，以全場視野、接球前掃描及傳球時機控制比賽。',
    '187厘米身高配合護球能力，能背向壓迫保住球權，再以縱向或斜線傳球推進。',
    '浦和官方強調其高職業態度和對不同踢法的適應力；本季狀態仍受一月集訓受傷影響。'
  ],
  quirky_trivia: '出身足球家庭：父親Patrik曾是職業球員，雙胞胎弟弟Simon同樣成為瑞典國腳，三歲小弟Elias亦踢過職業足球。三兄弟童年在家中一起踢球，競爭和討論足球幾乎是日常生活的一部分。',
  official_player_id: '1645913',
  player_image: 'https://www.urawa-reds.co.jp/wp-content/uploads/player_photo/1/547.png',
  season_stats: [
    { season: '2025', competition: 'J1（浦和）', appearances: 32, goals: 3, assists: null, minutes: null, as_of: '2025-12-31', source: gustafsonOfficial.url },
    { season: '2026', competition: 'J1百年構想聯賽（浦和）', appearances: 6, goals: 0, assists: null, minutes: null, as_of: '2026-06-12', source: gustafsonOfficial.url },
    { season: '2026/27', competition: 'J1（浦和）', appearances: 0, goals: 0, assists: 0, minutes: 0, as_of: '2026-09-11', source: gustafsonJLeague.url }
  ],
  career: [
    row(null, 'Fässbergs IF', '瑞典青年足球', null, null, '育成年代', '可靠來源只確認效力至2013年，起始年份未有記載。', [gustafsonWiki, gustafsonInterview]),
    row('2013', 'BK Häcken', 'Allsvenskan', 2, 0, '升上一隊', '職業首戰另在盃賽入球。', [gustafsonWiki]),
    row('2014', 'BK Häcken', 'Allsvenskan', 21, 3, '', '', [gustafsonWiki]),
    row('2015', 'BK Häcken', 'Allsvenskan', 27, 5, '', 'Svenska Cupen冠軍球季。', [gustafsonWiki]),
    row('2016', 'BK Häcken', 'Allsvenskan', 17, 3, '', '8月轉投Torino。', [gustafsonWiki]),
    row('2016/17', 'Torino FC', 'Serie A', 5, 0, '完全轉會', '', [gustafsonWiki]),
    row('2017/18', 'Torino FC', 'Serie A', 4, 0, '', '', [gustafsonWiki]),
    row('2017/18', 'AC Perugia Calcio', 'Serie B', 21, 1, '外借', '', [gustafsonWiki]),
    row('2018/19', 'Hellas Verona FC', 'Serie B', 31, 1, '外借', '', [gustafsonWiki]),
    row('2019/20', 'US Cremonese', 'Serie B', 19, 0, '完全轉會', '', [gustafsonWiki]),
    row('2020/21', 'US Cremonese', 'Serie B', 33, 0, '', '', [gustafsonWiki]),
    row('2021', 'BK Häcken', 'Allsvenskan', 4, 0, '完全轉會', '7月回歸。', [gustafsonWiki]),
    row('2022', 'BK Häcken', 'Allsvenskan', 28, 1, '', 'Allsvenskan冠軍。', [gustafsonWiki]),
    row('2023', 'BK Häcken', 'Allsvenskan', 29, 1, '', 'Svenska Cupen冠軍。', [gustafsonWiki]),
    row('2024', '浦和紅鑽', 'J1', 28, 2, '完全轉會', '', [gustafsonOfficial, gustafsonWiki]),
    row('2025', '浦和紅鑽', 'J1', 32, 3, '', '', [gustafsonOfficial, gustafsonWiki]),
    row('2026', '浦和紅鑽', 'J1百年構想聯賽', 6, 0, '', '一月集訓受傷，五月才復出。', [gustafsonOfficial, gustafsonWiki]),
    row('2026/27', '浦和紅鑽', 'J1', 0, 0, '', '截至2026-09-11尚未上陣。', [gustafsonOfficial, gustafsonJLeague])
  ],
  sources: [gustafsonOfficial, gustafsonJLeague, gustafsonWiki, gustafsonInterview, gustafsonLife],
  verification_status: 'verified',
  verified_at: verifiedAt
});

const sekoOfficial = source('浦和紅鑽官方球員檔案', 'https://www.urawa-reds.co.jp/topteam/detail/?id=599');
const sekoSigning = source('浦和紅鑽官方加盟公告', 'https://www.urawa-reds.co.jp/topteamtopics/245034/');
const sekoJLeague = source('J.League官方球員檔案', 'https://www.jleague.jp/player/1627548/');
const sekoWiki = source('日本語Wikipedia（育成、生涯及逐季紀錄）', 'https://ja.wikipedia.org/wiki/%E7%80%AC%E5%8F%A4%E6%A8%B9');
const sekoMeiji = source('明治大學：J.League內定記者會', 'https://meijinow.jp/activity/club/47476');
const sekoInterview = source('川崎前鋒專訪（少年及大學育成背景）', 'https://www.frontale.co.jp/f_spot/pickup/2023/04.html');

replacePlayer('12', {
  name_zh: '瀨古樹',
  name_ja: '瀬古 樹',
  name_en: 'Tatsuki Seko',
  position: 'MF',
  dob: '1997-12-22',
  age: 28,
  season_start_age: 28,
  birthplace: '東京都足立區',
  height: 175,
  weight: 71,
  foot: '右腳',
  nationality: '日本',
  joined: 2026,
  prev_club: 'Stoke City',
  registration_status: '新加盟（2026年8月完全轉會）',
  registration_tags: ['2019特別指定（歷史身份）'],
  tenure_status: '效力浦和第1季',
  national_team_detail: '2015日本U-18代表候補；未有成年日本代表上陣紀錄',
  intro: '跑動量大、技術穩定的中場連接者，能在壓迫下接應、轉移並支援攻守。兩季英冠共68次聯賽上陣，增強了身體對抗和搶第二點的能力；2026年8月回國加盟浦和。',
  timeline: [
    { period: '2008–2015', team: '三菱養和SC巣鴨', category: '少年、Junior Youth及Youth', milestone: '在街頭名門體系由進攻位置成長；高三入選日本U-18代表候補。' },
    { period: '2016–2019', team: '明治大学', category: '大學足球', milestone: '四年級才固定成為主力；同年贏得大學三冠及聯賽最佳十一人。' },
    { period: '2019–2021', team: '横浜FC', category: 'J2／J1', milestone: '大四成為特別指定球員；職業首季J1開幕戰入球。' },
    { period: '2022–2024', team: '川崎フロンターレ', category: 'J1', milestone: '2023成為主力並贏得天皇盃；2024出任副隊長。' },
    { period: '2024–2026', team: 'Stoke City', category: 'EFL Championship', milestone: '兩季英冠68場；第二季46輪上陣43場。' },
    { period: '2026–', team: '浦和紅鑽', category: 'J1', milestone: '8月完全轉會回日本。' }
  ],
  honors: [
    '2018、2019 全日本大學足球總理大臣盃冠軍（明治大学）',
    '2019 關東大學足球聯賽冠軍（明治大学）',
    '2019 全日本大學足球選手權冠軍（明治大学）',
    '2019 東京都足球錦標賽冠軍（明治大学）',
    '2019 關東大學足球聯賽最佳十一人',
    '2023 天皇盃冠軍（川崎フロンターレ）',
    '2024 日本超級盃冠軍（川崎フロンターレ）'
  ],
  milestones: [
    '高三入選日本U-18代表候補，但未能直接成為職業球員；獲明治大學招攬後選擇大學路線。',
    '明治大學前三年未能固定正選，四年級成為主力並協助球隊完成總理大臣盃、關東大學聯賽及全日本大學選手權三冠。',
    '2019獲認定為橫濱FC的JFA・J.League特別指定球員，正式賽未有上陣。',
    '2020年J1開幕戰對神戶正選兼取得J.League首球，是橫濱FC史上第二位大學新人在聯賽開幕戰入球。',
    '2024/25英冠25場，2025/26增至43場；兩季聯賽68場均沒有入球。',
    '2026/27 J1截至9月11日上陣4場、210分鐘。'
  ],
  tactical_traits: [
    '可擔任防守中場及中前衛，以大量移動提供傳球角度，串連後場與前場。',
    '少年年代曾踢邊中場、進攻中場和前鋒；三菱養和奠定盤帶及狹窄位置處理球的技術。',
    '英格蘭兩季提升身體接觸、第二點爭奪和高強度連續比賽適應力；浦和首四場錄得6次對抗勝出。'
  ],
  quirky_trivia: '小四曾獲橫濱水手Primary邀請，但由埼玉川口往橫濱單程約一小時，周末更要清晨四、五時出門，身體數次不適；小五轉到距家約20分鐘的三菱養和SC巢鴨。本人曾坦言希望高中畢業便成為職業球員，未能如願後在明治大學用四年建立自信。',
  official_player_id: '1627548',
  player_image: 'https://www.urawa-reds.co.jp/wp-content/uploads/player_photo/1/599.png',
  season_stats: [
    { season: '2024/25', competition: 'EFL Championship（Stoke City）', appearances: 25, goals: 0, assists: null, minutes: null, as_of: '2025-05-31', source: sekoWiki.url },
    { season: '2025/26', competition: 'EFL Championship（Stoke City）', appearances: 43, goals: 0, assists: null, minutes: null, as_of: '2026-05-31', source: sekoWiki.url },
    { season: '2026/27', competition: 'J1（浦和）', appearances: 4, goals: 0, assists: 0, minutes: 210, as_of: '2026-09-11', source: sekoJLeague.url }
  ],
  career: [
    ...annualRows(2008, 2009, '三菱養和SC巣鴨ジュニア', '少年足球', '育成年代', [sekoWiki, sekoInterview], { '2008': '小五加入；此前曾往橫濱水手Primary練習。' }),
    ...annualRows(2010, 2012, '三菱養和SC巣鴨ジュニアユース', 'Junior Youth', '育成年代', [sekoWiki, sekoInterview]),
    ...annualRows(2013, 2015, '三菱養和SCユース', 'Youth', '育成年代', [sekoWiki, sekoInterview], { '2015': '入選日本U-18代表候補。' }),
    ...annualRows(2016, 2019, '明治大学', '大學足球', '育成年代', [sekoWiki, sekoMeiji], { '2018': '全日本大學足球總理大臣盃冠軍。', '2019': '大學三冠、東京都足球錦標賽冠軍及關東大學聯賽最佳十一人；天皇盃2場0球。' }),
    row('2019', '横浜FC', 'J2', 0, 0, '特別指定球員', '8月至12月；正式賽未有上陣。', [sekoSigning, sekoWiki]),
    row('2020', '横浜FC', 'J1', 33, 2, '正式加盟', '聯賽開幕戰取得J.League首球。', [sekoSigning, sekoWiki]),
    row('2021', '横浜FC', 'J1', 33, 1, '', '', [sekoSigning, sekoWiki]),
    row('2022', '川崎フロンターレ', 'J1', 13, 0, '完全轉會', 'ACL另2場0球。', [sekoSigning, sekoWiki]),
    row('2023', '川崎フロンターレ', 'J1', 28, 1, '', '天皇盃冠軍；盃賽合共11場4球，ACL另6場1球。', [sekoSigning, sekoWiki]),
    row('2024', '川崎フロンターレ', 'J1', 25, 0, '副隊長', '8月離隊赴英。', [sekoSigning, sekoWiki]),
    row('2024/25', 'Stoke City', 'EFL Championship', 25, 0, '完全轉會', '盃賽另3場0球。', [sekoWiki]),
    row('2025/26', 'Stoke City', 'EFL Championship', 43, 0, '', '46輪聯賽上陣43場；盃賽另4場0球。', [sekoOfficial, sekoWiki]),
    row('2026/27', '浦和紅鑽', 'J1', 4, 0, '完全轉會', '0助攻、210分鐘；數據截至2026-09-11。', [sekoOfficial, sekoJLeague])
  ],
  sources: [sekoOfficial, sekoSigning, sekoJLeague, sekoWiki, sekoMeiji, sekoInterview],
  verification_status: 'verified',
  verified_at: verifiedAt
});

data.generated_at = new Date().toISOString();
await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
console.log('Updated Urawa players #10, #11 and #12.');
