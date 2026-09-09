import type { TestMode } from '@/modules/typing-test/config';
import type { WpmSeriesPoint } from '@/modules/typing-test/replay';
import type { LetterMetrics } from '@/modules/typing-test/types';

export type { LetterMetrics } from '@/modules/typing-test/types';

export interface CumulativeStats {
  totalTests: number;
  totalWordsTyped: number;
  totalTimeSpent: number; // in seconds
  totalCorrectWords: number; // for weighted accuracy calculation
  weightedWPM: number;
  weightedRawWPM?: number; // optional: absent in data recorded before raw WPM tracking
  weightedAccuracy: number;
  weightedConsistency?: number; // optional: absent in data recorded before event-log tracking
  weightedBurst?: number; // optional: absent in data recorded before event-log tracking
  letterStats: Record<string, LetterMetrics>; // aggregated across all tests
  firstTestDate: string;
  lastTestDate: string;
}

export interface TestSession {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  testDate: string;
  testDuration: number;
  wordsTyped: number;
  correctWords: number;
  letterAccuracy: Record<string, LetterMetrics>;
  mode?: TestMode; // optional: absent in data recorded before mode/customization support
  consistency?: number; // optional: absent in data recorded before event-log tracking
  burst?: number; // optional: absent in data recorded before event-log tracking
  wpmSeries?: WpmSeriesPoint[]; // optional: absent in data recorded before event-log tracking
}

export interface EnhancedStoredData {
  lastSession: TestSession;
  cumulative: CumulativeStats;
}
