import type { LetterMetrics } from '@/modules/typing-test/types';
export {
  calculateCurrentAccuracy,
  calculateWpm,
  getElapsedSecondsForWpm,
  resolveTestElapsedSeconds as resolveLiveElapsedSeconds,
} from '@/modules/typing-test/scoring';

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
