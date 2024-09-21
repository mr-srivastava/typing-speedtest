import { useState, useCallback, useMemo } from "react";
import getText from "@/lib/text";

export function useTypingTest(defaultTimer: number) {
  const defaultText = useMemo(() => getText(), []);
  const [text, setText] = useState<string>(defaultText);
  const [timer, setTimer] = useState<number>(defaultTimer);
  const [userInput, setUserInput] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [correctWordCount, setCorrectWordCount] = useState<number>(0);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);
  const [letterAccuracy, setLetterAccuracy] = useState<
    Record<string, { correct: number; total: number }>
  >({});

  const onRestart = useCallback(() => {
    setText(defaultText);
    setCorrectWordCount(0);
    setTotalWordCount(0);
    setUserInput("");
    setStarted(false);
    setFinished(false);
    setTimer(defaultTimer);
    setLetterAccuracy({});
  }, [defaultText, defaultTimer]);

  const startTimer = useCallback(() => {
    setStarted(true);
  }, []);

  const handleTimerExpiry = useCallback(() => {
    setFinished(true);
  }, []);

  const checkIfFinished = useCallback(
    (input: string) => {
      if (input.length === text.length) {
        setFinished(true);
      }
    },
    [text]
  );

  const handleWordCount = useCallback((isCorrect: boolean) => {
    setTotalWordCount((prev) => prev + 1);
    if (isCorrect) {
      setCorrectWordCount((prev) => prev + 1);
    }
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      const lastChar = v[v.length - 1];
      const isCorrect = lastChar === text[v.length - 1];

      handleWordCount(isCorrect);
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
    [text, handleWordCount, startTimer, checkIfFinished]
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
