/**
 * Pure typing-test domain logic. No React imports.
 *
 * Letter accuracy: only [a-z] keys are tracked. Backspace does not
 * decrement counts — only the last character of a growing/changed input
 * is recorded when evaluateInput runs (same behavior as before).
 */

import type { LetterMetrics } from '@/modules/session';

export interface WordAccuracy {
  correct: number;
  total: number;
}

/** Character counts for the industry-standard "chars / 5 = words" WPM formula. */
export interface CharAccuracy {
  correctChars: number;
  typedChars: number;
}

interface AccuracyCounts {
  correctWordCount: number;
  totalWordCount: number;
  correctChars: number;
  typedChars: number;
}

export interface TypingTestFinishedSnapshot extends AccuracyCounts {
  timer: number;
  letterAccuracy: Record<string, LetterMetrics>;
}

export interface EvaluateInputResult extends AccuracyCounts {
  letterAccuracy: Record<string, LetterMetrics>;
  isComplete: boolean;
}

export function splitWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

export function countWordAccuracy(referenceText: string, input: string): WordAccuracy {
  const typedWords = splitWords(input);
  const textWords = splitWords(referenceText);

  let correct = 0;
  for (let i = 0; i < typedWords.length; i++) {
    if (i < textWords.length && typedWords[i] === textWords[i]) {
      correct++;
    }
  }

  return { correct, total: typedWords.length };
}

export function isTestComplete(referenceText: string, input: string): boolean {
  return input.length === referenceText.length;
}

/**
 * Per-character correctness against the reference text, position by position.
 * `typedChars` is every character typed so far (raw); `correctChars` is the
 * subset that matches the reference at that position (correct).
 */
export function countCharAccuracy(referenceText: string, input: string): CharAccuracy {
  let correctChars = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === referenceText[i]) {
      correctChars++;
    }
  }
  return { correctChars, typedChars: input.length };
}

/** Word + character accuracy counts, computed together since every caller needs both. */
function countAccuracy(referenceText: string, input: string): AccuracyCounts {
  const { correct, total } = countWordAccuracy(referenceText, input);
  const { correctChars, typedChars } = countCharAccuracy(referenceText, input);
  return { correctWordCount: correct, totalWordCount: total, correctChars, typedChars };
}

export function isLetterKey(char: string): boolean {
  return /[a-z]/i.test(char);
}

/**
 * Immutable letter-metrics update for one keystroke.
 * Only [a-z] characters are tracked (case-insensitive).
 */
export function recordLetterAccuracy(
  prev: Record<string, LetterMetrics>,
  typedChar: string,
  expectedChar: string,
): Record<string, LetterMetrics> {
  if (!typedChar || !isLetterKey(typedChar)) {
    return prev;
  }

  const lowerChar = typedChar.toLowerCase();
  const next = { ...prev };
  next[lowerChar] = next[lowerChar] ? { ...next[lowerChar] } : { correct: 0, total: 0 };
  next[lowerChar].total++;
  if (typedChar === expectedChar) {
    next[lowerChar].correct++;
  }
  return next;
}

/**
 * Main entry: word counts + letter accuracy for the latest keystroke + completion.
 * Letter accuracy is updated from the last character of `input` only.
 */
export function evaluateInput(
  referenceText: string,
  input: string,
  prevLetterAccuracy: Record<string, LetterMetrics>,
): EvaluateInputResult {
  const lastChar = input[input.length - 1] ?? '';
  const expectedChar = referenceText[input.length - 1] ?? '';
  const letterAccuracy = recordLetterAccuracy(prevLetterAccuracy, lastChar, expectedChar);

  return {
    ...countAccuracy(referenceText, input),
    letterAccuracy,
    isComplete: isTestComplete(referenceText, input),
  };
}

export function buildFinishedSnapshot(
  referenceText: string,
  input: string,
  timerRemaining: number,
  letterAccuracy: Record<string, LetterMetrics>,
): TypingTestFinishedSnapshot {
  return {
    ...countAccuracy(referenceText, input),
    timer: timerRemaining,
    letterAccuracy,
  };
}
