"use client";
import React from "react";
import Header from "@/components/header";
import Preview from "@/components/preview";
import TypingStats from "@/components/stats";
import TypingInput from "@/components/typing-input";
import RestartButton from "@/components/restart-button";
import { useTypingTest } from "@/hooks/useTypingTest";

interface OctaneProps {
  defaultTimer?: number;
}

export default function Octane({ defaultTimer = 60 }: OctaneProps) {
  const {
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
  } = useTypingTest(defaultTimer);

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
        <RestartButton onRestart={onRestart} disabled={!started} />
        <TypingInput
          value={userInput}
          onChange={onInputChange}
          readOnly={finished}
        />
        {finished && (
          <TypingStats
            correctWordCount={correctWordCount}
            totalWordCount={totalWordCount}
            timer={timer}
            // letterAccuracy={letterAccuracy}
          />
        )}
      </main>
    </div>
  );
}
