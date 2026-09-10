import { describe, expect, it } from 'vitest';
import { deriveBaseline, deriveCoachingInsight } from './coaching';
import type { TestSession } from '@/modules/session/types';

const config = {
  mode: 'time' as const,
  timeSeconds: 60,
  wordCount: 25,
  language: 'english' as const,
  punctuationEnabled: false,
  numbersEnabled: false,
};

const emptyInsights = {
  correctionCount: 0,
  errorPairs: [],
  pace: [],
  keys: {},
  pauses: {
    longestPauseMs: 0,
    pausesOver500ms: 0,
    earlyAverageWpm: 0,
    middleAverageWpm: 0,
    finalAverageWpm: 0,
  },
  correctionClusters: [],
};

function test(wpm: number, date: string, overrides: Partial<TestSession> = {}): TestSession {
  const rawWpm = overrides.rawWpm ?? wpm + 5;
  return {
    wpm,
    rawWpm,
    accuracy: 95,
    testDate: date,
    testDuration: 60,
    wordsTyped: 20,
    correctWords: 19,
    letterAccuracy: { r: { correct: 7, total: 10 } },
    mode: 'time',
    consistency: 80,
    burst: 90,
    wpmSeries: [],
    config,
    counters: {
      correctChars: wpm * 5,
      typedChars: rawWpm * 5,
      backspaces: 0,
      correctWords: 19,
      completedWords: 20,
    },
    insights: emptyInsights,
    ...overrides,
  };
}

describe('coaching', () => {
  it('compares only comparable earlier tests and requires two samples', () => {
    const current = test(70, '2026-01-03T00:00:00.000Z');
    expect(
      deriveBaseline(current, [
        current,
        test(60, '2026-01-01T00:00:00.000Z'),
        test(64, '2026-01-02T00:00:00.000Z'),
      ]),
    ).toBe(62);
    expect(
      deriveBaseline(current, [current, test(60, '2026-01-01T00:00:00.000Z')]),
    ).toBeUndefined();
  });

  it('makes a weak-key recommendation only with enough presses', () => {
    expect(deriveCoachingInsight(test(70, '2026-01-03T00:00:00.000Z', { rawWpm: 70 })).title).toBe(
      'Focus on R',
    );
  });

  it('ignores the inactive target when comparing matching configurations', () => {
    const current = test(70, '2026-01-03T00:00:00.000Z');
    const differentWordTarget = test(60, '2026-01-01T00:00:00.000Z', {
      config: { ...config, wordCount: 100 },
    });
    const matchingTimeTest = test(64, '2026-01-02T00:00:00.000Z');
    expect(deriveBaseline(current, [current, differentWordTarget, matchingTimeTest])).toBe(62);
  });
});
