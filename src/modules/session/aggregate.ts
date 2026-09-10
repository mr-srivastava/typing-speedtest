import type { CumulativeStats, TestSession } from './types';
import { calculateWpm } from '@/modules/typing-test';

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

export function createInitialCumulativeStats(newTest: TestSession): CumulativeStats {
  const counters = newTest.counters;
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
    exact: {
      totalCorrectChars: counters.correctChars,
      totalTypedChars: counters.typedChars,
      totalBackspaces: counters.backspaces,
      exactDurationSeconds: newTest.testDuration,
      exactCorrectWords: counters.correctWords,
      exactCompletedWords: counters.completedWords,
      exactTestCount: 1,
    },
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

  const weightedConsistency = weightedAverage(
    current.weightedConsistency,
    current.totalTimeSpent,
    newTest.consistency,
    newTest.testDuration,
  );

  const weightedBurst = weightedAverage(
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

  const incomingCounters = newTest.counters;
  const exact = {
    totalCorrectChars: current.exact.totalCorrectChars + incomingCounters.correctChars,
    totalTypedChars: current.exact.totalTypedChars + incomingCounters.typedChars,
    totalBackspaces: current.exact.totalBackspaces + incomingCounters.backspaces,
    exactDurationSeconds: current.exact.exactDurationSeconds + newTest.testDuration,
    exactCorrectWords: current.exact.exactCorrectWords + incomingCounters.correctWords,
    exactCompletedWords: current.exact.exactCompletedWords + incomingCounters.completedWords,
    exactTestCount: current.exact.exactTestCount + 1,
  };
  const weightedWPM = calculateWpm(exact.totalCorrectChars, exact.exactDurationSeconds);
  const weightedRawWPM = calculateWpm(exact.totalTypedChars, exact.exactDurationSeconds);
  const weightedAccuracy = Math.round((exact.exactCorrectWords / exact.exactCompletedWords) * 100);

  return {
    totalTests: newTotalTests,
    totalWordsTyped: newTotalWordsTyped,
    totalTimeSpent: newTotalTimeSpent,
    totalCorrectWords: newTotalCorrectWords,
    weightedWPM,
    weightedRawWPM,
    weightedAccuracy,
    weightedConsistency: Math.round(weightedConsistency),
    weightedBurst: Math.round(weightedBurst),
    letterStats: updatedLetterStats,
    firstTestDate: current.firstTestDate || newTest.testDate,
    lastTestDate: newTest.testDate,
    exact,
  };
}
