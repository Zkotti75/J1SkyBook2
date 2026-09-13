import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = process.argv[2] || resolve('../skybook-old/players_db.json');
const targetRoot = resolve('data');
const seasonStart = '2026-08-07';

const teams = [
  { slug: 'kashima', name_zh: '鹿島鹿角', data_key: '鹿島鹿角', name_ja: '鹿島アントラーズ', name_en: 'Kashima Antlers', logo_url: 'logos/japan_kashima-antlers.football-logos.cc.svg', colors: { bg: '#b8193f', text: '#ffffff' } },
  { slug: 'mito', name_zh: '水戶蜀葵', data_key: '水戶蜀葵', name_ja: '水戸ホーリーホック', name_en: 'Mito HollyHock', logo_url: 'logos/japan_mito-hollyhock.football-logos.cc.svg', colors: { bg: '#005bac', text: '#ffffff' } },
  { slug: 'urawa', name_zh: '浦和紅鑽', data_key: '浦和紅鑽', name_ja: '浦和レッズ', name_en: 'Urawa Red Diamonds', logo_url: 'logos/japan_urawa-reds.football-logos.cc.svg', colors: { bg: '#e6002d', text: '#ffffff' } },
  { slug: 'chiba', name_zh: '千葉市原JEF聯', data_key: '千葉市原JEF聯', name_ja: 'ジェフユナイテッド千葉', name_en: 'JEF United Chiba', logo_url: 'logos/japan_jef-united-chiba.football-logos.cc.svg', colors: { bg: '#ffe100', text: '#111827' } },
  { slug: 'kashiwa', name_zh: '柏太陽王', data_key: '柏太陽王', name_ja: '柏レイソル', name_en: 'Kashiwa Reysol', logo_url: 'logos/japan_kashiwa-reysol.football-logos.cc.svg', colors: { bg: '#fff100', text: '#111827' } },
  { slug: 'fc-tokyo', name_zh: 'FC東京', data_key: 'FC 東京', name_ja: 'FC東京', name_en: 'FC Tokyo', logo_url: 'logos/japan_fc-tokyo.football-logos.cc.svg', colors: { bg: '#11216c', text: '#ffffff' } },
  { slug: 'machida', name_zh: '町田澤維亞', data_key: '町田澤維亞', name_ja: 'FC町田ゼルビア', name_en: 'FC Machida Zelvia', logo_url: 'logos/japan_machida-zelvia.football-logos.cc.svg', colors: { bg: '#0054a7', text: '#ffffff' } },
  { slug: 'tokyo-verdy', name_zh: '東京綠茵', data_key: '東京綠茵', name_ja: '東京ヴェルディ', name_en: 'Tokyo Verdy', logo_url: 'logos/japan_tokyo-verdy.football-logos.cc.svg', colors: { bg: '#006d30', text: '#ffffff' } },
  { slug: 'kawasaki', name_zh: '川崎前鋒', data_key: '川崎前鋒', name_ja: '川崎フロンターレ', name_en: 'Kawasaki Frontale', logo_url: 'logos/japan_kawasaki-frontale.football-logos.cc.svg', colors: { bg: '#38a1db', text: '#ffffff' } },
  { slug: 'nagoya', name_zh: '名古屋鯨魚', data_key: '名古屋鯨魚', name_ja: '名古屋グランパス', name_en: 'Nagoya Grampus', logo_url: 'logos/japan_nagoya-grampus.football-logos.cc.svg', colors: { bg: '#e6002d', text: '#ffffff' } },
  { slug: 'yokohama-fm', name_zh: '橫濱水手', data_key: '橫濱水手', name_ja: '横浜F・マリノス', name_en: 'Yokohama F. Marinos', logo_url: 'logos/japan_yokohama-f-marinos.football-logos.cc.svg', colors: { bg: '#004098', text: '#ffffff' } },
  { slug: 'shimizu', name_zh: '清水心跳', data_key: '清水心跳', name_ja: '清水エスパルス', name_en: 'Shimizu S-Pulse', logo_url: 'logos/japan_shimizu-s-pulse.football-logos.cc.svg', colors: { bg: '#f39800', text: '#111827' } },
  { slug: 'kyoto', name_zh: '京都不死鳥', data_key: '京都不死鳥', name_ja: '京都サンガF.C.', name_en: 'Kyoto Sanga F.C.', logo_url: 'logos/japan_kyoto-sanga.football-logos.cc.svg', colors: { bg: '#750069', text: '#ffffff' } },
  { slug: 'gamba-osaka', name_zh: '大阪飛腳', data_key: '大阪飛腳', name_ja: 'ガンバ大阪', name_en: 'Gamba Osaka', logo_url: 'logos/japan_gamba-osaka.football-logos.cc.svg', colors: { bg: '#00458d', text: '#ffffff' } },
  { slug: 'cerezo-osaka', name_zh: '大阪櫻花', data_key: '大阪櫻花', name_ja: 'セレッソ大阪', name_en: 'Cerezo Osaka', logo_url: 'logos/japan_cerezo-osaka.football-logos.cc.svg', colors: { bg: '#da005c', text: '#ffffff' } },
  { slug: 'kobe', name_zh: '神戶勝利船', data_key: '神戶勝利船', name_ja: 'ヴィッセル神戸', name_en: 'Vissel Kobe', logo_url: 'logos/japan_vissel-kobe.football-logos.cc.svg', colors: { bg: '#a9002e', text: '#ffffff' } },
  { slug: 'okayama', name_zh: '岡山綠雉', data_key: '岡山綠雉', name_ja: 'ファジアーノ岡山', name_en: 'Fagiano Okayama', logo_url: 'logos/japan_fagiano-okayama.football-logos.cc.svg', colors: { bg: '#b6003d', text: '#ffffff' } },
  { slug: 'hiroshima', name_zh: '廣島三箭', data_key: '廣島三箭', name_ja: 'サンフレッチェ広島', name_en: 'Sanfrecce Hiroshima', logo_url: 'logos/japan_sanfrecce-hiroshima.football-logos.cc.svg', colors: { bg: '#51318f', text: '#ffffff' } },
  { slug: 'fukuoka', name_zh: '福岡黃蜂', data_key: '福岡黃蜂', name_ja: 'アビスパ福岡', name_en: 'Avispa Fukuoka', logo_url: 'logos/japan_avispa-fukuoka.football-logos.cc.svg', colors: { bg: '#001b5b', text: '#ffffff' } },
  { slug: 'nagasaki', name_zh: '長崎成功丸', data_key: '長崎成功丸', name_ja: 'V・ファーレン長崎', name_en: 'V-Varen Nagasaki', logo_url: 'logos/japan_v-varen-nagasaki.football-logos.cc.svg', colors: { bg: '#005bac', text: '#ffffff' } }
];

