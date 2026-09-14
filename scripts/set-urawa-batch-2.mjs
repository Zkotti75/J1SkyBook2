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

const yamaneOfficial = source('浦和紅鑽官方球員檔案', 'https://www.urawa-reds.co.jp/topteam/detail/?id=600');
const yamaneSigning = source('浦和紅鑽官方加盟公告', 'https://www.urawa-reds.co.jp/topteamtopics/245036/');
const yamaneJLeague = source('J.League官方球員檔案', 'https://www.jleague.jp/player/1503720/');
const yamaneWiki = source('日本語Wikipedia（育成、生涯及逐季紀錄）', 'https://ja.wikipedia.org/wiki/%E5%B1%B1%E6%A0%B9%E8%A6%96%E6%9D%A5');
const yamaneInterview = source('4years.專訪（中學、高校及大學背景）', 'https://4years.asahi.com/article/14679051');

replacePlayer('6', {
  name_zh: '山根視來',
  name_ja: '山根 視来',
  name_en: 'Miki Yamane',
  position: 'DF',
  dob: '1993-12-22',
  age: 32,
  season_start_age: 32,
  birthplace: '神奈川縣橫濱市青葉區',
  height: 178,
  weight: 72,
  foot: '右腳',
  nationality: '日本',
  joined: 2026,
  prev_club: 'Los Angeles Galaxy',
  registration_status: '新加盟（2026年8月完全轉會）',
  registration_tags: [],
  tenure_status: '效力浦和第1季',
  national_team_detail: '日本代表16場2球；2022世界盃決賽周成員',
  intro: '進攻取向的右閘，能沿右路高速壓上，也會移入半空間串連和帶球破線。大學以前主要踢攻擊位置，2017年由曺貴裁在湘南改造成三中堅右側守將，其後在川崎固定成為右閘。',
  timeline: [
    { period: '1998–2008', team: 'あざみ野F.C.／東京ヴェルディ青訓', category: '少年及Junior Youth', milestone: '五歲開始踢球，小四加入東京綠茵青訓；未獲升上U-18。' },
    { period: '2009–2015', team: 'ウィザス高校／桐蔭横浜大学', category: '高校及大學足球', milestone: '高校因東日本大震災一度借用桐蔭橫濱大學場地，這段緣分帶他升讀該校；2014入選全日本大學選拔。' },
    { period: '2016–2019', team: '湘南ベルマーレ', category: 'J1／J2', milestone: '2017轉踢三中堅右側並成為主力；2018贏得聯賽盃。' },
    { period: '2020–2023', team: '川崎フロンターレ', category: 'J1', milestone: '兩奪J1冠軍，連續三季入選J1最佳十一人。' },
    { period: '2024–2026', team: 'Los Angeles Galaxy', category: 'MLS', milestone: '首季贏得MLS Cup；三季聯賽合共85場1球。' },
    { period: '2026–', team: '浦和紅鑽', category: 'J1', milestone: '2026年8月完全轉會回到J.League。' }
  ],
  honors: [
    '2017 J2冠軍（湘南ベルマーレ）',
    '2018 J.League聯賽盃冠軍（湘南ベルマーレ）',
    '2020、2021 J1冠軍（川崎フロンターレ）',
    '2020、2023 天皇盃冠軍；2021日本超級盃冠軍（川崎フロンターレ）',
    '2024 MLS Cup冠軍（Los Angeles Galaxy）',
    '2020、2021、2022 J1最佳十一人',
    '2021 J1公平競技個人獎',
    '2022 EAFF E-1足球錦標賽冠軍（日本代表）'
  ],
  milestones: [
    '2014年在桐蔭橫濱大學入選全日本大學選拔；2015天皇盃2場入1球。',
    '2017年2月26日代表湘南對水戶完成J.League首戰；2018年4月7日對鹿島取得J.League首球。',
    '2021年J1錄得聯賽最多的12次助攻。',
    '日本代表首戰即入球：2021年3月25日對韓國；累計16場2球。',
    '入選日本代表2022世界盃決賽周名單。',
    '截至離開Los Angeles Galaxy，三季MLS聯賽85場1球；2024季後賽連同常規賽共38場。',
    '2026年8月23日對町田後備上陣16分鐘，完成浦和首戰。'
  ],
  tactical_traits: [
    '大學以前主要踢進攻位置；2017年曺貴裁把他改造成三中堅右側，2020轉投川崎後改任右閘。',
    '強項是從後場帶球越過第一道防線、右路疊瓦，以及移入半空間與中場短傳配合。',
    '2021年J1助攻數全聯賽第一，反映其最後一傳與持續插上的產量。'
  ],
  quirky_trivia: '五歲受父親與兄長影響加入あざみ野F.C.。未獲東京綠茵U-18升格，高校二年級又遇東日本大震災、學校受災；球隊暫借桐蔭橫濱大學場地訓練，這段意外緣分最終帶他升讀該校。',
  official_player_id: '1503720',
  player_image: 'https://www.urawa-reds.co.jp/wp-content/uploads/player_photo/1/600.png',
  season_stats: [
    { season: '2025', competition: 'MLS（Los Angeles Galaxy）', appearances: 31, goals: 1, assists: null, minutes: null, as_of: '2025-12-31', source: yamaneWiki.url },
    { season: '2026', competition: 'MLS（Los Angeles Galaxy）', appearances: 16, goals: 0, assists: null, minutes: null, as_of: '2026-08-17', source: yamaneWiki.url },
    { season: '2026/27', competition: 'J1（浦和）', appearances: 1, goals: 0, assists: 0, minutes: 16, as_of: '2026-09-11', source: yamaneJLeague.url }
  ],
  career: [
    ...annualRows(1998, 2003, 'あざみ野F.C.', '少年足球', '育成年代', [yamaneWiki], { '1998': '五歲開始踢球。' }),
    ...annualRows(2004, 2005, '東京ヴェルディ1969ジュニア', '少年足球', '育成年代', [yamaneWiki], { '2004': '小學四年級加入東京綠茵青訓。' }),
    ...annualRows(2006, 2008, '東京ヴェルディ1969ジュニアユース', 'Junior Youth', '育成年代', [yamaneWiki], { '2008': '未獲升上U-18。' }),
    ...annualRows(2009, 2011, 'ウィザス高校（現・第一学院高校）', '高中足球', '育成年代', [yamaneWiki, yamaneInterview], { '2011': '東日本大震災令學校受災，球隊一度在桐蔭橫濱大學借場訓練。' }),
    ...annualRows(2012, 2015, '桐蔭横浜大学', '大學足球', '育成年代', [yamaneWiki, yamaneInterview], { '2013': '天皇盃上陣1場。', '2014': '入選全日本大學選拔。', '2015': '天皇盃上陣2場、入1球。' }),
    row('2016', '湘南ベルマーレ', 'J1', 0, 0, '正式加盟', '受傷影響未有聯賽上陣；盃賽合共4場。', [yamaneOfficial, yamaneWiki]),
    row('2017', '湘南ベルマーレ', 'J2', 37, 0, '', '曺貴裁把他由攻擊位置改造成三中堅右側；球隊奪冠升班。', [yamaneOfficial, yamaneWiki]),
    row('2018', '湘南ベルマーレ', 'J1', 32, 1, '', 'J.League聯賽盃冠軍。', [yamaneOfficial, yamaneWiki]),
    row('2019', '湘南ベルマーレ', 'J1', 31, 2, '', '', [yamaneOfficial, yamaneWiki]),
    row('2020', '川崎フロンターレ', 'J1', 31, 4, '完全轉會', 'J1及天皇盃冠軍；首次入選J1最佳十一人。', [yamaneOfficial, yamaneWiki]),
    row('2021', '川崎フロンターレ', 'J1', 37, 2, '', 'J1冠軍；聯賽12次助攻為全J1最多。', [yamaneOfficial, yamaneWiki]),
    row('2022', '川崎フロンターレ', 'J1', 32, 3, '', '連續第三季入選J1最佳十一人；出戰世界盃。', [yamaneOfficial, yamaneWiki]),
    row('2023', '川崎フロンターレ', 'J1', 33, 2, '', '天皇盃冠軍。', [yamaneOfficial, yamaneWiki]),
    row('2024', 'Los Angeles Galaxy', 'MLS', 38, 0, '完全轉會', 'MLS Cup冠軍。', [yamaneWiki]),
    row('2025', 'Los Angeles Galaxy', 'MLS', 31, 1, '', '', [yamaneWiki]),
    row('2026', 'Los Angeles Galaxy', 'MLS', 16, 0, '', '8月中離隊回到日本。', [yamaneWiki, yamaneSigning]),
    row('2026/27', '浦和紅鑽', 'J1', 1, 0, '完全轉會', '8月23日對町田後備上陣16分鐘完成首戰；數據截至2026-09-11。', [yamaneOfficial, yamaneJLeague])
  ],
  sources: [yamaneOfficial, yamaneSigning, yamaneJLeague, yamaneWiki, yamaneInterview],
  verification_status: 'verified',
  verified_at: verifiedAt
});

