// Builds the folder each arm runs in. Every arm with documents is copied from the same source,
// so the documents are byte for byte the same across arms.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { armSpec, FOLDER_DIR, INSTRUCTION_FILES, LIBRARY_DIR, STAGE_ROOT, SWITCH_FILE } from './config.mjs';
import { sha256 } from './rng.mjs';

// Everything Claude Code's documentation says it reads from a folder above the working one:
// instruction files, a rules folder, and a git repo, whose status it reports to the model.
const LEAKY_FILES = ['CLAUDE.md', 'CLAUDE.local.md', 'AGENTS.md', '.claude/CLAUDE.md', '.claude/AGENTS.md', '.claude/rules', '.git'];
// A machine-wide instruction file that loads whatever flags are passed.
const MANAGED_FILES = ['C:/Program Files/ClaudeCode/CLAUDE.md', '/Library/Application Support/ClaudeCode/CLAUDE.md', '/etc/claude-code/CLAUDE.md'];
// Every staged file gets the same timestamp, because the file-listing tool sorts by it.
const STAGED_TIME = new Date('2026-01-01T00:00:00Z');

// Any of these at or above the staging root would reach every session, in every arm.
export function assertCleanAncestors(root, managed = MANAGED_FILES) {
  for (const path of managed) {
    if (existsSync(path)) throw new Error(`This machine has a managed instruction file at ${path}. It loads into every session and cannot be switched off from here.`);
  }
  let dir = resolve(root);
  for (;;) {
    for (const name of LEAKY_FILES) {
      if (existsSync(join(dir, name))) throw new Error(`Staging root ${root} sits at or below ${join(dir, name)}, which would leak into every session.`);
    }
    const parent = dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }
}

function setTimes(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) setTimes(path);
    utimesSync(path, STAGED_TIME, STAGED_TIME);
  }
}

// One fingerprint for everything an arm held. It does not depend on where the arm was staged.
export const stagedDigest = (staged) => sha256(JSON.stringify({ switchFile: staged.switchFile, files: staged.files }));

export const switchFileText =(loaded) => (loaded.length === 0 ? null : `${loaded.map((name) => `@${name}`).join('\n')}\n`);

export function fingerprint(dir, base = dir) {
  const entries = {};
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) Object.assign(entries, fingerprint(path, base));
    else entries[relative(base, path).replace(/\\/g, '/')] = sha256(readFileSync(path));
  }
  return entries;
}

// The folder is exactly five things, and none of the four files may be empty. Anything else
// would be left out of an arm, or put into it, without the reader of the results knowing.
export function assertFolderShape(source) {
  for (const name of INSTRUCTION_FILES) {
    if (!existsSync(join(source, name))) throw new Error(`The folder needs ${name}, which is missing from ${source}.`);
    if (readFileSync(join(source, name), 'utf8').trim() === '') throw new Error(`${name} in ${source} is empty. An arm that loads it would load nothing.`);
  }
  if (!existsSync(join(source, LIBRARY_DIR))) throw new Error(`The folder needs ${LIBRARY_DIR}/, which is missing from ${source}.`);
  // In the repo itself the folder shares the top level with the apparatus, so only the five
  // named things are staged. A separate copy of the folder must hold nothing else.
  const extra = resolve(source) === resolve(FOLDER_DIR) ? [] : readdirSync(source).filter((name) => ![...INSTRUCTION_FILES, LIBRARY_DIR].includes(name));
  if (extra.length > 0) throw new Error(`${source} holds ${extra.join(', ')}. The folder is exactly ${INSTRUCTION_FILES.join(', ')} and ${LIBRARY_DIR}/; anything else would not be staged.`);
}

// A copy of just the folder: the four files and the library. For rooms and for tests.
export function copyFolder(source, target) {
  mkdirSync(target, { recursive: true });
  for (const name of INSTRUCTION_FILES) cpSync(join(source, name), join(target, name));
  cpSync(join(source, LIBRARY_DIR), join(target, LIBRARY_DIR), { recursive: true });
}

// The known-bad map: inside each set, every document is given the next document's entry, so the
// map is well formed and wrong about what each file covers. Nothing is random.
export function wrongMap(text) {
  const lines = text.split('\n');
  const entry = /^(- [^:]+: )(.*)$/;
  const rotate = (from, to) => {
    const at = [];
    for (let i = from; i < to; i += 1) if (entry.test(lines[i])) at.push(i);
    const said = at.map((i) => lines[i].match(entry)[2]);
    at.forEach((i, k) => { lines[i] = lines[i].match(entry)[1] + said[(k + 1) % said.length]; });
  };
  let start = null;
  lines.forEach((line, i) => { if (line.startsWith('## ')) { if (start !== null) rotate(start, i); start = i; } });
  if (start !== null) rotate(start, lines.length);
  return lines.join('\n');
}

// Copies what the arm may see into a fresh folder. `edit` lets the probe add its marker words.
export function stageArm(dir, arm, { source = FOLDER_DIR, edit = null } = {}) {
  const spec = armSpec(arm);
  assertFolderShape(source);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  if (spec.library) cpSync(join(source, LIBRARY_DIR), join(dir, LIBRARY_DIR), { recursive: true });
  if (spec.folder) {
    for (const name of INSTRUCTION_FILES) {
      const own = readFileSync(join(source, name), 'utf8');
      const text = spec.wrongMap && name === INSTRUCTION_FILES[0] ? wrongMap(own) : own;
      writeFileSync(join(dir, name), edit ? edit(name, text) : text);
    }
  }
  const switchText = switchFileText(spec.loaded);
  if (switchText !== null) writeFileSync(join(dir, SWITCH_FILE), switchText);
  for (const name of spec.loaded) {
    if (!existsSync(join(dir, name))) throw new Error(`The switch file for arm ${arm} points at ${name}, which is not in ${dir}.`);
  }
  setTimes(dir);
  return { dir: dir.replace(/\\/g, '/'), switchFile: switchText, files: fingerprint(dir) };
}

// Stages every arm under its code. Returns what was staged, keyed by code only.
export function stageAll(armsByCode, { root = STAGE_ROOT, source = FOLDER_DIR, edit = null } = {}) {
  assertCleanAncestors(root);
  const staged = {};
  for (const [code, arm] of Object.entries(armsByCode)) {
    staged[code] = stageArm(join(root, code), arm, { source, edit });
  }
  return staged;
}
