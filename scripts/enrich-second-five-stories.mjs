import fs from 'node:fs';

const standings = {
  'data/clubs/yokohama-fm.json': { rank: 6, points: 14, matches: 8, wins: 4, draws: 2, losses: 2, goals_for: 13, goals_against: 9, goal_difference: 4 },
  'data/clubs/kawasaki.json': { rank: 7, points: 13, matches: 8, wins: 3, draws: 4, losses: 1, goals_for: 16, goals_against: 12, goal_difference: 4 },
  'data/clubs/kashima.json': { rank: 8, points: 13, matches: 8, wins: 4, draws: 1, losses: 3, goals_for: 17, goals_against: 16, goal_difference: 1 },
  'data/clubs/okayama.json': { rank: 9, points: 13, matches: 8, wins: 4, draws: 1, losses: 3, goals_for: 11, goals_against: 10, goal_difference: 1 },
  'data/clubs/urawa.json': { rank: 10, points: 12, matches: 8, wins: 4, draws: 0, losses: 4, goals_for: 16, goals_against: 18, goal_difference: -2 }
};

const updates = {
  'data/clubs/yokohama-fm.json': {
    '8': [
      {
        text: '喜田拓也由橫濱水手青訓升上一隊，2012年至今從未轉投其他職業球會；截至2026年8月已累積超過300場聯賽上陣，是名單中最鮮明的「一人一會」故事。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Takuya Kida', url: 'https://en.wikipedia.org/wiki/Takuya_Kida', published_at: null }
      },
      {
        text: '他曾參加2011年U17世界盃及2014年亞運，並隨橫濱水手贏得2019、2022年J1冠軍；2019年亦入選J.League最佳十一人。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Takuya Kida', url: 'https://en.wikipedia.org/wiki/Takuya_Kida', published_at: null }
      }
    ],
    '23': [
      {
        text: '宮市亮18歲便加盟Arsenal，其後外借Feyenoord、Bolton、Wigan及Twente，再於德國聖保利效力六年；職業路線橫跨英格蘭、荷蘭與德國。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Ryō Miyaichi', url: 'https://en.wikipedia.org/wiki/Ry%C5%8D_Miyaichi', published_at: null }
      },
      {
        text: '他職業生涯曾三度前十字韌帶重創，但仍能回到J1並取得單場最佳球員；介紹他時，「速度天才」以外，更重要是反覆復出的韌性。',
        reliability: 'reported',
        source: { label: 'J.League International：宮市亮賽後訪問', url: 'https://www.facebook.com/jleagueofficial.English/videos/ryo-miyaichis-interview-after-man-of-the-match/787048469592672/', published_at: null }
      }
    ]
  },
  'data/clubs/kawasaki.json': {
    '14': [
      {
        text: '脇坂泰斗在2025亞冠精英聯賽八強加時射入決勝球，帶領川崎首次闖入賽事四強；該球是其隊長身份與大賽決斷力的重要切入點。',
        reliability: 'reported',
        source: { label: 'Reuters：Kawasaki reach ACL Elite semi-finals', url: 'https://www.reuters.com/sports/soccer/kawasakis-hasebe-determined-fly-east-asian-flag-face-saudi-dominance-2025-04-28/', published_at: '2025-04-28' }
      }
    ],
    '17': [
      {
        text: '伊藤達哉在2025亞冠精英聯賽四強對C朗拿度領軍的Al-Nassr先開紀錄，並參與策動第二球；賽後形容與對方球星交手「像在打電子遊戲」。',
        reliability: 'confirmed',
        source: { label: 'Reuters：Ito on facing Ronaldo', url: 'https://www.reuters.com/sports/soccer/facing-ronaldo-like-video-game-says-kawasakis-asian-champions-league-hero-ito-2025-04-30/', published_at: '2025-04-30' }
      }
    ],
    '41': [
      {
        text: '家長昭博早年由大阪飛腳出道，曾赴西班牙效力Mallorca；轉投川崎後成為球會黃金年代核心，隨隊四奪J1冠軍。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Akihiro Ienaga', url: 'https://en.wikipedia.org/wiki/Akihiro_Ienaga', published_at: null }
      },
      {
        text: '2025亞冠精英聯賽四強，他後備上陣後射入川崎第三球，協助球隊以3比2淘汰Al-Nassr；這是老將在高壓大賽改變戰局的具體例子。',
        reliability: 'reported',
        source: { label: 'Reuters：Kawasaki beat Al-Nassr', url: 'https://www.reuters.com/sports/soccer/underdogs-kawasaki-down-ronaldos-al-nassr-book-asian-final-berth-2025-04-30/', published_at: '2025-04-30' }
      }
    ]
  },
  'data/clubs/kashima.json': {
    '10': [
      {
        text: '柴崎岳在2016世界冠軍球會盃決賽對皇家馬德里梅開二度，鹿島最終加時落敗，但他憑賽事表現獲得銅球獎。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Gaku Shibasaki', url: 'https://en.wikipedia.org/wiki/Gaku_Shibasaki', published_at: null }
      },
      {
        text: '旅西期間，他先後效力Tenerife、Getafe、Deportivo La Coruña及Leganés；其中代表Getafe對Barcelona射入一記窩利，是其西甲生涯最常被重播的畫面。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Gaku Shibasaki', url: 'https://en.wikipedia.org/wiki/Gaku_Shibasaki', published_at: null }
      }
    ],
    '40': [
      {
        text: '鈴木優磨7歲加入鹿島青訓，2018亞冠決賽階段攻入兩球，協助球會首奪亞洲冠軍，並當選該屆賽事最有價值球員。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Yuma Suzuki', url: 'https://en.wikipedia.org/wiki/Yuma_Suzuki', published_at: null }
      },
      {
        text: '他在比利時Sint-Truiden三季累積67場聯賽26球後回歸鹿島；屬少數外流後回到母會、再成為進攻領袖的日本前鋒。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Yuma Suzuki', url: 'https://en.wikipedia.org/wiki/Yuma_Suzuki', published_at: null }
      }
    ]
  },
  'data/clubs/okayama.json': {
    '8': [
      {
        text: '江坂任的大學畢業後職業起點是J2群馬；首個球季42場入13球，其後逐級走到大宮、柏、浦和，再到韓國蔚山。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Ataru Esaka', url: 'https://en.wikipedia.org/wiki/Ataru_Esaka', published_at: null }
      },
      {
        text: '他曾隨浦和贏得2021天皇盃及2022亞冠，轉戰蔚山後又連贏兩屆K League 1；日本與韓國兩地的冠軍經驗，是岡山陣中少見的履歷。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Ataru Esaka', url: 'https://en.wikipedia.org/wiki/Ataru_Esaka', published_at: null }
      }
    ],
    '10': [
      {
        text: '羅相浩在2018年同時成為K League 2神射手及最有價值球員；他亦曾效力FC東京、城南及FC首爾，熟悉日韓兩地聯賽。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Na Sang-ho', url: 'https://en.wikipedia.org/wiki/Na_Sang-ho', published_at: null }
      },
      {
        text: '他在2020年季中外借城南後成為隊內神射手，協助球隊護級；這段經歷可用來說明他不只是一名邊路突破手，也能承擔直接入球責任。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Na Sang-ho', url: 'https://en.wikipedia.org/wiki/Na_Sang-ho', published_at: null }
      }
    ]
  },
  'data/clubs/urawa.json': {
    '1': [
      {
        text: '西川周作在2023年J1全數34場正選，錄得聯賽最多的15場不失球，並憑多次關鍵撲救入選年度最佳十一人。',
        reliability: 'confirmed',
        source: { label: 'J.League International：2023 Best XI－Shusaku Nishikawa', url: 'https://www.youtube.com/watch?v=Vu-YJqXSAHo', published_at: '2023-12-17' }
      },
      {
        text: '他先後效力大分、廣島及浦和，亦為日本代表上陣31次；截至2025年已為浦和累積超過400場聯賽上陣。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Shūsaku Nishikawa', url: 'https://en.wikipedia.org/wiki/Sh%C5%ABsaku_Nishikawa', published_at: null }
      }
    ],
    '10': [
      {
        text: 'Matheus Sávio出身Flamengo青訓，2019年加盟柏後長期擔任進攻核心；其履歷連結巴西傳統名門與J.League兩種足球環境。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Matheus Sávio', url: 'https://en.wikipedia.org/wiki/Matheus_S%C3%A1vio', published_at: null }
      }
    ]
  }
};

for (const [file, table] of Object.entries(standings)) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(data.team.current_season, table, { as_of: '2026-09-19' });
  for (const [number, trivia] of Object.entries(updates[file])) {
    const player = data.players.find((candidate) => String(candidate.number) === number);
    if (!player) throw new Error(`Missing #${number} in ${file}`);
    player.trivia = trivia;
  }
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}
