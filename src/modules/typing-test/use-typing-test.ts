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

export type { TypingTestFinishedSnapshot };
export type { TypingTestPhase } from './create-typing-test';

export interface UseTypingTestOptions {
  onFinished?: (snapshot: TypingTestFinishedSnapshot) => void;
  getReferenceText?: (config: TestConfig) => Promise<string>;
}

/** Pulls the real discriminated `TestTiming` out of `state` — the mode-safe source consumers
 *  that need to branch on it (WPM calc, the results modal) should read from directly. */
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
      started: state.phase === 'active' || state.phase === 'finished',
      finished: state.phase === 'finished',
    },
    mode: state.mode,
    timing: extractTiming(state),
    // Flattened for UI ergonomics: the inactive mode's field(s) read as 0, matching the
    // discriminated `TestTiming`'s absence of that field for the current mode. Use `timing`
    // above instead when mode-safe access is what's needed (WPM calc, anything downstream).
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
    /** Event-sourced stats (wpmSeries/consistency/burst) — populated once the test finishes. */
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
    sync(); // catch up in case the reference text resolved before this effect ran
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

  // Stable reference so consumers can depend on the whole `actions` object (e.g. in a
  // useEffect) without it changing identity every render.
  const actions = useMemo(
    () => ({ restart, setInput, reconfigure }),
    [restart, setInput, reconfigure],
  );

  return {
    ...view,
    actions,
  };
}
