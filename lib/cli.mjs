// Shared command-line handling: read an option, insist on one, and turn any failure into one
// plain line and a non-zero exit instead of a stack trace.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO, runDir } from './config.mjs';

export function option(name, fallback = null) {
  const at = process.argv.indexOf(`--${name}`);
  if (at === -1) return fallback;
  const value = process.argv[at + 1];
  if (value === undefined || value.startsWith('--')) throw new Error(`--${name} needs a value.`);
  return value;
}

// The folder of a sealed run, named with --name. Stops with a clear message if it is not one.
export function sealedRunDir(usage) {
  const name = option('name');
  if (!name) throw new Error(`Name the run with --name. ${usage}`);
  const dir = runDir(name);
  if (!existsSync(dir)) throw new Error(`There is no run called "${name}" under runs/.`);
  if (!existsSync(join(dir, 'schedule.json'))) throw new Error(`"${name}" is not a sealed run (it has no schedule). Re-run and ask folders cannot be checked this way.`);
  return dir;
}

// The run to use when none is named: the one whose reveal sits at the top of the repo, or the
// only sealed run there is. With several and no way to choose, it says which ones exist.
export function defaultSealedRun() {
  const base = join(REPO, 'runs');
  const names = existsSync(base) ? readdirSync(base).filter((name) => existsSync(join(base, name, 'schedule.json'))).sort() : [];
  const atRoot = names.filter((name) => existsSync(join(base, name, 'revealed-at.json')) && JSON.parse(readFileSync(join(base, name, 'revealed-at.json'), 'utf8')).root);
  if (atRoot.length === 1) return atRoot[0];
  if (names.length === 1) return names[0];
  if (names.length === 0) throw new Error('There is no sealed run under runs/ yet.');
  throw new Error(`Name the run with --name. Sealed runs here: ${names.join(', ')}.`);
}

// The folder of the named run, or of the default run when none is named.
export function sealedRunOrDefault(usage) {
  if (option('name')) return sealedRunDir(usage);
  const name = defaultSealedRun();
  console.log(`No run named; using "${name}".`);
  return runDir(name);
}

export function runCli(main) {
  try {
    main();
  } catch (error) {
    console.error(`Stopped: ${error.message}`);
    process.exitCode = 1;
  }
}
