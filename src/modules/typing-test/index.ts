export type {
  TypingTestFinishedSnapshot,
  TypingTestPhase,
  TypingTestEvent,
  TypingTestState,
  TypingTest,
} from './create-typing-test';
export { createTypingTest } from './create-typing-test';
export { countWordAccuracy, splitWords } from './typing-engine';
export { deriveLiveTypingAnalytics } from './analytics';
export type { LiveTypingAnalytics } from './analytics';
export {
  calculateWpm,
  calculateCurrentAccuracy,
  resolveTestElapsedSeconds,
  getElapsedSecondsForWpm,
} from './scoring';
export type { LetterMetrics } from './types';
export { useTypingTest } from './use-typing-test';
export type { UseTypingTestOptions } from './use-typing-test';
export { default as getReferenceText } from './text-provider';
export type { TestMode, TestConfig, TestTiming } from './config';
export { TIME_PRESETS, WORD_COUNT_PRESETS, DEFAULT_TEST_CONFIG } from './config';
export { LANGUAGES, loadWordList } from './word-lists';
export type { LanguageCode } from './word-lists';
export {
  estimateWordBudget,
  applyPunctuation,
  generateReferenceText,
} from './generate-reference-text';
export type { GenerateReferenceTextOptions } from './generate-reference-text';
export { diffInputToEvents } from './event-log';
export type { TypingLogEvent, TypingEventLog } from './event-log';
export { deriveWpmSeries, deriveConsistency, deriveBurst } from './replay';
export type { WpmSeriesPoint } from './replay';
