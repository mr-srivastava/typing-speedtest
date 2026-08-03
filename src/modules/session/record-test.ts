import { createInitialCumulativeStats, updateCumulativeStats } from './aggregate';
import type { EnhancedStoredData, TestSession } from './types';

export function mergeTestRecord(
  current: EnhancedStoredData | null,
  test: TestSession,
): EnhancedStoredData {
  if (current) {
    return {
      lastSession: test,
      cumulative: updateCumulativeStats(current.cumulative, test),
    };
  }

  return {
    lastSession: test,
    cumulative: createInitialCumulativeStats(test),
  };
}
