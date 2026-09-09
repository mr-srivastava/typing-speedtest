/** Tracks letter attempts only. Backspace does not undo them. */

import type { LetterMetrics } from '@/modules/session';

export interface WordAccuracy {
  correct: number;
  total: number;
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
