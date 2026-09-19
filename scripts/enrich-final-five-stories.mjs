import fs from 'node:fs';

const standings = {
  'data/clubs/gamba-osaka.json': { rank: 16, points: 6, matches: 7, wins: 1, draws: 3, losses: 3, goals_for: 8, goals_against: 13, goal_difference: -5 },
  'data/clubs/nagoya.json': { rank: 17, points: 6, matches: 8, wins: 2, draws: 0, losses: 6, goals_for: 7, goals_against: 14, goal_difference: -7 },
  'data/clubs/fukuoka.json': { rank: 18, points: 4, matches: 8, wins: 1, draws: 1, losses: 6, goals_for: 9, goals_against: 12, goal_difference: -3 },
  'data/clubs/tokyo-verdy.json': { rank: 19, points: 4, matches: 8, wins: 0, draws: 4, losses: 4, goals_for: 4, goals_against: 12, goal_difference: -8 },
  'data/clubs/chiba.json': { rank: 20, points: 4, matches: 8, wins: 1, draws: 1, losses: 6, goals_for: 7, goals_against: 18, goal_difference: -11 }
};

const updates = {
  'data/clubs/gamba-osaka.json': {
    '7': [
      {
        text: '宇佐美貴史17歲14日便為大阪飛腳一隊處子上陣兼入球，當時同時刷新球會最年輕上陣及最年輕入球紀錄。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Takashi Usami', url: 'https://en.wikipedia.org/wiki/Takashi_Usami', published_at: null }
      },
      {
        text: '他曾兩度外流德國，先後效力Bayern Munich、Hoffenheim、Augsburg及Fortuna Düsseldorf；在日本則是飛腳2014年本土三冠的重要成員。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Takashi Usami', url: 'https://en.wikipedia.org/wiki/Takashi_Usami', published_at: null }
      }
    ]
  },
  'data/clubs/nagoya.json': {
    '15': [
      {
        text: '稻垣祥由日本體育大學出身，經甲府及廣島後於2020年加盟名古屋；截至2026年8月已為名古屋累積超過200場聯賽上陣。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Sho Inagaki', url: 'https://en.wikipedia.org/wiki/Sho_Inagaki', published_at: null }
      },
      {
        text: '他2021年首次代表日本對蒙古即梅開二度；2025年東亞盃再對香港入球，並隨日本奪冠。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Sho Inagaki', url: 'https://en.wikipedia.org/wiki/Sho_Inagaki', published_at: null }
      }
    ]
  },
  'data/clubs/fukuoka.json': {
    '10': [
      {
        text: '城後壽2005年由國見高校加盟福岡黃蜂後從未轉會，是現役名單中罕見超過20年只效力同一間職業球會的「一人一會」代表。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Hisashi Jogo', url: 'https://en.wikipedia.org/wiki/Hisashi_Jogo', published_at: null }
      },
      {
        text: '截至2025年9月，他已累積498場聯賽上陣及84球；由前鋒、中場到隊長身份，個人職業生涯幾乎就是福岡近代升降史的縮影。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Hisashi Jogo', url: 'https://en.wikipedia.org/wiki/Hisashi_Jogo', published_at: null }
      }
    ]
  },
  'data/clubs/tokyo-verdy.json': {
    '9': [
      {
        text: '染野唯月出身鹿島青訓，2022年季中開始外借東京綠茵；多次借用合共為綠茵在聯賽取得17球後，2025年正式轉會。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Itsuki Someno', url: 'https://en.wikipedia.org/wiki/Itsuki_Someno', published_at: null }
      },
      {
        text: '他在2023年J1升班附加賽亦有上陣及入球，之後2024年首次以綠茵球員身份完成整季J1；其成長軌跡與球會重返頂級聯賽直接相連。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Itsuki Someno', url: 'https://en.wikipedia.org/wiki/Itsuki_Someno', published_at: null }
      }
    ]
  },
  'data/clubs/chiba.json': {
    '99': [
      {
        text: '艾利臣18歲前仍在巴西參加業餘賽事，其後才加入XV de Piracicaba青訓；這是一條比一般職業球員起步更遲的發展路線。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Erison', url: 'https://en.wikipedia.org/wiki/Erison_(footballer)', published_at: null }
      },
      {
        text: '他來日前先後效力Botafogo、外借葡萄牙Estoril及São Paulo；2024至2026年為川崎前鋒，轉投千葉前已累積69場聯賽26球。',
        reliability: 'reported',
        source: { label: 'Wikipedia：Erison', url: 'https://en.wikipedia.org/wiki/Erison_(footballer)', published_at: null }
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
