import type { LetterMetrics } from '@/modules/session/types';

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
  const entries = Object.entries(letterAccuracyData);
  if (entries.length === 0) return 0;

  const weightedSum = entries.reduce((sum, [_, metrics]) => {
    if (metrics.total === 0) return sum;
    return sum + (metrics.correct / metrics.total) * metrics.total;
  }, 0);
  const totalAttempts = entries.reduce(
    (sum, [_, metrics]) => sum + metrics.total,
    0,
  );

  if (totalAttempts === 0) return 0;
  return (weightedSum / totalAttempts) * 100;
}
