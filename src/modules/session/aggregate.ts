import type { CumulativeStats, TestSession } from './types';

/** Weighted average of `current` and `next`, weighted by their sample sizes. */
function weightedAverage(
  current: number,
  currentWeight: number,
  next: number,
  nextWeight: number,
): number {
  const totalWeight = currentWeight + nextWeight;
  if (totalWeight <= 0) return next;
  return (current * currentWeight + next * nextWeight) / totalWeight;
}

/**
 * Weighted average for a metric that's optional on `TestSession` (added after older tests were
 * recorded). Carries `current` forward untouched when `next` is absent, instead of fabricating a
 * value for a test that never tracked this stat.
 */
function weightedAverageOptional(
  current: number | undefined,
  currentWeight: number,
  next: number | undefined,
  nextWeight: number,
): number | undefined {
  if (next === undefined) return current;
  return weightedAverage(current ?? next, currentWeight, next, nextWeight);
}

export function createInitialCumulativeStats(newTest: TestSession): CumulativeStats {
  return {
    totalTests: 1,
    totalWordsTyped: newTest.wordsTyped,
    totalTimeSpent: newTest.testDuration,
    totalCorrectWords: newTest.correctWords,
    weightedWPM: newTest.wpm,
    weightedRawWPM: newTest.rawWpm,
    weightedAccuracy: newTest.accuracy,
    weightedConsistency: newTest.consistency,
    weightedBurst: newTest.burst,
    letterStats: { ...newTest.letterAccuracy },
    firstTestDate: newTest.testDate,
    lastTestDate: newTest.testDate,
  };
}

export function updateCumulativeStats(
  current: CumulativeStats,
  newTest: TestSession,
): CumulativeStats {
  const newTotalTests = current.totalTests + 1;
  const newTotalWordsTyped = current.totalWordsTyped + newTest.wordsTyped;
  const newTotalTimeSpent = current.totalTimeSpent + newTest.testDuration;
  const newTotalCorrectWords = current.totalCorrectWords + newTest.correctWords;

  const weightedWPM = weightedAverage(
    current.weightedWPM,
    current.totalTimeSpent,
    newTest.wpm,
    newTest.testDuration,
  );

  const weightedRawWPM = weightedAverage(
    current.weightedRawWPM ?? current.weightedWPM,
    current.totalTimeSpent,
    newTest.rawWpm,
    newTest.testDuration,
  );

  const weightedAccuracy = weightedAverage(
    current.weightedAccuracy,
    current.totalWordsTyped,
    newTest.accuracy,
    newTest.wordsTyped,
  );

  const weightedConsistency = weightedAverageOptional(
    current.weightedConsistency,
    current.totalTimeSpent,
    newTest.consistency,
    newTest.testDuration,
  );

  const weightedBurst = weightedAverageOptional(
    current.weightedBurst,
    current.totalTimeSpent,
    newTest.burst,
    newTest.testDuration,
  );

  const updatedLetterStats = { ...current.letterStats };

  Object.entries(newTest.letterAccuracy).forEach(([letter, metrics]) => {
    if (updatedLetterStats[letter]) {
      updatedLetterStats[letter].correct += metrics.correct;
      updatedLetterStats[letter].total += metrics.total;
    } else {
      updatedLetterStats[letter] = { ...metrics };
    }
  });

  return {
    totalTests: newTotalTests,
    totalWordsTyped: newTotalWordsTyped,
    totalTimeSpent: newTotalTimeSpent,
    totalCorrectWords: newTotalCorrectWords,
    weightedWPM: Math.round(weightedWPM),
    weightedRawWPM: Math.round(weightedRawWPM),
    weightedAccuracy: Math.round(weightedAccuracy),
    weightedConsistency:
      weightedConsistency !== undefined ? Math.round(weightedConsistency) : undefined,
    weightedBurst: weightedBurst !== undefined ? Math.round(weightedBurst) : undefined,
    letterStats: updatedLetterStats,
    firstTestDate: current.firstTestDate || newTest.testDate,
    lastTestDate: newTest.testDate,
  };
}
