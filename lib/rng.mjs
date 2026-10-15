// Seeded randomness for anything that must be reproducible from a recorded seed, and true
// randomness for codes that must not be guessable.

import { createHash, randomInt } from 'node:crypto';

export function seededRandom(seedText) {
  let state = createHash('sha256').update(String(seedText)).digest().readUInt32LE(0);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(items, random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Letters and digits that cannot be mistaken for one another when typed.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function uniqueCodes(count, length = 4) {
  const codes = new Set();
  while (codes.size < count) {
    let code = '';
    for (let i = 0; i < length; i += 1) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
    codes.add(code);
  }
  return [...codes];
}

export function uniqueNumbers(count, low = 1000, high = 9999) {
  if (count > high - low + 1) throw new Error(`Cannot draw ${count} unique numbers from ${low} to ${high}.`);
  const numbers = new Set();
  while (numbers.size < count) numbers.add(randomInt(low, high + 1));
  return [...numbers];
}

export const sha256 = (data) => createHash('sha256').update(data).digest('hex');
