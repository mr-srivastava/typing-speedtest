import { useState, useCallback, useRef } from 'react';
import getText from '@/lib/text';
import { LetterMetrics } from '@/types/metrics';
import { useTimer } from '@/hooks/atomic/useTimer';
import { useToggle } from '@/hooks/atomic/useToggle';
import {
  evaluateInput,
  buildFinishedSnapshot,
  type TypingTestFinishedSnapshot,
} from '@/lib/typing-engine';

export type { TypingTestFinishedSnapshot };

export type TypingTestPhase = 'idle' | 'active' | 'finished';

export interface UseTypingTestOptions {
  onFinished?: (snapshot: TypingTestFinishedSnapshot) => void;
}

export function useTypingTest(
  defaultTimer: number,
  options: UseTypingTestOptions = {},
) {
  const { onFinished } = options;
  const [text, setText] = useState<string>(getText());
  const [userInput, setUserInput] = useState<string>('');
  const [correctWordCount, setCorrectWordCount] = useState<number>(0);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);
  const [letterAccuracy, setLetterAccuracy] = useState<
    Record<string, LetterMetrics>
  >({});

  const {
    value: finished,
    setTrue: setFinished,
    setFalse: clearFinished,
  } = useToggle(false);

  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  const snapshotRef = useRef<TypingTestFinishedSnapshot>({
    correctWordCount: 0,
    totalWordCount: 0,
    timer: 0,
    letterAccuracy: {},
  });

  const finishTest = useCallback(
    (snapshot: TypingTestFinishedSnapshot) => {
      setFinished();
      onFinishedRef.current?.(snapshot);
    },
    [setFinished],
  );

  const {
    timer,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
    isRunning: timerStarted,
  } = useTimer({
    duration: defaultTimer,
    onExpiry: () => finishTest(snapshotRef.current),
  });

  // Keep snapshot ref in sync so onExpiry gets fresh data
  snapshotRef.current = {
    correctWordCount,
    totalWordCount,
    timer,
    letterAccuracy,
  };

  const started = timerStarted;
  const phase: TypingTestPhase = finished
    ? 'finished'
    : started
      ? 'active'
      : 'idle';

  const onRestart = useCallback(() => {
    setText(getText());
    setCorrectWordCount(0);
    setTotalWordCount(0);
    setUserInput('');
    clearFinished();
    resetTimer();
    setLetterAccuracy({});
  }, [clearFinished, resetTimer]);

  const setInput = useCallback(
    (value: string) => {
      const result = evaluateInput(text, value, letterAccuracy);

      setCorrectWordCount(result.correctWordCount);
      setTotalWordCount(result.totalWordCount);
      setUserInput(value);
      setLetterAccuracy(result.letterAccuracy);
      startTimer();

      if (result.isComplete) {
        stopTimer();
        finishTest(
          buildFinishedSnapshot(
            text,
            value,
            timer,
            result.letterAccuracy,
          ),
        );
      }
    },
    [text, letterAccuracy, timer, startTimer, stopTimer, finishTest],
  );

  return {
    content: { text, input: userInput },
    status: { phase, started, finished },
    timer: { remaining: timer, duration: defaultTimer },
    metrics: { correctWordCount, totalWordCount, letterAccuracy },
    actions: { restart: onRestart, setInput },
  };
}
