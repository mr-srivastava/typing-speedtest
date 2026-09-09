/**
 * Timestamped keystroke log, derived by diffing consecutive `input` values.
 *
 * This app drives typing through a controlled `<textarea onChange>`, not raw
 * keydown/keyup listeners, so "diff prevInput -> nextInput" is the natural
 * equivalent of Monkeytype's literal keystroke capture — it needs no new DOM
 * event wiring and stays purely a function of state already flowing through
 * the engine.
 */

export type TypingLogEvent =
  | { type: 'char'; t: number; char: string; expected: string; correct: boolean }
  | { type: 'backspace'; t: number };

export type TypingEventLog = TypingLogEvent[];

/**
 * Diffs `prevInput` -> `nextInput` into 0+ timestamped events, all stamped `t`.
 * Handles the common single-char append/remove path, and multi-char deltas
 * (paste, IME commit) by emitting one event per changed character.
 */
export function diffInputToEvents(
  prevInput: string,
  nextInput: string,
  referenceText: string,
  t: number,
): TypingLogEvent[] {
  if (prevInput === nextInput) {
    return [];
  }

  let prefixLen = 0;
  const maxPrefix = Math.min(prevInput.length, nextInput.length);
  while (prefixLen < maxPrefix && prevInput[prefixLen] === nextInput[prefixLen]) {
    prefixLen++;
  }

  const removedCount = prevInput.length - prefixLen;
  const added = nextInput.slice(prefixLen);

  const events: TypingLogEvent[] = [];

  for (let i = 0; i < removedCount; i++) {
    events.push({ type: 'backspace', t });
  }

  for (let i = 0; i < added.length; i++) {
    const index = prefixLen + i;
    const char = added[i];
    const expected = referenceText[index] ?? '';
    events.push({ type: 'char', t, char, expected, correct: char === expected });
  }

  return events;
}
