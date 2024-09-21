"use client";
import React, { useState, useCallback, useMemo } from "react";
import Header from "@/components/header";
import Preview from "@/components/preview";
import TypingStats from "@/components/stats";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import getText from "@/lib/text";
import { ResetIcon } from "@radix-ui/react-icons";

export default function Octane() {
  const defaultText = useMemo(() => getText(), []);
  const [text, setText] = useState<string>(defaultText);
  const [timer, setTimer] = useState<number>(60);
  const [userInput, setUserInput] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [correctWordCount, setCorrectWordCount] = useState<number>(0);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);

  const onRestart = useCallback(() => {
    setText(defaultText);
    setCorrectWordCount(0);
    setTotalWordCount(0);
    setUserInput("");
    setStarted(false);
    setFinished(false);
    setTimer(60);
  }, [defaultText]);

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
      const isCorrect = e.nativeEvent.data === text[v.length - 1];
      handleWordCount(isCorrect);
      startTimer();
      setUserInput(v);
      checkIfFinished(v);
    },
    [text, handleWordCount, startTimer, checkIfFinished]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[--background]">
      <Header
        timer={timer}
        setTimer={setTimer}
        started={started}
        finished={finished}
        handleTimerExpiry={handleTimerExpiry}
      />

      <main className="flex min-h-screen flex-col max-w-6xl">
        <Preview text={text} userInput={userInput} />
        <div className="flex w-full justify-end mt-5">
          <Button
            variant="outline"
            className=" rounded-lg"
            size="icon"
            onClick={onRestart}
            disabled={!started}
          >
            <ResetIcon />
          </Button>
        </div>
        <Textarea
          className="w-full rounded-lg min-h-[250px] overflow-hidden px-3 py-3 resize-none mt-2 bg-grey-100/20"
          placeholder="Start typing for the test to begin"
          value={userInput}
          onChange={onInputChange}
          readOnly={finished}
        />

        {finished && (
          <TypingStats
            correctWordCount={correctWordCount}
            totalWordCount={totalWordCount}
            timer={timer}
          />
        )}
      </main>
    </div>
  );
}
