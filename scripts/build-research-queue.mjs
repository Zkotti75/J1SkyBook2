import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { evaluatePlayerCard, estimatePlayerWeight } from './research-quality.mjs';

const force = process.argv.includes('--force');
const rootFile = resolve('data/research-progress.json');
const progressDir = resolve('data/research-progress');
const today = new Date().toISOString().slice(0, 10);
const manifest = JSON.parse(await readFile(resolve('data/teams.json'), 'utf8'));
const priority = ['shimizu', 'hiroshima', 'kobe', 'kyoto', 'nagoya', 'tokyo-verdy', 'kashima', 'okayama'];
const clubOrder = [...priority, ...manifest.teams.map(team => team.slug).filter(slug => !priority.includes(slug))];

if (!force) {
  try {
    await access(rootFile);
    throw new Error('Research queue already exists. Use --force only when intentionally rebuilding it.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

await mkdir(progressDir, { recursive: true });
const index = {
  schema_version: 1,
  standard: 'nishikawa-player-card',
  generated_at: today,
  max_batch_players: 4,
  max_capacity_points: 6,
  club_order: clubOrder,
  progress_directory: 'data/research-progress',
  future_stages: [
    { id: 'status-tags', status: 'scheduled', description: 'Normalise and source permanent player status tags across all 20 clubs.' },
    { id: 'portraits-and-coverage', status: 'scheduled', description: 'Fill official portraits and documented coverage gaps after player research.' }
  ]
};
await writeFile(rootFile, `${JSON.stringify(index, null, 2)}\n`);

let totalPlayers = 0;
let baselineComplete = 0;
let totalBatches = 0;
for (const slug of clubOrder) {
  const data = JSON.parse(await readFile(resolve('data/clubs', `${slug}.json`), 'utf8'));
  const players = [...(data.players || [])].sort((a, b) => Number(a.number) - Number(b.number));
  totalPlayers += players.length;
  const completed = [];
  const queued = [];
  for (const player of players) {
    const evaluation = evaluatePlayerCard(player, slug);
    if (evaluation.ok) completed.push({ id: player.id, number: String(player.number), name_zh: player.name_zh });
    else queued.push({ id: player.id, number: String(player.number), name_zh: player.name_zh, name_en: player.name_en, weight: estimatePlayerWeight(player) });
  }
  baselineComplete += completed.length;

  const batches = [];
  let current = [];
  let points = 0;
  const flush = () => {
    if (!current.length) return;
    const sequence = String(batches.length + 1).padStart(2, '0');
    batches.push({
      id: `${slug}-${sequence}`,
      kind: 'player_research',
      status: 'queued',
      capacity_points: points,
      players: current,
      started_at: null,
      completed_at: null,
      notes: []
    });
    current = [];
    points = 0;
  };
  for (const player of queued) {
    if (current.length >= index.max_batch_players || points + player.weight > index.max_capacity_points) flush();
    current.push(player);
    points += player.weight;
  }
  flush();
  totalBatches += batches.length;

  const progress = {
    schema_version: 1,
    club: slug,
    club_name_zh: data.team?.name_zh,
    player_research_status: batches.length ? 'queued' : 'completed',
    updated_at: today,
    roster_players: players.length,
    baseline_complete_players: completed,
    batches,
    status_tag_stage: { status: 'scheduled', reviewed_players: 0, total_players: players.length }
  };
  await writeFile(resolve(progressDir, `${slug}.json`), `${JSON.stringify(progress, null, 2)}\n`);
}

console.log(`Created ${totalBatches} player-research batches for ${totalPlayers - baselineComplete} incomplete cards.`);
console.log(`${baselineComplete}/${totalPlayers} cards met the baseline at queue creation.`);
