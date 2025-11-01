import { useCallback, useMemo } from 'react';
import {
  EnhancedStoredData,
  TestSession,
  CumulativeStats,
} from '@/types/metrics';
import { useLocalStorage } from '@/hooks/atomic/useLocalStorage';

function updateCumulativeStats(
  current: CumulativeStats,
  newTest: TestSession,
): CumulativeStats {
  const newTotalTests = current.totalTests + 1;
  const newTotalWordsTyped = current.totalWordsTyped + newTest.wordsTyped;
  const newTotalTimeSpent = current.totalTimeSpent + newTest.testDuration;
  const newTotalCorrectWords = current.totalCorrectWords + newTest.correctWords;

  // Weighted averages
  const weightedWPM =
    newTotalTimeSpent > 0
      ? (current.weightedWPM * current.totalTimeSpent +
          newTest.wpm * newTest.testDuration) /
        newTotalTimeSpent
      : newTest.wpm;

  const weightedAccuracy =
    newTotalWordsTyped > 0
      ? (current.weightedAccuracy * current.totalWordsTyped +
          newTest.accuracy * newTest.wordsTyped) /
        newTotalWordsTyped
      : newTest.accuracy;

  // Merge letter stats
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

function validateStoredData(value: any): value is EnhancedStoredData {
  return (
    value &&
    value.lastSession &&
    value.cumulative &&
    typeof value.lastSession.wpm === 'number' &&
    typeof value.lastSession.accuracy === 'number' &&
    typeof value.cumulative.totalTests === 'number'
  );
}

export function useSession() {
  const {
    value: data,
    setValue: setStoredData,
    removeValue: removeStoredData,
    isLoading,
    isHydrated,
  } = useLocalStorage<EnhancedStoredData | null>(
    'octane-type-last-session',
    null,
    validateStoredData,
  );

  const saveTestSession = useCallback(
    (newTest: TestSession) => {
      let updatedData: EnhancedStoredData;

      if (data) {
        // Update existing data
        updatedData = {
          lastSession: newTest,
          cumulative: updateCumulativeStats(data.cumulative, newTest),
        };
      } else {
        // Create initial data
        updatedData = {
          lastSession: newTest,
          cumulative: {
            totalTests: 1,
            totalWordsTyped: newTest.wordsTyped,
            totalTimeSpent: newTest.testDuration,
            totalCorrectWords: newTest.correctWords,
            weightedWPM: newTest.wpm,
            weightedAccuracy: newTest.accuracy,
            letterStats: { ...newTest.letterAccuracy },
            firstTestDate: newTest.testDate,
            lastTestDate: newTest.testDate,
          },
        };
      }

      setStoredData(updatedData);
    },
    [data, setStoredData],
  );

  const clearSession = useCallback(() => {
    removeStoredData();
  }, [removeStoredData]);

  return useMemo(
    () => ({
      data,
      isLoading,
      isHydrated,
      hasSession: !!data,
      saveTestSession,
      clearSession,
    }),
    [data, isLoading, isHydrated, saveTestSession, clearSession],
  );
}
