/** Timestamped keystroke log, derived by diffing consecutive `input` values instead of raw key events. */

export type TypingLogEvent =
  | { type: 'char'; t: number; char: string; expected: string; correct: boolean }
  | { type: 'backspace'; t: number; wasCorrect: boolean };

export type TypingEventLog = TypingLogEvent[];

/** Diffs `prevInput` -> `nextInput` into 0+ timestamped events, handling multi-char deltas like paste or IME commit. */
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
