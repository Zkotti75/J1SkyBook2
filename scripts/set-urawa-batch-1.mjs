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

function replacePlayer(number, replacement) {
  const index = data.players.findIndex(player => String(player.number) === String(number));
  if (index < 0) throw new Error(`Urawa player #${number} not found`);
  data.players[index] = { ...data.players[index], ...replacement };
}

const miyamotoOfficial = source('浦和紅鑽官方球員檔案', 'https://www.urawa-reds.co.jp/topteam/detail/?id=541');
const miyamotoJLeague = source('J.League官方球員檔案', 'https://www.jleague.jp/player/1631769/');
const miyamotoWiki = source('日本語Wikipedia（生涯及逐季紀錄）', 'https://ja.wikipedia.org/wiki/%E5%AE%AE%E6%9C%AC%E5%84%AA%E5%A4%AA');
const miyamotoInterview = source('REDS Denki訪問（育成及領袖背景）', 'https://magazine.reds-denki.com/111.html');

replacePlayer('2', {
  name_zh: '宮本優太',
  name_ja: '宮本 優太',
  name_en: 'Yuta Miyamoto',
  position: 'DF',
  dob: '1999-12-15',
  age: 26,
  season_start_age: 26,
  birthplace: '東京都練馬區',
  height: 171,
  weight: 70,
  foot: '右腳',
  nationality: '日本',
  joined: 2026,
  prev_club: '京都サンガF.C.',
  registration_status: '外借回歸（2026）',
  registration_tags: ['2020、2021特別指定（歷史身份）'],
  tenure_status: '浦和正式球員第5季；2026回歸',
  national_team_detail: '曾入選全日本大學選拔；未有成年日本代表上陣紀錄',
  intro: '能任右閘、右中堅及防守中場，最大特點是極強跑動量、廣闊防守覆蓋及持球向前推進。2026由京都外借回歸後在百年構想聯賽出任副隊長及防線領袖。',
  timeline: [
    { period: '2015–2017', team: '流通經濟大學附屬柏高校', category: '高中足球', milestone: '高三任隊長，贏得全國高校綜體冠軍並獲兩項全國大賽優秀球員獎。' },
    { period: '2018–2021', team: '流通經濟大學', category: '大學足球', milestone: '由防守中場改踢右閘；2020及2021成為浦和特別指定球員。' },
    { period: '2022–2023', team: '浦和紅鑽／KMSK Deinze', category: 'J1／Challenger Pro League', milestone: '2022正式加盟；2023上半年外借比利時。' },
    { period: '2024–2025', team: '京都サンガF.C.', category: 'J1', milestone: '連續兩季外借並合共取得66次J1上陣。' },
    { period: '2026–', team: '浦和紅鑽', category: 'J1', milestone: '回歸後成為副隊長及防線指揮者。' }
  ],
  honors: [
    '2017 全國高等學校綜合體育大會足球冠軍（流通經濟大學附屬柏高校）',
    '2017 全國高校足球選手權大會亞軍；獲選大會優秀球員',
    '2017 全國高校綜體優秀球員',
    '2018 日本高校選拔：杜塞爾多夫國際青年大賽冠軍',
    '2020 關東大學足球聯賽二部冠軍、Amino Vital Cup冠軍（流通經濟大學）',
    '2021 關東大學足球聯賽一部冠軍及最佳十一人',
    '2022 日本超級盃冠軍（浦和紅鑽）'
  ],
  milestones: [
    '2020及2021連續兩季獲認定為浦和的JFA・J.League特別指定球員；兩季J1均未上陣。',
    '2023外借KMSK Deinze期間在比利時第二級Challenger Pro League上陣2場。',
    '2024年7月7日代表京都作客福岡取得個人首個J.League入球。',
    '2024及2025連續兩季各有33次J1上陣；2024入1球。',
    '2026百年構想聯賽為浦和上陣16場，並獲委任為副隊長。'
  ],
  tactical_traits: [
    '小學一年級至六年級校內長跑比賽一直第一；中三曾在練馬區田徑賽3000米擊敗田徑部選手奪冠。',
    '大學二年級由防守中場改踢右閘；曺貴裁當時建議他掌握多個位置，以延長球員生涯。',
    '2026浦和官方定位為中堅：以跑力包抄大範圍、主動帶球及縱向傳球破解第一道壓迫。'
  ],
  quirky_trivia: '由小學、中學、高中至大學長期擔任隊長或副隊長。高中三年級帶領流經大柏奪全國高校綜體冠軍及全國選手權亞軍；私人旅行亦習慣提前約一年安排目的地、住宿及時間表。',
  official_player_id: '1631769',
  player_image: 'https://www.urawa-reds.co.jp/wp-content/uploads/player_photo/1/541.png',
  season_stats: [
    { season: '2025', competition: 'J1（京都）', appearances: 33, goals: 0, minutes: null, as_of: '2025-12-31', source: miyamotoOfficial.url },
    { season: '2026', competition: 'J1百年構想聯賽（浦和）', appearances: 16, goals: 0, minutes: null, as_of: '2026-06-12', source: miyamotoWiki.url },
    { season: '2026/27', competition: 'J1（浦和）', appearances: null, goals: 0, minutes: 540, as_of: verifiedAt, source: miyamotoOfficial.url }
  ],
  career: [
    row(null, '田柄足球會', '少年足球', null, null, '育成年代', '', [miyamotoOfficial]),
    row(null, 'NPO法人ワセダクラブForza\'02', 'Junior Youth', null, null, '育成年代', '就讀練馬區立田柄中學校；中學時任隊長。', [miyamotoWiki, miyamotoInterview]),
    row('2015', '流通經濟大學附屬柏高校', '高中足球', null, null, '育成年代', '', [miyamotoWiki]),
    row('2016', '流通經濟大學附屬柏高校', '高中足球', null, null, '育成年代', '', [miyamotoWiki]),
    row('2017', '流通經濟大學附屬柏高校', '高中足球', null, null, '隊長', '全國高校綜體冠軍、全國高校選手權亞軍；兩項賽事均入選優秀球員。', [miyamotoWiki]),
    row('2018', '流通經濟大學FC', '關東足球聯賽', 1, 0, '大學一年級', '夏季升上一隊並在聯賽首次上陣錄得助攻。', [miyamotoWiki]),
    row('2019', '流通經濟大學', '大學足球', null, null, '大學二年級', '入選全日本大學選拔；天皇盃上陣2場。', [miyamotoWiki]),
    row('2020', '流通經濟大學', '關東大學足球聯賽二部', null, null, '大學三年級／副隊長', '由防守中場固定改踢右閘；球隊贏得聯賽及Amino Vital Cup。', [miyamotoWiki]),
    row('2020', '浦和紅鑽', 'J1', 0, 0, '特別指定球員', '11月獲認定；未有正式賽上陣。', [miyamotoOfficial, miyamotoWiki]),
    row('2021', '流通經濟大學', '關東大學足球聯賽一部', null, null, '大學四年級／副隊長', '聯賽冠軍及最佳十一人；天皇盃上陣1場。', [miyamotoWiki]),
    row('2021', '浦和紅鑽', 'J1', 0, 0, '特別指定球員', '連續第二季獲認定；未有正式賽上陣。', [miyamotoOfficial, miyamotoWiki]),
    row('2022', '浦和紅鑽', 'J1', 15, 0, '正式加盟', '2月12日日本超級盃完成職業首戰。', [miyamotoOfficial, miyamotoWiki]),
    row('2022/23', 'KMSK Deinze', 'Challenger Pro League（比利時第二級）', 2, 0, '外借', '2023年1月至6月；兩次均為後備上陣。', [miyamotoWiki]),
    row('2023', '浦和紅鑽', 'J1', 0, 0, '外借回歸', '6月由比利時回歸。', [miyamotoOfficial, miyamotoWiki]),
    row('2024', '京都サンガF.C.', 'J1', 33, 1, '外借', '7月7日攻入J.League首球。', [miyamotoOfficial, miyamotoWiki]),
    row('2025', '京都サンガF.C.', 'J1', 33, 0, '外借', '外借期延長第二季。', [miyamotoOfficial, miyamotoWiki]),
    row('2026', '浦和紅鑽', 'J1百年構想聯賽', 16, 0, '外借回歸／副隊長', '', [miyamotoOfficial, miyamotoWiki]),
    row('2026/27', '浦和紅鑽', 'J1', null, 0, '副隊長', '官方頁截至核實日列有540分鐘。', [miyamotoOfficial])
  ],
  sources: [miyamotoOfficial, miyamotoJLeague, miyamotoWiki, miyamotoInterview],
  verification_status: 'verified',
  verified_at: verifiedAt
});

