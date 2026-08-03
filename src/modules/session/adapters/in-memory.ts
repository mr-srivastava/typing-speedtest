import {
  createInitialCumulativeStats,
  updateCumulativeStats,
} from '../aggregate';
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
      if (data) {
        data = {
          lastSession: test,
          cumulative: updateCumulativeStats(data.cumulative, test),
        };
      } else {
        data = {
          lastSession: test,
          cumulative: createInitialCumulativeStats(test),
        };
      }
      return data;
    },

    clear() {
      data = null;
    },
  };
}
