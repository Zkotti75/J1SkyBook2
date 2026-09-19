import fs from 'node:fs';

const standings = {
  'data/clubs/cerezo-osaka.json': { rank: 11, points: 11, matches: 8, wins: 3, draws: 2, losses: 3, goals_for: 7, goals_against: 12, goal_difference: -5 },
  'data/clubs/shimizu.json': { rank: 12, points: 10, matches: 8, wins: 3, draws: 1, losses: 4, goals_for: 6, goals_against: 8, goal_difference: -2 },
  'data/clubs/mito.json': { rank: 13, points: 9, matches: 8, wins: 2, draws: 3, losses: 3, goals_for: 11, goals_against: 11, goal_difference: 0 },
  'data/clubs/kyoto.json': { rank: 14, points: 8, matches: 8, wins: 2, draws: 2, losses: 4, goals_for: 11, goals_against: 15, goal_difference: -4 },
  'data/clubs/nagasaki.json': { rank: 15, points: 8, matches: 8, wins: 2, draws: 2, losses: 4, goals_for: 10, goals_against: 15, goal_difference: -5 }
};

const updates = {
  'data/clubs/cerezo-osaka.json': {
    '8': [
      {
        text: '香川真司效力Manchester United期間，成為首位在英超上演帽子戲法的亞洲球員，亦是首位贏得英超冠軍的日本球員。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Shinji Kagawa', url: 'https://en.wikipedia.org/wiki/Shinji_Kagawa', published_at: null }
      },
      {
        text: '他在Borussia Dortmund兩奪德甲冠軍；2012年德國盃決賽對拜仁慕尼黑更交出一入球一助攻，協助球隊完成本土雙冠。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Shinji Kagawa', url: 'https://en.wikipedia.org/wiki/Shinji_Kagawa', published_at: null }
      }
    ],
    '23': [
      {
        text: '中村航輔加盟大阪櫻花後，憑開季一記高難度撲救當選2026/27球季8月J1月間最佳撲救；評審特別指出其站位、細密步法及指尖改變皮球方向的技術。',
        reliability: 'confirmed',
        source: { label: 'J.League：2026/27年8月月間最佳撲救', url: 'https://www.jleague.jp/j1/monthly_awards/2026-27/08/best-save/', published_at: null }
      }
    ]
  },
  'data/clubs/shimizu.json': {
    '49': [
      {
        text: '北川航也由清水心跳青訓升上一隊，2018年J1取得32場13球；2019至2022年轉戰奧地利Rapid Wien後再回到母會。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Koya Kitagawa', url: 'https://en.wikipedia.org/wiki/Koya_Kitagawa', published_at: null }
      },
      {
        text: '他曾為日本大國腳上陣8次，亦是2019亞洲盃亞軍成員；由球會青訓、外流歐洲再回歸，是清水陣中最完整的「自家孩子」故事之一。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Koya Kitagawa', url: 'https://en.wikipedia.org/wiki/Koya_Kitagawa', published_at: null }
      }
    ]
  },
  'data/clubs/mito.json': {
    '10': [
      {
        text: '渡邉新太在2026年9月2日J1歷來首次茨城打吡對鹿島一人攻入四球；水戶其後推出「HATTRICK+1」紀念商品，四個入球時間亦印在設計上。',
        reliability: 'confirmed',
        source: { label: '水戶蜀葵：渡邉新太四球紀念商品', url: 'https://www.mito-hollyhock.net/news/p%3D54619/', published_at: '2026-09-17' }
      },
      {
        text: '球會2026年6月公布續約時，他在J1百年構想聯賽17場入4球，並已累積194場J2及46個J2入球；其職業路線由新潟青訓、流通經濟大學、新潟、大分再到水戶。',
        reliability: 'confirmed',
        source: { label: '水戶蜀葵：渡邉新太續約及履歷', url: 'https://www.mito-hollyhock.net/news/p%3D52195/', published_at: '2026-06-12' }
      }
    ]
  },
  'data/clubs/kyoto.json': {
    '7': [
      {
        text: '奧川雅也出身京都不死鳥青訓，2015年外流後先後效力Salzburg體系、Mattersburg、Holstein Kiel、Arminia Bielefeld、Augsburg及Hamburger SV，2025年才回歸母會。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Masaya Okugawa', url: 'https://en.wikipedia.org/wiki/Masaya_Okugawa', published_at: null }
      },
      {
        text: '他在2020年歐聯對拜仁慕尼黑攻入個人首個歐聯入球；其後效力Bielefeld時，曾在德甲連續四輪入球。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Masaya Okugawa', url: 'https://en.wikipedia.org/wiki/Masaya_Okugawa', published_at: null }
      }
    ],
    '9': [
      {
        text: '拉菲爾艾利亞斯2024年季中借用加盟京都，15場J1已攻入11球，隨即獲球會正式買斷；2025年再憑表現首度入選J.League最佳十一人。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Rafael Elias', url: 'https://en.wikipedia.org/wiki/Rafael_Elias', published_at: null }
      },
      {
        text: '他的巴西履歷由Palmeiras青訓開始，曾外借Atlético Mineiro、Goiás、Cuiabá及Ituano，亦到阿聯酋Baniyas效力，來日前屬典型多站式巴西前鋒生涯。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Rafael Elias', url: 'https://en.wikipedia.org/wiki/Rafael_Elias', published_at: null }
      }
    ]
  },
  'data/clubs/nagasaki.json': {
    '5': [
      {
        text: '山口螢由大阪櫻花青訓出身，曾短暫外流Hannover 96，之後效力神戶勝利船六季；其職業履歷橫跨櫻花、德甲、神戶及長崎。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Hotaru Yamaguchi', url: 'https://en.wikipedia.org/wiki/Hotaru_Yamaguchi', published_at: null }
      },
      {
        text: '他為日本大國腳上陣48次並攻入3球，參加過2014及2018世界盃；青年代表時期亦是2010亞運金牌隊成員。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Hotaru Yamaguchi', url: 'https://en.wikipedia.org/wiki/Hotaru_Yamaguchi', published_at: null }
      }
    ],
    '9': [
      {
        text: '泰亞高辛坦拿2022年效力清水心跳時，以27場14球成為J1神射手並入選最佳十一人；球隊當季降班，令這個個人獎項更顯突出。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Thiago Santana', url: 'https://en.wikipedia.org/wiki/Thiago_Santana', published_at: null }
      },
      {
        text: '來日前他在葡萄牙Santa Clara協助球隊升上頂級聯賽，其後一度成為球會葡超歷來入球最多的球員；日本生涯則先後效力清水、浦和及長崎。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Thiago Santana', url: 'https://en.wikipedia.org/wiki/Thiago_Santana', published_at: null }
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