const bozaOfficial = source('浦和紅鑽官方球員檔案', 'https://www.urawa-reds.co.jp/topteam/detail/?id=542');
const bozaWiki = source('日本語Wikipedia（生涯及轉會）', 'https://ja.wikipedia.org/wiki/%E3%83%80%E3%83%8B%E3%83%BC%E3%83%AD%E3%83%BB%E3%83%9C%E3%82%B6');
const bozaSoccerway = source('Soccerway（海外逐季賽事數據）', 'https://www.soccerway.com/player/danilo-boza/65bpTwwE/');
const bozaInterview = source('REDS Denki訪問（巴西育成背景）', 'https://magazine.reds-denki.com/99.html');

replacePlayer('3', {
  name_zh: '丹尼路·保沙',
  name_ja: 'ダニーロ ボザ',
  name_en: 'Danilo Boza',
  position: 'DF',
  dob: '1998-05-06',
  age: 28,
  season_start_age: 28,
  birthplace: '巴西馬托格羅索州龍多諾波利斯',
  height: 184,
  weight: 72,
  foot: '右腳',
  nationality: '巴西',
  joined: 2025,
  prev_club: 'EC Juventude',
  registration_status: '外籍球員',
  registration_tags: [],
  tenure_status: '效力浦和第2季',
  national_team_detail: '',
  intro: '可任中堅或右閘的巴西守將。擅長門前封堵及空中對抗，也會主動壓到對方半場；2026百年構想聯賽末段曾以右閘身份參與疊瓦與短傳配合。',
  timeline: [
    { period: '育成年代', team: 'Rondonópolis EC／Grêmio Prudente／Palmeiras／Monte Azul', category: '巴西青年足球', milestone: '13歲才正式接受足球訓練，15歲加入首間球會。' },
    { period: '2016–2021', team: 'Mirassol及多次外借', category: '巴西／葡萄牙', milestone: '2016職業首戰；外借Braga B、Athletico Paranaense、Figueirense及Santos。' },
    { period: '2022–2024', team: 'EC Juventude／Vasco da Gama', category: 'Série A／Série B', milestone: '2022外借Vasco並協助升上Série A；2023回歸Juventude。' },
    { period: '2025–', team: '浦和紅鑽', category: 'J1', milestone: '由EC Juventude正式轉會加盟。' }
  ],
  honors: [
    '2020 Campeonato Brasileiro Série D冠軍（Mirassol）',
    '2022 協助Vasco da Gama取得Série A升班資格'
  ],
  milestones: [
    '2016年7月12日代表Mirassol在盃賽完成職業首戰。',
    '2020代表Mirassol在Série D上陣20場、入4球並贏得冠軍。',
    '2021由第四級Série D直接躍升至Santos的Série A陣容；季末連續12場踢足全場。',
    '2025年2月15日對神戶勝利船完成J1首戰；4月20日對橫濱水手攻入J1首球。',
    '2025 J1為浦和上陣35場、入1球；另在世界冠軍球會盃踢足3場。'
  ],
  tactical_traits: [
    '本職中堅，也能出任右閘；浦和官方形容他能在門線前封堵，也可在對方半場製造威脅。',
    '2021效力Santos初期主要後備或擔任比賽末段制空點，季末適應Série A後連續12場正選踢足。',
    '2026百年構想聯賽受傷患影響出場排序，但季末改踢右閘後展現前插和組織能力。'
  ],
  quirky_trivia: '在龍多諾波利斯郊外牧場長大，13歲離開父母與姊姊同住後才開始正式受訓，15歲首度加入球會Rondonópolis EC。兒時亦喜歡滑板；家人至今仍經常聯絡，他把浦和首戰球衣寄回巴西給家人收藏。',
  official_player_id: null,
  player_image: 'https://www.urawa-reds.co.jp/wp-content/uploads/player_photo/1/542.png',
  season_stats: [
    { season: '2025', competition: 'J1（浦和）', appearances: 35, goals: 1, minutes: null, as_of: '2025-12-31', source: bozaOfficial.url },
    { season: '2026', competition: 'J1百年構想聯賽（浦和）', appearances: 6, goals: 1, minutes: null, as_of: '2026-06-12', source: bozaOfficial.url },
    { season: '2026/27', competition: 'J1（浦和）', appearances: null, goals: 0, minutes: 540, as_of: verifiedAt, source: bozaOfficial.url }
  ],
  career: [
    row(null, 'Rondonópolis EC', '巴西青年足球', null, null, '育成年代', '15歲加入的首間球會。', [bozaWiki, bozaInterview]),
    row(null, 'Grêmio Prudente', '巴西青年足球', null, null, '育成年代', '', [bozaWiki]),
    row(null, 'Palmeiras', '巴西青年足球', null, null, '育成年代', '', [bozaWiki]),
    row(null, 'Monte Azul', '巴西青年足球', null, null, '育成年代', '在聖保羅州受注目後，開始認真以職業球員為目標。', [bozaInterview]),
    row('2016', 'Mirassol', '巴西職業賽事', null, null, '正式加盟', '7月12日盃賽完成職業首戰。', [bozaWiki]),
    row('2017', 'Mirassol', '巴西職業賽事', 0, 0, '', '聯賽未上陣；在Copinha青年賽的表現帶來其他球會邀請。', [bozaWiki]),
    row('2018', 'Mirassol', 'Campeonato Paulista', 14, 0, '', '', [bozaSoccerway]),
    row('2018/19', 'SC Braga B', 'Liga Portugal 2', 9, 0, '外借', '', [bozaOfficial, bozaSoccerway]),
    row('2019', 'Athletico Paranaense', '巴西職業賽事', 0, 0, '外借', '聯賽未上陣；盃賽4場入1球。', [bozaWiki]),
    row('2019', 'Figueirense', 'Campeonato Brasileiro Série B', 0, 0, '外借', '', [bozaWiki, bozaSoccerway]),
    row('2020', 'Athletico Paranaense', 'Campeonato Paranaense', 5, 1, '外借', '', [bozaOfficial, bozaSoccerway]),
    row('2020', 'Mirassol', 'Campeonato Brasileiro Série D', 20, 4, '外借回歸', 'Série D冠軍。', [bozaWiki]),
    row('2021', 'Mirassol', 'Campeonato Paulista', 11, 1, '', '', [bozaSoccerway]),
    row('2021', 'Santos FC', 'Campeonato Brasileiro Série A', 22, 0, '外借', '由Série D直接跳升Série A。', [bozaWiki, bozaSoccerway]),
    row('2022', 'EC Juventude', 'Campeonato Gaúcho', 11, 0, '正式轉會', '', [bozaOfficial, bozaSoccerway]),
    row('2022', 'Vasco da Gama', 'Campeonato Brasileiro Série B', 17, 0, '外借', '協助球隊升上Série A。', [bozaWiki, bozaSoccerway]),
    row('2023', 'EC Juventude', 'Campeonato Brasileiro Série B', 38, 2, '外借回歸', '', [bozaSoccerway]),
    row('2024', 'EC Juventude', 'Campeonato Brasileiro Série A', 32, 3, '', '', [bozaSoccerway]),
    row('2025', '浦和紅鑽', 'J1', 35, 1, '正式轉會', '另於世界冠軍球會盃上陣3場。', [bozaOfficial]),
    row('2026', '浦和紅鑽', 'J1百年構想聯賽', 6, 1, '', '', [bozaOfficial]),
    row('2026/27', '浦和紅鑽', 'J1', null, 0, '', '官方頁截至核實日列有540分鐘。', [bozaOfficial])
  ],
  sources: [bozaOfficial, bozaWiki, bozaSoccerway, bozaInterview],
  verification_status: 'verified',
  verified_at: verifiedAt
});

