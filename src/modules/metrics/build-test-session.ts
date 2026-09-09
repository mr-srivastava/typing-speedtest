import type { TestSession } from '@/modules/session/types';
import type { TypingTestFinishedSnapshot } from '@/modules/typing-test/create-typing-test';

export function buildTestSession(snapshot: TypingTestFinishedSnapshot): TestSession {
  return {
    ...snapshot.result,
    testDate: new Date().toISOString(),
  };
}
