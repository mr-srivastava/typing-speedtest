import type { EnhancedStoredData } from './types';

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

export function validateStoredData(value: unknown): value is EnhancedStoredData {
  if (typeof value !== 'object' || value === null) return false;
  const o = value as Record<string, unknown>;
  const lastSession = o.lastSession as Record<string, unknown> | undefined;
  const cumulative = o.cumulative as Record<string, unknown> | undefined;

  if (
    lastSession === null ||
    lastSession === undefined ||
    cumulative === null ||
    cumulative === undefined
  )
    return false;

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
