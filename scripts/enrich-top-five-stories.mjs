import fs from 'node:fs';

const updates = {
  'data/clubs/kobe.json': {
    '7': [
      {
        text: '井手口陽介在歐洲時期經歷傷患與出場不穩，但回到日本後重新成為重要中場。2025年亞冠精英聯賽對上海申花，他的入球經VAR改判有效，協助神戶取勝。',
        reliability: 'reported',
        source: {
          label: 'Reuters：神戶對上海申花賽事報道',
          url: 'https://www.reuters.com/sports/soccer/kobe-down-shenhua-2-0-move-clear-asian-champions-league-2025-11-26/',
          published_at: '2025-11-26'
        }
      }
    ],
    '10': [
      {
        text: '大迫勇也曾在德國三間球會效力，回流後於2023年同時取得J1神射手及年度最佳球員；他亦是神戶2023、2024連霸的進攻核心。',
        reliability: 'reported',
        source: {
          label: 'Wikipedia：Yuya Osako',
          url: 'https://en.wikipedia.org/wiki/Yuya_Osako',
          published_at: null
        }
      },
      {
        text: '2025年亞冠精英聯賽對光州，他先補中領先球，再由右路助攻井出遙也頭槌建功；一場比賽同時呈現其禁區觸覺與策應價值。',
        reliability: 'reported',
        source: {
          label: 'Reuters：Osako inspires Kobe against Gwangju',
          url: 'https://www.reuters.com/sports/soccer/osako-gives-kobe-asian-champions-league-advantage-over-gwangju-2025-03-05/',
          published_at: '2025-03-05'
        }
      }
    ],
    '11': [
      {
        text: '武藤嘉紀出身FC東京青訓，其後入讀慶應義塾大學經濟學部；2014年首個完整職業球季攻入13球，追平當時J1新人球季入球紀錄並入選最佳十一人。',
        reliability: 'reported',
        source: {
          label: 'Wikipedia：Yoshinori Muto',
          url: 'https://en.wikipedia.org/wiki/Yoshinori_Muto',
          published_at: null
        }
      },
      {
        text: '他曾效力Mainz、Newcastle United及外借Eibar，能以英超、德甲與西甲經驗作為直播延伸；2026年亞冠精英聯賽四強亦曾為神戶先開紀錄。',
        reliability: 'reported',
        source: {
          label: 'Reuters：Kobe’s ACL Elite semi-final',
          url: 'https://www.reuters.com/sports/soccer/japanese-clubs-cannot-compete-with-big-spending-saudis-says-kobe-coach-skibbe-2026-04-21/',
          published_at: '2026-04-21'
        }
      }
    ],
    '24': [
      {
        text: '酒井高德在紐約出生，母親是德國人、父親是日本人，兩歲時隨家人回到日本，於新潟縣三條市成長；他與弟弟酒井宣福年少時曾一起踢球。',
        reliability: 'reported',
        source: {
          label: 'Wikipedia：Gōtoku Sakai',
          url: 'https://en.wikipedia.org/wiki/G%C5%8Dtoku_Sakai',
          published_at: null
        }
      },
      {
        text: '他17歲便在天皇盃為新潟天鵝一隊上陣，其後在德國為史特加與漢堡累積多年經驗；左右閘皆可勝任，是介紹其位置多功能性的背景。',
        reliability: 'reported',
        source: {
          label: 'Wikipedia：Gōtoku Sakai',
          url: 'https://en.wikipedia.org/wiki/G%C5%8Dtoku_Sakai',
          published_at: null
        }
      }
    ]
  },
  'data/clubs/kashiwa.json': {
    '9': [
      {
        text: '細谷真大由柏太陽王青訓一路升上一隊，小學一年級受父親影響開始踢足球；17歲已以「2種登錄」身份進入一隊名單。',
        reliability: 'reported',
        source: {
          label: 'Wikipedia：Mao Hosoya',
          url: 'https://en.wikipedia.org/wiki/Mao_Hosoya',
          published_at: null
        }
      },
      {
        text: '他是2022年J.League最佳年輕球員，亦隨日本U23贏得2024年U23亞洲盃；2025年東亞盃為日本入球，成年代表隊履歷不只限於友賽。',
        reliability: 'reported',
        source: {
          label: 'Wikipedia：Mao Hosoya',
          url: 'https://en.wikipedia.org/wiki/Mao_Hosoya',
          published_at: null
        }
      }
    ]
  }
};

for (const [file, playerUpdates] of Object.entries(updates)) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [number, trivia] of Object.entries(playerUpdates)) {
    const player = data.players.find((candidate) => String(candidate.number) === number);
    if (!player) throw new Error(`Missing #${number} in ${file}`);
    player.trivia = trivia;
  }
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}
