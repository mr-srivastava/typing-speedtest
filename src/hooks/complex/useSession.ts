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

function isLetterMetricsRecord(
  val: unknown,
): val is Record<string, { correct: number; total: number }> {
  if (typeof val !== 'object' || val === null) return false;
  for (const v of Object.values(val)) {
    if (
      typeof v !== 'object' ||
      v === null ||
      typeof (v as Record<string, unknown>).correct !== 'number' ||
      typeof (v as Record<string, unknown>).total !== 'number'
    )
      return false;
  }
  return true;
}

function validateStoredData(value: unknown): value is EnhancedStoredData {
  if (typeof value !== 'object' || value === null) return false;
  const o = value as Record<string, unknown>;
  const lastSession = o.lastSession as Record<string, unknown> | undefined;
  const cumulative = o.cumulative as Record<string, unknown> | undefined;

  if (lastSession == null || cumulative == null) return false;

  // lastSession (TestSession): all required fields and types
  if (
    typeof lastSession.wpm !== 'number' ||
    typeof lastSession.accuracy !== 'number' ||
    typeof lastSession.testDate !== 'string' ||
    typeof lastSession.testDuration !== 'number' ||
    typeof lastSession.wordsTyped !== 'number' ||
    typeof lastSession.correctWords !== 'number'
  )
    return false;
  if (!isLetterMetricsRecord(lastSession.letterAccuracy)) return false;

  // cumulative (CumulativeStats): all required fields used by updateCumulativeStats
  if (
    typeof cumulative.totalTests !== 'number' ||
    typeof cumulative.totalWordsTyped !== 'number' ||
    typeof cumulative.totalTimeSpent !== 'number' ||
    typeof cumulative.totalCorrectWords !== 'number' ||
    typeof cumulative.weightedWPM !== 'number' ||
    typeof cumulative.weightedAccuracy !== 'number' ||
    typeof cumulative.firstTestDate !== 'string' ||
    typeof cumulative.lastTestDate !== 'string'
  )
    return false;
  if (!isLetterMetricsRecord(cumulative.letterStats)) return false;

  return true;
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
