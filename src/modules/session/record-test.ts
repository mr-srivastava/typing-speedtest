import { createInitialCumulativeStats, updateCumulativeStats } from './aggregate';
import type { EnhancedStoredData, TestSession } from './types';

const RECENT_SESSION_LIMIT = 30;

function appendRecentSession(current: EnhancedStoredData | null, test: TestSession): TestSession[] {
  return [test, ...(current?.recentSessions ?? [])].slice(0, RECENT_SESSION_LIMIT);
}

export function mergeTestRecord(
  current: EnhancedStoredData | null,
  test: TestSession,
): EnhancedStoredData {
  if (current) {
    return {
      lastSession: test,
      cumulative: updateCumulativeStats(current.cumulative, test),
      recentSessions: appendRecentSession(current, test),
    };
  }

  return {
    lastSession: test,
    cumulative: createInitialCumulativeStats(test),
    recentSessions: [test],
  };
}
