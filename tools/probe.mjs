// The delivery check. Each instruction file gets a unique marker word in a probe copy. One
// session per arm is asked which marker words it was given. An arm passes when it reports
// exactly the words of the files its switch file names, without opening anything.
//
//   node tools/probe.mjs --name pass1

import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ask } from '../lib/claude.mjs';
import { armSpec, INSTRUCTION_FILES, STAGE_ROOT } from '../lib/config.mjs';
import { uniqueCodes } from '../lib/rng.mjs';
import { parseLog, resultRecord, toolCalls } from '../lib/session.mjs';
import { stageAll } from '../lib/stage.mjs';
import { runCli, sealedRunDir } from '../lib/cli.mjs';

const PROBE_PROMPT = 'Do not use any tool. Some text you were given before this message may contain lines of the form "Marker word: X". Reply with every such X, separated by spaces and nothing else. If there are none, reply with the single word NONE.';
const MARKER_PATTERN = /\bMK[A-Z2-9]{6}\b/g;

function main() {
  const dir = sealedRunDir('Example: node tools/probe.mjs --name sealed');
  const key = JSON.parse(readFileSync(join(dir, 'key.json'), 'utf8'));
  const words = uniqueCodes(INSTRUCTION_FILES.length, 6);
  const markers = Object.fromEntries(INSTRUCTION_FILES.map((name, i) => [name, `MK${words[i]}`]));
  const staged = stageAll(key.arms, { root: `${STAGE_ROOT}/probe`, edit: (name, text) => `${text.trimEnd()}\n\nMarker word: ${markers[name]}\n` });
  const lines = ['# Delivery probe', '', '| Code | Expected | Reported | Tool calls | Result |', '|---|---|---|---|---|'];
  let failed = 0;
  for (const code of Object.keys(key.arms).sort()) {
    const expected = armSpec(key.arms[code]).loaded.map((name) => markers[name]).sort();
    const done = ask(staged[code].dir, PROBE_PROMPT);
    const { events } = parseLog(done.stream);
    const reported = [...new Set(String(resultRecord(events)?.result ?? '').match(MARKER_PATTERN) ?? [])].sort();
    const calls = toolCalls(events, staged[code].dir).length;
    const pass = calls === 0 && expected.join(' ') === reported.join(' ');
    if (!pass) failed += 1;
    lines.push(`| ${code} | ${expected.join(' ') || 'none'} | ${reported.join(' ') || 'none'} | ${calls} | ${pass ? 'pass' : 'FAIL'} |`);
    console.log(lines.at(-1));
  }
  lines.push('', failed === 0 ? 'Every arm was given exactly the files its switch file names.' : `${failed} arm(s) failed.`);
  writeFileSync(join(dir, 'probe.md'), `${lines.join('\n')}\n`);
  rmSync(`/probe`, { recursive: true, force: true });
  if (failed > 0) process.exitCode = 1;
}

runCli(main);
