import { readFileSync, writeFileSync } from 'node:fs';

const date = '2026-10-24';
const path = 'data/clubs/cerezo-osaka.json';
const club = JSON.parse(readFileSync(path, 'utf8'));
const source = (label, url, published_at) => ({ label, url, accessed_at: date, ...(published_at ? { published_at } : {}) });
const roster = source('J.League Data Site：2026/27大阪櫻花登錄、履歷及累計數據', 'https://data.j-league.or.jp/SFIX02/search?lang=ja&selectValue=1&selectValueTeam=20');
const row = (season, team, competition, appearances, goals, status, notes, sources) => ({ season, team, competition, appearances, goals, status, notes, verification_status: 'verified', sources });
const youth = (season, team, notes, sources) => row(season, team, 'Youth / school / college', null, null, '育成', notes, sources);
const timeline = (period, team, milestone) => ({ period, team, category: '生涯轉折', milestone });
const stat = (season, competition, appearances, goals, sources, notes = '') => ({ season, competition, appearances, goals, as_of: '2026-10-23', notes, sources });

const defs = {
  '1': {
    official: source('Cerezo官方：上林豪身份及2026-08-20生涯訪問', 'https://www.cerezo.jp/team/players/go_kambayashi/'),
    league: source('J.League：上林豪逐季紀錄；頁面更新2026-10-23 06:15', 'https://www.jleague.jp/player/1624840/'),
    wiki: source('Wikipedia日文：上林豪；生涯路線索引', 'https://ja.wikipedia.org/wiki/上林豪'),
    foot: source('Transfermarkt：Go Kambayashi；右腳，舊租借狀態不作現役依據', 'https://www.transfermarkt.com/go-kambayashi/profil/spieler/657619'),
    feature: source('萩原亜依／明大スポーツ、4years.：轉跌後站起來的門將', 'https://4years.asahi.com/article/14608894', '2022-05-03'),
    interview: source('明大スポーツ：回巢內定訪問', 'https://meisupo.net/special/26897/', '2024-04-29'),
    unbeaten: source('明大スポーツ：第22輪後上林豪談無敗奪冠', 'https://meisupo.net/special/35281/', '2024-11-28'),
    debut: source('日刊スポーツ：新加盟記者會及本人自述技術強項', 'https://www.nikkansports.com/m/soccer/news/amp/202501090001192.html', '2025-01-09'),
    return: source('松本山雅官方：上林豪租借期結束', 'https://www.yamaga-fc.com/archives/549807', '2026-06-27'),
    japan: source('JFA：2023-03-21大學日韓定期戰正式紀錄', 'https://www.jfa.jp/match/japanandkorea_2023/match_page/m1.html', '2023-03-21'),
    jufa: source('JUFA：2023年9月大學日韓定期戰報告', 'https://www.jufa.jp/news/news.php?kn=1491', '2023-09-26'),
    signing: source('Cerezo官方：明治大學上林豪2025年加盟內定', 'https://www.cerezo.jp/news/2024-0411-1400/', '2024-04-11')
  },
  '2': {
    official: source('Cerezo官方：中村拓海身份及2026-08-07生涯訪問', 'https://www.cerezo.jp/team/players/takumi_nakamura/'),
    league: source('J.League：中村拓海逐季及現季紀錄；更新2026-10-23 06:15', 'https://www.jleague.jp/player/1624315/'),
    wiki: source('Wikipedia日文：中村拓海；生涯路線索引', 'https://ja.wikipedia.org/wiki/中村拓海'),
    foot: source('Transfermarkt：Takumi Nakamura；右腳', 'https://www.transfermarkt.jp/takumi-nakamura/profil/spieler/590651'),
    former: source('横浜FC官方：中村拓海轉會Cerezo；附2019至2024逐季出場數', 'https://yokohamafc.com/2024/12/20/takumi_nakamura-3/', '2024-12-20'),
    feature: source('北健一郎、渡邉知晃／横浜FC：タクミはタクミのままで；原頁未列日期', 'https://yokohamafc.com/interview/player_07_takumi_nakamura/'),
    tokyo: source('FC東京官方2021球員頁：中村拓海的傳中、走動及多位置特點', 'https://www.fctokyo.co.jp/team/players/2021/294975/'),
    jfa: source('JFA：2018全國高校總體賽優秀選手名單', 'https://jfa.jp/match/koukou_soutai_2018/news/00018440/'),
    u18: source('JFA：U-18日本代表／2019年AFC U-19錦標賽外圍賽名單', 'https://www.jfa.jp/national_team/u18_2019/afc_u19_championship_2020q/member.html'),
    u20: source('JFA：2019年3月U-20歐洲遠征名單', 'https://www.jfa.jp/national_team/u20_2019/20190321/member.html'),
    match: source('JFA：2018高校聯賽WEST第12輪東福岡對大阪飛腳青年軍', 'https://www.jfa.jp/jfa_tv/news/00018748/')
  },
  '4': {
    official: source('Cerezo官方：井上黎生人身份及2026-08-07完整生涯訪問', 'https://www.cerezo.jp/team/players/rikito_inoue/'),
    league: source('J.League：井上黎生人逐季及現季紀錄；更新2026-10-23 06:15', 'https://www.jleague.jp/player/1500812/'),
    wiki: source('Wikipedia日文：井上黎生人；生涯路線索引', 'https://ja.wikipedia.org/wiki/井上黎生人'),
    foot: source('Transfermarkt：Rikito Inoue；右腳，搜尋頁可見球員資料', 'https://www.transfermarkt.jp/rikito-inoue/profil/spieler/362694'),
    feature: source('サッカーマガジン：京都加盟訪問、全季全勤與技術自評', 'https://soccermagazine.jp/j1/17511226?ct=rel&fr=wg', '2022-01-15'),
    human: source('スポニチ：井上黎生人談浦和、家庭及西班牙血緣', 'https://www.sponichi.co.jp/soccer/yomimono/likecerezo/kiji/20250819s00002365363000c.html', '2025-08-20'),
    roots: source('サッカーマガジン：2026年10月鳥取舊會戰前回顧；2016零上陣及海外計劃', 'https://soccermagazine.jp/_amp/j1/17869848'),
    move: source('Cerezo官方：井上黎生人由浦和正式加盟', 'https://www.cerezo.jp/news/2025-0731-1630/', '2025-07-31'),
    former: source('浦和官方：井上黎生人轉會Cerezo', 'https://www.urawa-reds.co.jp/topteamtopics/229762/', '2025-07-31')
  },
  '6': {
    official: source('Cerezo官方：登里享平身份及2026-08-07生涯訪問', 'https://www.cerezo.jp/team/players/kyohei_noborizato/'),
    league: source('J.League：登里享平逐季、現季及獎項；更新2026-10-23 06:15', 'https://www.jleague.jp/player/900097/'),
    wiki: source('Wikipedia日文：登里享平；生涯及冠軍年份索引', 'https://ja.wikipedia.org/wiki/登里享平'),
    foot: source('Transfermarkt：Kyohei Noborizato；左腳', 'https://www.transfermarkt.jp/kyohei-noborizato/profil/spieler/114205'),
    former: source('川崎官方：登里享平轉會；完整隊伍及2009至2023紀錄', 'https://www.frontale.co.jp/info/2024/0106_3.html?s=09', '2024-01-06'),
    profile: source('川崎官方2023球員頁：逐季出場、盃賽、ACL及代表賽事', 'https://www.frontale.co.jp/profile/2023/mem_02.html'),
    tactics: source('川崎F-SPOT：2020年3月專訪，翼鋒轉左閘及中路組織', 'https://www.frontale.co.jp/f_spot/pickup/2020/03.html'),
    injury: source('原田大輔／川崎F-SPOT：2015年膝傷與康復故事（2016年10月刊）', 'https://www.frontale.co.jp/f_spot/pickup/2016/10.html'),
    feature: source('本田健介／Soccer Digest：登里享平的冠軍經驗及Cerezo角色', 'https://www.soccerdigestweb.com/news/detail/id=182960', '2025-11-28'),
    human: source('竹中玲央奈／OSAKA SPORTS GROOVE：選擇Cerezo的理由', 'https://note.com/maishimavoice/n/n96a739bd9de1', '2024-03-30'),
    joc: source('日本奧委會：2010廣州亞運男子足球金牌隊員名單', 'https://www.joc.or.jp/news/000258.html', '2010-11-25'),
    move: source('Cerezo官方：登里享平2024加盟、代表層級及280場J1', 'https://www.cerezo.jp/news/2024-0106-1500/', '2024-01-06')
  }
};

