import type { LetterMetrics, LiveTypingAnalytics, WpmSeriesPoint } from '@/modules/typing-test';
import type { CoachingInsight } from './coaching';
import type {
  CorrectionCluster,
  KeyTelemetry,
  PaceBucket,
  TestSession,
} from '@/modules/session/types';

/** The SDK's live analytics snapshot, as consumed by the metrics display pipeline. */
export type LiveTestMetrics = LiveTypingAnalytics;

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
