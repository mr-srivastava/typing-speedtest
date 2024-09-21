"use client";
import React, { useCallback, useMemo } from "react";
import Header from "@/components/header";
import Preview from "@/components/preview";
import TypingStats from "@/components/stats";
import RestartButton from "@/components/restart-button";
import { useTypingTest } from "@/hooks/useTypingTest";
import TypingInput from "@/components/typing-input";

const defaultTimer = 60;

// Add this interface
interface LetterMetrics {
  correct: number;
  total: number;
}

export default function Octane() {
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

  // Use useMemo to memoize typedLetterAccuracy
  const typedLetterAccuracy = useMemo(() => {
    return letterAccuracy as Record<string, LetterMetrics>;
  }, [letterAccuracy]);

  // Use useCallback for logging
  const logLetterAccuracy = useCallback(() => {
    console.log("Letter Level Accuracy", typedLetterAccuracy);
  }, [typedLetterAccuracy]);

  // Call the logging function
  React.useEffect(() => {
    logLetterAccuracy();
  }, [logLetterAccuracy]);

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
            letterAccuracyData={typedLetterAccuracy}
          />
        )}
      </main>
    </div>
  );
}
