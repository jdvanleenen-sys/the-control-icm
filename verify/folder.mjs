// The folder check. Each instruction file must be short, must stand alone, and the examples
// file must hold shapes only. Run before the folder is frozen.
//
//   node verify/folder.mjs [FOLDER]

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOLDER_DIR, INSTRUCTION_FILES, LIBRARY_DIR, SWITCH_FILE } from '../lib/config.mjs';
import { wordCount } from '../lib/session.mjs';

export const WORD_LIMITS = { 'identity.md': 60, 'rules.md': 220, 'examples.md': 200, 'README.md': 530 };
// The map is generated from the library, so it alone may name the library's own content.
const GENERATED = 'README.md';
const EXAMPLES = 'examples.md';

function libraryNames(folder) {
  const base = join(folder, LIBRARY_DIR);
  if (!existsSync(base)) return [];
  const names = [];
  for (const set of readdirSync(base, { withFileTypes: true }).filter((e) => e.isDirectory())) {
    names.push(set.name, ...readdirSync(join(base, set.name)).filter((n) => n.endsWith('.md')));
  }
  return names;
}

function examplesFailures(text) {
  const failures = [];
  if (/\d/.test(text.replace(/^#+ .*$/gm, ''))) failures.push(`${EXAMPLES} contains a digit; it must hold placeholders only`);
  if (!/\[[^\]]+\]/.test(text)) failures.push(`${EXAMPLES} has no bracketed placeholder`);
  if (!/not like this/i.test(text)) failures.push(`${EXAMPLES} has no example labelled "Not like this"`);
  if (!/^why it fails/im.test(text)) failures.push(`${EXAMPLES} has no line saying why the bad example fails`);
  return failures;
}

export function checkFolder(folder = FOLDER_DIR) {
  const failures = [];
  const library = libraryNames(folder);
  for (const name of INSTRUCTION_FILES) {
    const path = join(folder, name);
    if (!existsSync(path)) { failures.push(`${name} is missing`); continue; }
    const text = readFileSync(path, 'utf8');
    if (text.trim() === '') failures.push(`${name} is empty`);
    if (wordCount(text) > WORD_LIMITS[name]) failures.push(`${name} has ${wordCount(text)} words; the limit is ${WORD_LIMITS[name]}`);
    for (const other of [...INSTRUCTION_FILES, SWITCH_FILE].filter((n) => n !== name)) {
      // A whole file name only: "plot-rules.md" in the map is a document, not rules.md.
      if (new RegExp(`(?<![\\w-])${other.replace('.', '\\.')}`, 'i').test(text)) failures.push(`${name} names ${other}; each file must stand alone`);
    }
    if (name !== GENERATED) {
      for (const word of library) if (new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)) failures.push(`${name} names "${word}" from the library; it must work on any library`);
    }
    if (name === EXAMPLES) failures.push(...examplesFailures(text));
  }
  for (const entry of resolve(folder) === resolve(FOLDER_DIR) ? [] : readdirSync(folder)) {
    if (![...INSTRUCTION_FILES, LIBRARY_DIR].includes(entry)) failures.push(`${entry} is in the folder; the folder is exactly five things`);
  }
  return failures;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const failures = checkFolder(process.argv[2] ?? FOLDER_DIR);
  if (failures.length === 0) console.log('Folder check passed.');
  else { console.error(`Folder check FAILED (${failures.length}):\n${failures.map((f) => `- ${f}`).join('\n')}`); process.exitCode = 1; }
}
