// The scripted checks on the ICM arm, run before the freeze, and the ICM's minimum text.
//
//   node verify/sup-icm-check.mjs

import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from '../lib/cli.mjs';
import { LIBRARY_DIR, REPO } from '../lib/config.mjs';
import { ARM_EAGER, ARM_ICM, eagerRouter, filesUnder, ICM_SOURCE, icmInstructionFiles, loadedChars, stageSupArm } from '../lib/sup.mjs';
import { makeMap, parseFrontmatter } from '../tools/make-map.mjs';

const DOCLIST = '01 answer/documents.md';
const norm = (t) => t.replace(/\r\n/g, '\n');

// Facts from the live documents that must not appear in the ICM outside its generated list.
export function liveFacts(repo = REPO) {
  const facts = new Set();
  const lib = join(repo, LIBRARY_DIR);
  for (const path of filesUnder(lib)) {
    const text = norm(readFileSync(join(lib, path), 'utf8'));
    for (const m of text.matchAll(/£\s?\d[\d,.]*/g)) facts.add(m[0].replace(/\s/g, ''));
    for (const m of text.matchAll(/\b\d{1,2}:\d{2}\b/g)) facts.add(m[0]);
    for (const m of text.matchAll(/\b\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}\b/g)) facts.add(m[0]);
    for (const m of text.matchAll(/\b\d+\.\d+\b/g)) facts.add(m[0]);
    const meta = parseFrontmatter(text);
    if (meta?.set) facts.add(meta.set);
  }
  return [...facts];
}

export function checks(repo = REPO) {
  const out = [];
  const files = filesUnder(join(repo, 'arms', 'icm'));
  const routers = files.filter((p) => /(^|\/)(CLAUDE|AGENTS)(\.local)?\.md$/i.test(p));
  out.push(['exactly one CLAUDE.md, at the top', JSON.stringify(routers) === '["CLAUDE.md"]']);
  out.push(['no reference/ inside the ICM', !files.some((p) => p.startsWith(`${LIBRARY_DIR}/`))]);
  out.push(['no "@" import in any file', files.every((p) => !/^@\S/m.test(norm(readFileSync(join(repo, 'arms', 'icm', p), 'utf8'))))]);
  const list = norm(readFileSync(join(repo, 'arms', 'icm', DOCLIST), 'utf8'));
  out.push(['the document list is the map script\'s output on the live documents', list === makeMap(join(repo, LIBRARY_DIR))]);
  out.push(['the document list is the folder\'s map, word for word', list === norm(readFileSync(join(repo, 'arms', 'folder', 'README.md'), 'utf8'))]);
  const facts = liveFacts(repo);
  const hits = files.filter((p) => p !== DOCLIST).flatMap((p) => { const t = norm(readFileSync(join(repo, 'arms', 'icm', p), 'utf8')); return facts.filter((f) => t.includes(f)).map((f) => `${p}: ${f}`); });
  out.push([`no figure, time, date, section number or organisation name from the documents outside the list (${facts.length} checked)`, hits.length === 0, hits]);
  const routerLines = norm(readFileSync(join(repo, 'arms', 'icm', 'CLAUDE.md'), 'utf8')).trimEnd().split('\n').length;
  out.push([`router under 60 lines (${routerLines})`, routerLines < 60]);
  return out;
}

export function sizes(repo = REPO) {
  return filesUnder(join(repo, 'arms', 'icm')).map((p) => { const t = norm(readFileSync(join(repo, 'arms', 'icm', p), 'utf8')); return { path: p, lines: t.trimEnd().split('\n').length, chars: t.length, tokensAbout: Math.round(t.length / 4) }; });
}

function main() {
  const results = checks();
  for (const [name, ok, detail] of results) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail?.length ? `\n      ${detail.join('\n      ')}` : ''}`);
  console.log('\n| File | Lines | Characters | Tokens, about |\n|---|---|---|---|');
  for (const s of sizes()) console.log(`| ${s.path} | ${s.lines} | ${s.chars} | ${s.tokensAbout} |`);
  const icm = stageSupArm(join(REPO, '.check-stage', 'icm'), ARM_ICM);
  const eager = stageSupArm(join(REPO, '.check-stage', 'eager'), ARM_EAGER);
  const sameFiles = Object.keys(icm.files).filter((p) => p !== 'CLAUDE.md').every((p) => icm.files[p] === eager.files[p]) && Object.keys(icm.files).length === Object.keys(eager.files).length;
  const routerOk = eagerRouter() === norm(readFileSync(join(REPO, '.check-stage', 'eager', 'CLAUDE.md'), 'utf8'));
  rmSync(join(REPO, '.check-stage'), { recursive: true, force: true });
  console.log(`\n${sameFiles && routerOk ? 'PASS' : 'FAIL'}  icm-eager differs from icm only in its router, which carries ${icmInstructionFiles(ICM_SOURCE).join(', ')}`);
  const read = (p) => norm(readFileSync(join(ICM_SOURCE, p), 'utf8')).length;
  const minimum = icm.loadedChars + read('01 answer/CONTEXT.md') + read(DOCLIST);
  console.log(`\nText loaded first: icm ${icm.loadedChars}, icm-eager ${eager.loadedChars}, folder 5261.`);
  console.log(`The ICM's minimum text per question (its router, plus the stage contract and the document list its router says to read before anything else): ${minimum} characters, against the folder's 5261 loaded first.`);
  if (results.some(([, ok]) => !ok) || !sameFiles || !routerOk) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli(main);
