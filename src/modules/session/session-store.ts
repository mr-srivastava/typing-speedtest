import type { EnhancedStoredData, TestSession } from './types';

export interface SessionStore {
  load(): EnhancedStoredData | null;
  recordTest(test: TestSession): EnhancedStoredData;
  clear(): void;
}
