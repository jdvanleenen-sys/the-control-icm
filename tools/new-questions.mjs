// Asks a fresh Claude session the entry's question prompt (or key-check prompt), word for word,
// with the 18 documents attached as two text files, one per organisation, as the entry did.
// The session runs in an empty folder with no tools, so it sees the prompt and nothing else.
//
//   node tools/new-questions.mjs write          the writer: claude-opus-5-5, question-prompt.md
//   node tools/new-questions.mjs check          the key check: claude-fable-5-1, prompt one
//   node tools/new-questions.mjs dispute <file> one dispute round, resuming the session named in <file>
//
// Every prompt sent and every raw reply is saved under generator/new/.

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAUDE_BIN, EFFORT, REPO } from '../lib/config.mjs';
import { sessionEnv } from '../lib/claude.mjs';

const OUT = join(REPO, 'generator', 'new');
const WRITER = 'claude-opus-5-5';
const CHECKER = 'claude-fable-5-1';

// The part of a prompt file between the first two lines that are exactly "---" after the heading.
export function promptBody(file, which = 0) {
  const text = readFileSync(join(REPO, 'generator', file), 'utf8').replace(/\r\n/g, '\n');
  const parts = text.split('\n---\n');
  if (parts.length < 2 + which * 2) throw new Error(`${file} has no prompt number ${which + 1}.`);
  return parts[1 + which * 2].trim();
}

// The documents as two text files, one per organisation, each document under its file name.
export function attachments() {
  const lib = join(REPO, 'reference');
  return readdirSync(lib).sort().map((set) => {
    const docs = readdirSync(join(lib, set)).filter((n) => n.endsWith('.md')).sort();
    const body = docs.map((n) => `### ${n}\n\n${readFileSync(join(lib, set, n), 'utf8').replace(/\r\n/g, '\n').trim()}`).join('\n\n');
    return `<attached file="${set}.txt">\n${body}\n</attached>`;
  }).join('\n\n');
}

function run(model, prompt, label, resume = null) {
  mkdirSync(OUT, { recursive: true });
  const room = mkdtempSync(join(tmpdir(), 'tc-q-'));
  const args = ['--setting-sources', 'project', '-p', '--model', model, '--effort', EFFORT, '--tools', '',
    '--strict-mcp-config', '--disable-slash-commands', '--output-format', 'stream-json', '--verbose'];
  if (resume) args.push('--resume', resume);
  writeFileSync(join(OUT, `${label}.prompt.txt`), prompt);
  const done = spawnSync(CLAUDE_BIN, args, { cwd: room, input: prompt, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: sessionEnv(), timeout: 900000 });
  writeFileSync(join(OUT, `${label}.stream.jsonl`), done.stdout ?? '');
  const events = (done.stdout ?? '').split('\n').filter(Boolean).map((line) => { try { return JSON.parse(line); } catch { return null; } }).filter(Boolean);
  const result = events.find((e) => e.type === 'result');
  const init = events.find((e) => e.type === 'system' && e.subtype === 'init');
  if (!result || result.is_error) throw new Error(`${label}: no answer (exit ${done.status}). ${done.stderr ?? ''}`.trim());
  writeFileSync(join(OUT, `${label}.answer.md`), result.result);
  writeFileSync(join(OUT, `${label}.session.json`), JSON.stringify({ model: init?.model, version: init?.claude_code_version, session: result.session_id, label, at: new Date().toISOString() }, null, 2));
  console.log(`${label}: ${init?.model}, ${result.result.length} characters, saved under generator/new/`);
  return result.result;
}

const WRITE_PREFIX = 'Attached are the working papers';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [mode, arg] = process.argv.slice(2);
  if (mode === 'write') {
    const body = promptBody('question-prompt.md');
    if (!body.startsWith(WRITE_PREFIX)) throw new Error('question-prompt.md did not split where expected.');
    run(WRITER, `${body}\n\n${attachments()}`, 'write');
  } else if (mode === 'check') {
    const pool = readFileSync(join(OUT, 'question-pool.md'), 'utf8');
    const prompts = [...pool.matchAll(/^## (N\d+)[\s\S]*?\*\*Prompt \(paste exactly\):\*\*\s*\n\s*\n> (.+)$/gm)].map((m) => `## ${m[1]}\n\n${m[2].trim()}`);
    if (prompts.length === 0) throw new Error('No prompts found in generator/new/question-pool.md.');
    const body = promptBody('key-check-prompt.md', 0).replace('{PASTE THE 20 PROMPTS HERE, EACH UNDER ITS NUMBER, WITH NOTHING ELSE}', prompts.join('\n\n'));
    run(CHECKER, `${body}\n\n${attachments()}`, 'check');
  } else if (mode === 'dispute') {
    const spec = JSON.parse(readFileSync(arg, 'utf8'));
    run(spec.model, spec.prompt, spec.label, spec.resume);
  } else {
    console.error('Usage: node tools/new-questions.mjs write | check | dispute <file>');
    process.exit(1);
  }
}
