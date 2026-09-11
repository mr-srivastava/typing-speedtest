import { describe, expect, it } from 'vitest';
import { createInMemorySessionStore } from './adapters/in-memory';
import { validateStoredData } from './validate';
import type { TestSession } from './types';

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

function makeTest(overrides: Partial<TestSession> = {}): TestSession {
  const wordsTyped = overrides.wordsTyped ?? 60;
  const correctWords = overrides.correctWords ?? 57;
  return {
    wpm: 60,
    rawWpm: 65,
    accuracy: 95,
    testDate: '2026-01-01T00:00:00.000Z',
    testDuration: 60,
    wordsTyped,
    correctWords,
    letterAccuracy: { a: { correct: 10, total: 10 } },
    mode: 'time',
    consistency: 80,
    burst: 90,
    wpmSeries: [],
    config,
    counters: {
      correctChars: correctWords * 5,
      typedChars: wordsTyped * 5,
      backspaces: 0,
      correctWords,
      completedWords: wordsTyped,
    },
    insights: emptyInsights,
    ...overrides,
  };
}

describe('SessionStore (in-memory)', () => {
  it('creates initial cumulative stats on first recordTest', () => {
    const store = createInMemorySessionStore();
    const test = makeTest();

    const data = store.recordTest(test);

    expect(data.lastSession).toEqual(test);
    expect(data.cumulative).toEqual({
      totalTests: 1,
      totalWordsTyped: 60,
      totalTimeSpent: 60,
      totalCorrectWords: 57,
      weightedWPM: 60,
      weightedRawWPM: 65,
      weightedAccuracy: 95,
      weightedConsistency: 80,
      weightedBurst: 90,
      letterStats: { a: { correct: 10, total: 10 } },
      firstTestDate: test.testDate,
      lastTestDate: test.testDate,
      exact: {
        totalCorrectChars: 285,
        totalTypedChars: 300,
        totalBackspaces: 0,
        exactDurationSeconds: 60,
        exactCorrectWords: 57,
        exactCompletedWords: 60,
        exactTestCount: 1,
      },
    });
    expect(store.load()).toEqual(data);
  });

  it('merges weighted WPM/accuracy and letter stats on subsequent tests', () => {
    const store = createInMemorySessionStore();
    store.recordTest(
      makeTest({
        testDuration: 60,
        wordsTyped: 60,
        letterAccuracy: { a: { correct: 8, total: 10 } },
        // 300 correct / 325 typed chars over 60s → 60 WPM / 65 raw WPM
        counters: {
          correctChars: 300,
          typedChars: 325,
          backspaces: 0,
          correctWords: 54,
          completedWords: 60,
        },
      }),
    );

    const second = makeTest({
      testDate: '2026-01-02T00:00:00.000Z',
      testDuration: 60,
      wordsTyped: 40,
      correctWords: 40,
      letterAccuracy: {
        a: { correct: 5, total: 5 },
        b: { correct: 3, total: 4 },
      },
      // 400 correct / 425 typed chars over 60s → 80 WPM / 85 raw WPM
      counters: {
        correctChars: 400,
        typedChars: 425,
        backspaces: 0,
        correctWords: 40,
        completedWords: 40,
      },
    });

    const data = store.recordTest(second);

    expect(data.cumulative.totalTests).toBe(2);
    expect(data.cumulative.totalWordsTyped).toBe(100);
    expect(data.cumulative.totalTimeSpent).toBe(120);
    // (300+400) correct chars / 5 / (120s / 60) = 70
    expect(data.cumulative.weightedWPM).toBe(70);
    // (325+425) typed chars / 5 / (120s / 60) = 75
    expect(data.cumulative.weightedRawWPM).toBe(75);
    // (54+40) correct words / (60+40) completed words = 94%
    expect(data.cumulative.weightedAccuracy).toBe(94);
    expect(data.cumulative.letterStats).toEqual({
      a: { correct: 13, total: 15 },
      b: { correct: 3, total: 4 },
    });
    expect(data.cumulative.firstTestDate).toBe('2026-01-01T00:00:00.000Z');
    expect(data.cumulative.lastTestDate).toBe('2026-01-02T00:00:00.000Z');
  });

  it('merges weighted consistency/burst across tests', () => {
    const store = createInMemorySessionStore();
    store.recordTest(makeTest({ testDuration: 60, consistency: 80, burst: 90 }));
    const data = store.recordTest(makeTest({ testDuration: 60, consistency: 100, burst: 110 }));

    // (80*60 + 100*60) / 120 = 90
    expect(data.cumulative.weightedConsistency).toBe(90);
    // (90*60 + 110*60) / 120 = 100
    expect(data.cumulative.weightedBurst).toBe(100);
  });

  it('round-trips recordTest → load', () => {
    const store = createInMemorySessionStore();
    const recorded = store.recordTest(makeTest());
    expect(store.load()).toBe(recorded);
  });

  it('derives cumulative WPM from exact counters rather than rounded test scores', () => {
    const store = createInMemorySessionStore();
    const first = makeTest({
      wpm: 1,
      rawWpm: 1,
      accuracy: 1,
      testDuration: 30,
      counters: {
        correctChars: 55,
        typedChars: 60,
        backspaces: 2,
        correctWords: 10,
        completedWords: 12,
      },
    });
    const second = makeTest({
      wpm: 1,
      rawWpm: 1,
      accuracy: 1,
      testDate: '2026-01-02T00:00:00.000Z',
      testDuration: 90,
      counters: {
        correctChars: 145,
        typedChars: 160,
        backspaces: 4,
        correctWords: 25,
        completedWords: 30,
      },
    });

    store.recordTest(first);
    const data = store.recordTest(second);

    expect(data.cumulative.weightedWPM).toBe(20); // 200 chars / 5 over 120 seconds
    expect(data.cumulative.weightedRawWPM).toBe(22);
    expect(data.cumulative.weightedAccuracy).toBe(83); // 35 correct words / 42 completed words
    expect(data.cumulative.exact.totalBackspaces).toBe(6);
    expect(data.cumulative.exact.exactTestCount).toBe(2);
  });

  it('retains only the 30 most recent compact sessions', () => {
    const store = createInMemorySessionStore();
    for (let index = 0; index < 31; index++) {
      store.recordTest(
        makeTest({ testDate: `2026-01-${String(index + 1).padStart(2, '0')}T00:00:00.000Z` }),
      );
    }
    const data = store.load();
    expect(data?.recentSessions).toHaveLength(30);
    expect(data?.recentSessions[0]?.testDate).toBe('2026-01-31T00:00:00.000Z');
  });

  it('clears stored data', () => {
    const store = createInMemorySessionStore();
    store.recordTest(makeTest());
    store.clear();
    expect(store.load()).toBeNull();
  });
});

