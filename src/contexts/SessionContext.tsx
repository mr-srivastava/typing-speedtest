'use client';
import React, { createContext, useContext } from 'react';
import { EnhancedStoredData, TestSession } from '@/types/metrics';
import { useSession as useSessionHook } from '@/hooks/complex/useSession';

interface SessionContextType {
  data: EnhancedStoredData | null;
  isLoading: boolean;
  isHydrated: boolean;
  hasSession: boolean;
  saveTestSession: (testSession: TestSession) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const sessionData = useSessionHook();

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
