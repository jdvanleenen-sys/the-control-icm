// The supplement's arms, questions and counts. Everything the supplement adds to the entry's
// harness lives here, so the entry's own files stay as they were.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { LIBRARY_DIR, REPO } from './config.mjs';
import { loadQuestions } from './questions.mjs';
import { sha256 } from './rng.mjs';
import { fingerprint } from './stage.mjs';

export const ARM_DOCS = 'docs';
export const ARM_FOLDER = 'folder';
export const ARM_ICM = 'icm';
export const ARM_EAGER = 'icm-eager';
export const SUP_ARMS = [ARM_DOCS, ARM_FOLDER, ARM_ICM, ARM_EAGER];

export const FOLDER_SOURCE = resolve(REPO, 'arms', 'folder');
export const ICM_SOURCE = resolve(REPO, 'arms', 'icm');
export const FOLDER_FILES = ['README.md', 'identity.md', 'rules.md', 'examples.md'];
const ROUTER = 'CLAUDE.md';
const STAGED_TIME = new Date('2026-01-01T00:00:00Z');

// The three question sets. Ids do not overlap: N for new, Q for exam, H for held-out.
export const QUESTION_SETS = { new: 'questions-new.md', exam: 'questions.md', heldout: 'questions-heldout.md' };
export const PRIMARY_SET = 'new';

export function loadAllQuestions(repo = REPO) {
  const all = [];
  for (const [set, file] of Object.entries(QUESTION_SETS)) for (const q of loadQuestions(join(repo, file))) all.push({ ...q, questionSet: set });
  const ids = all.map((q) => q.id);
  const repeated = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (repeated.length > 0) throw new Error(`Question ids appear in more than one set: ${[...new Set(repeated)].join(', ')}.`);
  return all;
}

const norm = (text) => text.replace(/\r\n/g, '\n');

// Every file in a folder, as paths relative to it with forward slashes, sorted.
export function filesUnder(dir, base = dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path).replace(/\\/g, '/')];
  }).sort();
}

// The ICM's instruction files: everything in arms/icm except the router.
export const icmInstructionFiles = (source = ICM_SOURCE) => filesUnder(source).filter((p) => p !== ROUTER && p.endsWith('.md'));

// icm-eager's router: the ICM's router, then the text of every other instruction file, each under
// its path. An "@" import would do the same, but it does not work for a path with a space in it.
export function eagerRouter(source = ICM_SOURCE) {
  const parts = [norm(readFileSync(join(source, ROUTER), 'utf8')).replace(/\n*$/, '\n')];
  for (const path of icmInstructionFiles(source)) parts.push(`\n---\n\n# ${path}\n\n${norm(readFileSync(join(source, path), 'utf8')).replace(/\n*$/, '\n')}`);
  return parts.join('');
}

function setTimes(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) setTimes(path);
    utimesSync(path, STAGED_TIME, STAGED_TIME);
  }
}

// The text an arm puts in front of the model before the question: the router as it arrives, with
// each "@" line replaced by the file it names. Counted in characters, as the entry counted it.
export function loadedText(dir) {
  const path = join(dir, ROUTER);
  if (!existsSync(path)) return '';
  return norm(readFileSync(path, 'utf8')).split('\n').map((line) => {
    const m = line.match(/^@(\S+)$/);
    return m ? norm(readFileSync(join(dir, m[1]), 'utf8')) : line;
  }).join('\n');
}

// What the folder arm loads is the entry's four files, counted as the entry counted them.
export function loadedChars(dir) {
  const path = join(dir, ROUTER);
  if (!existsSync(path)) return 0;
  const lines = norm(readFileSync(path, 'utf8')).split('\n');
  if (lines.filter(Boolean).every((line) => line.startsWith('@'))) {
    return lines.filter(Boolean).reduce((n, line) => n + norm(readFileSync(join(dir, line.slice(1)), 'utf8')).length, 0);
  }
  return loadedText(dir).length;
}

// Copies what an arm may see into a fresh folder.
export function stageSupArm(dir, arm, { repo = REPO } = {}) {
  if (!SUP_ARMS.includes(arm)) throw new Error(`Unknown arm "${arm}".`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync(join(repo, LIBRARY_DIR), join(dir, LIBRARY_DIR), { recursive: true });
  if (arm === ARM_FOLDER) {
    for (const name of FOLDER_FILES) cpSync(join(repo, 'arms', 'folder', name), join(dir, name));
    writeFileSync(join(dir, ROUTER), `${FOLDER_FILES.map((name) => `@${name}`).join('\n')}\n`);
  }
  if (arm === ARM_ICM || arm === ARM_EAGER) {
    const source = join(repo, 'arms', 'icm');
    if (existsSync(join(source, LIBRARY_DIR))) throw new Error('arms/icm holds its own reference/; it must not.');
    for (const path of filesUnder(source)) cpSync(join(source, path), join(dir, path));
    if (arm === ARM_EAGER) writeFileSync(join(dir, ROUTER), eagerRouter(source));
  }
  checkArm(dir, arm);
  setTimes(dir);
  return { dir: dir.replace(/\\/g, '/'), files: fingerprint(dir), loadedChars: loadedChars(dir) };
}

// One instruction file that loads by itself, at the top, and nothing hidden lower down.
export function checkArm(dir, arm) {
  const routers = filesUnder(dir).filter((p) => /(^|\/)(CLAUDE|AGENTS)(\.local)?\.md$/i.test(p) || /(^|\/)\.claude\//.test(p));
  const allowed = arm === ARM_DOCS ? [] : [ROUTER];
  if (JSON.stringify(routers) !== JSON.stringify(allowed)) throw new Error(`Arm ${arm} holds ${routers.join(', ') || 'no instruction file'}; it must hold ${allowed.join(', ') || 'none'}.`);
  if (arm === ARM_ICM && /^@/m.test(readFileSync(join(dir, ROUTER), 'utf8'))) throw new Error('The ICM router holds an "@" import.');
}

// A step is a document step if it is a search or a listing, or opens something in reference/.
// Opening anything else (a stage contract, the map, a folder file) is an instruction step.
export function splitSteps(calls) {
  const instruction = calls.filter((c) => c.tool === 'Read' && !c.target.toLowerCase().startsWith(`${LIBRARY_DIR}/`)).length;
  return { documentSteps: calls.length - instruction, instructionSteps: instruction };
}

export const digest = (staged) => sha256(JSON.stringify(staged.files));