for (const number of Object.keys(defs)) {
  const p = club.players.find(p => p.number === number);
  const s = defs[number];
  p.sources = [...Object.values(s), roster];
  p.identity_reviewed_at = date;
  p.identity_sources = [s.official, s.league, roster];
  p.identity_notes = '球會現行個人頁的生日顯示較J.League早一天；採J.League官方登錄及既有出生日期，沒有據此改動生日。身高體重採現行球會／J.League相符值。';
  p.preferred_foot_sources = [s.foot];
  p.wikipedia_research = { preferred_language: 'ja', consulted: [s.wiki], note: '先查日文路線，再以官方聯賽逐季表及轉會公告交叉核對；未需要以其他語言版本取代日文。' };
  p.career_audit = { reviewed_at: date, scope: '最早足球學校／少年隊至2026/27；每個職業球季、同期登錄、租借及季中轉會分列。', earliest_known_year: null, sources: [s.official, s.wiki, s.league], notes: [] };
  p.verification_status = 'verified';
  p.verified_at = date;
  p.research_gaps = [];
  p.status_tag_sources = [roster];
  p.status_tags_reviewed_at = date;
}

{
  const p = club.players.find(p => p.number === '1'), s = defs['1'];
  p.player_image = 'https://images.microcms-assets.io/assets/cc125679249b4055b70b8d540ec6636a/8d339f1093fc415ea01f8d26932a1084/01-260704_0054.webp';
  p.player_image_source = s.official;
  p.prev_club = '松本山雅（外借期滿回歸）';
  p.registration_status = '本國球員（2026-06租借期滿回歸）';
  p.registration_tags = ['Home Grown'];
  p.intro = '187cm門將，櫻花青訓出身，未獲高中畢業直升合約，改經明治大學四年再回巢；2025年加盟時以「導」字表達帶領球會奪冠的心願。（2024-04-29 明大スポーツ／meisupo.net；2025-01-09 日刊スポーツ／nikkansports.com）2020年已為U-23踢過J3，2026年松本借將經歷並非首次踏上J.League；6月27日租借期滿，現役歸屬以回歸公告及Cerezo現行名單為準。';
  p.career = [
    youth(null, 'ミズノフットサルプラザ奈良', '幼稚園時入讀足球學校；未找到確切起訖年，不按年齡倒算。', [s.official, s.wiki]),
    youth(null, '奈良YMCA', '小三加入，之後以門將為主；年期未確立。', [s.official, s.wiki]),
    youth('2013-2014', '大阪櫻花U-12', '2014：全日本少年足球大會冠軍；保留在合併育成年期內。', [s.league, s.official]),
    youth('2015-2017', '大阪櫻花U-15', '無可靠逐季上陣數，按同一機構合併。', [s.league]),
    youth('2018', '大阪櫻花U-18', '2019起同期一隊二種登錄，後兩年分列。', [s.league]),
    youth('2019', '大阪櫻花U-18', '同年另有一隊二種登錄及U-23名單，不能合併為純育成多年。', [s.league, s.wiki]),
    row('2019', '大阪櫻花', 'J1', null, null, '二種登錄', '官方逐季表以橫線顯示；不把橫線直接轉成0。', [s.league]),
    row('2019', '大阪櫻花U-23', 'J3', null, null, '同期登錄', '官方有此列但數字為橫線；保留空值。', [s.league]),
    youth('2020', '大阪櫻花U-18', '同期二種及U-23職業聯賽登錄。', [s.league, s.wiki]),
    row('2020', '大阪櫻花', 'J1', null, null, '二種登錄', '一隊數字為橫線；U-23的J3上陣另列。', [s.league]),
    row('2020', '大阪櫻花U-23', 'J3', 7, 0, '二種登錄', '2020-09-27對YS橫濱首次J.League上陣。', [s.league, roster]),
    youth('2021-2024', '明治大學', '2024：副隊長，球隊關東大學甲組22輪無敗奪冠。沒有虛填青年上陣／入球總數。', [s.league, s.wiki, s.unbeaten]),
    row('2025', '大阪櫻花', 'J1', 0, 0, '正式加盟', '日文生涯表明列0；J.League歷史表顯示橫線，與未有J1上陣的敘述相符。', [s.wiki, s.league, s.signing]),
    row('2026特別', '松本山雅', 'J2・J3百年構想聯賽', 1, 0, '期限付き移籍', '5月對岐阜上陣；6月27日松本官方公布租借期結束。', [s.league, s.return]),
    row('2026/27', '大阪櫻花', 'J1', 0, 0, '租借期滿回歸', '截至J.League頁面2026-10-23 06:15：現季出場0。該頁歷史表仍誤列松本；採回歸公告及現役登錄，未另建沒有證據的松本現季上陣列。', [s.league, s.return, roster])
  ];
  p.career_audit.notes = ['幼年兩個具名機構保留無年份列；不把Cerezo U-12當作最早接觸足球。', '2019、2020存在青年／一隊／U-23同期登錄，分別保留，不合併職業球季。', '松本2026/27所屬欄滯後：2026-06-27租借結束公告及當季Cerezo登錄優先。', '松本公告身高體重185/74與現行187/84不同；現役體格採球會現行及J.League一致值。'];
  p.timeline = [timeline('2013-2020', '大阪櫻花青訓', '2014少年全國冠軍；2020為U-23上陣7次J3。'), timeline('2021-2024', '明治大學', '由未獲直升合約到2024獲回巢內定，最後一年隨隊無敗奪冠。'), timeline('2025-2026', '大阪櫻花／松本山雅', '2025正式加盟；2026春外借松本，6月27日結束借用回歸。')];
  p.honors = ['2014 全日本少年足球大會冠軍：大阪櫻花U-12。（Cerezo生涯訪問／cerezo.jp）', '2024 關東大學甲組聯賽冠軍：明治大學22輪無敗；上林以副隊長身份談及全隊達成少於20失球目標。（2024-11-28 明大スポーツ／meisupo.net）'];
  p.milestones = ['2020-09-27 首次J.League上陣，代表大阪櫻花U-23對YS橫濱；該季J3共7場。（J.League／jleague.jp）', '2024-04-11 獲公布2025回巢內定，完成經大學重返青訓母會的路線。（Cerezo官方／cerezo.jp）', '2023-03-21 以全日本大學選拔正選門將身份1比0勝韓國大學選拔。（JFA正式紀錄／jfa.jp）', '2026-06-27 松本官方確認租借期結束；不把2026松本上陣誤稱為生涯J.League處子戰。（松本山雅／yamaga-fc.com）'];
  p.tactical_traits = ['撲救準備講求接球手形及預先站位；大學一年級末段失誤後，他特別重視每一次射門的處理，而非只追求精彩救球。（2022-05-03 萩原亜依／4years.asahi.com）', '2025加盟記者會本人把高空球處理及在進攻型足球中救險列為武器；這是球員自評，並非已證實的J1排名。（2025-01-09 日刊スポーツ／nikkansports.com）', '重視指揮後衛先收窄射門角度，也把令隊友願意共同守住球門的溝通視為能力之一。（2024-04-29 明大スポーツ／meisupo.net）'];
  p.tactical_sources = [s.feature, s.debut, s.interview];
  p.quirky_trivia = '他由奈良往青訓訓練，單程約一個半小時，連續八年往返；高中未獲直升時沒有轉向其他球會，而是把明治四年當成爭取櫻花再一次邀請的機會。（本人訪問，2024-04-29 明大スポーツ／meisupo.net）';
  p.national_team_detail = '2023全日本大學選拔：3月日韓定期戰正選並零封；9月亦參與日韓定期戰。此為大學選拔，不等同成年日本國家隊。J.League現行頁列成年代表0場；青年／大學累計出場未有完整可靠總數，不填估算。（JFA、JUFA、J.League）';
  p.season_stats = [stat('2025', 'J1', 0, 0, [s.wiki, s.league]), stat('2026特別', 'J2・J3百年構想聯賽（松本山雅）', 1, 0, [s.league, s.return]), stat('2026/27', 'J1', 0, 0, [s.league], '官方頁更新2026-10-23；並非以歷史表橫線推斷。')];
}