const kanekoOfficial = source('浦和紅鑽官方球員檔案', 'https://www.urawa-reds.co.jp/topteam/detail/?id=544');
const kanekoJLeague = source('J.League官方球員檔案', 'https://www.jleague.jp/player/1624851/');
const kanekoWiki = source('日本語Wikipedia（育成、生涯及逐季紀錄）', 'https://ja.wikipedia.org/wiki/%E9%87%91%E5%AD%90%E6%8B%93%E9%83%8E');
const kanekoUniversity = source('日本大學專訪（高校、大學及旅歐背景）', 'https://www.nihon-u.ac.jp/sports/graduate/546/');

replacePlayer('7', {
  name_zh: '金子拓郎',
  name_ja: '金子 拓郎',
  name_en: 'Takuro Kaneko',
  position: 'MF',
  dob: '1997-07-30',
  age: 29,
  season_start_age: 29,
  birthplace: '埼玉縣比企郡小川町',
  height: 178,
  weight: 75,
  foot: '左腳',
  nationality: '日本',
  joined: 2025,
  prev_club: 'KV Kortrijk',
  registration_status: '本國球員',
  registration_tags: [],
  tenure_status: '效力浦和第2季',
  national_team_detail: '2019日本大學生代表（拿坡里世界大學生運動會金牌）；2020日本U-23代表候補',
  intro: '右路為主的左腳翼鋒，擅長在一對一以節奏變化和內切突破甩開守將。失去球權後第一時間回搶速度快，既能自行射門，也能以傳中和倒三角製造機會。',
  timeline: [
    { period: '少年–2012', team: '小川サッカースポーツ少年団／クマガヤSC', category: '少年及Junior Youth', milestone: '小一開始踢球；クマガヤSC同屆包括加藤陸次樹及庄司朋乃也。' },
    { period: '2013–2015', team: '前橋育英高校', category: '高中足球', milestone: '高二全國高校選手權亞軍；高三八強及大會優秀球員。' },
    { period: '2016–2019', team: '日本大學', category: '大學足球', milestone: '大三練習賽獲札幌發掘；2019成為特別指定球員並完成J1首戰。' },
    { period: '2020–2023', team: '北海道コンサドーレ札幌', category: 'J1', milestone: '2021獲J1優秀球員獎；2023上半季21場入8球。' },
    { period: '2023–2025', team: 'Dinamo Zagreb／KV Kortrijk', category: 'Croatian Football League／Belgian Pro League', milestone: '在克羅地亞贏得聯賽、盃賽雙冠；其後轉戰比利時。' },
    { period: '2025–', team: '浦和紅鑽', category: 'J1', milestone: '回到家鄉埼玉；2026/27球季開季首6場錄得1球4助攻。' }
  ],
  honors: [
    '2014 全國高校足球選手權大會亞軍（前橋育英高校）',
    '2015 全國高校足球選手權大會八強及大會優秀球員',
    '2019 拿坡里世界大學生運動會男子足球金牌（日本大學生代表）',
    '2023/24 Croatian Football League冠軍（Dinamo Zagreb）',
    '2023/24 Croatian Cup冠軍（Dinamo Zagreb）',
    '2021 J1優秀球員獎'
  ],
  milestones: [
    '2019年仍在日本大學就讀時獲認定為札幌的JFA・J.League特別指定球員；J1上陣6場、聯賽盃8場入1球。',
    '2019年3月30日對名古屋完成J.League首戰；2020年7月26日對橫濱水手取得J1首球。',
    '2021 J1上陣38場入7球，獲優秀球員獎。',
    '2023年7月外借Dinamo Zagreb；聯賽28場2球、克羅地亞盃4場1球，贏得本土雙冠。',
    '2024/25代表KV Kortrijk在Belgian Pro League上陣16場入1球。',
    '2025浦和首季J1上陣33場入1球；天皇盃2場入2球。',
    '2026/27 J1開季6場取得1球4助攻；數據截至2026年9月11日。'
  ],
  tactical_traits: [
    '左腳球員多從右路起步，以步頻、急停再加速及內切製造一對一優勢。',
    '浦和官方特別強調他由攻轉守時的第一下加速及反搶，可直接阻止對手反擊。',
    '2026/27首6輪製造17次機會，錄得4次助攻。'
  ],
  quirky_trivia: '小一在家鄉小川町開始踢球。日本大學三年級夏天在釧路集訓最後一天對札幌的練習賽被相中，隨即獲邀跟操一星期，翌年再參加熊本營，最終由一場大學練習賽打開職業大門。',
  official_player_id: '1624851',
  player_image: 'https://www.urawa-reds.co.jp/wp-content/uploads/player_photo/1/544.png',
  season_stats: [
    { season: '2025', competition: 'J1（浦和）', appearances: 33, goals: 1, assists: null, minutes: null, as_of: '2025-12-31', source: kanekoOfficial.url },
    { season: '2026', competition: 'J1百年構想聯賽（浦和）', appearances: 20, goals: 2, assists: null, minutes: null, as_of: '2026-06-12', source: kanekoOfficial.url },
    { season: '2026/27', competition: 'J1（浦和）', appearances: 6, goals: 1, assists: 4, minutes: 526, as_of: '2026-09-11', source: kanekoJLeague.url }
  ],
  career: [
    row(null, '小川サッカースポーツ少年団', '少年足球', null, null, '育成年代', '小學一年級開始踢球；確實起訖年份未見可靠來源。', [kanekoWiki]),
    row(null, 'クマガヤSC', 'Junior Youth', null, null, '育成年代', '確實起訖年份未見可靠來源。', [kanekoOfficial, kanekoWiki]),
    ...annualRows(2013, 2015, '前橋育英高校', '高中足球', '育成年代', [kanekoWiki, kanekoUniversity], { '2014': '全國高校足球選手權亞軍；當屆主要為後備。', '2015': '全國高校足球選手權八強，獲選大會優秀球員。' }),
    ...annualRows(2016, 2019, '日本大學', '大學足球', '育成年代', [kanekoWiki, kanekoUniversity], { '2018': '釧路集訓對札幌練習賽後獲邀跟操。', '2019': '日本大學生代表贏得世界大學生運動會金牌。' }),
    row('2019', '北海道コンサドーレ札幌', 'J1', 6, 0, '特別指定球員', '聯賽盃8場入1球；3月30日完成J1首戰。', [kanekoOfficial, kanekoWiki]),
    row('2020', '北海道コンサドーレ札幌', 'J1', 31, 4, '正式加盟', '', [kanekoOfficial, kanekoWiki]),
    row('2021', '北海道コンサドーレ札幌', 'J1', 38, 7, '', '獲J1優秀球員獎。', [kanekoOfficial, kanekoJLeague, kanekoWiki]),
    row('2022', '北海道コンサドーレ札幌', 'J1', 27, 1, '', '', [kanekoOfficial, kanekoWiki]),
    row('2023', '北海道コンサドーレ札幌', 'J1', 21, 8, '', '7月離隊赴歐。', [kanekoOfficial, kanekoWiki]),
    row('2023/24', 'Dinamo Zagreb', 'Croatian Football League', 28, 2, '外借', '聯賽及克羅地亞盃雙冠；盃賽4場入1球。', [kanekoWiki]),
    row('2024/25', 'KV Kortrijk', 'Belgian Pro League', 16, 1, '完全轉會', '比利時盃2場0球。', [kanekoWiki]),
    row('2025', '浦和紅鑽', 'J1', 33, 1, '完全轉會', '天皇盃2場入2球。', [kanekoOfficial, kanekoWiki]),
    row('2026', '浦和紅鑽', 'J1百年構想聯賽', 20, 2, '', '官方記錄為賽事全20場均有上陣。', [kanekoOfficial, kanekoWiki]),
    row('2026/27', '浦和紅鑽', 'J1', 6, 1, '', '另有4次助攻、526分鐘；數據截至2026-09-11。', [kanekoOfficial, kanekoJLeague])
  ],
  sources: [kanekoOfficial, kanekoJLeague, kanekoWiki, kanekoUniversity],
  verification_status: 'verified',
  verified_at: verifiedAt
});

