// The leak scan. Searches every file under a folder for strings that could identify the
// person or machine that ran it. Reports the kind and the place, never the string itself.
//
//   node verify/leaks.mjs [PATH]

import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir, hostname, userInfo } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPO } from '../lib/config.mjs';

const SKIP_DIRS = new Set(['.git', 'node_modules']);
// These two files hold the patterns and the planted examples, so they would flag themselves.
// They are named in the output every time, so the gap is visible.
export const SKIPPED_FILES = ['verify/leaks.mjs', 'verify/selftest-proof.mjs'];
// Not a person's address: the tooling's own, and switch-file pointers such as "@rules.md".
const ALLOWED_EMAILS = /noreply@anthropic\.com|@[A-Za-z0-9._-]+\.md\b/gi;
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Home paths appear in logs with single or doubled backslashes, or forward slashes.
const pathPattern = (path) => new RegExp(escape(path).replace(/(\\\\|\/)/g, '[\\\\/]+'), 'i');

export function leakPatterns({ user = userInfo().username, home = homedir(), host = hostname() } = {}) {
  return [
    ['the user name of whoever ran this', new RegExp(escape(user), 'i')],
    ['the home folder path', pathPattern(home)],
    ['the machine name', new RegExp(`\\b${escape(host)}\\b`, 'i')],
    ['a user-profile path', /[A-Za-z]:[\\/]+Users[\\/]+[^\\/"\s]+|\/(home|Users)\/[^/"\s]+/],
    ['an email address', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/],
    ['a cloud-drive folder', /OneDrive|Dropbox|Google Drive|iCloud/i],
    ['a key or token', /\b(sk-[A-Za-z0-9-]{16,}|ghp_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16})\b/],
  ];
}

// Extra words to look for, such as a first name or a company, given at run time so that they
// are never written into the repo: TC_LEAK_WORDS="word one,word two".
export function wordPatterns(list = process.env.TC_LEAK_WORDS ?? '') {
  return list.split(',').map((word) => word.trim()).filter(Boolean).map((word) => ['a word you asked the scan to look for', new RegExp(`\\b${escape(word)}\\b`, 'i')]);
}

// How many different people the commit history names. The scan reports the count and leaves
// the judgment to the reader, since a public repo is signed on purpose.
export function historyIdentities(repo) {
  const done = spawnSync('git', ['-C', repo, 'log', '--format=%an <%ae>%n%cn <%ce>'], { encoding: 'utf8' });
  return done.status === 0 ? new Set(done.stdout.split('\n').filter(Boolean)).size : 0;
}

export function scanText(text, patterns = leakPatterns()) {
  const cleaned = text.replace(ALLOWED_EMAILS, '');
  return patterns.filter(([, pattern]) => pattern.test(cleaned)).map(([kind]) => kind);
}

function walk(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) { if (!SKIP_DIRS.has(name)) walk(path, found); } else found.push(path);
  }
  return found;
}

export function scanTree(root, patterns = leakPatterns()) {
  const hits = [];
  for (const path of walk(root)) {
    const file = relative(root, path).replace(/\\/g, '/');
    if (SKIPPED_FILES.includes(file)) continue;
    for (const kind of scanText(readFileSync(path, 'utf8'), patterns)) hits.push({ file, kind });
  }
  return hits;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ?? REPO;
  const extra = wordPatterns();
  const hits = scanTree(root, [...leakPatterns(), ...extra]);
  console.log(`Extra words looked for: ${extra.length} (set TC_LEAK_WORDS to add a first name, a company or a project name).`);
  console.log(`The commit history names ${historyIdentities(root)} identity(ies). They are not scanned; list them with: git log --format="%an <%ae>"`);
  console.log(`Not scanned, because they hold the scan's own patterns and planted examples: ${SKIPPED_FILES.join(', ')}.`);
  if (hits.length === 0) console.log('Leak scan passed: no private string found.');
  else { console.error(`Leak scan found ${hits.length} place(s):\n${hits.map((h) => `- ${h.file}: ${h.kind}`).join('\n')}`); process.exitCode = 1; }
}
