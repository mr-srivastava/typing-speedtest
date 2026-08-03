'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SessionStore } from './session-store';
import type { EnhancedStoredData, TestSession } from './types';

export function useSession(store: SessionStore) {
  const [data, setData] = useState<EnhancedStoredData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    try {
      setData(store.load());
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  const recordTest = useCallback(
    (test: TestSession) => {
      const updated = store.recordTest(test);
      setData(updated);
    },
    [store],
  );

  const clearSession = useCallback(() => {
    store.clear();
    setData(null);
  }, [store]);

  return useMemo(
    () => ({
      data,
      isLoading,
      isHydrated,
      hasSession: !!data,
      recordTest,
      clearSession,
    }),
    [data, isLoading, isHydrated, recordTest, clearSession],
  );
}
