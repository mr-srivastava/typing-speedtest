import { describe, expect, it } from 'vitest';
import { buildTestSession } from './build-test-session';
import type { TestTiming } from '@/modules/typing-test/config';
import type { TypingTestFinishedSnapshot } from '@/modules/typing-test/create-typing-test';

type AccuracyOverrides = Partial<
  Omit<TypingTestFinishedSnapshot, 'mode' | 'timerRemaining' | 'timerDuration' | 'elapsedSeconds'>
>;

function makeSnapshot(
  timing: TestTiming,
  overrides: AccuracyOverrides = {},
): TypingTestFinishedSnapshot {
  return {
    correctWordCount: 10,
    totalWordCount: 10,
    correctChars: 50,
    typedChars: 50,
    letterAccuracy: {},
    eventLog: [],
    wpmSeries: [{ second: 1, wpm: 60, rawWpm: 60 }],
    consistency: 90,
    burst: 72,
    ...timing,
    ...overrides,
  };
}

describe('buildTestSession', () => {
  it('uses the countdown (timerDuration - timerRemaining) for time-mode duration', () => {
    // finished with 10s left on a 60s test
    const snapshot = makeSnapshot({ mode: 'time', timerRemaining: 10, timerDuration: 60 });
    const session = buildTestSession(snapshot);
    expect(session.testDuration).toBe(50); // 60 - 10
  });

  it('uses elapsedSeconds for word-mode duration', () => {
    const snapshot = makeSnapshot({ mode: 'words', elapsedSeconds: 42 });
    const session = buildTestSession(snapshot);
    expect(session.testDuration).toBe(42);
  });

  it('passes through mode, consistency, burst, and wpmSeries', () => {
    const snapshot = makeSnapshot({ mode: 'time', timerRemaining: 0, timerDuration: 60 });
    const session = buildTestSession(snapshot);
    expect(session.mode).toBe('time');
    expect(session.consistency).toBe(90);
    expect(session.burst).toBe(72);
    expect(session.wpmSeries).toEqual([{ second: 1, wpm: 60, rawWpm: 60 }]);
  });

  it('computes wpm/rawWpm from correct/typed chars over the resolved duration', () => {
    // 50 chars / 5 / (50s / 60) = 12 wpm
    const snapshot = makeSnapshot(
      { mode: 'time', timerRemaining: 10, timerDuration: 60 },
      { correctChars: 50, typedChars: 60 },
    );
    const session = buildTestSession(snapshot);
    expect(session.wpm).toBe(12);
    expect(session.rawWpm).toBe(14); // 60/5/(50/60) = 14.4 -> 14
  });
});
