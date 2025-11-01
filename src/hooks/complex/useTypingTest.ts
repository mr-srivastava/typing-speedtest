import { useState, useCallback } from 'react';
import getText from '@/lib/text';
import { LetterMetrics } from '@/types/metrics';
import { useTimer } from '@/hooks/atomic/useTimer';
import { useToggle } from '@/hooks/atomic/useToggle';

export function useTypingTest(defaultTimer: number) {
  const [text, setText] = useState<string>(getText());
  const [userInput, setUserInput] = useState<string>('');
  const [correctWordCount, setCorrectWordCount] = useState<number>(0);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);
  const [letterAccuracy, setLetterAccuracy] = useState<
    Record<string, LetterMetrics>
  >({});

  // Use atomic hooks for boolean states first
  const {
    value: finished,
    setTrue: setFinished,
    setFalse: clearFinished,
  } = useToggle(false);

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
    onExpiry: () => setFinished(),
  });

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
    setFinished();
  }, [setFinished]);

  const checkIfFinished = useCallback(
    (input: string) => {
      if (input.length === text.length) {
        setFinished();
        stopTimer(); // Stop the timer when text is completed
      }
    },
    [text, setFinished, stopTimer],
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
