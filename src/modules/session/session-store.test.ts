import { describe, expect, it } from 'vitest';
import { createInMemorySessionStore } from './adapters/in-memory';
import { validateStoredData } from './validate';
import type { TestSession } from './types';

function makeTest(overrides: Partial<TestSession> = {}): TestSession {
  return {
    wpm: 60,
    rawWpm: 65,
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
      weightedRawWPM: 65,
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
        rawWpm: 65,
        accuracy: 90,
        testDuration: 60,
        wordsTyped: 60,
        letterAccuracy: { a: { correct: 8, total: 10 } },
      }),
    );

    const second = makeTest({
      wpm: 80,
      rawWpm: 85,
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
    // (65*60 + 85*60) / 120 = 75
    expect(data.cumulative.weightedRawWPM).toBe(75);
    // (90*60 + 100*40) / 100 = 94
    expect(data.cumulative.weightedAccuracy).toBe(94);
    expect(data.cumulative.letterStats).toEqual({
      a: { correct: 13, total: 15 },
      b: { correct: 3, total: 4 },
    });
    expect(data.cumulative.firstTestDate).toBe('2026-01-01T00:00:00.000Z');
    expect(data.cumulative.lastTestDate).toBe('2026-01-02T00:00:00.000Z');
  });

  it('merges weighted consistency/burst when both tests track them', () => {
    const store = createInMemorySessionStore();
    store.recordTest(makeTest({ testDuration: 60, consistency: 80, burst: 90 }));
    const data = store.recordTest(makeTest({ testDuration: 60, consistency: 100, burst: 110 }));

    // (80*60 + 100*60) / 120 = 90
    expect(data.cumulative.weightedConsistency).toBe(90);
    // (90*60 + 110*60) / 120 = 100
    expect(data.cumulative.weightedBurst).toBe(100);
  });

  it('carries the weighted consistency/burst forward when a later test lacks them', () => {
    const store = createInMemorySessionStore();
    store.recordTest(makeTest({ consistency: 80, burst: 90 }));
    const data = store.recordTest(makeTest({ consistency: undefined, burst: undefined }));

    expect(data.cumulative.weightedConsistency).toBe(80);
    expect(data.cumulative.weightedBurst).toBe(90);
  });

  it('leaves weighted consistency/burst undefined when no test has tracked them', () => {
    const store = createInMemorySessionStore();
    store.recordTest(makeTest());
    const data = store.recordTest(makeTest());

    expect(data.cumulative.weightedConsistency).toBeUndefined();
    expect(data.cumulative.weightedBurst).toBeUndefined();
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

  it('accepts stored data without the newer optional fields (pre-existing localStorage data)', () => {
    const store = createInMemorySessionStore();
    const data = store.recordTest(makeTest()); // no mode/consistency/burst/wpmSeries
    expect(validateStoredData(data)).toBe(true);
  });

  it('accepts stored data with the newer optional fields present and well-typed', () => {
    const store = createInMemorySessionStore();
    const data = store.recordTest(
      makeTest({ mode: 'words', consistency: 90, burst: 72, wpmSeries: [] }),
    );
    expect(validateStoredData(data)).toBe(true);
  });

  it('rejects stored data with a wrongly-typed optional field', () => {
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
});
