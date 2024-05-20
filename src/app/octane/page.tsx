"use client";
import Header from "@/components/header";
import Preview from "@/components/preview";
import TypingStats from "@/components/stats";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import getText from "@/lib/text";
import { ResetIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Octane() {
  const defaultText = getText();
  const [text, setText] = useState<string>(defaultText);
  const [timer, setTimer] = useState<number>(60);
  const [userInput, setUserInput] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [correctWordCount, setCorrectWordCount] = useState<number>(0);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);

  function onRestart() {
    setText(defaultText);
    setCorrectWordCount(0);
    setTotalWordCount(0);
    setUserInput("");
    setStarted(false);
    setFinished(false);
  }

  function onInputChange(e: any) {
    const v = e.target.value;
    const isCorrect = e.nativeEvent.data === text[v.length - 1];
    handleWordCount(isCorrect);
    startTimer();
    setUserInput(v);
    checkIfFinished(v);
  }
  function startTimer() {
    setStarted(true);
  }

  function handleTimerExpiry() {
    setFinished(true);
  }

  function checkIfFinished(input: string) {
    if (input.split("").length === text.split("").length) {
      setFinished(true);
    }
  }

  function handleWordCount(isCorrect: boolean) {
    setTotalWordCount((prev) => prev + 1);
    if (isCorrect) {
      setCorrectWordCount((prev) => prev + 1);
    }
  }

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
            size="icon"
            onClick={onRestart}
            disabled={!started}
          >
            <ResetIcon />
          </Button>
        </div>
        <Textarea
          className="w-full min-h-[150px] px-3 py-3 resize-none mt-2"
          placeholder="Start typing..."
          value={userInput}
          onChange={onInputChange}
          readOnly={finished}
        />
        <p className="text-sm text-muted-foreground">
          Start typing for the test to begin.
        </p>

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
