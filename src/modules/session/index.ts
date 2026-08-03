export type { LetterMetrics, CumulativeStats, TestSession, EnhancedStoredData } from './types';
export type { SessionStore } from './session-store';
export { createInitialCumulativeStats, updateCumulativeStats } from './aggregate';
export { validateStoredData } from './validate';
export { createInMemorySessionStore } from './adapters/in-memory';
export { createLocalStorageSessionStore, SESSION_STORAGE_KEY } from './adapters/local-storage';
export { useSession as useSessionWithStore } from './use-session';
export { SessionProvider, useSession } from './session-provider';
