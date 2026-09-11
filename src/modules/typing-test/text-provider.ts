import type { TestConfig } from './config';
import { generateReferenceText } from './generate-reference-text';
import { loadWordList } from './word-lists';

/** Resolves the reference text for a test config: loads the language's word list, then generates content. */
export default async function getReferenceText(config: TestConfig): Promise<string> {
  const words = await loadWordList(config.language);
  return generateReferenceText({ ...config, words });
}
