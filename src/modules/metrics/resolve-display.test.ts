import { describe, expect, it } from 'vitest';
import { resolveMetricsDisplay } from './resolve-display';
import type { EnhancedStoredData } from '@/modules/session/types';
import type { LiveTestMetrics } from './types';

const live: LiveTestMetrics = {
  correctWordCount: 30,
  totalWordCount: 32,
  // elapsed = 60-20 = 40s; 150 correct chars / 5 / (40/60) = 45 WPM; 160 typed chars = 48 raw WPM
  correctChars: 150,
  typedChars: 160,
  timerRemaining: 20,
  timerDuration: 60,
  letterAccuracy: { a: { correct: 5, total: 6 } },
};

function makeSession(totalTests: number): EnhancedStoredData {
  return {
    lastSession: {
      wpm: 45,
      rawWpm: 48,
      accuracy: 90,
      testDate: '2026-01-01T00:00:00.000Z',
      testDuration: 60,
      wordsTyped: 45,
      correctWords: 40,
      letterAccuracy: { a: { correct: 8, total: 10 } },
    },
    cumulative: {
      totalTests,
      totalWordsTyped: 100,
      totalTimeSpent: 120,
      totalCorrectWords: 90,
      weightedWPM: 55,
      weightedRawWPM: 60,
      weightedAccuracy: 92,
      letterStats: { a: { correct: 20, total: 22 }, b: { correct: 5, total: 5 } },
      firstTestDate: '2026-01-01T00:00:00.000Z',
      lastTestDate: '2026-01-02T00:00:00.000Z',
    },
  };
}

describe('resolveMetricsDisplay', () => {
  it('returns live-only model when there is no session', () => {
    const model = resolveMetricsDisplay({ live, session: null });

    expect(model.view).toEqual({ scope: 'live' });
    expect(model.canToggle).toBe(false);
    expect(model.showingCumulative).toBe(false);
    // 150 correct chars in 40 seconds → 45 WPM
    expect(model.wpm).toBe(45);
    // 160 typed chars in 40 seconds → 48 raw WPM
    expect(model.rawWpm).toBe(48);
    expect(model.accuracy).toBe(94);
    expect(model.letterAccuracy).toEqual(live.letterAccuracy);
    expect(model.statsTitle).toBeNull();
  });

  it('returns live without toggle when session has 1 test', () => {
    const model = resolveMetricsDisplay({
      live,
      session: makeSession(1),
      preference: 'auto',
    });

    expect(model.view).toEqual({ scope: 'live' });
    expect(model.canToggle).toBe(false);
    expect(model.showingCumulative).toBe(false);
    expect(model.wpm).toBe(45);
  });

  it('enables toggle and defaults to live when session has 2+ tests', () => {
    const model = resolveMetricsDisplay({
      live,
      session: makeSession(2),
      preference: 'auto',
    });

    expect(model.view).toEqual({ scope: 'toggle', initial: 'live' });
    expect(model.canToggle).toBe(true);
    expect(model.showingCumulative).toBe(false);
    expect(model.wpm).toBe(45);
  });

  it('uses cumulative weighted values when preference is cumulative', () => {
    const model = resolveMetricsDisplay({
      live,
      session: makeSession(3),
      preference: 'cumulative',
    });

    expect(model.view).toEqual({ scope: 'toggle', initial: 'cumulative' });
    expect(model.canToggle).toBe(true);
    expect(model.showingCumulative).toBe(true);
    expect(model.wpm).toBe(55);
    expect(model.rawWpm).toBe(60);
    expect(model.accuracy).toBe(92);
    expect(model.letterAccuracy).toEqual({
      a: { correct: 20, total: 22 },
      b: { correct: 5, total: 5 },
    });
    expect(model.statsTitle).toBe('3 tests • 2 minutes total');
  });

  it('locks to cumulative-only when locked is true', () => {
    const model = resolveMetricsDisplay({
      live,
      session: makeSession(3),
      preference: 'cumulative',
      locked: true,
    });

    expect(model.view).toEqual({ scope: 'cumulative' });
    expect(model.canToggle).toBe(false);
    expect(model.showingCumulative).toBe(true);
    expect(model.wpm).toBe(55);
  });
});