{
  const p = club.players.find(p => p.number === '2'), s = defs['2'];
  p.player_image = 'https://images.microcms-assets.io/assets/cc125679249b4055b70b8d540ec6636a/099276029f384bcda67258291e9fc89d/02-260704_1875.webp';
  p.player_image_source = s.official;
  p.prev_club = '橫濱FC';
  p.birthplace = '大分縣大分市';
  p.intro = '右腳後衛，真正育成路線是大分三神U-12、U-15及東福岡高中，並非FC東京青訓。2019由高中加盟FC東京，先在U-23踢21場J3，之後兩季在J1累積35場；2022轉橫濱FC，再於2025加盟櫻花。（横浜FC 2024-12-20轉會公告；J.League逐季表）傳中與多變腳法是主要進攻資產，橫濱年代亦累積右中堅經驗。（北健一郎、渡邉知晃／yokohamafc.com；Cerezo 2026-08-07訪問）';
  p.career = [youth(null, '大分三神足球學校', 'U-12選拔前已參加球會足球學校；確切年份未知。', [s.official]), youth('2010-2012', '大分三神U-12', '年份依J.League逐季履歷；不填青年出場總數。', [s.league]), youth('2013-2015', '大分三神U-15', '中學後選擇東福岡，而非升上大分U-18。', [s.league, s.official]), youth('2016-2018', '東福岡高中', '2018：全國高校總體賽優秀選手；同年獲FC東京內定。', [s.league, s.jfa]), row('2019', 'FC東京', 'J1', 0, 0, '正式加盟', '橫濱FC官方轉會表明列0；聯賽盃另有3場，不混入聯賽數字。', [s.former]), row('2019', 'FC東京U-23', 'J3', 21, 0, '同期U-23出賽', '不是另一筆租借轉會；與一隊J1分開。', [s.former, s.league]), ...[[2020,17],[2021,18]].map(([y,a])=>row(String(y),'FC東京','J1',a,0,'正式球員','聯賽數字；不含ACL及聯賽盃。',[s.former,s.league])), ...[[2022,'J2',32],[2023,'J1',11],[2024,'J2',26]].map(([y,c,a])=>row(String(y),'橫濱FC',c,a,0,'完全移籍',y===2023?'該季聯賽盃及天皇盃另有入球，不能記入J1聯賽。':'',[s.former,s.league])), row('2025','大阪櫻花','J1',2,0,'完全移籍','2024-12-20公布從橫濱FC加盟；非直接由FC東京轉來。',[s.former,s.league]), row('2026特別','大阪櫻花','J1百年構想聯賽',2,0,'正式球員','春季特別賽事與2026/27分開。',[s.league]), row('2026/27','大阪櫻花','J1',5,0,'正式球員','官方現季匯總5場0球；歷史球季表未填，不把其橫線當作零。',[s.league])];
  p.career_audit.notes = ['刪除沒有事實依據的FC東京Academy履歷；大分足球學校是比U-12更早的具名機構。', '2019一隊J1及U-23 J3分列；2023盃賽入球不挪入J1。', '現季以J.League現季匯總5場為準，另記頁面更新日；永久履歷不保留無時點的跑動排名。'];
  p.timeline = [timeline('2010-2018','大分三神青訓／東福岡高中','大分育成後選擇高中路線；高三的サニックス盃成為獲職業球會注意的轉折。'), timeline('2019-2021','FC東京','2019在U-23磨練；2020、2021各在J1上陣17、18場。'), timeline('2022-2024','橫濱FC','嘗試三後衛右側中堅；三季聯賽69場。'), timeline('2025-','大阪櫻花','正式轉會加盟；之前球會為橫濱FC。')];
  p.honors = ['2018 全國高校總體賽優秀選手：東福岡高中。（JFA賽會正式名單／jfa.jp）', '2020 J.League Cup冠軍隊成員：FC東京；該屆盃賽出場1次，並非聲稱踢足決賽。（日文生涯索引／ja.wikipedia.org；J.League逐季表）'];
  p.milestones = ['2019 職業第一年代表FC東京U-23踢21場J3，與一隊盃賽經驗並存。（横浜FC轉會公告／yokohamafc.com）', '2020-2021 FC東京J1合共35場；室屋成離隊後得到更多右閘競爭機會。（J.League；Cerezo 2026-08-07生涯訪問）', '2024-12-20 由横浜FC公布完全轉會櫻花，結束三年效力。（横浜FC官方／yokohamafc.com）'];
  p.tactical_traits = ['善用準確且多樣的傳中，與前插時機配合；FC東京官方亦把持續上下走動及可兼踢防中列為特點。（2021 FC東京官方球員頁／fctokyo.co.jp）', '腳法由向佐藤由紀彦加操學習發展，會先辨認空間，再按落點反推踢法；這解釋了他的傳球選擇，並非只靠直線速度。（北健一郎、渡邉知晃／横浜FC官方專訪，未列原刊日期；yokohamafc.com）', '2022在横浜FC踢三後衛右側，既可參與進攻也須保留中堅的防守責任；櫻花2026新體系中，他自述翼衛能更前移，教練要求持球突破及傳中。（2026-08-07 Cerezo生涯訪問／cerezo.jp）'];
  p.tactical_sources = [s.tokyo, s.feature, s.official];
  p.quirky_trivia = '他是三兄弟中的次子，一歲年長的哥哥駿既是偶像，亦曾是東福岡右閘位置的競爭者。中學還兼練驛傳，甚至有田徑強校招攬；但他最後選擇足球。（北健一郎、渡邉知晃／横浜FC官方專訪，原頁未列日期；yokohamafc.com）';
  p.national_team_detail = '有日本U-17至U-20層級經歷；已交叉查2019年U-18的AFC U-19錦標賽外圍賽名單及同年3月U-20歐洲遠征名單。這些屬青年代表，不能稱為成年國腳或U-20世界盃決賽週經歷。成年日本隊0場；青年各級完整總數未確立。（JFA官方；J.League更新2026-10-23）';
  p.season_stats = [stat('2024','J2（橫濱FC）',26,0,[s.former]),stat('2025','J1',2,0,[s.league]),stat('2026特別','J1百年構想聯賽',2,0,[s.league]),stat('2026/27','J1',5,0,[s.league],'現季匯總，更新2026-10-23 06:15。')];
}

