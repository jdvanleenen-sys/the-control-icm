// Reads a question file. A question is a "## <id>" heading followed by fields written as
// "**Label:** text". The prompt is the quoted block under the Prompt label.

import { readFileSync } from 'node:fs';

const squash = (text) => text.replace(/\s+/g, ' ').trim();

function field(body, label) {
  const match = body.match(new RegExp(`\\*\\*${label}[^*]*\\*\\*([\\s\\S]*?)(?=\\n\\*\\*[A-Z][^*]*:\\*\\*|$)`));
  return match ? match[1].trim() : '';
}

function promptOf(body) {
  const quoted = body.split('\n').filter((line) => line.startsWith('>'));
  return squash(quoted.map((line) => line.replace(/^>\s?/, '')).join(' '));
}

export function parseQuestions(markdown) {
  const parts = markdown.split(/^## (\S+)\s*$/m);
  const questions = [];
  for (let i = 1; i < parts.length; i += 2) {
    const body = parts[i + 1];
    questions.push({
      id: parts[i],
      prompt: promptOf(body),
      set: field(body, 'Set:'),
      expected: field(body, 'Expected answer:'),
      source: field(body, 'Source:'),
      requires: field(body, 'Correct requires:'),
    });
  }
  return questions;
}

export function loadQuestions(path) {
  const questions = parseQuestions(readFileSync(path, 'utf8'));
  if (questions.length === 0) throw new Error(`No questions found in ${path}.`);
  const blank = questions.filter((q) => q.prompt === '');
  if (blank.length > 0) throw new Error(`Questions with no prompt in ${path}: ${blank.map((q) => q.id).join(', ')}.`);
  return questions;
}
