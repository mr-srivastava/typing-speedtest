import { useState, useCallback, useRef, useEffect } from 'react';
import getText from '@/lib/text';
import { LetterMetrics } from '@/types/metrics';
import { useTimer } from '@/hooks/atomic/useTimer';
import { useToggle } from '@/hooks/atomic/useToggle';

export interface TypingTestFinishedSnapshot {
  correctWordCount: number;
  totalWordCount: number;
  timer: number;
  letterAccuracy: Record<string, LetterMetrics>;
}

export interface UseTypingTestOptions {
  onFinished?: (snapshot: TypingTestFinishedSnapshot) => void;
}

export function useTypingTest(
  defaultTimer: number,
  options: UseTypingTestOptions = {}
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
    (override?: Partial<TypingTestFinishedSnapshot>) => {
      setFinished();
      const snapshot = override
        ? { ...snapshotRef.current, ...override }
        : snapshotRef.current;
      onFinishedRef.current?.(snapshot);
    },
    [setFinished]
  );

  // Use atomic hooks for timer
  const {
    timer,
    setTimer,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
    isRunning: timerStarted,
  } = useTimer({
    duration: defaultTimer,
    onExpiry: () => finishTest(),
  });

  useEffect(() => {
    snapshotRef.current = {
      correctWordCount,
      totalWordCount,
      timer,
      letterAccuracy,
    };
  }, [correctWordCount, totalWordCount, timer, letterAccuracy]);

  // Derived state for started - using timer's isRunning
  const started = timerStarted;

  const onRestart = useCallback(() => {
    setText(getText());
    setCorrectWordCount(0);
    setTotalWordCount(0);
    setUserInput('');
    clearFinished();
    resetTimer();
    setLetterAccuracy({});
  }, [clearFinished, resetTimer]);

  const handleTimerExpiry = useCallback(() => {
    finishTest();
  }, [finishTest]);

  const checkIfFinished = useCallback(
    (input: string) => {
      if (input.length === text.length) {
        const typedWords = input
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        const textWords = text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        let correctWords = 0;
        for (let i = 0; i < typedWords.length; i++) {
          if (i < textWords.length && typedWords[i] === textWords[i]) {
            correctWords++;
          }
        }
        stopTimer();
        finishTest({
          correctWordCount: correctWords,
          totalWordCount: typedWords.length,
          timer,
          letterAccuracy,
        });
      }
    },
    [text, timer, letterAccuracy, finishTest, stopTimer],
  );

  const updateWordCounts = useCallback(
    (input: string) => {
      // Count words by splitting on spaces and filtering out empty strings
      const typedWords = input
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const textWords = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      let correctWords = 0;

      // Count correct words by comparing each typed word with the corresponding text word
      for (let i = 0; i < typedWords.length; i++) {
        if (i < textWords.length && typedWords[i] === textWords[i]) {
          correctWords++;
        }
      }

      setTotalWordCount(typedWords.length);
      setCorrectWordCount(correctWords);
    },
    [text],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      const lastChar = v[v.length - 1];
      const isCorrect = lastChar === text[v.length - 1];

      updateWordCounts(v);
      startTimer();
      setUserInput(v);
      checkIfFinished(v);

      setLetterAccuracy((prev) => {
        const newAccuracy = { ...prev };
        if (lastChar && lastChar.match(/[a-z]/i)) {
          const lowerChar = lastChar.toLowerCase();
          if (!newAccuracy[lowerChar]) {
            newAccuracy[lowerChar] = { correct: 0, total: 0 };
          }
          newAccuracy[lowerChar].total++;
          if (isCorrect) {
            newAccuracy[lowerChar].correct++;
          }
        }
        return newAccuracy;
      });
    },
    [text, updateWordCounts, startTimer, checkIfFinished],
  );

  return {
    text,
    timer,
    userInput,
    started,
    finished,
    correctWordCount,
    totalWordCount,
    letterAccuracy,
    onRestart,
    onInputChange,
    setTimer,
    handleTimerExpiry,
  };
}
