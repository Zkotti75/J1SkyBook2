import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const strict = process.argv.includes('--strict');
const clubArg = process.argv.find(arg => arg.startsWith('--club='));
const clubSlug = clubArg ? clubArg.slice('--club='.length) : null;
const errors = [];
const warnings = [];
const requiredCareerKeys = ['season', 'team', 'competition', 'appearances', 'goals', 'status', 'notes'];

const manifest = JSON.parse(await readFile(resolve('data/teams.json'), 'utf8'));
if (manifest.schema_version !== 2) errors.push('Manifest schema_version must be 2.');
if (manifest.teams?.length !== 20) errors.push(`Expected 20 J1 clubs; found ${manifest.teams?.length ?? 0}.`);

const slugs = new Set();
for (const listed of manifest.teams || []) {
}

const selectedTeams = clubSlug ? (manifest.teams || []).filter(team => team.slug === clubSlug) : (manifest.teams || []);
if (clubSlug && !selectedTeams.length) errors.push(`Unknown club slug: ${clubSlug}.`);

for (const listed of selectedTeams) {
  if (slugs.has(listed.slug)) errors.push(`Duplicate team slug: ${listed.slug}`);
  slugs.add(listed.slug);
  let data;
  try {
    data = JSON.parse(await readFile(resolve('data/clubs', `${listed.slug}.json`), 'utf8'));
  } catch (error) {
    errors.push(`${listed.slug}: cannot read club file (${error.message}).`);
    continue;
  }
  if (data.schema_version !== 2) errors.push(`${listed.slug}: schema_version must be 2.`);
  if (data.team?.slug !== listed.slug) errors.push(`${listed.slug}: team slug mismatch.`);
  if (!data.team?.name_zh || !data.team?.name_ja || !data.team?.name_en) errors.push(`${listed.slug}: missing team names.`);
  if (!Array.isArray(data.players)) errors.push(`${listed.slug}: players must be an array.`);
  if (data.team?.data_status !== 'verified') warnings.push(`${listed.slug}: team data is ${data.team?.data_status || 'unlabelled'}.`);
  if (!data.manager) warnings.push(`${listed.slug}: manager has not been added.`);
  else {
    if (data.manager.verification_status !== 'verified') warnings.push(`${listed.slug}: manager still requires verification.`);
    if (!Array.isArray(data.manager.career)) errors.push(`${listed.slug}: manager career must be an array.`);
    for (const [index, row] of (data.manager.career || []).entries()) {
      for (const key of requiredCareerKeys) if (!(key in row)) errors.push(`${listed.slug} manager career row ${index + 1}: missing ${key}.`);
      if (/[–—-].*\d{4}|至今|present/i.test(row.season || '')) warnings.push(`${listed.slug} manager career row ${index + 1}: season is not a single-season entry (${row.season}).`);
    }
  }
  if (!(data.players || []).length) warnings.push(`${listed.slug}: roster has not been added.`);

  const numbers = new Set();
  for (const player of data.players || []) {
    const ref = `${listed.slug} #${player.number || '?'}`;
    if (!player.id || !player.number || !player.name_zh || !player.position) errors.push(`${ref}: missing core identity field.`);
    if (numbers.has(String(player.number))) {
      const message = `${ref}: duplicate shirt number.`;
      if (data.team?.data_status === 'verified') errors.push(message);
      else warnings.push(message);
    }
    numbers.add(String(player.number));
    if (!['GK','DF','MF','FW'].includes(player.position)) errors.push(`${ref}: invalid position ${player.position}.`);
    if (player.verification_status !== 'verified') warnings.push(`${ref}: identity/career still requires verification.`);
    if (!Array.isArray(player.career)) errors.push(`${ref}: career must be an array.`);
    for (const [index, row] of (player.career || []).entries()) {
      for (const key of requiredCareerKeys) if (!(key in row)) errors.push(`${ref} career row ${index + 1}: missing ${key}.`);
      if (/[–—-].*\d{4}|至今|present/i.test(row.season || '')) warnings.push(`${ref} career row ${index + 1}: season is not a single-season entry (${row.season}).`);
    }
  }
}

console.log(`Validated ${selectedTeams.length} club file${selectedTeams.length === 1 ? '' : 's'}${clubSlug ? ` (${clubSlug})` : ''}.`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
for (const line of errors) console.error(`ERROR: ${line}`);
for (const line of warnings.slice(0, 100)) console.warn(`WARN: ${line}`);
if (warnings.length > 100) console.warn(`WARN: ${warnings.length - 100} additional warning(s) omitted.`);
if (errors.length || (strict && warnings.length)) process.exit(1);
