'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SessionStore } from './session-store';
import type { EnhancedStoredData, TestSession } from './types';

export function useSession(store: SessionStore) {
  const [data, setData] = useState<EnhancedStoredData | null>(null);
  /** False until the client has mounted and loaded from storage — guards against SSR/CSR mismatch. */
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- loads from storage, unavailable during SSR/render
    setData(store.load());
    setIsReady(true);
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
      isReady,
      hasSession: !!data,
      recordTest,
      clearSession,
    }),
    [data, isReady, recordTest, clearSession],
  );
}