const mizunumaOfficial = source('浦和紅鑽官方球員檔案', 'https://www.urawa-reds.co.jp/topteam/detail/?id=545');
const mizunumaSigning = source('浦和紅鑽官方加盟公告', 'https://www.urawa-reds.co.jp/topteamtopics/242656/');
const mizunumaJLeague = source('J.League官方球員檔案', 'https://www.jleague.jp/player/700805/');
const mizunumaWiki = source('日本語Wikipedia（育成、生涯、逐季紀錄及成就）', 'https://ja.wikipedia.org/wiki/%E6%B0%B4%E6%B2%BC%E5%AE%8F%E5%A4%AA');
const mizunumaMarinos = source('橫濱水手官方轉會公告（完整日本生涯紀錄）', 'https://www.f-marinos.com/news/team/8053');

replacePlayer('8', {
  name_zh: '水沼宏太',
  name_ja: '水沼 宏太',
  name_en: 'Kota Mizunuma',
  position: 'MF',
  dob: '1990-02-22',
  age: 36,
  season_start_age: 36,
  birthplace: '神奈川縣橫濱市青葉區',
  height: 177,
  weight: 72,
  foot: '右腳',
  nationality: '日本',
  joined: 2026,
  prev_club: 'Newcastle Jets',
  registration_status: '新加盟（2026年7月完全轉會）',
  registration_tags: [],
  tenure_status: '效力浦和第1季',
  national_team_detail: '日本代表2場0球；日本U-17、U-20、U-23代表',
  intro: '經驗豐富的右翼及右中場，以不停走動、傳中時機和無球入楔見長。既能拉闊右路，也能在禁區外圍製造最後一傳；場上持續呼喊和鼓勵隊友，是多支球隊倚重的更衣室領袖。',
  timeline: [
    { period: '1997–2007', team: 'あざみ野FC／横浜F・マリノス青訓', category: '少年、Junior Youth及Youth', milestone: '從前鋒逐步後移至中場；2007以二種註冊身份、17歲完成J1首戰。' },
    { period: '2008–2015', team: '横浜F・マリノス／栃木SC／サガン鳥栖', category: 'J1／J2', milestone: '兩度外借爭取上陣；2013由鳥栖正式買斷。' },
    { period: '2016–2019', team: 'FC東京／セレッソ大阪', category: 'J1／J3', milestone: '2017外借大阪櫻花即贏聯賽盃及天皇盃，翌季正式加盟。' },
    { period: '2020–2024', team: '横浜F・マリノス', category: 'J1', milestone: '回歸母會並贏得2022 J1冠軍；同年入選J1最佳十一人。' },
    { period: '2025–2026', team: 'Newcastle Jets', category: 'A-League Men', milestone: '首次旅外，37場7球並贏得2025 Australia Cup。' },
    { period: '2026–', team: '浦和紅鑽', category: 'J1', milestone: '36歲返日加盟父親故鄉球會。' }
  ],
  honors: [
    '2006 AFC U-17錦標賽冠軍（日本U-17；6場4球）',
    '2010 亞洲運動會男子足球金牌（日本U-23；7場2球）',
    '2017 J.League聯賽盃及天皇盃冠軍（セレッソ大阪）',
    '2018 日本超級盃冠軍（セレッソ大阪）',
    '2022 J1冠軍（横浜F・マリノス）',
    '2023 日本超級盃冠軍（横浜F・マリノス）',
    '2025 Australia Cup冠軍（Newcastle Jets）',
    '2022 J1最佳十一人、J1優秀球員獎、J1六月最佳球員及JPFA J1最佳十一人',
    '2022 EAFF E-1足球錦標賽冠軍（日本代表）'
  ],
  milestones: [
    '2007仍屬橫濱水手Youth時以二種註冊身份在J1上陣3場；10月27日對甲府、17歲完成J.League首戰。',
    '2009聯賽盃準決賽第二回合，球隊換人名額用盡兼門將被逐，他臨時戴手套把關。',
    'J1里程碑：2014達100場、2018達200場、2021達300場；目前J1累計396場48球。',
    '2022年7月19日對香港完成日本成年代表首戰；與父親水沼貴史成為日本史上首對父子兩代成年國腳。',
    '父子亦先後贏得日本頂級聯賽冠軍；宏太於2022隨橫濱水手封王。',
    '2024/25及2025/26兩季為Newcastle Jets在A-League Men合共上陣32場入4球；Australia Cup另5場入3球。',
    '2026/27 J1開季對大阪鋼巴後備上陣3分鐘，完成浦和首戰。'
  ],
  tactical_traits: [
    '主要出任右翼或右中場；無球跑動、右路傳中、後上入楔和攻守轉換中的工作率是核心特點。',
    '在橫濱水手Youth由前鋒後移至中場後冒起；成年後亦能客串左路及前鋒。',
    '2022 J1以31場7球協助橫濱水手奪冠，首次入選聯賽最佳十一人。'
  ],
  quirky_trivia: '父親水沼貴史是前日本代表、日產自動車及橫濱水手名將。宏太五歲時已穿着水手球衣，隨父親在木村和司引退賽踏上三ツ沢球場；青訓年代曾因「名將之子」標籤承受壓力，後來把它轉化成以實力證明自己的動力。',
  official_player_id: '700805',
  player_image: 'https://www.urawa-reds.co.jp/wp-content/uploads/player_photo/1/545.png',
  season_stats: [
    { season: '2024/25', competition: 'A-League Men（Newcastle Jets）', appearances: 12, goals: 2, assists: null, minutes: null, as_of: '2025-06-30', source: mizunumaWiki.url },
    { season: '2025/26', competition: 'A-League Men（Newcastle Jets）', appearances: 20, goals: 2, assists: null, minutes: null, as_of: '2026-05-28', source: mizunumaWiki.url },
    { season: '2026/27', competition: 'J1（浦和）', appearances: 1, goals: 0, assists: 0, minutes: 3, as_of: '2026-09-11', source: mizunumaJLeague.url }
  ],
  career: [
    ...annualRows(1997, 2001, 'あざみ野FC', '少年足球', '育成年代', [mizunumaWiki], { '1997': '小學二年級開始踢球。' }),
    ...annualRows(2002, 2004, '横浜F・マリノスジュニアユース', 'Junior Youth', '育成年代', [mizunumaWiki]),
    ...annualRows(2005, 2007, '横浜F・マリノスユース', 'Youth', '育成年代', [mizunumaWiki], { '2007': '以二種註冊身份跟隨一隊。' }),
    row('2007', '横浜F・マリノス', 'J1', 3, 0, '二種註冊', '17歲完成J.League首戰。', [mizunumaOfficial, mizunumaWiki]),
    row('2008', '横浜F・マリノス', 'J1', 10, 0, '升上一隊', '', [mizunumaSigning, mizunumaWiki]),
    row('2009', '横浜F・マリノス', 'J1', 12, 0, '', '聯賽盃準決賽曾因門將被逐而臨時把關。', [mizunumaSigning, mizunumaWiki]),
    row('2010', '横浜F・マリノス', 'J1', 4, 0, '', '7月外借栃木。', [mizunumaSigning, mizunumaWiki]),
    row('2010', '栃木SC', 'J2', 13, 2, '外借', '', [mizunumaSigning, mizunumaWiki]),
    row('2011', '栃木SC', 'J2', 37, 5, '外借', '', [mizunumaSigning, mizunumaWiki]),
    row('2012', 'サガン鳥栖', 'J1', 33, 5, '外借', '', [mizunumaSigning, mizunumaWiki]),
    row('2013', 'サガン鳥栖', 'J1', 27, 4, '完全轉會', '', [mizunumaSigning, mizunumaWiki]),
    row('2014', 'サガン鳥栖', 'J1', 32, 4, '', 'J1累計100場。', [mizunumaSigning, mizunumaWiki]),
    row('2015', 'サガン鳥栖', 'J1', 32, 7, '', '', [mizunumaSigning, mizunumaWiki]),
    row('2016', 'FC東京', 'J1', 17, 1, '完全轉會', '', [mizunumaSigning, mizunumaWiki]),
    row('2016', 'FC東京U-23', 'J3', 9, 3, '', '', [mizunumaWiki]),
    row('2017', 'セレッソ大阪', 'J1', 24, 3, '外借', '聯賽盃及天皇盃冠軍。', [mizunumaSigning, mizunumaWiki]),
    row('2018', 'セレッソ大阪', 'J1', 27, 1, '完全轉會', '日本超級盃冠軍；J1累計200場。', [mizunumaSigning, mizunumaWiki]),
    row('2019', 'セレッソ大阪', 'J1', 31, 7, '', '', [mizunumaSigning, mizunumaWiki]),
    row('2020', '横浜F・マリノス', 'J1', 25, 3, '完全轉會', '相隔十年回歸母會。', [mizunumaMarinos, mizunumaWiki]),
    row('2021', '横浜F・マリノス', 'J1', 36, 3, '', 'J1累計300場。', [mizunumaMarinos, mizunumaWiki]),
    row('2022', '横浜F・マリノス', 'J1', 31, 7, '', 'J1冠軍；J1最佳十一人。', [mizunumaMarinos, mizunumaWiki]),
    row('2023', '横浜F・マリノス', 'J1', 33, 1, '', '日本超級盃冠軍。', [mizunumaMarinos, mizunumaWiki]),
    row('2024', '横浜F・マリノス', 'J1', 18, 2, '', '', [mizunumaMarinos, mizunumaWiki]),
    row('2024/25', 'Newcastle Jets', 'A-League Men', 12, 2, '完全轉會', 'Australia Cup 5場入3球。', [mizunumaWiki]),
    row('2025/26', 'Newcastle Jets', 'A-League Men', 20, 2, '', '贏得2025 Australia Cup。', [mizunumaWiki]),
    row('2026/27', '浦和紅鑽', 'J1', 1, 0, '完全轉會', '對大阪鋼巴後備上陣3分鐘；數據截至2026-09-11。', [mizunumaOfficial, mizunumaJLeague])
  ],
  sources: [mizunumaOfficial, mizunumaSigning, mizunumaJLeague, mizunumaWiki, mizunumaMarinos],
  verification_status: 'verified',
  verified_at: verifiedAt
});

await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
console.log('Updated Urawa players #6, #7 and #8.');
