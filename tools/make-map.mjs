// Generates the folder's map (README.md) from the frontmatter of the documents in reference/.
// The map is information only: it may contain only what the documents' frontmatter states.
// How to look things up is an instruction, and lives in rules.md.
//
//   node tools/make-map.mjs

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOLDER_DIR, LIBRARY_DIR } from '../lib/config.mjs';

const ROLE_NOTES = { governing: '', changes: ' Changes document.', summary: ' Summary; does not govern.', archive: ' Archive; does not govern.' };
const ROLE_ORDER = ['governing', 'changes', 'summary', 'archive'];

const unquote = (value) => (value.startsWith('"') ? JSON.parse(value) : value);

export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const data = {};
  let list = null;
  for (const line of match[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && list) { data[list].push(unquote(item[1].trim())); continue; }
    const pair = line.match(/^([a-z]+):\s*(.*)$/);
    if (!pair) continue;
    if (pair[2] === '') { list = pair[1]; data[list] = []; } else { list = null; data[pair[1]] = unquote(pair[2]); }
  }
  return data;
}

function documentLine(path, meta) {
  if (!(meta.role in ROLE_NOTES)) throw new Error(`${path} has an unknown role "${meta.role}".`);
  const replaces = meta.replaces?.length ? ` Replaces: ${meta.replaces.join('; ')}.` : '';
  const note = meta.note ? ` ${meta.note}` : '';
  return `- ${path}: ${meta.covers.replace(/\.+$/, '')}.${ROLE_NOTES[meta.role]}${replaces}${note}`;
}

export function makeMap(libraryDir) {
  const lines = ['# Map of the library', ''];
  for (const set of readdirSync(libraryDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort()) {
    const docs = readdirSync(join(libraryDir, set)).filter((name) => name.endsWith('.md')).sort().map((name) => {
      const meta = parseFrontmatter(readFileSync(join(libraryDir, set, name), 'utf8').replace(/\r\n/g, '\n'));
      if (!meta) throw new Error(`${set}/${name} has no frontmatter.`);
      return { path: `${LIBRARY_DIR}/${set}/${name}`, meta };
    });
    docs.sort((a, b) => ROLE_ORDER.indexOf(a.meta.role) - ROLE_ORDER.indexOf(b.meta.role) || a.path.localeCompare(b.path));
    lines.push(`## ${docs[0].meta.set}`, '', ...docs.map((d) => documentLine(d.path, d.meta)), '');
  }
  return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const text = makeMap(join(FOLDER_DIR, LIBRARY_DIR));
  writeFileSync(join(FOLDER_DIR, 'README.md'), text);
  console.log(`README.md written: ${text.split(/\s+/).filter(Boolean).length} words`);
}