{
  const p = club.players.find(p => p.number === '4'), s = defs['4'];
  p.player_image = 'https://images.microcms-assets.io/assets/cc125679249b4055b70b8d540ec6636a/cafea0dbb9014558b420e3987c7a5d1f/04-260704_0981.webp';
  p.player_image_source = s.official;
  p.birthplace = '島根縣松江市';
  p.intro = '右腳中堅，2015從鹿兒島實業高中走進鳥取，經J3六季、岡山J2一季，再到京都站穩J1，是逐級向上的例子。2021在岡山踢足全部42場，之後兩年京都各上陣28場；2024赴浦和面對更激烈競爭，2025年7月31日轉到櫻花。（J.League逐季表；2022-01-15 サッカーマガジン／soccermagazine.jp；Cerezo轉會公告）閱讀危險、封阻射門及補位是其本人強調的技術重點。';
  p.career = [youth(null,'雑賀JSCキッカーズ','小學低年級的最初足球隊；起訖年未確立。',[s.official,s.wiki]),youth(null,'玉湯SC','小三轉入；小四已參與高年級全國賽，年期不按年齡倒算。',[s.official,s.wiki]),youth(null,'野洲JFC','父親調職至滋賀後曾短暫效力，不能遺漏在RESTA前的這一站。',[s.official]),youth(null,'RESTA FC','小五末轉入，之後經鹿兒島實業；不虛構少年賽數字。',[s.official,s.wiki,roster]),youth('2012-2014','鹿兒島實業高中','高中日期依J.League逐季表。',[s.league]),...[[2015,8,0],[2016,0,0],[2017,14,1],[2018,30,2],[2019,34,1],[2020,34,3]].map(([y,a,g])=>row(String(y),'鳥取飛翔','J3',a,g,'正式球員',y===2016?'2016聯賽零上陣有2026年10月舊會戰報道明文；官方逐季表為橫線。':'',[s.league,...(y===2016?[s.roots]:[])])),row('2021','岡山綠雉','J2',42,0,'完全移籍','全部42場踢足，為該季僅三位全勤全場球員之一；中堅位置唯一。',[s.league,s.feature]),row('2022','京都不死鳥','J1',28,1,'完全移籍','首個J1球季；升降班附加賽不計入28場聯賽。',[s.league]),row('2023','京都不死鳥','J1',28,0,'正式球員','',[s.league]),row('2024','浦和紅鑽','J1',16,0,'完全移籍','',[s.league]),row('2025','浦和紅鑽','J1',2,0,'季中轉出','2025-07-31轉會櫻花。',[s.league,s.former]),row('2025','大阪櫻花','J1',9,0,'完全移籍','同年兩隊分列；不合併成單一球會。',[s.league,s.move]),row('2026特別','大阪櫻花','J1百年構想聯賽',18,2,'正式球員','春季特別賽事。',[s.league]),row('2026/27','大阪櫻花','J1',11,0,'正式球員','現季匯總截至2026-10-23 06:15；11場全部正選踢足。',[s.league])];
  p.career_audit.notes = ['最早四個具名少年隊分開保留，加入野洲JFC；不把只記RESTA的聯賽名冊當作完整幼年路線。','2016明文零上陣用報道確認，沒有從橫線直接推算。','2025浦和與櫻花的季中轉會分列；2026春及2026/27分列。'];
  p.timeline = [timeline('2015-2020','鳥取飛翔','入職業前的海外計劃未能成事；鳥取在開季前給予機會，首兩年8場、0場後逐步成主力。（サッカーマガジン2026年10月舊會戰報道）'),timeline('2021','岡山綠雉','J2全部42場全場上陣，一年後升到J1舞台。'),timeline('2022-2023','京都不死鳥','連續兩季各28場J1，累積高級別比賽經驗。'),timeline('2024-2025','浦和紅鑽／大阪櫻花','先到浦和挑戰競爭，再於2025-07-31季中轉會櫻花。')];
  p.honors = ['2021 J2全42場全場出賽：該季全聯賽只有三人達成，中堅中僅井上一人。屬出場紀錄，並非虛構個人獎項。（2022-01-15 サッカーマガジン／soccermagazine.jp）'];
  p.milestones = ['2015-05-17 鳥取對YS橫濱首次J.League上陣；2017-08-26對相模原取得首個聯賽入球。（J.League官方／jleague.jp）','2021 在岡山全勤踢足42輪，隨後獲京都邀請，完成J3→J2→J1三級上升。（J.League；2022-01-15 サッカーマガジン／soccermagazine.jp）','2025-07-31 完全轉會櫻花；同季浦和2場、櫻花9場J1分別記錄。（Cerezo／浦和官方；J.League）'];
  p.tactical_traits = ['自評最有把握的是射門封阻及補位，升J1時認為必須再提升閱讀及危機察覺，避免只能在最後一刻救火。（2022-01-15 サッカーマガジン訪問／soccermagazine.jp）','防守習慣偏向少領牌、以乾淨處理完成任務；他同時承認個別局面應更果斷阻止對手，這是本人對防守風險的檢討。（2022-01-15 サッカーマガジン／soccermagazine.jp）','180cm的中堅並不把自己定位為單靠身高或極速取勝，目標是把各項能力一起提高；2021全季踢足證明其穩定性，而非證明每項技術都頂尖。（2022-01-15 サッカーマガジン／soccermagazine.jp）'];
  p.tactical_sources = [s.feature];
  p.quirky_trivia = '祖母是西班牙人，他說西班牙語比英語較容易聽懂；京都時期對神戶賽後，曾用西班牙語跟恩尼斯達說話。這是本人回憶的家庭及語言故事，不代表其持有西班牙國籍或已精通西語。（2025-08-20 スポニチ／sponichi.co.jp）';
  p.national_team_detail = 'J.League現行資料列成年日本代表0場。查閱球會完整生涯訪問、J.League與日文生涯索引，未確立青年國家隊正式出場紀錄；不把前教練的代表資歷或搜尋結果內其他球員的代表史套用到他身上。';
  p.season_stats = [stat('2025','J1（浦和紅鑽）',2,0,[s.league]),stat('2025','J1（大阪櫻花）',9,0,[s.league]),stat('2026特別','J1百年構想聯賽',18,2,[s.league]),stat('2026/27','J1',11,0,[s.league],'官方現季逐場表11次正選，每場90分鐘；更新2026-10-23 06:15。')];
}

