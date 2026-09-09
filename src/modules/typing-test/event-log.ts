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
  | { type: 'backspace'; t: number; wasCorrect: boolean };

export type TypingEventLog = TypingLogEvent[];

/**
 * Diffs `prevInput` -> `nextInput` into 0+ timestamped events, all stamped `t`.
 * Handles the common single-char append/remove path, and multi-char deltas
 * (paste, IME commit) by emitting one event per changed character.
 *
 * Each event carries the correctness of the character it adds or removes
 * (checked against `referenceText` at that position) — the single place this
 * fact is computed. Callers (live counters, replay-derived stats) both read
 * it off the event rather than re-deriving character correctness themselves.
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

  // Removed from the end backward: the i-th backspace removes the char that was at
  // prevInput.length - 1 - i.
  for (let i = 0; i < removedCount; i++) {
    const removedIndex = prevInput.length - 1 - i;
    const wasCorrect = prevInput[removedIndex] === referenceText[removedIndex];
    events.push({ type: 'backspace', t, wasCorrect });
  }

  for (let i = 0; i < added.length; i++) {
    const index = prefixLen + i;
    const char = added[i];
    const expected = referenceText[index] ?? '';
    events.push({ type: 'char', t, char, expected, correct: char === expected });
  }

  return events;
}
