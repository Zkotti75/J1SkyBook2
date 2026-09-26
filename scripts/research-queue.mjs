import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { evaluatePlayerCard } from './research-quality.mjs';

const [command = 'summary'] = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const arg = name => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3) || null;
const batchId = arg('batch');
const clubFilter = arg('club');
const note = arg('note');
const jsonOutput = process.argv.includes('--json');
const today = new Date().toISOString().slice(0, 10);
const index = JSON.parse(await readFile(resolve('data/research-progress.json'), 'utf8'));

async function loadProgress(slug) {
  const file = resolve(index.progress_directory, `${slug}.json`);
  return { file, data: JSON.parse(await readFile(file, 'utf8')) };
}

async function allProgress() {
  const rows = [];
  for (const slug of index.club_order) rows.push(await loadProgress(slug));
  return rows;
}

async function findBatch(id) {
  if (!id) throw new Error('--batch=<id> is required.');
  const slug = index.club_order.find(candidate => id.startsWith(`${candidate}-`));
  if (!slug) throw new Error(`Unknown batch: ${id}`);
  const progress = await loadProgress(slug);
  const batch = progress.data.batches.find(item => item.id === id);
  if (!batch) throw new Error(`Unknown batch: ${id}`);
  return { ...progress, batch, slug };
}

function printBatch(batch, clubName) {
  if (jsonOutput) return console.log(JSON.stringify({ club_name_zh: clubName, ...batch }, null, 2));
  console.log(`${batch.id} · ${clubName} · ${batch.status} · ${batch.capacity_points} point(s)`);
  console.log(batch.players.map(player => `#${player.number} ${player.name_zh} (${player.weight})`).join('\n'));
}

if (command === 'summary') {
  const rows = await allProgress();
  const summary = rows.map(({ data }) => ({
    club: data.club,
    name: data.club_name_zh,
    completed: data.batches.filter(batch => batch.status === 'completed').length,
    active: data.batches.filter(batch => batch.status === 'researching').length,
    queued: data.batches.filter(batch => ['queued', 'validation_failed'].includes(batch.status)).length,
    total: data.batches.length
  }));
  if (jsonOutput) console.log(JSON.stringify(summary, null, 2));
  else {
    for (const row of summary) console.log(`${row.name}: ${row.completed}/${row.total} completed · ${row.active} active · ${row.queued} queued`);
    console.log(`Total: ${summary.reduce((sum, row) => sum + row.completed, 0)}/${summary.reduce((sum, row) => sum + row.total, 0)} batches completed.`);
  }
} else if (command === 'next') {
  const rows = clubFilter ? [await loadProgress(clubFilter)] : await allProgress();
  let selected = null;
  for (const { data } of rows) {
    if (data.batches.some(batch => batch.status === 'researching')) continue;
    const batch = data.batches.find(item => ['queued', 'validation_failed'].includes(item.status));
    if (batch) { selected = { batch, name: data.club_name_zh }; break; }
  }
  if (!selected) console.log('No unclaimed player-research batch is available.');
  else printBatch(selected.batch, selected.name);
} else if (command === 'start') {
  const { file, data, batch } = await findBatch(batchId);
  if (!['queued', 'validation_failed'].includes(batch.status)) throw new Error(`${batch.id} cannot start from status ${batch.status}.`);
  const active = data.batches.find(item => item.status === 'researching');
  if (active) throw new Error(`${data.club_name_zh} already has active batch ${active.id}.`);
  batch.status = 'researching';
  batch.started_at = today;
  batch.completed_at = null;
  data.player_research_status = 'in_progress';
  data.updated_at = today;
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  printBatch(batch, data.club_name_zh);
} else if (command === 'validate' || command === 'complete') {
  const { file, data, batch, slug } = await findBatch(batchId);
  const club = JSON.parse(await readFile(resolve('data/clubs', `${slug}.json`), 'utf8'));
  const results = batch.players.map(queued => {
    const player = club.players.find(item => item.id === queued.id || String(item.number) === String(queued.number));
    return player ? evaluatePlayerCard(player, slug) : { ref: `#${queued.number} ${queued.name_zh}`, ok: false, issues: ['player missing from club file'], coverage: [], outsideHosts: [] };
  });
  const failures = results.flatMap(result => result.issues);
  if (jsonOutput) console.log(JSON.stringify({ batch: batch.id, ok: !failures.length, results }, null, 2));
  else {
    console.log(`${batch.id}: ${failures.length ? 'FAILED' : 'PASSED'} (${results.filter(result => result.ok).length}/${results.length} players)`);
    for (const result of results) {
      console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.ref} · outside sources: ${result.outsideHosts.join(', ') || 'none'}`);
      for (const issue of result.issues) console.error(`  - ${issue}`);
      for (const gap of result.coverage) console.warn(`  ~ ${gap}`);
    }
  }
  if (failures.length) process.exitCode = 1;
  else if (command === 'complete') {
    if (batch.status !== 'researching') throw new Error(`${batch.id} must be researching before completion.`);
    batch.status = 'completed';
    batch.completed_at = today;
    data.updated_at = today;
    if (data.batches.every(item => item.status === 'completed')) data.player_research_status = 'completed';
    await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  }
} else if (command === 'fail') {
  if (!note) throw new Error('--note=<reason> is required.');
  const { file, data, batch } = await findBatch(batchId);
  batch.status = 'validation_failed';
  batch.notes.push({ date: today, text: note });
  data.updated_at = today;
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  printBatch(batch, data.club_name_zh);
} else if (command === 'handoff') {
  const { data, batch } = await findBatch(batchId);
  console.log(`Use $skybook-player-research to complete batch ${batch.id} for ${data.club_name_zh}.`);
  console.log(`Start with: npm run research:start -- --batch=${batch.id}`);
  console.log(`Players: ${batch.players.map(player => `#${player.number} ${player.name_zh}`).join('、')}`);
  console.log('Complete only this batch, run the batch validator and npm test, update its progress file, and use the batch ID in the commit subject.');
} else {
  throw new Error(`Unknown command: ${command}`);
}