{
  const p = club.players.find(p => p.number === '6'), s = defs['6'];
  p.player_image = 'https://images.microcms-assets.io/assets/cc125679249b4055b70b8d540ec6636a/8da8acbb8ec94f50b764e817fa1c8097/06-260704_0344.webp';
  p.player_image_source = s.official;
  p.birthplace = '大阪府東大阪市';
  p.intro = '左腳左閘，2009至2023為川崎上陣280場J1，四奪聯賽、兩奪天皇盃及一次聯賽盃；2024選擇回大阪，加盟童年曾支持的櫻花。（2024-01-06 Cerezo／川崎官方；2025-11-28 本田健介／Soccer Digest）早年以高速翼鋒起步，後來藉站位及與隊友互補，成為可進入中路組織的左閘。2020入選J.League最佳十一人，是其角色成熟的具體標記。';
  p.career = [youth(null,'クサカSS','幼年起至小五的本地少年隊，未找到完整公曆起訖年。',[s.official,s.former]),youth(null,"EXE '90FC Junior",'小五途中轉入；就讀孔舎衙東小學，學校名稱不是另一次轉隊。',[s.former,s.human]),youth('2003-2005',"EXE '90FC",'初中就讀孔舎衙中學；與小學部隊伍分列。',[s.league,s.wiki,s.former]),youth('2006-2008','香川西高中','高中足球；2009開始職業生涯。',[s.league,s.wiki]),...[[2009,2,1],[2010,9,0],[2011,19,2],[2012,16,2],[2013,29,0],[2014,19,1],[2015,1,0],[2016,14,0],[2017,23,1],[2018,25,0],[2019,27,0],[2020,29,0],[2021,29,0],[2022,12,0],[2023,26,2]].map(([y,a,g])=>row(String(y),'川崎前鋒','J1',a,g,'正式球員',y===2015?'膝傷與2015-04-30手術令該季僅1場；只描述當年，不作現時傷停依據。':y===2020?'J.League最佳十一人；盃賽統計不混入聯賽。':'',[s.league,s.former,...(y===2015?[s.injury]:[])])),row('2024','大阪櫻花','J1',19,0,'完全移籍','2024-01-06公布加盟。',[s.league,s.move]),row('2025','大阪櫻花','J1',14,0,'正式球員','',[s.league]),row('2026特別','大阪櫻花','J1百年構想聯賽',6,1,'正式球員','春季特別賽事，不加進2026/27。',[s.league]),row('2026/27','大阪櫻花','J1',2,0,'正式球員','兩次後備：8月15日6分鐘、8月22日1分鐘；截至2026-10-23 06:15。',[s.league])];
  p.career_audit.notes = ['クサカSS及EXE小學部保留獨立無年份列；兩所學校為所就讀學校，沒有當作另一次足球轉會。','2009至2023逐季相加280場9球，與轉會公告一致；職業15季沒有合併。','川崎2023球員頁的2020聯賽盃出場欄列2，但該頁出場分鐘表列4、J.League亦列4；本批只採一致的聯賽29場，沒有把盃賽衝突值寫入正式統計。'];
  p.timeline = [timeline('2003-2008',"EXE '90FC／香川西高中",'青少年階段打磨技術及速度，2009由高中進入川崎。'),timeline('2009-2016','川崎前鋒','高速翼鋒逐步改踢左閘；2015膝傷後走過長期康復。'),timeline('2017-2023','川崎前鋒','黃金時代四次J1冠軍，2020最佳十一人；15季J1合共280場。'),timeline('2024-','大阪櫻花','帶着冠軍經驗回大阪，強調場內外共同建立爭標環境。')];
  p.honors = ['J1冠軍4次：2017、2018、2020、2021（川崎前鋒）。（日文生涯年份索引；2025-11-28 Soccer Digest確認四次／soccerdigestweb.com）','天皇盃冠軍2次：2020、2023；J.League Cup冠軍：2019（川崎前鋒）。（日文生涯年份索引；2025-11-28 Soccer Digest確認總數）','2020 J.League最佳十一人；2021 J1優秀選手賞。（J.League官方獎項欄／jleague.jp）','2010 廣州亞運男子足球金牌隊成員：日本奧委會正式名單包含登里。（2010-11-25 JOC／joc.or.jp）'];
  p.milestones = ['2009-06-20 對大分完成J1首戰；同年10月25日對廣島取得首個J1入球。（J.League；川崎官方歷年紀錄）','2015-04-30 左膝半月板手術，該季J1只上陣1次；復出過程成為生涯重要轉折。（2016年10月 原田大輔／川崎F-SPOT；frontale.co.jp）','2020 聯賽29場並獲最佳十一人，反映其左閘角色已由速度突破發展到位置與組織。（J.League；川崎2020年3月專訪）','2024-01-06 公布離開效力15年的川崎加盟櫻花；離隊時J1為280場9球。（川崎／Cerezo官方）'];
  p.tactical_traits = ['會觀察己方翼鋒是否拉邊牽制對方閘位，再決定自己進入中路接應；位置選擇是為隊友製造空間，而非每次都疊瓦。（2020年3月 川崎F-SPOT專訪／frontale.co.jp）','內收不只有持球作用：他解釋中路隊友距離較近，失球後能較快反搶，亦可縮窄對手發動反擊的空間。（2020年3月 川崎F-SPOT／frontale.co.jp）','曾是縱向爆破翼鋒，成熟後更注重引出對方防守者、支援翼鋒以其擅長節奏突破；2024在櫻花亦以內收左閘成為控球一環。（2020年3月 川崎F-SPOT；2025-11-28 本田健介／Soccer Digest）'];
  p.tactical_sources = [s.tactics,s.feature];
  p.quirky_trivia = '大阪出身卻從高中起長期離鄉。2024專訪中他談到，選擇櫻花亦看重香川真司等長期為球會付出的隊友，盼與他們一起帶來冠軍；這是他解釋加盟動機的本人訪問。（2024-03-30 竹中玲央奈／OSAKA SPORTS GROOVE，note.com）';
  p.national_team_detail = '日本U-20、U-21、U-22、U-23層級經歷；2010廣州亞運金牌隊員，另有2009東亞運動會、2010土倫盃及2011倫敦奧運亞洲外圍賽經歷。不能把亞運／青年賽當作成年A級國際賽；成年日本代表0場。（川崎官方2023球員頁；JOC；J.League現行頁）';
  p.season_stats = [stat('2023','J1（川崎前鋒）',26,2,[s.league,s.former]),stat('2024','J1',19,0,[s.league]),stat('2025','J1',14,0,[s.league]),stat('2026特別','J1百年構想聯賽',6,1,[s.league]),stat('2026/27','J1',2,0,[s.league],'兩次後備合共7分鐘；更新2026-10-23 06:15。')];
}

