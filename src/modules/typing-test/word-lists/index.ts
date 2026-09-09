import type { LanguageCode } from '@/modules/typing-test/config';

/** Loads the word list for a language. Dynamic import keeps unused languages out of the bundle. */
export async function loadWordList(language: LanguageCode): Promise<string[]> {
  switch (language) {
    case 'english':
      return (await import('./english.json')).default;
  }
}
