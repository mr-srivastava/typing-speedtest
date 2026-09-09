import { describe, expect, it } from 'vitest';
import {
  applyPunctuation,
  estimateWordBudget,
  generateReferenceText,
  type GenerateReferenceTextOptions,
} from './generate-reference-text';

const WORDS = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that'];

function makeOptions(
  overrides: Partial<GenerateReferenceTextOptions> = {},
): GenerateReferenceTextOptions {
  return {
    mode: 'words',
    wordCount: 10,
    timeSeconds: 60,
    punctuationEnabled: false,
    numbersEnabled: false,
    language: 'english',
    words: WORDS,
    ...overrides,
  };
}

describe('estimateWordBudget', () => {
  it('uses wordCount directly for word mode', () => {
    expect(estimateWordBudget('words', 25, 60)).toBe(25);
    expect(estimateWordBudget('words', 100, 15)).toBe(100);
  });

  it('scales with duration for time mode, with a floor', () => {
    expect(estimateWordBudget('time', 25, 120)).toBe(360);
    expect(estimateWordBudget('time', 25, 15)).toBe(60); // floor kicks in (15*3=45 < 60)
  });
});

describe('applyPunctuation', () => {
  it('capitalizes the first word and ends the last word with sentence punctuation', () => {
    const result = applyPunctuation(['the', 'cat', 'sat']);
    expect(result[0][0]).toBe(result[0][0].toUpperCase());
    expect(/[.?!]$/.test(result[result.length - 1])).toBe(true);
  });

  it('returns an empty array unchanged', () => {
    expect(applyPunctuation([])).toEqual([]);
  });
});

describe('generateReferenceText', () => {
  it('generates the expected word count for word mode', () => {
    const text = generateReferenceText(makeOptions({ wordCount: 10 }));
    expect(text.split(' ')).toHaveLength(10);
  });

  it('generates a generous word count for time mode', () => {
    const text = generateReferenceText(makeOptions({ mode: 'time', timeSeconds: 60 }));
    expect(text.split(' ')).toHaveLength(180);
  });

  it('never emits digit tokens when numbersEnabled is false', () => {
    for (let i = 0; i < 20; i++) {
      const text = generateReferenceText(makeOptions({ wordCount: 50, numbersEnabled: false }));
      expect(/\d/.test(text)).toBe(false);
    }
  });

  it('can emit digit tokens when numbersEnabled is true', () => {
    let sawDigit = false;
    for (let i = 0; i < 50 && !sawDigit; i++) {
      const text = generateReferenceText(makeOptions({ wordCount: 50, numbersEnabled: true }));
      if (/\d/.test(text)) sawDigit = true;
    }
    expect(sawDigit).toBe(true);
  });

  it('produces output with no leading/trailing/double whitespace', () => {
    const text = generateReferenceText(
      makeOptions({ wordCount: 30, punctuationEnabled: true, numbersEnabled: true }),
    );
    expect(text).not.toMatch(/^\s|\s$/);
    expect(text).not.toMatch(/\s{2,}/);
  });

  it('returns an empty string when the word list is empty', () => {
    expect(generateReferenceText(makeOptions({ words: [] }))).toBe('');
  });
});