function seasonAge(dob) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return null;
  const birth = new Date(`${dob}T00:00:00Z`);
  const start = new Date(`${seasonStart}T00:00:00Z`);
  let age = start.getUTCFullYear() - birth.getUTCFullYear();
  if (start.getUTCMonth() < birth.getUTCMonth() || (start.getUTCMonth() === birth.getUTCMonth() && start.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

function blankCareerRow(row) {
  return {
    season: row.period || '',
    team: row.team || '',
    competition: row.category || '',
    appearances: null,
    goals: null,
    status: '',
    notes: row.milestone || '',
    verification_status: 'legacy_unverified',
    sources: []
  };
}

function migratePerson(item, team) {
  return {
    ...item,
    id: item.id || `legacy_${team.slug}_${item.number}`,
    legacy_id: item.id || null,
    official_player_id: null,
    club: team.name_zh,
    team_slug: team.slug,
    name_ja: '',
    birthplace: '',
    season_start_age: seasonAge(item.dob),
    player_image: '',
    career: (item.timeline || []).map(blankCareerRow),
    sources: [],
    verification_status: 'legacy_unverified',
    verified_at: null
  };
}

await mkdir(resolve(targetRoot, 'clubs'), { recursive: true });
const legacy = JSON.parse(await readFile(source, 'utf8'));

for (const team of teams) {
  const oldItems = legacy.filter(item => item.club === team.data_key);
  const oldTeam = oldItems.find(item => item.type === 'team_info');
  const isManager = item => item.number === 'HC' || ['MANAGER', 'HC', '領隊'].includes(item.position);
  const oldManager = oldItems.find(isManager);
  const oldPlayers = oldItems.filter(item => item.type !== 'team_info' && !isManager(item));
  const teamRecord = {
    ...(oldTeam || {}),
    id: `team_${team.slug}`,
    type: 'team_info',
    slug: team.slug,
    data_key: team.data_key,
    name_zh: team.name_zh,
    name_ja: team.name_ja,
    name_en: team.name_en,
    club: team.name_zh,
    club_en: team.name_en,
    logo_url: team.logo_url,
    colors: team.colors,
    season: '2026/27',
    season_start: seasonStart,
    roster_as_of: null,
    data_status: oldItems.length ? 'legacy_unverified' : 'pending',
    sources: []
  };
  const output = {
    schema_version: 2,
    generated_at: new Date().toISOString(),
    team: teamRecord,
    manager: oldManager ? migratePerson({ ...oldManager, position: 'MANAGER', number: 'HC' }, team) : null,
    players: oldPlayers.map(item => migratePerson(item, team)).sort((a,b) => Number(a.number) - Number(b.number))
  };
  await writeFile(resolve(targetRoot, 'clubs', `${team.slug}.json`), `${JSON.stringify(output, null, 2)}\n`);
}

const manifest = {
  schema_version: 2,
  competition: '2026/27 明治安田 J1 League',
  season_start: seasonStart,
  generated_at: new Date().toISOString(),
  teams: teams.map(({ data_key, ...team }) => ({ ...team, data_file: `data/clubs/${team.slug}.json` }))
};
await writeFile(resolve(targetRoot, 'teams.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Migrated ${legacy.length} legacy records into ${teams.length} club files.`);
