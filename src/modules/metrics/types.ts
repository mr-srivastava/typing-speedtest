import type { LetterMetrics } from '@/modules/typing-test/types';
import type { TestTiming } from '@/modules/typing-test/config';
import type { WpmSeriesPoint } from '@/modules/typing-test/replay';

export type LiveTestMetrics = TestTiming & {
  correctWordCount: number;
  totalWordCount: number;
  correctChars: number;
  typedChars: number;
  letterAccuracy: Record<string, LetterMetrics>;
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
}
