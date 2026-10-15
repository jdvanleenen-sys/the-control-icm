// Every fixed value the harness uses lives here, so no number or name is stated twice.

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Worked out from this file's own location, in a way every Node 20 release supports.
export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// The folder under test is the repo's top level: its four instruction files and reference/.
// Everything else in the repo is apparatus and is never staged into an arm.
export const FOLDER_DIR = REPO;
export const QUESTIONS_FILE = resolve(REPO, 'questions.md');
export const STAGE_ROOT = process.env.TC_STAGE_ROOT ?? (process.platform === 'win32' ? 'C:/tc' : '/tmp/tc');
export const CLAUDE_BIN = process.env.CLAUDE_BIN ?? 'claude';

// Order matters: an arm id is one bit per file, in this order.
export const INSTRUCTION_FILES = ['README.md', 'identity.md', 'rules.md', 'examples.md'];
export const LIBRARY_DIR = 'reference';
export const SWITCH_FILE = 'CLAUDE.md';
export const ARM_DOCS_ONLY = 'docs';
export const ARM_EMPTY = 'empty';
export const ARM_FULL = 'c1111';
export const ARM_NONE = 'c0000';
// The known-bad arm: the whole folder loaded first, but its map describes each document with
// another document's entry. It is there to show the test can catch a folder that misleads.
export const ARM_WRONG_MAP = 'wrongmap';

// The pinned model. TC_MODEL lets a visitor try another; the manifest records whichever ran.
export const PINNED_MODEL = 'claude-sonnet-5-5';
export const MODEL = process.env.TC_MODEL ?? PINNED_MODEL;
export const EFFORT = 'medium';
export const ALLOWED_TOOLS = ['Read', 'Glob', 'Grep'];
export const BLOCKED_TOOLS = 'Bash,PowerShell,Edit,Write,NotebookEdit,WebFetch,WebSearch,Agent,mcp__*';
export const SESSION_TIMEOUT_MS = 240000;
export const MAX_ATTEMPTS = 3;
export const TURN_LIMIT = 20;

// The only variables a session inherits. Everything else in the launching shell is dropped.
export const ENV_ALLOWED = [
  'PATH', 'PATHEXT', 'SystemRoot', 'SYSTEMROOT', 'windir', 'COMSPEC', 'TEMP', 'TMP',
  'USERPROFILE', 'HOMEDRIVE', 'HOMEPATH', 'HOME', 'APPDATA', 'LOCALAPPDATA', 'ProgramData',
  'ProgramFiles', 'ProgramFiles(x86)', 'USERNAME', 'OS', 'LANG',
];
export const ENV_FIXED = { CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1', DISABLE_AUTOUPDATER: '1', DISABLE_UPDATES: '1' };

// The headline rule: out of the questions compared, how many must agree.
export const RULE_CLEAR_AT_LEAST = 9;
// A run is void if more than this share of the headline pair's sessions had a fault.
export const FAULT_LIMIT = 0.05;
// Two runs of one arm compared with each other should show no clear difference. This is how
// many of those comparisons may name a direction before the page warns about the rule itself.
export const SELF_COMPARISON_LIMIT = 0;

export function allArms() {
  const cells = [];
  for (let bits = 0; bits < 16; bits += 1) cells.push(`c${bits.toString(2).padStart(4, '0')}`);
  return [...cells, ARM_DOCS_ONLY, ARM_EMPTY, ARM_WRONG_MAP];
}

// What an arm puts on disk and what its switch file loads.
export function armSpec(arm) {
  if (arm === ARM_EMPTY) return { library: false, folder: false, loaded: [] };
  if (arm === ARM_DOCS_ONLY) return { library: true, folder: false, loaded: [] };
  if (arm === ARM_WRONG_MAP) return { library: true, folder: true, loaded: [...INSTRUCTION_FILES], wrongMap: true };
  if (!/^c[01]{4}$/.test(arm)) throw new Error(`Unknown arm "${arm}".`);
  const loaded = INSTRUCTION_FILES.filter((_, i) => arm[i + 1] === '1');
  return { library: true, folder: true, loaded };
}

// What an arm is, in words a reader can follow without a legend.
export function armLabel(arm) {
  if (arm === ARM_EMPTY) return 'Empty';
  if (arm === ARM_DOCS_ONLY) return 'Documents only';
  if (arm === ARM_WRONG_MAP) return 'Folder loaded first, with a map that points to the wrong documents';
  const { loaded } = armSpec(arm);
  if (loaded.length === 0) return 'Folder on disk, nothing loaded';
  if (loaded.length === INSTRUCTION_FILES.length) return 'Folder loaded first (all four files)';
  return `Loaded: ${loaded.map((name) => name.replace('.md', '')).join(' + ')}`;
}

// How often a marker has to guess the arm correctly before we say the answers gave it away.
export const GUESS_TELLS_AT = 0.7;
// Fewer guesses than this on the two headline arms and a marker's guesses say nothing either way.
export const GUESS_MIN = 10;

export const runDir = (name) => resolve(REPO, 'runs', name);
