// Turns one raw session log into one row of counts. Nothing here judges an answer.

import { INSTRUCTION_FILES, LIBRARY_DIR } from './config.mjs';

const flat = (path) => String(path ?? '').replace(/\\/g, '/');
const squash = (text) => String(text ?? '').replace(/\s+/g, ' ').trim();
export const wordCount = (text) => (squash(text) === '' ? 0 : squash(text).split(' ').length);

export function parseLog(text) {
  if (text.trim() === '') return { events: [], error: 'empty' };
  try {
    return { events: text.split('\n').filter((line) => line.trim() !== '').map((line) => JSON.parse(line)), error: null };
  } catch {
    return { events: [], error: 'unparseable' };
  }
}

export const startRecord = (events) => events.find((e) => e.type === 'system' && e.subtype === 'init') ?? null;
export const resultRecord = (events) => events.find((e) => e.type === 'result') ?? null;

// The part of a path inside the staged arm folder, so counts do not depend on where it was staged.
export function insideStage(path, stageDir) {
  const full = flat(path).replace(/^\.\//, '');
  const base = flat(stageDir).replace(/\/$/, '');
  const at = full.toLowerCase().indexOf(base.toLowerCase());
  if (base === '' || at === -1) return full;
  return full.slice(at + base.length).replace(/^\//, '') || '.';
}

// Every tool call the main model made, in order, with whether it succeeded.
export function toolCalls(events, stageDir) {
  const calls = [];
  const failed = new Set();
  for (const event of events) {
    const content = event.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (event.type === 'assistant' && block.type === 'tool_use' && !event.parent_tool_use_id) {
        const input = block.input ?? {};
        calls.push({ id: block.id, tool: block.name, target: insideStage(input.file_path ?? input.path ?? input.pattern ?? '', stageDir), pattern: input.pattern ?? null, hasPath: Boolean(input.file_path ?? input.path) });
      }
      if (event.type === 'user' && block.type === 'tool_result' && block.is_error) failed.add(block.tool_use_id);
    }
  }
  return calls.map((call) => ({ ...call, ok: !failed.has(call.id) }));
}

const resultText = (content) => (Array.isArray(content) ? content.map((part) => part.text ?? '').join('') : String(content ?? ''));

// The number of characters the main model's tools handed back to it: file text, search hits,
// listings and refusals alike. Loaded files and tool results can be compared in this one unit.
export function charsFetched(events) {
  const mine = new Set(toolCalls(events, '').map((call) => call.id));
  let total = 0;
  for (const event of events) {
    if (event.type !== 'user' || !Array.isArray(event.message?.content)) continue;
    for (const block of event.message.content) {
      if (block.type === 'tool_result' && mine.has(block.tool_use_id)) total += resultText(block.content).length;
    }
  }
  return total;
}

function tokenCounts(usage) {
  if (!usage) return { tokensIn: null, tokensOut: null, cacheRead: null };
  const fresh = (usage.input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0);
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  return { tokensIn: fresh + cacheRead, tokensOut: usage.output_tokens ?? 0, cacheRead };
}

const isDocument = (target) => target.toLowerCase().startsWith(`${LIBRARY_DIR}/`);
const instructionName = (target) => INSTRUCTION_FILES.find((name) => name.toLowerCase() === target.toLowerCase()) ?? null;

export function summarise(events, meta) {
  const calls = toolCalls(events, meta.stageDir);
  const opened = calls.filter((c) => c.tool === 'Read' && c.ok);
  const result = resultRecord(events) ?? {};
  const init = startRecord(events) ?? {};
  return {
    code: meta.code, run: meta.run, question: meta.question,
    steps: calls.length,
    opens: opened.length,
    documentsOpened: new Set(opened.filter((c) => isDocument(c.target)).map((c) => c.target.toLowerCase())).size,
    searches: calls.filter((c) => c.tool === 'Grep').length,
    listings: calls.filter((c) => c.tool === 'Glob').length,
    refused: calls.filter((c) => !c.ok).length,
    charsFetched: charsFetched(events),
    instructionOpened: [...new Set(opened.map((c) => instructionName(c.target)).filter(Boolean))].sort(),
    ...tokenCounts(result.usage),
    seconds: result.duration_ms ? Math.round(result.duration_ms / 100) / 10 : null,
    words: wordCount(result.result),
    turns: result.num_turns ?? null,
    costUsd: result.total_cost_usd ?? null,
    model: init.model ?? null,
    version: init.claude_code_version ?? null,
    modelsUsed: Object.keys(result.modelUsage ?? {}).sort(),
    answer: String(result.result ?? ''),
    calls,
  };
}
