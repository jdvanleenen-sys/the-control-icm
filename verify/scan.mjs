// The silent-failure scan. A session can exit 0 with a normal-looking answer and still be
// broken. This names every such fault. It runs before the analyser and its output is kept.
//
//   node verify/scan.mjs --name pass1

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODEL, runDir, SESSION_TIMEOUT_MS, TURN_LIMIT } from '../lib/config.mjs';
import { parseLog, resultRecord, startRecord } from '../lib/session.mjs';

const NORMAL_STOP = 'end_turn';
const OUT_OF_TURNS = 'error_max_turns';

// What the model did, as opposed to what went wrong with the set-up. A session with only these
// is kept in every average and marked like any other, because the arm may be what caused it.
// It is counted and listed as flagged. Anything else on the list is a fault and is left out.
const BEHAVIOUR = [/^empty answer$/, /^stop reason is /, /^a tool call was refused$/, /^at the turn limit$/, /^at the time limit$/, /^answer says it could not/, /^a tool call returned an error$/, new RegExp(`^result subtype is ${OUT_OF_TURNS}$`)];
export const isBehaviour = (fault) => BEHAVIOUR.some((pattern) => pattern.test(fault));
export const splitFaults = (all) => ({ faults: all.filter((fault) => !isBehaviour(fault)), flags: all.filter(isBehaviour) });
const COULD_NOT_OPEN = /(could not|couldn't|can't|cannot|unable to|wasn't able to|was not able to) (open|read|access)/i;

function startFaults(init, expect) {
  if (!init) return ['no start record'];
  const faults = [];
  if (init.model !== expect.model) faults.push(`model is ${init.model}, expected ${expect.model}`);
  if (expect.version && init.claude_code_version !== expect.version) faults.push(`tool version is ${init.claude_code_version}, expected ${expect.version}`);
  if ((init.mcp_servers ?? []).length > 0) faults.push('an MCP server was loaded');
  if ((init.skills ?? []).length > 0) faults.push('a skill was loaded');
  if ((init.plugins ?? []).some((plugin) => plugin.path !== 'builtin')) faults.push('a plugin that is not built in was loaded');
  return faults;
}

function resultFaults(result, expect) {
  if (!result) return ['no result record'];
  const faults = [];
  const others = Object.keys(result.modelUsage ?? {}).filter((model) => model !== expect.model);
  if (others.length > 0) faults.push(`another model also ran: ${others.sort().join(', ')}`);
  if (result.is_error && result.subtype !== OUT_OF_TURNS) faults.push('result flagged as an error');
  if (result.subtype !== 'success') faults.push(`result subtype is ${result.subtype}`);
  if (String(result.result ?? '').trim() === '') faults.push('empty answer');
  if (result.stop_reason && result.stop_reason !== NORMAL_STOP) faults.push(`stop reason is ${result.stop_reason}`);
  if ((result.permission_denials ?? []).length > 0) faults.push('a tool call was refused');
  if ((result.num_turns ?? 0) >= TURN_LIMIT) faults.push('at the turn limit');
  if ((result.duration_ms ?? 0) >= SESSION_TIMEOUT_MS) faults.push('at the time limit');
  if (COULD_NOT_OPEN.test(String(result.result ?? ''))) faults.push('answer says it could not open or read something');
  return faults;
}

// A request that was allowed while the account was near its limit ran normally. It is counted
// and shown, but it is not a fault. Only a status that is neither of these is one.
const RATE_LIMIT_OK = ['allowed', 'allowed_warning'];
const RATE_LIMIT_WARNING = 'allowed_warning';

export function usageWarning(text) {
  return parseLog(text).events.some((event) => event.type === 'rate_limit_event' && event.rate_limit_info?.status === RATE_LIMIT_WARNING);
}

function eventFaults(events) {
  const faults = new Set();
  for (const event of events) {
    if (event.type === 'rate_limit_event' && event.rate_limit_info?.status && !RATE_LIMIT_OK.includes(event.rate_limit_info.status)) {
      faults.add(`rate limit status is ${event.rate_limit_info.status}`);
    }
    if (event.type !== 'user' || !Array.isArray(event.message?.content)) continue;
    if (event.message.content.some((block) => block.type === 'tool_result' && block.is_error)) faults.add('a tool call returned an error');
  }
  return [...faults];
}

// Every fault in one session log. An empty list means nothing was found.
export function scanLog(text, expect = { model: MODEL, version: null }) {
  const { events, error } = parseLog(text);
  if (error === 'empty') return ['empty log file'];
  if (error === 'unparseable') return ['log does not parse'];
  return [...startFaults(startRecord(events), expect), ...resultFaults(resultRecord(events), expect), ...eventFaults(events)];
}

export const logPath = (dir, s) => join(dir, 'logs', s.code, `r${s.run}`, `${s.question}.jsonl`);

// Scans a whole run against its schedule. A scheduled session with no log is itself a fault.
// Each row carries its faults (left out of the averages) and its flags (kept in them).
export function scanRun(dir) {
  const schedule = JSON.parse(readFileSync(join(dir, 'schedule.json'), 'utf8'));
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const expect = { model: manifest.model, version: manifest.version };
  const sessions = schedule.sessions.slice(0, manifest.limit || schedule.sessions.length);
  return sessions.map((s) => {
    const path = logPath(dir, s);
    const text = existsSync(path) ? readFileSync(path, 'utf8') : null;
    return { code: s.code, run: s.run, question: s.question, ...splitFaults(text === null ? ['log is missing'] : scanLog(text, expect)), usageWarning: text !== null && usageWarning(text) };
  });
}

// One kind of finding, counted and then listed session by session.
function findingTables(rows, field, title) {
  const tally = {};
  for (const row of rows) for (const item of row[field]) tally[item] = (tally[item] ?? 0) + 1;
  const lines = [`| ${title} | Sessions |`, '|---|---|'];
  for (const [item, count] of Object.entries(tally).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) lines.push(`| ${item} | ${count} |`);
  lines.push('', `| Code | Run | Question | ${title} |`, '|---|---|---|---|');
  for (const row of rows.filter((r) => r[field].length > 0)) lines.push(`| ${row.code} | ${row.run} | ${row.question} | ${row[field].join('; ')} |`);
  return lines;
}

export function scanReport(rows) {
  const faulty = rows.filter((row) => row.faults.length > 0);
  const flagged = rows.filter((row) => row.flags.length > 0);
  const warned = rows.filter((row) => row.usageWarning).length;
  const lines = [
    '# Silent-failure scan', '', `Sessions scanned: ${rows.length}. Sessions with a fault: ${faulty.length}.`, '',
    `Sessions kept and flagged for something the model did (a refused call, a tool error, a limit reached, an empty answer): ${flagged.length}.`, '',
    `Sessions that ran while the account was past a usage-warning mark: ${warned}. These ran normally and are not faults.`, '',
  ];
  lines.push(...(faulty.length === 0 ? ['No faults found.'] : findingTables(rows, 'faults', 'Fault')));
  if (flagged.length > 0) lines.push('', ...findingTables(rows, 'flags', 'Flag'));
  return `${lines.join('\n')}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = runDir(process.argv[process.argv.indexOf('--name') + 1]);
  const report = scanReport(scanRun(dir));
  writeFileSync(join(dir, 'scan.md'), report);
  process.stdout.write(report);
}