{
  const p = club.players.find(p => p.number === '1');
  const recall = source('Cerezo官方：上林豪由松本復歸及累計上陣確認', 'https://www.cerezo.jp/news/2026-0627-1300/', '2026-06-27');
  const injury = source('松本山雅官方：上林豪5月6日受傷、左肩脫臼及擬手術', 'https://www.yamaga-fc.com/archives/545793', '2026-05-22');
  p.sources.push(recall, injury);
  p.identity_sources.push(recall);
  p.career.find(r => r.season === '2026/27').sources.push(recall);
  const loan = p.career.find(r => r.season === '2026特別');
  loan.notes = '5月6日對岐阜首次代表松本出賽；5月22日球會公告該仗左肩脫臼並擬手術。6月27日借用期結束。這是當年傷病紀錄，不代表目前仍未康復。';
  loan.sources.push(injury, recall);
  p.milestones.push('2026-05-06 對岐阜左肩脫臼；松本5月22日公告擬進行手術。保留受傷及公告兩個日期，不推斷2026/27的可用狀態。（松本山雅官方／yamaga-fc.com）');
  // Zero senior appearances in these mixed seasons is independently explicit in the career map.
  for (const r of p.career.filter(r => ['2019','2020'].includes(r.season) && r.team === '大阪櫻花')) {
    r.appearances = 0; r.goals = 0; r.sources.push(defs['1'].wiki);
    r.notes = '日文生涯敘述明確指一隊沒有出場；官方歷年表是橫線，零值並非單從橫線推算。';
  }
  const unused = p.career.find(r => r.season === '2019' && r.team === '大阪櫻花U-23');
  unused.appearances = 0; unused.goals = 0; unused.sources.push(defs['1'].wiki);
  unused.notes = '日文生涯表註明2019一隊及U-23均無上陣；不是從官方表的橫線推算。';
}
for (const [number, minutes] of [['2',381],['4',990],['6',7]]) {
  const last = club.players.find(p => p.number === number).season_stats.find(r => r.season === '2026/27');
  last.minutes = minutes;
  last.assists = 0;
}
// The U-18 affiliations in 2019/2020 overlap senior registration; keep individual years.
for (const r of club.players.find(p => p.number === '1').career) {
  if (r.team === '大阪櫻花U-18' && ['2019', '2020'].includes(r.season)) {
    r.competition = 'Youth / mixed J1 registration';
    r.status = 'U-18及一隊二種同期登錄';
  }
}
// Keep all 25 other cards, the authoritative supplied names, and other batches intact.
writeFileSync(path, JSON.stringify(club, null, 2) + '\n', 'utf8');
console.log('Updated cerezo-osaka-01: 1, 2, 4, 6');
