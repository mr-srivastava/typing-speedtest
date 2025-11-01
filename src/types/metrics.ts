export interface LetterMetrics {
  correct: number;
  total: number;
}

export interface CumulativeStats {
  totalTests: number;
  totalWordsTyped: number;
  totalTimeSpent: number; // in seconds
  totalCorrectWords: number; // for weighted accuracy calculation
  weightedWPM: number;
  weightedAccuracy: number;
  letterStats: Record<string, LetterMetrics>; // aggregated across all tests
  firstTestDate: string;
  lastTestDate: string;
}

export interface TestSession {
  wpm: number;
  accuracy: number;
  testDate: string;
  testDuration: number;
  wordsTyped: number;
  correctWords: number;
  letterAccuracy: Record<string, LetterMetrics>;
}

export interface EnhancedStoredData {
  lastSession: TestSession;
  cumulative: CumulativeStats;
}
