import type { LanguageCode } from './word-lists';

export type TestMode = 'time' | 'words';

/** Keep both values when switching modes. */
export interface TestConfig {
  mode: TestMode;
  timeSeconds: number;
  wordCount: number;
  punctuationEnabled: boolean;
  numbersEnabled: boolean;
  language: LanguageCode;
}

/** Time mode counts down. Word mode counts up. */
export type TestTiming =
  | { mode: 'time'; timerRemaining: number; timerDuration: number }
  | { mode: 'words'; elapsedSeconds: number };

export const TIME_PRESETS = [15, 30, 60, 120] as const;
export const WORD_COUNT_PRESETS = [10, 25, 50, 100] as const;

export const DEFAULT_TEST_CONFIG: TestConfig = {
  mode: 'time',
  timeSeconds: 60,
  wordCount: 25,
  punctuationEnabled: false,
  numbersEnabled: false,
  language: 'english',
};
