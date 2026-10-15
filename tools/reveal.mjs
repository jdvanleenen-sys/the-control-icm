// The reveal. Run only after the coded tables and the marks are committed. Names the arms,
// writes the named tables and results.md, and files the control and treatment transcripts in
// question order.
//
//   node tools/reveal.mjs --name NAME            files them under runs/NAME/revealed/
//   node tools/reveal.mjs --name NAME --root     files them at the top of the repo, as the
//                                                competition asks: control/, treatment/, results.md

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { option, runCli, sealedRunDir } from '../lib/cli.mjs';
import { ARM_DOCS_ONLY, ARM_EMPTY, ARM_FULL, REPO } from '../lib/config.mjs';
import { transcript } from '../lib/transcript.mjs';
import { byQuestionId, loadRows, namedTables } from '../verify/analyse.mjs';
import { marksPresent } from '../verify/marks.mjs';
import { buildResults } from '../verify/results.mjs';
import { logPath } from '../verify/scan.mjs';

// Where each named arm's transcripts go, as the competition's folder names.
export const REVEALED = { [ARM_DOCS_ONLY]: 'control/documents-only', [ARM_EMPTY]: 'control/empty', [ARM_FULL]: 'treatment' };
export const REVEALED_DIRS = ['control', 'treatment'];
const PLACE_FILE = 'revealed-at.json';

// Where a run's reveal was filed: at the top of the repo, or inside the run's own folder.
export function revealPlace(dir, repo = REPO) {
  const atRoot = existsSync(join(dir, PLACE_FILE)) && JSON.parse(readFileSync(join(dir, PLACE_FILE), 'utf8')).root;
  return { atRoot, base: atRoot ? repo : join(dir, 'revealed'), results: join(atRoot ? repo : dir, 'results.md') };
}

// The files the reveal writes: a copy of each raw log and a readable transcript beside it.
export function revealedFiles(dir, key, schedule, limit, base = revealPlace(dir).base) {
  const files = [];
  const sessions = schedule.sessions.slice(0, limit || schedule.sessions.length);
  for (const [code, arm] of Object.entries(key.arms).filter(([, a]) => a in REVEALED)) {
    const mine = sessions.filter((s) => s.code === code).sort((a, b) => byQuestionId(a.question, b.question) || a.run - b.run);
    for (const s of mine) {
      const raw = logPath(dir, s);
      if (!existsSync(raw)) continue;
      const meta = JSON.parse(readFileSync(raw.replace(/\.jsonl$/, '.meta.json'), 'utf8'));
      // Two digits, so a file listing shows the questions in the order they are asked.
      const stem = join(base, REVEALED[arm], `${s.question.replace(/\d+/, (n) => n.padStart(2, '0'))}-run${s.run}`);
      files.push({ raw, copy: `${stem}.jsonl`, readable: `${stem}.md`, text: transcript(readFileSync(raw, 'utf8'), meta) });
    }
  }
  return files;
}

// Marks come before the key, so a reveal with no marks is refused unless it is asked for by name.
export function reveal(dir, { unmarked = false, root = false, repo = REPO } = {}) {
  if (!existsSync(join(dir, 'tables-coded.md'))) throw new Error('No coded tables yet. The reveal comes after them.');
  if (!unmarked && !marksPresent(dir)) throw new Error('This run has not been marked. Marks are made blind, so they come before the key. For a rehearsal with no marking, add --unmarked.');
  const key = JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8'));
  const schedule = JSON.parse(readFileSync(join(dir, 'schedule.json'), 'utf8'));
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const placed = existsSync(join(dir, PLACE_FILE)) ? JSON.parse(readFileSync(join(dir, PLACE_FILE), 'utf8')) : null;
  if (placed && placed.root && !root) throw new Error('This run is already revealed at the top of the repo. Add --root to rebuild it there. Without it the reveal would move, and the check would stop covering control/, treatment/ and results.md.');
  writeFileSync(join(dir, PLACE_FILE), `${JSON.stringify({ root })}\n`);
  const place = revealPlace(dir, repo);
  for (const name of REVEALED_DIRS) rmSync(join(place.base, name), { recursive: true, force: true });
  const files = revealedFiles(dir, key, schedule, manifest.limit, place.base);
  for (const file of files) {
    mkdirSync(dirname(file.copy), { recursive: true });
    copyFileSync(file.raw, file.copy);
    writeFileSync(file.readable, file.text);
  }
  writeFileSync(join(dir, 'tables-named.md'), namedTables(loadRows(dir), key));
  writeFileSync(place.results, buildResults(dir));
  return files.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli(() => {
    const root = process.argv.includes('--root');
    const count = reveal(sealedRunDir('Example: node tools/reveal.mjs --name NAME --root'), { unmarked: process.argv.includes('--unmarked'), root });
    const name = option('name');
    console.log(`Revealed: ${count} transcripts filed ${root ? 'in control/ and treatment/ at the top of the repo' : `under runs/${name}/revealed/`}; tables-named.md and results.md written.`);
    console.log(`The key files are ignored by git until now. To publish them: git add -f runs/${name}/key.json runs/${name}/key-staged.json runs/${name}/probe.md runs/${name}/marking-key.csv`);
  });
}
