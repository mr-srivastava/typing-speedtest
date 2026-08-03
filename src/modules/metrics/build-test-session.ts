import type { TestSession } from '@/modules/session/types';
import type { TypingTestFinishedSnapshot } from '@/modules/typing-test/typing-engine';
import {
  calculateCurrentAccuracy,
  calculateCurrentWpm,
  getElapsedSecondsForWpm,
} from './calculate';

export function buildTestSession(
  snapshot: TypingTestFinishedSnapshot,
  timerDuration: number,
): TestSession {
  const testDuration = getElapsedSecondsForWpm(timerDuration, snapshot.timer);
  return {
    wpm: calculateCurrentWpm(snapshot.correctWordCount, testDuration),
    accuracy: calculateCurrentAccuracy(
      snapshot.correctWordCount,
      snapshot.totalWordCount,
    ),
    testDate: new Date().toISOString(),
    testDuration,
    wordsTyped: Math.round(snapshot.totalWordCount),
    correctWords: Math.round(snapshot.correctWordCount),
    letterAccuracy: snapshot.letterAccuracy,
  };
}
