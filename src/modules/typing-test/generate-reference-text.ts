import type { TestConfig, TestMode } from './config';

/** Minimum word budget for time-mode tests, regardless of duration. */
const TIME_MODE_WORD_FLOOR = 60;

/** Generous headroom multiplier so a fast typer can't outrun the buffer (~180 WPM ceiling). */
const TIME_MODE_WORDS_PER_SECOND = 3;

/** Target word count for the reference text, given the test mode and its parameters. */
export function estimateWordBudget(mode: TestMode, wordCount: number, timeSeconds: number): number {
  if (mode === 'words') {
    return wordCount;
  }
  return Math.max(TIME_MODE_WORD_FLOOR, Math.round(timeSeconds * TIME_MODE_WORDS_PER_SECOND));
}

function pickWord(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

/** Replaces a word with a random 1-4 digit number token, matching Monkeytype's convention. */
function toNumberToken(): string {
  const digitCount = 1 + Math.floor(Math.random() * 4);
  let token = String(1 + Math.floor(Math.random() * 9));
  for (let i = 1; i < digitCount; i++) {
    token += String(Math.floor(Math.random() * 10));
  }
  return token;
}

const SENTENCE_END_PUNCTUATION = ['.', '.', '.', '?', '!'];

function capitalize(word: string): string {
  return word.length === 0 ? word : word[0].toUpperCase() + word.slice(1);
}

/**
 * Capitalizes the first word and words that follow sentence-ending punctuation,
 * and appends comma/sentence-ending punctuation at intervals.
 */
export function applyPunctuation(words: string[]): string[] {
  if (words.length === 0) {
    return words;
  }

  const result = [...words];
  let capitalizeNext = true;

  for (let i = 0; i < result.length; i++) {
    const isLastWord = i === result.length - 1;

    if (capitalizeNext) {
      result[i] = capitalize(result[i]);
      capitalizeNext = false;
    }

    if (isLastWord) {
      result[i] +=
        SENTENCE_END_PUNCTUATION[Math.floor(Math.random() * SENTENCE_END_PUNCTUATION.length)];
      continue;
    }

    const roll = Math.random();
    if (roll < 0.12) {
      result[i] += ',';
    } else if (roll < 0.22) {
      result[i] +=
        SENTENCE_END_PUNCTUATION[Math.floor(Math.random() * SENTENCE_END_PUNCTUATION.length)];
      capitalizeNext = true;
    }
  }

  return result;
}

export type GenerateReferenceTextOptions = TestConfig & { words: string[] };

/** Builds a space-joined reference text from a resolved word list, per test config. */
export function generateReferenceText(options: GenerateReferenceTextOptions): string {
  const { mode, wordCount, timeSeconds, punctuationEnabled, numbersEnabled, words } = options;

  if (words.length === 0) {
    return '';
  }

  const budget = estimateWordBudget(mode, wordCount, timeSeconds);
  let picked = Array.from({ length: budget }, () => pickWord(words));

  if (numbersEnabled) {
    picked = picked.map((word) => (Math.random() < 0.125 ? toNumberToken() : word));
  }

  if (punctuationEnabled) {
    picked = applyPunctuation(picked);
  }

  return picked.join(' ');
}
