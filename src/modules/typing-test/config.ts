export type TestMode = 'time' | 'words';

export type LanguageCode = 'english';

/**
 * User-facing test settings. `timeSeconds` and `wordCount` are BOTH always present —
 * unlike the live-state interfaces (`TestTiming` below), this is a settings bag, not a
 * snapshot of what's currently happening. Keeping both lets the UI remember "how many
 * words you last picked" while you're in time mode (and vice versa), so toggling `mode`
 * back and forth doesn't reset the other preset. See `TestSettingsBar.tsx`'s `setMode`.
 */
export interface TestConfig {
  mode: TestMode;
  timeSeconds: number;
  wordCount: number;
  punctuationEnabled: boolean;
  numbersEnabled: boolean;
  language: LanguageCode;
}

/**
 * Mode-specific live timing. Time mode counts down (`timerRemaining`/`timerDuration`);
 * word mode counts up with no ceiling (`elapsedSeconds`). Unlike `TestConfig`, this
 * describes what's actually happening right now, so only one mode's fields ever exist —
 * shared by `TypingTestState`, `LiveTestMetrics`, and `TypingTestFinishedSnapshot`.
 */
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
