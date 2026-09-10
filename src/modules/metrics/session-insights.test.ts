import { describe, expect, it } from 'vitest';
import { deriveTestInsights } from './session-insights';

describe('deriveTestInsights', () => {
  it('creates privacy-safe pace, key, pair, and pause telemetry', () => {
    const insights = deriveTestInsights(
      [
        { type: 'char', t: 100, char: 'a', expected: 'a', correct: true },
        { type: 'char', t: 800, char: 't', expected: 'r', correct: false },
        { type: 'backspace', t: 900, wasCorrect: false },
        { type: 'char', t: 1700, char: 'r', expected: 'r', correct: true },
      ],
      [
        { second: 1, wpm: 12, rawWpm: 24 },
        { second: 2, wpm: 12, rawWpm: 12 },
      ],
    );

    expect(insights.pace).toEqual([
      { second: 1, typedChars: 2, correctChars: 1, backspaces: 1, rawWpm: 24, adjustedWpm: 12 },
      { second: 2, typedChars: 1, correctChars: 1, backspaces: 0, rawWpm: 12, adjustedWpm: 12 },
    ]);
    expect(insights.keys?.r).toEqual({
      attempts: 2,
      correct: 1,
      errorPairs: [{ expected: 'r', typed: 't', count: 1 }],
    });
    expect(insights.pauses).toMatchObject({ longestPauseMs: 800, pausesOver500ms: 2 });
  });

  it('keeps a key pair even when it is outside the global top twelve', () => {
    const eventLog = Array.from({ length: 13 }, (_, index) => ({
      type: 'char' as const,
      t: index,
      char: 'x',
      expected: String.fromCharCode(97 + index),
      correct: false as const,
    }));
    const insights = deriveTestInsights(eventLog, [{ second: 1, wpm: 0, rawWpm: 0 }]);
    expect(insights.errorPairs).toHaveLength(12);
    expect(insights.keys?.m?.errorPairs).toEqual([{ expected: 'm', typed: 'x', count: 1 }]);
  });
});
