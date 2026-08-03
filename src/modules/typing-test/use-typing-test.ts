'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createTypingTest,
  type TypingTestFinishedSnapshot,
  type TypingTestPhase,
  type TypingTestState,
} from './create-typing-test';
import getText from './text-provider';

export type { TypingTestFinishedSnapshot };
export type { TypingTestPhase } from './create-typing-test';

export interface UseTypingTestOptions {
  onFinished?: (snapshot: TypingTestFinishedSnapshot) => void;
  getText?: () => string;
}

function toHookReturn(state: TypingTestState) {
  return {
    content: { text: state.referenceText, input: state.input },
    status: {
      phase: state.phase,
      started: state.phase === 'active' || state.phase === 'finished',
      finished: state.phase === 'finished',
    },
    timer: { remaining: state.timerRemaining, duration: state.duration },
    metrics: {
      correctWordCount: state.correctWordCount,
      totalWordCount: state.totalWordCount,
      letterAccuracy: state.letterAccuracy,
    },
  };
}

export function useTypingTest(defaultTimer: number, options: UseTypingTestOptions = {}) {
  const { onFinished, getText: getTextOption } = options;
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  const [engine] = useState(() =>
    createTypingTest({
      duration: defaultTimer,
      getText: getTextOption ?? getText,
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

  useEffect(() => {
    if (state.phase !== 'active') {
      return;
    }

    const intervalId = setInterval(() => {
      const prevPhase = engine.getState().phase;
      engine.dispatch({ type: 'tick' });
      sync(prevPhase);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.phase, engine, sync]);

  const setInput = useCallback(
    (value: string) => {
      const prevPhase = engine.getState().phase;
      engine.dispatch({ type: 'input', value });
      sync(prevPhase);
    },
    [engine, sync],
  );

  const restart = useCallback(() => {
    engine.dispatch({ type: 'restart' });
    sync();
  }, [engine, sync]);

  const view = toHookReturn(state);

  return {
    ...view,
    actions: { restart, setInput },
  };
}
