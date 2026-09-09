import { describe, expect, it } from 'vitest';
import { deriveLiveTypingAnalytics } from './analytics';
import { DEFAULT_TEST_CONFIG } from './config';
import type { TypingTestState } from './create-typing-test';

function timeState(): Extract<TypingTestState, { mode: 'time' }> {
  return {
    phase: 'active',
    config: DEFAULT_TEST_CONFIG,
    mode: 'time',
    timerRemaining: 30,
    timerDuration: 60,
    referenceText: 'hello world',
    input: 'hello',
    correctWordCount: 1,
    totalWordCount: 1,
    correctChars: 5,
    typedChars: 5,
    letterAccuracy: {},
    eventLog: [],
    testStartTime: 0,
    snapshot: null,
    loadError: null,
  };
}

describe('deriveLiveTypingAnalytics', () => {
  it('owns the time-mode WPM and accuracy calculations', () => {
    const analytics = deriveLiveTypingAnalytics(timeState());

    expect(analytics.wpm).toBe(2);
    expect(analytics.accuracy).toBe(100);
    expect(analytics).toMatchObject({ mode: 'time', timerRemaining: 30, timerDuration: 60 });
  });

  it('uses word-mode elapsed time and exposes final event-sourced analytics', () => {
    const analytics = deriveLiveTypingAnalytics({
      ...timeState(),
      mode: 'words',
      elapsedSeconds: 10,
      snapshot: {
        mode: 'words',
        elapsedSeconds: 10,
        correctWordCount: 1,
        totalWordCount: 1,
        correctChars: 5,
        typedChars: 5,
        letterAccuracy: {},
        eventLog: [],
        wpmSeries: [{ second: 1, wpm: 60, rawWpm: 60 }],
        consistency: 92,
        burst: 75,
      },
    });

    expect(analytics.wpm).toBe(6);
    expect(analytics.consistency).toBe(92);
    expect(analytics.wpmSeries).toEqual([{ second: 1, wpm: 60, rawWpm: 60 }]);
  });
});