describe('validateStoredData', () => {
  it('accepts valid stored data', () => {
    const store = createInMemorySessionStore();
    const data = store.recordTest(makeTest());
    expect(validateStoredData(data)).toBe(true);
  });

  it('rejects invalid stored data', () => {
    expect(validateStoredData(null)).toBe(false);
    expect(validateStoredData({})).toBe(false);
    expect(
      validateStoredData({
        lastSession: { wpm: 'bad' },
        cumulative: {},
      }),
    ).toBe(false);
  });

  it('rejects stored data with a wrongly-typed field', () => {
    const store = createInMemorySessionStore();
    const data = store.recordTest(makeTest());

    expect(validateStoredData({ ...data, lastSession: { ...data.lastSession, mode: 42 } })).toBe(
      false,
    );
    expect(
      validateStoredData({
        ...data,
        lastSession: { ...data.lastSession, consistency: 'high' },
      }),
    ).toBe(false);
    expect(
      validateStoredData({
        ...data,
        lastSession: { ...data.lastSession, wpmSeries: 'not-an-array' },
      }),
    ).toBe(false);
    expect(
      validateStoredData({
        ...data,
        cumulative: { ...data.cumulative, weightedConsistency: 'bad' },
      }),
    ).toBe(false);
  });

  it('rejects malformed counters and an oversized history', () => {
    const store = createInMemorySessionStore();
    const data = store.recordTest(makeTest());
    expect(validateStoredData({ ...data, recentSessions: Array(31).fill(data.lastSession) })).toBe(
      false,
    );
    expect(
      validateStoredData({
        ...data,
        lastSession: { ...data.lastSession, counters: { correctChars: 'bad' } },
      }),
    ).toBe(false);
  });

  it('rejects malformed nested telemetry', () => {
    const store = createInMemorySessionStore();
    const data = store.recordTest(
      makeTest({
        insights: {
          correctionCount: 1,
          errorPairs: [{ expected: 'a', typed: 'x', count: 1 }],
          pace: [],
          keys: { a: { attempts: 1, correct: 0, errorPairs: [] } },
          pauses: {
            longestPauseMs: 0,
            pausesOver500ms: 0,
            earlyAverageWpm: 0,
            middleAverageWpm: 0,
            finalAverageWpm: 0,
          },
          correctionClusters: [],
        },
      }),
    );
    expect(
      validateStoredData({
        ...data,
        lastSession: { ...data.lastSession, insights: { correctionCount: 1, errorPairs: [null] } },
      }),
    ).toBe(false);
  });
});
