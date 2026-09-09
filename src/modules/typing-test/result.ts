import type { TestTiming } from './config';
import { calculateCurrentAccuracy, calculateWpm, resolveTestElapsedSeconds } from './scoring';
import type { LetterMetrics } from './types';
import type { WpmSeriesPoint } from './replay';

/** Final, frontend-agnostic metrics for one completed typing test. */
export type TypingTestResult = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  testDuration: number;
  wordsTyped: number;
  correctWords: number;
  letterAccuracy: Record<string, LetterMetrics>;
  mode: TestTiming['mode'];
  consistency: number;
  burst: number;
  wpmSeries: WpmSeriesPoint[];
};

export type TypingTestResultInput = TestTiming & {
  correctWordCount: number;
  totalWordCount: number;
  correctChars: number;
  typedChars: number;
  letterAccuracy: Record<string, LetterMetrics>;
  consistency: number;
  burst: number;
  wpmSeries: WpmSeriesPoint[];
};

export function buildTypingTestResult(input: TypingTestResultInput): TypingTestResult {
  const testDuration = resolveTestElapsedSeconds(input);

  return {
    wpm: calculateWpm(input.correctChars, testDuration),
    rawWpm: calculateWpm(input.typedChars, testDuration),
    accuracy: calculateCurrentAccuracy(input.correctWordCount, input.totalWordCount),
    testDuration,
    wordsTyped: Math.round(input.totalWordCount),
    correctWords: Math.round(input.correctWordCount),
    letterAccuracy: input.letterAccuracy,
    mode: input.mode,
    consistency: input.consistency,
    burst: input.burst,
    wpmSeries: input.wpmSeries,
  };
}
