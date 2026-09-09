import { describe, expect, it } from 'vitest';
import { LANGUAGES, loadWordList } from './index';

describe('loadWordList', () => {
  it('exposes a typed catalog with the available language labels', () => {
    expect(LANGUAGES.map(({ code, label }) => ({ code, label }))).toEqual([
      { code: 'english', label: 'English' },
    ]);
  });

  it('loads the english word list', async () => {
    const words = await loadWordList('english');
    expect(Array.isArray(words)).toBe(true);
    expect(words.length).toBeGreaterThan(100);
    expect(new Set(words).size).toBe(words.length); // no duplicates
    expect(words).toContain('the');
  });
});
