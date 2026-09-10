import type {
  CorrectionCluster,
  CumulativeStats,
  EnhancedStoredData,
  ExactCounters,
  KeyTelemetry,
  LetterMetrics,
  PaceBucket,
  PauseTelemetry,
  SavedTestConfig,
  TestCounters,
  TestInsights,
  TestSession,
  TypingErrorPair,
} from './types';

function isNumberRecord<K extends string>(
  value: unknown,
  keys: readonly K[],
): value is Record<K, number> {
  if (typeof value !== 'object' || value === null) return false;
  return keys.every((key) => isFiniteNonNegativeNumber((value as Record<string, unknown>)[key]));
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isArrayOf<T>(value: unknown, itemGuard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(itemGuard);
}

function isErrorPair(value: unknown): value is TypingErrorPair {
  if (typeof value !== 'object' || value === null) return false;
  const pair = value as Record<string, unknown>;
  return (
    typeof pair.expected === 'string' &&
    typeof pair.typed === 'string' &&
    isFiniteNonNegativeNumber(pair.count)
  );
}

function isConfig(value: unknown): value is SavedTestConfig {
  if (typeof value !== 'object' || value === null) return false;
  const config = value as Record<string, unknown>;
  return (
    (config.mode === 'time' || config.mode === 'words') &&
    isFiniteNonNegativeNumber(config.timeSeconds) &&
    isFiniteNonNegativeNumber(config.wordCount) &&
    typeof config.language === 'string' &&
    typeof config.punctuationEnabled === 'boolean' &&
    typeof config.numbersEnabled === 'boolean'
  );
}

function isCounters(value: unknown): value is TestCounters {
  return isNumberRecord(value, [
    'correctChars',
    'typedChars',
    'backspaces',
    'correctWords',
    'completedWords',
  ]);
}

function isPaceBucket(value: unknown): value is PaceBucket {
  return isNumberRecord(value, [
    'second',
    'typedChars',
    'correctChars',
    'backspaces',
    'rawWpm',
    'adjustedWpm',
  ]);
}

function isPauseTelemetry(value: unknown): value is PauseTelemetry {
  return isNumberRecord(value, [
    'longestPauseMs',
    'pausesOver500ms',
    'earlyAverageWpm',
    'middleAverageWpm',
    'finalAverageWpm',
  ]);
}

function isCorrectionCluster(value: unknown): value is CorrectionCluster {
  return isNumberRecord(value, ['startSecond', 'endSecond', 'count']);
}

function isExactCounters(value: unknown): value is ExactCounters {
  return isNumberRecord(value, [
    'totalCorrectChars',
    'totalTypedChars',
    'totalBackspaces',
    'exactDurationSeconds',
    'exactCorrectWords',
    'exactCompletedWords',
    'exactTestCount',
  ]);
}

function isKeyTelemetry(value: unknown): value is KeyTelemetry {
  if (!isNumberRecord(value, ['attempts', 'correct'])) return false;
  const telemetry = value as Record<string, unknown>;
  return isArrayOf(telemetry.errorPairs, isErrorPair);
}

function isKeyTelemetryRecord(value: unknown): value is Record<string, KeyTelemetry> {
  if (typeof value !== 'object' || value === null) return false;
  return Object.values(value).every(isKeyTelemetry);
}

function isInsights(value: unknown): value is TestInsights {
  if (typeof value !== 'object' || value === null) return false;
  const insights = value as Record<string, unknown>;
  return (
    isFiniteNonNegativeNumber(insights.correctionCount) &&
    isArrayOf(insights.errorPairs, isErrorPair) &&
    isArrayOf(insights.pace, isPaceBucket) &&
    isKeyTelemetryRecord(insights.keys) &&
    isPauseTelemetry(insights.pauses) &&
    isArrayOf(insights.correctionClusters, isCorrectionCluster)
  );
}

function isLetterMetricsRecord(val: unknown): val is Record<string, LetterMetrics> {
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

function isSession(value: unknown): value is TestSession {
  if (typeof value !== 'object' || value === null) return false;
  const session = value as Record<string, unknown>;
  return (
    typeof session.wpm === 'number' &&
    typeof session.accuracy === 'number' &&
    typeof session.testDate === 'string' &&
    typeof session.testDuration === 'number' &&
    typeof session.wordsTyped === 'number' &&
    typeof session.correctWords === 'number' &&
    isLetterMetricsRecord(session.letterAccuracy) &&
    (session.mode === 'time' || session.mode === 'words') &&
    isFiniteNonNegativeNumber(session.consistency) &&
    isFiniteNonNegativeNumber(session.burst) &&
    isArrayOf(session.wpmSeries, (point) => isNumberRecord(point, ['second', 'wpm', 'rawWpm'])) &&
    isConfig(session.config) &&
    isCounters(session.counters) &&
    isInsights(session.insights)
  );
}

function isCumulativeStats(value: unknown): value is CumulativeStats {
  if (typeof value !== 'object' || value === null) return false;
  const cumulative = value as Record<string, unknown>;
  return (
    typeof cumulative.totalTests === 'number' &&
    typeof cumulative.totalWordsTyped === 'number' &&
    typeof cumulative.totalTimeSpent === 'number' &&
    typeof cumulative.totalCorrectWords === 'number' &&
    typeof cumulative.weightedWPM === 'number' &&
    typeof cumulative.weightedRawWPM === 'number' &&
    typeof cumulative.weightedAccuracy === 'number' &&
    typeof cumulative.weightedConsistency === 'number' &&
    typeof cumulative.weightedBurst === 'number' &&
    typeof cumulative.firstTestDate === 'string' &&
    typeof cumulative.lastTestDate === 'string' &&
    isLetterMetricsRecord(cumulative.letterStats) &&
    isExactCounters(cumulative.exact)
  );
}

export function validateStoredData(value: unknown): value is EnhancedStoredData {
  if (typeof value !== 'object' || value === null) return false;
  const o = value as Record<string, unknown>;
  const recentSessions = o.recentSessions;

  return (
    isSession(o.lastSession) &&
    isCumulativeStats(o.cumulative) &&
    isArrayOf(recentSessions, isSession) &&
    recentSessions.length <= 30
  );
}
