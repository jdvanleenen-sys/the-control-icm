// Starts one Claude Code session with fixed flags and a stripped environment.

import { spawnSync } from 'node:child_process';
import {
  ALLOWED_TOOLS, BLOCKED_TOOLS, CLAUDE_BIN, EFFORT, ENV_ALLOWED, ENV_FIXED, MODEL, SESSION_TIMEOUT_MS,
} from './config.mjs';

// A session sees only the allowed variables, so nothing from the launching shell leaks in.
export function sessionEnv(source = process.env) {
  const env = {};
  for (const name of ENV_ALLOWED) if (source[name] !== undefined) env[name] = source[name];
  return { ...env, ...ENV_FIXED };
}

export function sessionArgs(prompt) {
  return [
    '--setting-sources', 'project', '-p', prompt,
    '--model', MODEL,
    '--effort', EFFORT,
    '--tools', ALLOWED_TOOLS.join(','),
    '--disallowedTools', BLOCKED_TOOLS,
    '--permission-mode', 'dontAsk',
    '--strict-mcp-config',
    '--disable-slash-commands',
    '--output-format', 'stream-json', '--verbose',
  ];
}

export function programVersion(bin = CLAUDE_BIN) {
  const done = spawnSync(bin, ['--version'], { encoding: 'utf8', env: sessionEnv() });
  if (done.error || done.status !== 0) {
    throw new Error(`Cannot run the Claude Code program "${bin}". Set CLAUDE_BIN to its path. ${done.error?.message ?? done.stderr ?? ''}`.trim());
  }
  const match = done.stdout.match(/\d+\.\d+\.\d+/);
  if (!match) throw new Error(`Could not read a version from "${done.stdout.trim()}".`);
  return match[0];
}

export function ask(dir, prompt, bin = CLAUDE_BIN) {
  const started = Date.now();
  const done = spawnSync(bin, sessionArgs(prompt), {
    cwd: dir,
    encoding: 'utf8',
    timeout: SESSION_TIMEOUT_MS,
    maxBuffer: 64 * 1024 * 1024,
    env: sessionEnv(),
  });
  return {
    stream: done.stdout ?? '',
    stderr: done.stderr ?? '',
    exit: done.status,
    timedOut: done.error?.code === 'ETIMEDOUT',
    wallMs: Date.now() - started,
  };
}
