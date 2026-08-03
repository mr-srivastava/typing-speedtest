import { describe, expect, it } from 'vitest';
import { createInMemorySessionStore } from './adapters/in-memory';
import { validateStoredData } from './validate';
import type { TestSession } from './types';

function makeTest(overrides: Partial<TestSession> = {}): TestSession {
  return {
    wpm: 60,
    accuracy: 95,
    testDate: '2026-01-01T00:00:00.000Z',
    testDuration: 60,
    wordsTyped: 60,
    correctWords: 57,
    letterAccuracy: { a: { correct: 10, total: 10 } },
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
      weightedAccuracy: 95,
      letterStats: { a: { correct: 10, total: 10 } },
      firstTestDate: test.testDate,
      lastTestDate: test.testDate,
    });
    expect(store.load()).toEqual(data);
  });

  it('merges weighted WPM/accuracy and letter stats on subsequent tests', () => {
    const store = createInMemorySessionStore();
    store.recordTest(
      makeTest({
        wpm: 60,
        accuracy: 90,
        testDuration: 60,
        wordsTyped: 60,
        letterAccuracy: { a: { correct: 8, total: 10 } },
      }),
    );

    const second = makeTest({
      wpm: 80,
      accuracy: 100,
      testDate: '2026-01-02T00:00:00.000Z',
      testDuration: 60,
      wordsTyped: 40,
      correctWords: 40,
      letterAccuracy: {
        a: { correct: 5, total: 5 },
        b: { correct: 3, total: 4 },
      },
    });

    const data = store.recordTest(second);

    expect(data.cumulative.totalTests).toBe(2);
    expect(data.cumulative.totalWordsTyped).toBe(100);
    expect(data.cumulative.totalTimeSpent).toBe(120);
    // (60*60 + 80*60) / 120 = 70
    expect(data.cumulative.weightedWPM).toBe(70);
    // (90*60 + 100*40) / 100 = 94
    expect(data.cumulative.weightedAccuracy).toBe(94);
    expect(data.cumulative.letterStats).toEqual({
      a: { correct: 13, total: 15 },
      b: { correct: 3, total: 4 },
    });
    expect(data.cumulative.firstTestDate).toBe('2026-01-01T00:00:00.000Z');
    expect(data.cumulative.lastTestDate).toBe('2026-01-02T00:00:00.000Z');
  });

  it('round-trips recordTest → load', () => {
    const store = createInMemorySessionStore();
    const recorded = store.recordTest(makeTest());
    expect(store.load()).toBe(recorded);
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
});
