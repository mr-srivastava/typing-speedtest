import type { LetterMetrics } from '@/modules/session/types';
import type { TestTiming } from '@/modules/typing-test/config';

/** Elapsed test time in seconds (non-negative). */
function getElapsedSeconds(timerDuration: number, timerRemaining: number): number {
  return Math.max(0, timerDuration - timerRemaining);
}

/**
 * Elapsed time with a 1s floor for WPM — matches live toolbar behavior and
 * avoids zero-duration skew in saved session stats.
 */
export function getElapsedSecondsForWpm(timerDuration: number, timerRemaining: number): number {
  const elapsed = getElapsedSeconds(timerDuration, timerRemaining);
  return elapsed > 0 ? elapsed : 1;
}

/**
 * Standard typing-test WPM: 5 characters = 1 "word", regardless of whether
 * typed word boundaries line up with the reference text.
 */
export function calculateWpm(charCount: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  return Math.round(charCount / 5 / (elapsedSeconds / 60));
}

/**
 * Elapsed seconds for a live (in-progress or just-finished) WPM calculation, mode-aware:
 * time mode counts down (`timerDuration - timerRemaining`), word mode counts up with no
 * ceiling, so its own `elapsedSeconds` is the value directly. Both are floored at 1s to
 * avoid a huge WPM spike in the first instant of a test.
 */
export function resolveLiveElapsedSeconds(timing: TestTiming): number {
  return timing.mode === 'time'
    ? getElapsedSecondsForWpm(timing.timerDuration, timing.timerRemaining)
    : Math.max(1, timing.elapsedSeconds);
}

export function calculateCurrentAccuracy(correctWordCount: number, totalWordCount: number): number {
  if (totalWordCount === 0) return 0;
  return Math.round((correctWordCount / totalWordCount) * 100);
}

export function calculateOverallWeightedAccuracy(
  letterAccuracyData: Record<string, LetterMetrics>,
): number {
  let totalCorrect = 0;
  let totalAttempts = 0;

  for (const { correct, total } of Object.values(letterAccuracyData)) {
    totalCorrect += correct;
    totalAttempts += total;
  }

  if (totalAttempts === 0) return 0;
  return Math.round((totalCorrect / totalAttempts) * 100);
}
