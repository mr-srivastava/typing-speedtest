'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TestConfig, TestTiming } from './config';
import {
  createTypingTest,
  type TypingTestEvent,
  type TypingTestFinishedSnapshot,
  type TypingTestPhase,
  type TypingTestState,
} from './create-typing-test';
import getReferenceText from './text-provider';
import { deriveLiveTypingAnalytics } from './analytics';

export type { TypingTestFinishedSnapshot };
export type { TypingTestPhase } from './create-typing-test';

export interface UseTypingTestOptions {
  onFinished?: (snapshot: TypingTestFinishedSnapshot) => void;
  getReferenceText?: (config: TestConfig) => Promise<string>;
}

/** Returns the timing shape for the active mode. */
function extractTiming(state: TypingTestState): TestTiming {
  return state.mode === 'time'
    ? { mode: 'time', timerRemaining: state.timerRemaining, timerDuration: state.timerDuration }
    : { mode: 'words', elapsedSeconds: state.elapsedSeconds };
}

function toHookReturn(state: TypingTestState) {
  return {
    content: { text: state.referenceText, input: state.input },
    status: {
      phase: state.phase,
      loading: state.phase === 'loading',
      error: state.phase === 'error',
      started: state.phase === 'active' || state.phase === 'finished',
      finished: state.phase === 'finished',
    },
    loadError: state.loadError,
    mode: state.mode,
    timing: extractTiming(state),
    // The flat timer shape keeps display code simple. Use timing for mode-specific work.
    timer: {
      remaining: state.mode === 'time' ? state.timerRemaining : 0,
      duration: state.mode === 'time' ? state.timerDuration : 0,
      elapsedSeconds: state.mode === 'words' ? state.elapsedSeconds : 0,
    },
    metrics: {
      correctWordCount: state.correctWordCount,
      totalWordCount: state.totalWordCount,
      correctChars: state.correctChars,
      typedChars: state.typedChars,
      letterAccuracy: state.letterAccuracy,
    },
    analytics: deriveLiveTypingAnalytics(state),
    /** Available after the test finishes. */
    snapshot: state.snapshot,
  };
}

export function useTypingTest(testConfig: TestConfig, options: UseTypingTestOptions = {}) {
  const { onFinished, getReferenceText: getReferenceTextOption } = options;
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  const [engine] = useState(() =>
    createTypingTest({
      testConfig,
      getReferenceText: getReferenceTextOption ?? getReferenceText,
    }),
  );

  const [state, setState] = useState<TypingTestState>(() => engine.getState());

  const sync = useCallback(
    (prevPhase?: TypingTestPhase) => {
      const next = engine.getState();
      setState({ ...next });

      if (
        prevPhase !== undefined &&
        prevPhase !== 'finished' &&
        next.phase === 'finished' &&
        next.snapshot
      ) {
        onFinishedRef.current?.(next.snapshot);
      }

      return next;
    },
    [engine],
  );

  const dispatchAndSync = useCallback(
    (event: TypingTestEvent) => {
      const prevPhase = engine.getState().phase;
      engine.dispatch(event);
      sync(prevPhase);
    },
    [engine, sync],
  );

  useEffect(() => {
    const unsubscribe = engine.onReady(() => sync());
    sync(); // Covers a load that finished before the subscription was installed.
    return unsubscribe;
  }, [engine, sync]);

  useEffect(() => {
    if (state.phase !== 'active') {
      return;
    }

    const intervalId = setInterval(() => dispatchAndSync({ type: 'tick' }), 1000);

    return () => clearInterval(intervalId);
  }, [state.phase, dispatchAndSync]);

  const setInput = useCallback(
    (value: string) => dispatchAndSync({ type: 'input', value }),
    [dispatchAndSync],
  );

  const restart = useCallback(() => dispatchAndSync({ type: 'restart' }), [dispatchAndSync]);

  const reconfigure = useCallback(
    (nextConfig: TestConfig) => dispatchAndSync({ type: 'reconfigure', config: nextConfig }),
    [dispatchAndSync],
  );

  const view = toHookReturn(state);

  // Keep the action object stable for consumers that depend on it.
  const actions = useMemo(
    () => ({ restart, setInput, reconfigure }),
    [restart, setInput, reconfigure],
  );

  return {
    ...view,
    actions,
  };
}
