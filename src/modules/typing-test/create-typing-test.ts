import type { LetterMetrics } from '@/modules/session';
import {
  buildFinishedSnapshot,
  evaluateInput,
  type TypingTestFinishedSnapshot,
} from './typing-engine';

export type { TypingTestFinishedSnapshot };

export type TypingTestPhase = 'idle' | 'active' | 'finished';

export type TypingTestEvent =
  | { type: 'input'; value: string }
  | { type: 'restart' }
  | { type: 'tick' };

export interface TypingTestState {
  phase: TypingTestPhase;
  referenceText: string;
  input: string;
  timerRemaining: number;
  duration: number;
  correctWordCount: number;
  totalWordCount: number;
  letterAccuracy: Record<string, LetterMetrics>;
  snapshot: TypingTestFinishedSnapshot | null;
}

export interface TypingTest {
  getState(): TypingTestState;
  dispatch(event: TypingTestEvent): TypingTestState;
}

export function createTypingTest(config: { duration: number; getText: () => string }): TypingTest {
  const { duration, getText } = config;

  function createInitialState(): TypingTestState {
    return {
      phase: 'idle',
      referenceText: getText(),
      input: '',
      timerRemaining: duration,
      duration,
      correctWordCount: 0,
      totalWordCount: 0,
      letterAccuracy: {},
      snapshot: null,
    };
  }

  let state: TypingTestState = createInitialState();

  function finish(snapshot: TypingTestFinishedSnapshot) {
    state = {
      ...state,
      phase: 'finished',
      snapshot,
    };
  }

  function dispatch(event: TypingTestEvent): TypingTestState {
    if (event.type === 'restart') {
      state = createInitialState();
      return state;
    }

    if (state.phase === 'finished') {
      return state;
    }

    if (event.type === 'tick') {
      if (state.phase !== 'active') {
        return state;
      }

      const nextRemaining = Math.max(0, state.timerRemaining - 1);
      if (nextRemaining === 0) {
        const snapshot = buildFinishedSnapshot(
          state.referenceText,
          state.input,
          0,
          state.letterAccuracy,
        );
        state = {
          ...state,
          timerRemaining: 0,
          correctWordCount: snapshot.correctWordCount,
          totalWordCount: snapshot.totalWordCount,
        };
        finish(snapshot);
        return state;
      }

      state = { ...state, timerRemaining: nextRemaining };
      return state;
    }

    // input
    const result = evaluateInput(state.referenceText, event.value, state.letterAccuracy);

    state = {
      ...state,
      phase: state.phase === 'idle' ? 'active' : state.phase,
      input: event.value,
      correctWordCount: result.correctWordCount,
      totalWordCount: result.totalWordCount,
      letterAccuracy: result.letterAccuracy,
    };

    if (result.isComplete) {
      const snapshot = buildFinishedSnapshot(
        state.referenceText,
        event.value,
        state.timerRemaining,
        result.letterAccuracy,
      );
      finish(snapshot);
    }

    return state;
  }

  return {
    getState: () => state,
    dispatch,
  };
}
