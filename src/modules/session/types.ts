import type { LetterMetrics, TestConfig, TestMode, WpmSeriesPoint } from '@/modules/typing-test';

export type { LetterMetrics } from '@/modules/typing-test';

/** Exact per-character/word counters, aggregated across every contributing test. */
export interface ExactCounters {
  totalCorrectChars: number;
  totalTypedChars: number;
  totalBackspaces: number;
  exactDurationSeconds: number;
  exactCorrectWords: number;
  exactCompletedWords: number;
  exactTestCount: number;
}

export interface CumulativeStats {
  totalTests: number;
  totalWordsTyped: number;
  totalTimeSpent: number; // in seconds
  totalCorrectWords: number; // for weighted accuracy calculation
  weightedWPM: number;
  weightedRawWPM: number;
  weightedAccuracy: number;
  weightedConsistency: number;
  weightedBurst: number;
  letterStats: Record<string, LetterMetrics>; // aggregated across all tests
  firstTestDate: string;
  lastTestDate: string;
  exact: ExactCounters;
}

export interface TestCounters {
  correctChars: number;
  typedChars: number;
  backspaces: number;
  correctWords: number;
  completedWords: number;
}

export interface TypingErrorPair {
  expected: string;
  typed: string;
  count: number;
}

export interface KeyTelemetry {
  attempts: number;
  correct: number;
  errorPairs: TypingErrorPair[];
}

export interface PaceBucket {
  second: number;
  typedChars: number;
  correctChars: number;
  backspaces: number;
  rawWpm: number;
  adjustedWpm: number;
}

export interface PauseTelemetry {
  longestPauseMs: number;
  pausesOver500ms: number;
  earlyAverageWpm: number;
  middleAverageWpm: number;
  finalAverageWpm: number;
}

export interface CorrectionCluster {
  startSecond: number;
  endSecond: number;
  count: number;
}

export interface TestInsights {
  correctionCount: number;
  errorPairs: TypingErrorPair[];
  pace: PaceBucket[];
  keys: Record<string, KeyTelemetry>;
  pauses: PauseTelemetry;
  correctionClusters: CorrectionCluster[];
}

export type SavedTestConfig = Pick<
  TestConfig,
  'mode' | 'timeSeconds' | 'wordCount' | 'language' | 'punctuationEnabled' | 'numbersEnabled'
>;

export interface TestSession {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  testDate: string;
  testDuration: number;
  wordsTyped: number;
  correctWords: number;
  letterAccuracy: Record<string, LetterMetrics>;
  mode: TestMode;
  consistency: number;
  burst: number;
  wpmSeries: WpmSeriesPoint[];
  config: SavedTestConfig;
  counters: TestCounters;
  insights: TestInsights;
}

export interface EnhancedStoredData {
  lastSession: TestSession;
  cumulative: CumulativeStats;
  /** Most recent compact test records, newest first. */
  recentSessions: TestSession[];
}
