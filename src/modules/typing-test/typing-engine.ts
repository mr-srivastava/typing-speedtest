/** Tracks letter attempts only. Backspace does not undo them. */

import type { LetterMetrics } from './types';

export function splitWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

export function countWordAccuracy(referenceText: string, input: string): LetterMetrics {
  return countWordAccuracyFromReferenceWords(splitWords(referenceText), input);
}

/** Calculates accuracy against reference words already prepared when a test loads. */
export function countWordAccuracyFromReferenceWords(
  referenceWords: readonly string[],
  input: string,
): LetterMetrics {
  const typedWords = splitWords(input);

  let correct = 0;
  for (let i = 0; i < typedWords.length; i++) {
    if (i < referenceWords.length && typedWords[i] === referenceWords[i]) {
      correct++;
    }
  }

  return { correct, total: typedWords.length };
}

export function isTestComplete(referenceText: string, input: string): boolean {
  return input.length === referenceText.length;
}

export function isLetterKey(char: string): boolean {
  return /[a-z]/i.test(char);
}

/**
 * Records one letter attempt without mutating the existing totals.
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
