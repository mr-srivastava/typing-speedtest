import { mergeTestRecord } from '../record-test';
import type { SessionStore } from '../session-store';
import type { EnhancedStoredData, TestSession } from '../types';

export function createInMemorySessionStore(
  initial: EnhancedStoredData | null = null,
): SessionStore {
  let data: EnhancedStoredData | null = initial;

  return {
    load() {
      return data;
    },

    recordTest(test: TestSession): EnhancedStoredData {
      data = mergeTestRecord(data, test);
      return data;
    },

    clear() {
      data = null;
    },
  };
}
