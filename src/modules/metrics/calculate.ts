import type { LetterMetrics } from '@/modules/session/types';

/** Elapsed test time in seconds (non-negative). */
export function getElapsedSeconds(
  timerDuration: number,
  timerRemaining: number,
): number {
  return Math.max(0, timerDuration - timerRemaining);
}

/**
 * Elapsed time with a 1s floor for WPM — matches live toolbar behavior and
 * avoids zero-duration skew in saved session stats.
 */
export function getElapsedSecondsForWpm(
  timerDuration: number,
  timerRemaining: number,
): number {
  const elapsed = getElapsedSeconds(timerDuration, timerRemaining);
  return elapsed > 0 ? elapsed : 1;
}

export function calculateCurrentWpm(
  correctWordCount: number,
  testDuration: number,
): number {
  if (testDuration <= 0) return 0;
  return Math.round(correctWordCount / (testDuration / 60)) || 0;
}

export function calculateCurrentAccuracy(
  correctWordCount: number,
  totalWordCount: number,
): number {
  if (totalWordCount === 0) return 0;
  return Math.round((correctWordCount / totalWordCount) * 100) || 0;
}

export function calculateOverallWeightedAccuracy(
  letterAccuracyData: Record<string, LetterMetrics>,
): number {
  const entries = Object.values(letterAccuracyData);
  if (entries.length === 0) return 0;

  const totalCorrect = entries.reduce((sum, metrics) => sum + metrics.correct, 0);
  const totalAttempts = entries.reduce((sum, metrics) => sum + metrics.total, 0);

  if (totalAttempts === 0) return 0;
  return (totalCorrect / totalAttempts) * 100;
}
