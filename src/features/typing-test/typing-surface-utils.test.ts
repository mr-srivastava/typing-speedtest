import { describe, expect, it } from 'vitest';
import {
  getCharStatus,
  getCurrentWordSpanIndex,
  parseReferenceSpans,
} from './typing-surface-utils';

describe('typing-surface-utils', () => {
  it('parses words and preserves spaces', () => {
    const spans = parseReferenceSpans('If cats could');
    expect(spans).toEqual([
      { text: 'If', startIndex: 0, isWhitespace: false },
      { text: ' ', startIndex: 2, isWhitespace: true },
      { text: 'cats', startIndex: 3, isWhitespace: false },
      { text: ' ', startIndex: 7, isWhitespace: true },
      { text: 'could', startIndex: 8, isWhitespace: false },
    ]);
  });

  it('tracks current word by cursor index', () => {
    const spans = parseReferenceSpans('If cats could');
    expect(getCurrentWordSpanIndex(spans, 0)).toBe(0);
    expect(getCurrentWordSpanIndex(spans, 2)).toBe(0);
    expect(getCurrentWordSpanIndex(spans, 3)).toBe(2);
  });

  it('classifies character status', () => {
    const reference = 'ab';
    expect(getCharStatus(reference, 'a', 0)).toBe('correct');
    expect(getCharStatus(reference, 'ax', 1)).toBe('incorrect');
    expect(getCharStatus(reference, 'a', 1)).toBe('cursor');
    expect(getCharStatus(reference, 'a', 2)).toBe('pending');
  });
});
