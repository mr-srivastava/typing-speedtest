import type { LetterMetrics, TestTiming, WpmSeriesPoint } from '@/modules/typing-test';
import type { CoachingInsight } from './coaching';
import type {
  CorrectionCluster,
  KeyTelemetry,
  PaceBucket,
  TestSession,
} from '@/modules/session/types';

export type LiveTestMetrics = TestTiming & {
  correctWordCount: number;
  totalWordCount: number;
  correctChars: number;
  typedChars: number;
  letterAccuracy: Record<string, LetterMetrics>;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  /** Only available once the test has finished (event-sourced stats derived at finish time). */
  consistency?: number;
  wpmSeries?: WpmSeriesPoint[];
};

export type MetricsView =
  | { scope: 'live' }
  | { scope: 'cumulative' }
  | { scope: 'toggle'; initial: 'live' | 'cumulative' };

export type MetricsPreference = 'live' | 'cumulative' | 'auto';

export interface MetricsDisplayModel {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  characterAccuracy: number;
  wordAccuracy: number;
  letterAccuracy: Record<string, LetterMetrics>;
  statsTitle: string | null;
  view: MetricsView;
  canToggle: boolean;
  showingCumulative: boolean;
  totalTests: number;
  /** Weighted-average consistency in cumulative view; this test's consistency in live view. */
  consistency?: number;
  /** Per-second WPM history — only available for a single finished test, not cumulative. */
  wpmSeries?: WpmSeriesPoint[];
  baselineWpm?: number;
  coaching?: CoachingInsight;
  correctionCost: number;
  paceBuckets?: PaceBucket[];
  keyTelemetry?: Record<string, KeyTelemetry>;
  correctionClusters?: CorrectionCluster[];
  recentSessions: TestSession[];
}
