import type { LetterMetrics } from '@/modules/session/types';

export interface LiveTestMetrics {
  correctWordCount: number;
  totalWordCount: number;
  timerRemaining: number;
  timerDuration: number;
  letterAccuracy: Record<string, LetterMetrics>;
}

export type MetricsView =
  | { scope: 'live' }
  | { scope: 'cumulative' }
  | { scope: 'toggle'; initial: 'live' | 'cumulative' };

export type MetricsPreference = 'live' | 'cumulative' | 'auto';

export interface MetricsDisplayModel {
  wpm: number;
  accuracy: number;
  letterAccuracy: Record<string, LetterMetrics>;
  statsTitle: string | null;
  view: MetricsView;
  canToggle: boolean;
  showingCumulative: boolean;
  totalTests: number;
}
