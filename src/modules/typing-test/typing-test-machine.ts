import { assign, fromPromise, setup } from 'xstate';

import type { LetterMetrics } from '@/modules/session';
import type { TestConfig, TestTiming } from './config';
import { diffInputToEvents, type TypingEventLog } from './event-log';
import { deriveBurst, deriveConsistency, deriveWpmSeries, type WpmSeriesPoint } from './replay';
import {
  countWordAccuracy,
  isTestComplete,
  recordLetterAccuracy,
  type AccuracySnapshot,
} from './typing-engine';

/** Full result of a finished test: accuracy counts, final `TestTiming`, and event-sourced stats. */
export type TypingTestFinishedSnapshot = AccuracySnapshot &
  TestTiming & {
    eventLog: TypingEventLog;
    wpmSeries: WpmSeriesPoint[];
    consistency: number;
    burst: number;
  };

export type TypingTestEvent =
  | { type: 'input'; value: string }
  | { type: 'restart' }
  | { type: 'reconfigure'; config: TestConfig }
  | { type: 'tick' };

export type TypingTestContext = TestTiming & {
  config: TestConfig;
  /** Kept in context so it survives the `loading` state being re-entered on restart/reconfigure. */
  getReferenceText: (config: TestConfig) => Promise<string>;
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

export interface TypingTestInput {
  testConfig: TestConfig;
  getReferenceText: (config: TestConfig) => Promise<string>;
}

function createInitialTiming(cfg: TestConfig): TestTiming {
  return cfg.mode === 'time'
    ? { mode: 'time', timerRemaining: cfg.timeSeconds, timerDuration: cfg.timeSeconds }
    : { mode: 'words', elapsedSeconds: 0 };
}

function createLoadingContext(
  cfg: TestConfig,
  getReferenceText: (config: TestConfig) => Promise<string>,
): TypingTestContext {
  return {
    config: cfg,
    getReferenceText,
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

/** Builds the finish snapshot straight from context — the counts are already accurate, kept incremental by `applyInput`. */
function buildSnapshot(context: TypingTestContext): TypingTestFinishedSnapshot {
  const wpmSeries = deriveWpmSeries(context.eventLog);
  const timing: TestTiming =
    context.mode === 'time'
      ? {
          mode: 'time',
          timerRemaining: context.timerRemaining,
          timerDuration: context.timerDuration,
        }
      : { mode: 'words', elapsedSeconds: context.elapsedSeconds };

  return {
    correctWordCount: context.correctWordCount,
    totalWordCount: context.totalWordCount,
    correctChars: context.correctChars,
    typedChars: context.typedChars,
    letterAccuracy: context.letterAccuracy,
    ...timing,
    eventLog: context.eventLog,
    wpmSeries,
    consistency: deriveConsistency(wpmSeries),
    burst: deriveBurst(context.eventLog),
  };
}

/** True once `applyInput`/`tick` has driven the context into a finishing condition. */
function isComplete(context: TypingTestContext): boolean {
  if (isTestComplete(context.referenceText, context.input)) {
    return true;
  }
  return context.mode === 'time' && context.timerRemaining === 0;
}

export const typingTestMachine = setup({
  types: {
    context: {} as TypingTestContext,
    events: {} as TypingTestEvent,
    input: {} as TypingTestInput,
  },
  actors: {
    loadReferenceText: fromPromise(
      async ({
        input,
      }: {
        input: { config: TestConfig; getReferenceText: TypingTestContext['getReferenceText'] };
      }) => await input.getReferenceText(input.config),
    ),
  },
  actions: {
    applyInput: assign(({ context, event }) => {
      if (event.type !== 'input') {
        return {};
      }
      const now = Date.now();
      const testStartTime = context.testStartTime ?? now;
      const newEvents = diffInputToEvents(
        context.input,
        event.value,
        context.referenceText,
        now - testStartTime,
      );

      // correctChars is tracked incrementally off the same per-event correctness that
      // populates the event log, instead of rescanning the whole input on every keystroke.
      let correctChars = context.correctChars;
      for (const logEvent of newEvents) {
        if (logEvent.type === 'char') {
          if (logEvent.correct) correctChars++;
        } else if (logEvent.wasCorrect) {
          correctChars--;
        }
      }
      correctChars = Math.max(0, correctChars);

      const { correct: correctWordCount, total: totalWordCount } = countWordAccuracy(
        context.referenceText,
        event.value,
      );
      const lastChar = event.value[event.value.length - 1] ?? '';
      const expectedChar = context.referenceText[event.value.length - 1] ?? '';
      const letterAccuracy = recordLetterAccuracy(context.letterAccuracy, lastChar, expectedChar);

      return {
        testStartTime,
        input: event.value,
        eventLog: [...context.eventLog, ...newEvents],
        correctWordCount,
        totalWordCount,
        correctChars,
        typedChars: event.value.length,
        letterAccuracy,
      };
    }),
    tick: assign(({ context }) => {
      if (context.mode === 'words') {
        return { elapsedSeconds: context.elapsedSeconds + 1 };
      }
      return { timerRemaining: Math.max(0, context.timerRemaining - 1) };
    }),
    finishTest: assign(({ context }) => ({ snapshot: buildSnapshot(context) })),
    resetForReload: assign(({ context, event }) => {
      const cfg = event.type === 'reconfigure' ? event.config : context.config;
      return createLoadingContext(cfg, context.getReferenceText);
    }),
  },
  guards: {
    isComplete: ({ context }) => isComplete(context),
  },
}).createMachine({
  id: 'typingTest',
  context: ({ input }) => createLoadingContext(input.testConfig, input.getReferenceText),
  initial: 'loading',
  on: {
    restart: { target: '.loading', reenter: true, actions: 'resetForReload' },
    reconfigure: { target: '.loading', reenter: true, actions: 'resetForReload' },
  },
  states: {
    loading: {
      invoke: {
        src: 'loadReferenceText',
        input: ({ context }) => ({
          config: context.config,
          getReferenceText: context.getReferenceText,
        }),
        onDone: {
          target: 'idle',
          actions: assign(({ event }) => ({ referenceText: event.output })),
        },
      },
    },
    idle: {
      on: {
        input: { target: 'active', actions: 'applyInput' },
      },
    },
    active: {
      on: {
        input: { actions: 'applyInput' },
        tick: { actions: 'tick' },
      },
      always: {
        guard: 'isComplete',
        target: 'finished',
        actions: 'finishTest',
      },
    },
    finished: {},
  },
});
