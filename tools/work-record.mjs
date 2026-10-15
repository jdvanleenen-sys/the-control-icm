// Turns a build session's raw transcript into its work record: the prompt it was given, what it
// wrote, every tool call and every tool result, in order. Context the session inherited from the
// machine it ran on (the operator's own instruction files, reminders) is left out, and the
// operator's user names (TC_REDACT) are replaced.
//
//   node tools/work-record.mjs <raw.jsonl> <out.md>

import { readFileSync, writeFileSync } from 'node:fs';

const [src, out] = process.argv.slice(2);
// Names to hide are given in TC_REDACT, separated by commas, so none is written here.
const names = (process.env.TC_REDACT ?? '').split(',').filter(Boolean);
const redact = (s) => names.reduce((t, n) => t.split(n).join('<user>'), String(s));
const text = (c) => (Array.isArray(c) ? c.map((p) => p.text ?? (p.type === 'image' ? '[image]' : '')).join('') : String(c ?? ''));
const lines = [];
let first = true;
for (const raw of readFileSync(src, 'utf8').split('\n').filter(Boolean)) {
  const e = JSON.parse(raw);
  const content = e.message?.content;
  if (e.type === 'user' && first) {
    const prompt = typeof content === 'string' ? content : text((content ?? []).filter((b) => b.type === 'text'));
    lines.push('## Prompt', '', prompt.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').trim(), '');
    first = false;
    continue;
  }
  if (!Array.isArray(content)) continue;
  for (const b of content) {
    if (e.type === 'assistant' && b.type === 'text' && b.text.trim()) lines.push('## Builder', '', b.text.trim(), '');
    if (e.type === 'assistant' && b.type === 'tool_use') lines.push(`## Call: ${b.name}`, '', '```json', JSON.stringify(b.input, null, 2), '```', '');
    if (e.type === 'user' && b.type === 'tool_result') lines.push('## Result', '', '```', text(b.content).replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').trim().slice(0, 20000), '```', '');
  }
}
writeFileSync(out, redact(lines.join('\n')));
console.log(`${out}: ${lines.length} lines`);