const nemotoOfficial = source('浦和紅鑽官方球員檔案', 'https://www.urawa-reds.co.jp/topteam/detail/?id=543');
const nemotoDesignation = source('浦和官方：2024特別指定球員公告', 'https://www.urawa-reds.co.jp/topteamtopics/216209/');
const nemotoWiki = source('日本語Wikipedia（生涯及逐季紀錄）', 'https://ja.wikipedia.org/wiki/%E6%A0%B9%E6%9C%AC%E5%81%A5%E5%A4%AA');
const nemotoAsahi = source('4years.專訪（大學成長背景）', 'https://4years.asahi.com/article/15479303');
const nemotoInterview = source('REDS Denki訪問（少年及青訓背景）', 'https://magazine.reds-denki.com/105.html');

replacePlayer('5', {
  name_zh: '根本健太',
  name_ja: '根本 健太',
  name_en: 'Kenta Nemoto',
  position: 'DF',
  dob: '2002-12-13',
  age: 23,
  season_start_age: 23,
  birthplace: '千葉縣八街市',
  height: 184,
  weight: 81,
  foot: '左腳',
  nationality: '日本',
  joined: 2025,
  prev_club: '流通經濟大學',
  registration_status: '本國球員',
  registration_tags: [],
  tenure_status: '效力浦和第2季',
  national_team_detail: '日本U-22代表（2023杭州亞運銀牌）；2024全日本大學選拔',
  intro: '左腳中堅，184厘米體格配合高打點頭槌；也能以左腳縱向傳球和大範圍轉邊球推進。百年構想聯賽全數比賽踢足，並由#28改穿前隊長Marius Høibråten留下的#5。',
  timeline: [
    { period: '少年年代', team: '柏レイソルA.A.長生', category: '少年足球', milestone: '小四加入；兩名兄弟亦曾在柏太陽王系統踢球。' },
    { period: '2015–2017', team: '千葉市原JEF聯U-15', category: 'Junior Youth', milestone: '主要踢左閘；未獲升上U-18。' },
    { period: '2018–2020', team: '東京學館高校', category: '高中足球', milestone: '改踢中堅，但未曾出戰全國大賽。' },
    { period: '2021–2024', team: '流通經濟大學', category: '大學足球', milestone: '由約第七梯隊起步，升至日本U-22代表及全日本大學選拔。' },
    { period: '2024', team: '浦和紅鑽', category: 'J1', milestone: 'JFA・J.League特別指定球員；正式賽未上陣。' },
    { period: '2025–', team: '浦和紅鑽', category: 'J1', milestone: '正式加盟；新人季末完成J1首個入球。' }
  ],
  honors: [
    '2023 杭州亞洲運動會男子足球銀牌（日本U-22代表）',
    '2024 全日本大學選拔：Denso Cup大學日韓定期賽代表',
    '2024 JFA・J.League特別指定球員（浦和紅鑽）'
  ],
  milestones: [
    '大學入學時由250多人陣容中約第七梯隊起步；二年級冬季仍在第三梯隊且未有聯賽經驗，獲邀任日本代表訓練拍檔後急速冒起。',
    '2023年4月首次入選日本U-22代表；一年後獲J1、J2合共9間球會提出邀請。',
    '2025年8月9日對橫濱FC完成J1首戰；12月6日對川崎前鋒以頭槌攻入職業首球。',
    '2026百年構想聯賽20場全數踢足並攻入2球。'
  ],
  tactical_traits: [
    '本人形容頭槌是「超過100%信心」的絕對武器；透過改善左右腳起跳差異提升制空能力。',
    '中學曾踢左閘，高中改任中堅；左腳長短傳、轉邊及穿透第一線的直傳是其另一賣點。',
    '浦和官方評價其防守特點為黏纏、選位準確，亦能以長傳和頭槌影響攻守兩端。'
  ],
  quirky_trivia: '小二由游泳轉踢足球，小四加入柏太陽王A.A.長生；中學每天放學後乘約50分鐘電車往蘇我訓練，回家常已是晚上10至11時。未獲千葉U-18升格的挫折成為他追求職業的動力。兩名兄弟也曾在柏太陽王系統踢球；休季仍會與父母到銚子釣魚。',
  official_player_id: null,
  player_image: 'https://www.urawa-reds.co.jp/wp-content/uploads/player_photo/1/543.png',
  season_stats: [
    { season: '2025', competition: 'J1（浦和）', appearances: 5, goals: 1, minutes: null, as_of: '2025-12-31', source: nemotoOfficial.url },
    { season: '2026', competition: 'J1百年構想聯賽（浦和）', appearances: 20, goals: 2, minutes: null, as_of: '2026-06-12', source: nemotoOfficial.url },
    { season: '2026/27', competition: 'J1（浦和）', appearances: null, goals: 0, minutes: 270, as_of: verifiedAt, source: nemotoOfficial.url }
  ],
  career: [
    row(null, '八街市地區少年足球隊（名稱未載）', '少年足球', null, null, '育成年代', '小學二年級開始正式踢足球。', [nemotoInterview]),
    row(null, '柏レイソルA.A.長生', '少年足球', null, null, '育成年代', '小學四年級加入。', [nemotoInterview]),
    row('2015', '千葉市原JEF聯U-15', 'Junior Youth', null, null, '育成年代', '主要出任左閘。', [nemotoWiki, nemotoAsahi]),
    row('2016', '千葉市原JEF聯U-15', 'Junior Youth', null, null, '育成年代', '', [nemotoWiki]),
    row('2017', '千葉市原JEF聯U-15', 'Junior Youth', null, null, '育成年代', '未獲升上U-18。', [nemotoWiki, nemotoInterview]),
    row('2018', '東京學館高校', '高中足球', null, null, '育成年代', '改踢中堅。', [nemotoWiki, nemotoAsahi]),
    row('2019', '東京學館高校', '高中足球', null, null, '育成年代', '', [nemotoWiki]),
    row('2020', '東京學館高校', '高中足球', null, null, '育成年代', '高中三年未曾晉身全國大賽。', [nemotoWiki, nemotoAsahi]),
    row('2021', '流通經濟大學', '大學足球', null, null, '大學一年級', '由約第七梯隊起步。', [nemotoWiki, nemotoAsahi]),
    row('2022', '流通經濟大學', '大學足球', null, null, '大學二年級', '冬季獲邀擔任日本代表訓練拍檔。', [nemotoWiki, nemotoAsahi]),
    row('2023', '流通經濟大學', '關東大學足球聯賽一部', null, null, '大學三年級', '入選日本U-22代表並參加杭州亞運。', [nemotoWiki, nemotoAsahi]),
    row('2024', '流通經濟大學', '大學足球', null, null, '大學四年級', '入選全日本大學選拔。', [nemotoWiki]),
    row('2024', '浦和紅鑽', 'J1', 0, 0, '特別指定球員', '8月至12月；正式賽未上陣，背號58。', [nemotoDesignation, nemotoWiki]),
    row('2025', '浦和紅鑽', 'J1', 5, 1, '正式加盟', '12月6日攻入職業首球。', [nemotoOfficial, nemotoWiki]),
    row('2026', '浦和紅鑽', 'J1百年構想聯賽', 20, 2, '', '全數比賽踢足。', [nemotoOfficial, nemotoWiki]),
    row('2026/27', '浦和紅鑽', 'J1', null, 0, '', '官方頁截至核實日列有270分鐘。', [nemotoOfficial])
  ],
  sources: [nemotoOfficial, nemotoDesignation, nemotoWiki, nemotoAsahi, nemotoInterview],
  verification_status: 'verified',
  verified_at: verifiedAt
});

data.generated_at = new Date().toISOString();
await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
console.log('Updated Urawa #2, #3 and #5 to verified Nishikawa-standard records.');
