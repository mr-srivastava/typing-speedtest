import type { TestTiming } from './config';
import type { TypingTestState } from './create-typing-test';
import type { WpmSeriesPoint } from './replay';
import { calculateCurrentAccuracy, calculateWpm, resolveTestElapsedSeconds } from './scoring';
import type { LetterMetrics } from './types';

/** UI-ready analytics derived from one SDK state snapshot. */
export type LiveTypingAnalytics = TestTiming & {
  correctWordCount: number;
  totalWordCount: number;
  correctChars: number;
  typedChars: number;
  letterAccuracy: Record<string, LetterMetrics>;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  /** Only populated after event-log analytics have been finalized. */
  consistency?: number;
  wpmSeries?: WpmSeriesPoint[];
};

/**
 * Keeps all per-test measurements in the frontend-agnostic SDK. Consumers get
 * display-ready values and never need to repeat timing or scoring arithmetic.
 */
export function deriveLiveTypingAnalytics(state: TypingTestState): LiveTypingAnalytics {
  const timing: TestTiming =
    state.mode === 'time'
      ? { mode: 'time', timerRemaining: state.timerRemaining, timerDuration: state.timerDuration }
      : { mode: 'words', elapsedSeconds: state.elapsedSeconds };
  const seconds = resolveTestElapsedSeconds(timing);

  return {
    ...timing,
    correctWordCount: state.correctWordCount,
    totalWordCount: state.totalWordCount,
    correctChars: state.correctChars,
    typedChars: state.typedChars,
    letterAccuracy: state.letterAccuracy,
    wpm: state.snapshot?.result.wpm ?? calculateWpm(state.correctChars, seconds),
    rawWpm: state.snapshot?.result.rawWpm ?? calculateWpm(state.typedChars, seconds),
    accuracy: calculateCurrentAccuracy(state.correctWordCount, state.totalWordCount),
    consistency: state.snapshot?.consistency,
    wpmSeries: state.snapshot?.wpmSeries,
  };
}
