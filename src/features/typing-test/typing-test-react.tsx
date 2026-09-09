'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { TestConfig } from '@/modules/typing-test/config';
import {
  createTypingTest,
  type TypingTest,
  type TypingTestFinishedSnapshot,
  type TypingTestState,
} from '@/modules/typing-test/create-typing-test';
import {
  deriveLiveTypingAnalytics,
  type LiveTypingAnalytics,
} from '@/modules/typing-test/analytics';
import getReferenceText from '@/modules/typing-test/text-provider';

const TypingTestContext = createContext<TypingTest | null>(null);

export interface TypingTestProviderProps {
  config: TestConfig;
  onFinished?: (snapshot: TypingTestFinishedSnapshot) => void;
  getReferenceText?: (config: TestConfig) => Promise<string>;
  children: React.ReactNode;
}

/** Optional React integration for the framework-neutral typing-test SDK. */
export function TypingTestProvider({
  config,
  onFinished,
  getReferenceText: loadReferenceText = getReferenceText,
  children,
}: TypingTestProviderProps) {
  const [test] = useState(() =>
    createTypingTest({ testConfig: config, getReferenceText: loadReferenceText }),
  );
  const state = useSyncExternalStore(test.subscribe, test.getState, test.getState);
  const onFinishedRef = useRef(onFinished);
  const isInitialConfig = useRef(true);
  const reportedSnapshot = useRef<TypingTestFinishedSnapshot | null>(null);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    if (isInitialConfig.current) {
      isInitialConfig.current = false;
      return;
    }
    test.dispatch({ type: 'reconfigure', config });
  }, [config, test]);

  useEffect(() => {
    if (state.phase !== 'active') return;
    const intervalId = setInterval(() => test.dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(intervalId);
  }, [state.phase, test]);

  useEffect(() => {
    if (
      state.phase !== 'finished' ||
      !state.snapshot ||
      reportedSnapshot.current === state.snapshot
    ) {
      return;
    }
    reportedSnapshot.current = state.snapshot;
    onFinishedRef.current?.(state.snapshot);
  }, [state.phase, state.snapshot]);

  return <TypingTestContext.Provider value={test}>{children}</TypingTestContext.Provider>;
}

function useTypingTest(): TypingTest {
  const test = useContext(TypingTestContext);
  if (!test) throw new Error('Typing-test hooks must be used within TypingTestProvider.');
  return test;
}

/** Subscribes only where current SDK state is needed. */
export function useTypingTestState(): TypingTestState {
  const test = useTypingTest();
  return useSyncExternalStore(test.subscribe, test.getState, test.getState);
}

export function useTypingTestAnalytics(): LiveTypingAnalytics {
  const state = useTypingTestState();
  return useMemo(() => deriveLiveTypingAnalytics(state), [state]);
}

export function useTypingTestActions() {
  const test = useTypingTest();

  const setInput = useCallback((value: string) => test.dispatch({ type: 'input', value }), [test]);
  const restart = useCallback(() => test.dispatch({ type: 'restart' }), [test]);

  return useMemo(() => ({ setInput, restart }), [restart, setInput]);
}
