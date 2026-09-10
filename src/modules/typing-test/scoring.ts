import type { TestTiming } from './config';

/** Standard typing WPM: 5 characters count as one word. */
export function calculateWpm(charCount: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  return Math.round(charCount / 5 / (elapsedSeconds / 60));
}

export function calculateCurrentAccuracy(correctWordCount: number, totalWordCount: number): number {
  if (totalWordCount === 0) return 0;
  return Math.round((correctWordCount / totalWordCount) * 100);
}

/** Elapsed test time for WPM, with a one-second floor before the first tick. */
export function resolveTestElapsedSeconds(timing: TestTiming): number {
  if (timing.mode === 'words') return Math.max(1, timing.elapsedSeconds);
  return Math.max(1, timing.timerDuration - timing.timerRemaining);
}
