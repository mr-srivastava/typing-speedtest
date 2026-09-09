import { createActor } from 'xstate';

import type { TestConfig } from './config';
import {
  typingTestMachine,
  type TypingTestContext,
  type TypingTestEvent,
  type TypingTestFinishedSnapshot,
} from './typing-test-machine';

export type { TypingTestEvent, TypingTestFinishedSnapshot };

export type TypingTestPhase = 'loading' | 'idle' | 'active' | 'finished';

/** `Omit` over `T`, distributed across a union so a discriminated union's variant-specific keys survive. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** Public state = the machine's context (minus the `getReferenceText` closure) plus its phase. */
export type TypingTestState = DistributiveOmit<TypingTestContext, 'getReferenceText'> & {
  phase: TypingTestPhase;
};

export interface TypingTest {
  getState(): TypingTestState;
  dispatch(event: TypingTestEvent): void;
  /** Subscribes to async reference-text-load completion (phase -> 'idle'). Returns an unsubscribe function. */
  onReady(listener: () => void): () => void;
}

/** Runs the typing-test state machine as an XState actor behind the same `TypingTest` interface. */
export function createTypingTest(config: {
  testConfig: TestConfig;
  getReferenceText: (config: TestConfig) => Promise<string>;
}): TypingTest {
  const actor = createActor(typingTestMachine, {
    input: { testConfig: config.testConfig, getReferenceText: config.getReferenceText },
  });

  const readyListeners = new Set<() => void>();
  let prevValue = actor.getSnapshot().value;

  actor.subscribe((snapshot) => {
    if (prevValue !== 'idle' && snapshot.value === 'idle') {
      readyListeners.forEach((listener) => listener());
    }
    prevValue = snapshot.value;
  });

  actor.start();

  function getState(): TypingTestState {
    const snapshot = actor.getSnapshot();
    // `getReferenceText` is an implementation detail of the machine's context, not part of
    // the public TypingTestState shape.
    const { getReferenceText: _getReferenceText, ...rest } = snapshot.context;
    return {
      phase: snapshot.value as TypingTestPhase,
      ...rest,
    };
  }

  return {
    getState,
    dispatch: (event) => actor.send(event),
    onReady: (listener) => {
      readyListeners.add(listener);
      return () => readyListeners.delete(listener);
    },
  };
}
