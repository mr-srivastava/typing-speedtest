/** Language choices and their word-list loaders. */
export const LANGUAGES = [
  {
    code: 'english',
    label: 'English',
    load: async () => (await import('./english.json')).default,
  },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

/** Loads the requested word list on demand. */
export async function loadWordList(languageCode: LanguageCode): Promise<string[]> {
  const language = LANGUAGES.find(({ code }) => code === languageCode);
  if (!language) {
    throw new Error(`Unsupported language: ${languageCode}`);
  }
  return language.load();
}
