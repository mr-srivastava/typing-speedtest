import { createActor } from 'xstate';

import type { TestConfig } from './config';
import {
  typingTestMachine,
  type TypingTestContext,
  type TypingTestEvent,
  type TypingTestFinishedSnapshot,
} from './typing-test-machine';

export type { TypingTestEvent, TypingTestFinishedSnapshot };

export type TypingTestPhase = 'loading' | 'error' | 'idle' | 'active' | 'finished';

/** Omit keys from each member of a union. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** Machine context exposed without its text-loader closure. */
export type TypingTestState = DistributiveOmit<TypingTestContext, 'getReferenceText'> & {
  phase: TypingTestPhase;
};

export interface TypingTest {
  getState(): TypingTestState;
  /** Notifies whenever the SDK state changes. */
  subscribe(listener: () => void): () => void;
  dispatch(event: TypingTestEvent): void;
  /** Runs after reference text loads. */
  onReady(listener: () => void): () => void;
}

/** Runs the typing-test machine behind the TypingTest interface. */
export function createTypingTest(config: {
  testConfig: TestConfig;
  getReferenceText: (config: TestConfig) => Promise<string>;
}): TypingTest {
  const actor = createActor(typingTestMachine, {
    input: { testConfig: config.testConfig, getReferenceText: config.getReferenceText },
  });

  const readyListeners = new Set<() => void>();
  const stateListeners = new Set<() => void>();
  let prevValue = actor.getSnapshot().value;
  let state = toState(actor.getSnapshot());

  actor.subscribe((snapshot) => {
    state = toState(snapshot);
    stateListeners.forEach((listener) => listener());

    if (prevValue !== 'idle' && snapshot.value === 'idle') {
      readyListeners.forEach((listener) => listener());
    }
    prevValue = snapshot.value;
  });

  actor.start();

  function toState(snapshot: ReturnType<typeof actor.getSnapshot>): TypingTestState {
    // The loader stays inside the machine.
    const { getReferenceText: _getReferenceText, ...rest } = snapshot.context;
    return {
      phase: snapshot.value as TypingTestPhase,
      ...rest,
    };
  }

  return {
    getState: () => state,
    subscribe: (listener) => {
      stateListeners.add(listener);
      return () => stateListeners.delete(listener);
    },
    dispatch: (event) => actor.send(event),
    onReady: (listener) => {
      readyListeners.add(listener);
      return () => readyListeners.delete(listener);
    },
  };
}
