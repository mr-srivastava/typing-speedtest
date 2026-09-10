import type { TestSession } from '@/modules/session/types';
import type { TestConfig, TypingTestFinishedSnapshot } from '@/modules/typing-test';
import { deriveTestInsights } from './session-insights';

export function buildTestSession(
  snapshot: TypingTestFinishedSnapshot,
  config: TestConfig,
): TestSession {
  return {
    ...snapshot.result,
    testDate: new Date().toISOString(),
    config: { ...config },
    counters: {
      correctChars: snapshot.correctChars,
      typedChars: snapshot.typedChars,
      backspaces: snapshot.eventLog.filter((event) => event.type === 'backspace').length,
      correctWords: snapshot.correctWordCount,
      completedWords: snapshot.totalWordCount,
    },
    insights: deriveTestInsights(snapshot.eventLog, snapshot.wpmSeries),
  };
}
