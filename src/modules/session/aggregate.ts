import type { CumulativeStats, TestSession } from './types';

export function createInitialCumulativeStats(newTest: TestSession): CumulativeStats {
  return {
    totalTests: 1,
    totalWordsTyped: newTest.wordsTyped,
    totalTimeSpent: newTest.testDuration,
    totalCorrectWords: newTest.correctWords,
    weightedWPM: newTest.wpm,
    weightedAccuracy: newTest.accuracy,
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

  const weightedWPM =
    newTotalTimeSpent > 0
      ? (current.weightedWPM * current.totalTimeSpent + newTest.wpm * newTest.testDuration) /
        newTotalTimeSpent
      : newTest.wpm;

  const weightedAccuracy =
    newTotalWordsTyped > 0
      ? (current.weightedAccuracy * current.totalWordsTyped +
          newTest.accuracy * newTest.wordsTyped) /
        newTotalWordsTyped
      : newTest.accuracy;

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
    weightedAccuracy: Math.round(weightedAccuracy),
    letterStats: updatedLetterStats,
    firstTestDate: current.firstTestDate || newTest.testDate,
    lastTestDate: newTest.testDate,
  };
}
