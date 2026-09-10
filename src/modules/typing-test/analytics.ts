import type { TestTiming } from './config';
import type { TypingTestState } from './create-typing-test';
import type { TypingTestResultInput } from './result';
import { calculateCurrentAccuracy, calculateWpm, resolveTestElapsedSeconds } from './scoring';

/**
 * Same raw counts the finished-test scorer takes, plus the score itself.
 * `consistency`/`wpmSeries` are event-sourced and only populated once analytics are finalized.
 */
export type LiveTypingAnalytics = TestTiming &
  Pick<
    TypingTestResultInput,
    'correctWordCount' | 'totalWordCount' | 'correctChars' | 'typedChars' | 'letterAccuracy'
  > &
  Partial<Pick<TypingTestResultInput, 'consistency' | 'wpmSeries'>> & {
    wpm: number;
    rawWpm: number;
    accuracy: number;
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
