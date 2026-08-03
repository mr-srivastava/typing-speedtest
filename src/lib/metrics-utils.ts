/**
 * Metrics calculation utilities
 */

import {
  LetterMetrics,
  EnhancedStoredData,
  TestSession,
} from '@/types/metrics';
import type { TypingTestFinishedSnapshot } from '@/lib/typing-engine';

/**
 * Calculate current WPM based on correct words and test duration
 */
export function calculateCurrentWpm(
  correctWordCount: number,
  testDuration: number,
): number {
  if (testDuration <= 0) return 0;
  return Math.round(correctWordCount / (testDuration / 60)) || 0;
}

/**
 * Calculate current accuracy percentage
 */
export function calculateCurrentAccuracy(
  correctWordCount: number,
  totalWordCount: number,
): number {
  if (totalWordCount === 0) return 0;
  return Math.round((correctWordCount / totalWordCount) * 100) || 0;
}

/**
 * Build a TestSession from a finished typing snapshot and configured duration.
 */
export function buildTestSession(
  snapshot: TypingTestFinishedSnapshot,
  timerDuration: number,
): TestSession {
  const testDuration = timerDuration - snapshot.timer;
  return {
    wpm: calculateCurrentWpm(snapshot.correctWordCount, testDuration),
    accuracy: calculateCurrentAccuracy(
      snapshot.correctWordCount,
      snapshot.totalWordCount,
    ),
    testDate: new Date().toISOString(),
    testDuration,
    wordsTyped: Math.round(snapshot.totalWordCount),
    correctWords: Math.round(snapshot.correctWordCount),
    letterAccuracy: snapshot.letterAccuracy,
  };
}

/**
 * Get WPM value (current or cumulative based on settings)
 */
export function getWpmValue(
  correctWordCount: number,
  timer: number,
  data?: EnhancedStoredData | null,
  showCumulative?: boolean,
  timerDuration: number = 60,
): number {
  if (showCumulative && data) {
    return data.cumulative.weightedWPM;
  }
  const testDuration = timerDuration - timer;
  return calculateCurrentWpm(correctWordCount, testDuration);
}

/**
 * Get accuracy value (current or cumulative based on settings)
 */
export function getAccuracyValue(
  correctWordCount: number,
  totalWordCount: number,
  data?: EnhancedStoredData | null,
  showCumulative?: boolean,
): number {
  if (showCumulative && data) {
    return data.cumulative.weightedAccuracy;
  }
  return calculateCurrentAccuracy(correctWordCount, totalWordCount);
}

/**
 * Get letter accuracy data (current or cumulative based on settings)
 */
export function getLetterAccuracyData(
  letterAccuracyData: Record<string, LetterMetrics>,
  data?: EnhancedStoredData | null,
  showCumulative?: boolean,
): Record<string, LetterMetrics> {
  if (showCumulative && data && data.cumulative.letterStats) {
    // Check if cumulative data has any actual values
    const hasData = Object.values(data.cumulative.letterStats).some(
      (metrics) => metrics.total > 0,
    );
    if (hasData) {
      return data.cumulative.letterStats;
    }
  }
  return letterAccuracyData;
}

/**
 * Calculate overall weighted accuracy from letter metrics
 */
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

/**
 * Generate stats title for cumulative data
 */
export function generateStatsTitle(
  data?: EnhancedStoredData | null,
  showCumulative?: boolean,
): string | null {
  if (showCumulative && data) {
    const { totalTests, totalTimeSpent } = data.cumulative;
    const totalMinutes = Math.round(totalTimeSpent / 60);
    return `${totalTests} tests • ${totalMinutes} minutes total`;
  }
  return null;
}
