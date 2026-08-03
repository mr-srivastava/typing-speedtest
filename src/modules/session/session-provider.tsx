'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { createLocalStorageSessionStore } from './adapters/local-storage';
import type { SessionStore } from './session-store';
import { useSession as useSessionWithStore } from './use-session';
import type { EnhancedStoredData, TestSession } from './types';

interface SessionContextType {
  data: EnhancedStoredData | null;
  isLoading: boolean;
  isHydrated: boolean;
  hasSession: boolean;
  recordTest: (testSession: TestSession) => void;
  saveTestSession: (testSession: TestSession) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo<SessionStore>(
    () => createLocalStorageSessionStore(),
    [],
  );
  const sessionData = useSessionWithStore(store);

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
