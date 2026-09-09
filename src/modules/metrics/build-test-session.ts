import type { TestSession } from '@/modules/session/types';
import type { TypingTestFinishedSnapshot } from '@/modules/typing-test/create-typing-test';
import { calculateCurrentAccuracy, calculateWpm, resolveLiveElapsedSeconds } from './calculate';

export function buildTestSession(snapshot: TypingTestFinishedSnapshot): TestSession {
  // The snapshot already carries its own mode-tagged TestTiming — no need for a separate
  // config parameter just to re-derive what mode this test ran in.
  const testDuration = resolveLiveElapsedSeconds(snapshot);
  return {
    wpm: calculateWpm(snapshot.correctChars, testDuration),
    rawWpm: calculateWpm(snapshot.typedChars, testDuration),
    accuracy: calculateCurrentAccuracy(snapshot.correctWordCount, snapshot.totalWordCount),
    testDate: new Date().toISOString(),
    testDuration,
    wordsTyped: Math.round(snapshot.totalWordCount),
    correctWords: Math.round(snapshot.correctWordCount),
    letterAccuracy: snapshot.letterAccuracy,
    mode: snapshot.mode,
    consistency: snapshot.consistency,
    burst: snapshot.burst,
    wpmSeries: snapshot.wpmSeries,
  };
}
