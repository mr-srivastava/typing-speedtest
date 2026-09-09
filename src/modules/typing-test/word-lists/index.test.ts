import { describe, expect, it } from 'vitest';
import { loadWordList } from './index';

describe('loadWordList', () => {
  it('loads the english word list', async () => {
    const words = await loadWordList('english');
    expect(Array.isArray(words)).toBe(true);
    expect(words.length).toBeGreaterThan(100);
    expect(new Set(words).size).toBe(words.length); // no duplicates
    expect(words).toContain('the');
  });
});
