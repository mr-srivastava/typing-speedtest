import type { LetterMetrics } from '@/modules/session';
import type { TestConfig, TestTiming } from './config';
import { diffInputToEvents, type TypingEventLog } from './event-log';
import { deriveBurst, deriveConsistency, deriveWpmSeries, type WpmSeriesPoint } from './replay';
import { buildFinishedSnapshot, evaluateInput, type AccuracySnapshot } from './typing-engine';

/**
 * Full result of a finished test: `buildFinishedSnapshot`'s accuracy counts, this test's
 * `TestTiming`, and the event-sourced stats derived by replaying the event log.
 */
export type TypingTestFinishedSnapshot = AccuracySnapshot &
  TestTiming & {
    eventLog: TypingEventLog;
    wpmSeries: WpmSeriesPoint[];
    consistency: number;
    burst: number;
  };

export type TypingTestPhase = 'loading' | 'idle' | 'active' | 'finished';

export type TypingTestEvent =
  | { type: 'input'; value: string }
  | { type: 'restart' }
  | { type: 'reconfigure'; config: TestConfig }
  | { type: 'tick' };

export type TypingTestState = TestTiming & {
  phase: TypingTestPhase;
  config: TestConfig;
  referenceText: string;
  input: string;
  correctWordCount: number;
  totalWordCount: number;
  correctChars: number;
  typedChars: number;
  letterAccuracy: Record<string, LetterMetrics>;
  eventLog: TypingEventLog;
  testStartTime: number | null;
  snapshot: TypingTestFinishedSnapshot | null;
};

export interface TypingTest {
  getState(): TypingTestState;
  dispatch(event: TypingTestEvent): void;
  /** Subscribes to async reference-text-load completion (phase -> 'idle'). Returns an unsubscribe function. */
  onReady(listener: () => void): () => void;
}

function createInitialTiming(cfg: TestConfig): TestTiming {
  return cfg.mode === 'time'
    ? { mode: 'time', timerRemaining: cfg.timeSeconds, timerDuration: cfg.timeSeconds }
    : { mode: 'words', elapsedSeconds: 0 };
}

export function createTypingTest(config: {
  testConfig: TestConfig;
  getReferenceText: (config: TestConfig) => Promise<string>;
}): TypingTest {
  const { getReferenceText } = config;
  let testConfig = config.testConfig;
  const readyListeners = new Set<() => void>();
  let loadingToken = 0;

  function createLoadingState(cfg: TestConfig): TypingTestState {
    return {
      phase: 'loading',
      config: cfg,
      ...createInitialTiming(cfg),
      referenceText: '',
      input: '',
      correctWordCount: 0,
      totalWordCount: 0,
      correctChars: 0,
      typedChars: 0,
      letterAccuracy: {},
      eventLog: [],
      testStartTime: null,
      snapshot: null,
    };
  }

  function loadReferenceText(cfg: TestConfig): void {
    const token = ++loadingToken;
    state = createLoadingState(cfg);
    void getReferenceText(cfg).then((text) => {
      if (token !== loadingToken) {
        return; // superseded by a later restart/reconfigure
      }
      state = { ...state, phase: 'idle', referenceText: text };
      readyListeners.forEach((listener) => listener());
    });
  }

  let state: TypingTestState = createLoadingState(testConfig);
  loadReferenceText(testConfig);

  /** Finishes the test using the current `state` as-is — callers update timing fields first. */
  function finish(): void {
    const accuracy = buildFinishedSnapshot(state.referenceText, state.input, state.letterAccuracy);
    const wpmSeries = deriveWpmSeries(state.eventLog);
    const timing: TestTiming =
      state.mode === 'time'
        ? { mode: 'time', timerRemaining: state.timerRemaining, timerDuration: state.timerDuration }
        : { mode: 'words', elapsedSeconds: state.elapsedSeconds };

    const snapshot: TypingTestFinishedSnapshot = {
      ...accuracy,
      ...timing,
      eventLog: state.eventLog,
      wpmSeries,
      consistency: deriveConsistency(wpmSeries),
      burst: deriveBurst(state.eventLog),
    };

    state = {
      ...state,
      phase: 'finished',
      correctWordCount: accuracy.correctWordCount,
      totalWordCount: accuracy.totalWordCount,
      correctChars: accuracy.correctChars,
      typedChars: accuracy.typedChars,
      snapshot,
    };
  }

  function dispatch(event: TypingTestEvent): void {
    if (event.type === 'restart') {
      loadReferenceText(testConfig);
      return;
    }

    if (event.type === 'reconfigure') {
      testConfig = event.config;
      loadReferenceText(testConfig);
      return;
    }

    if (state.phase === 'loading' || state.phase === 'finished') {
      return;
    }

    if (event.type === 'tick') {
      if (state.phase !== 'active') {
        return;
      }

      if (state.mode === 'words') {
        state = { ...state, elapsedSeconds: state.elapsedSeconds + 1 };
        return;
      }

      const nextRemaining = Math.max(0, state.timerRemaining - 1);
      state = { ...state, timerRemaining: nextRemaining };
      if (nextRemaining === 0) {
        finish();
      }
      return;
    }

    // input
    const now = Date.now();
    const testStartTime = state.testStartTime ?? now;
    const newEvents = diffInputToEvents(
      state.input,
      event.value,
      state.referenceText,
      now - testStartTime,
    );
    const result = evaluateInput(state.referenceText, event.value, state.letterAccuracy);

    state = {
      ...state,
      phase: state.phase === 'idle' ? 'active' : state.phase,
      testStartTime,
      input: event.value,
      eventLog: [...state.eventLog, ...newEvents],
      correctWordCount: result.correctWordCount,
      totalWordCount: result.totalWordCount,
      correctChars: result.correctChars,
      typedChars: result.typedChars,
      letterAccuracy: result.letterAccuracy,
    };

    if (result.isComplete) {
      finish();
    }
  }

  return {
    getState: () => state,
    dispatch,
    onReady: (listener) => {
      readyListeners.add(listener);
      return () => readyListeners.delete(listener);
    },
  };
}
