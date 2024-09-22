"use client";
import React, { useCallback, useMemo, useState } from "react";
import Header from "@/components/header";
import Preview from "@/components/preview";
import RestartButton from "@/components/restart-button";
import { useTypingTest } from "@/hooks/useTypingTest";
import TypingInput from "@/components/typing-input";
import { MetricsModal } from "@/components/metrics-modal";
import { button as Btn } from "framer-motion/client";

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

  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

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

  React.useEffect(() => {
    if (finished) {
      setIsMetricsModalOpen(true);
    }
  }, [finished]);

  const handleRestart = () => {
    onRestart();
    setIsMetricsModalOpen(false);
  };

  const handleViewMetrics = () => {
    setIsMetricsModalOpen(true);
  };

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
        <RestartButton onRestart={handleRestart} disabled={!started} />
        {started && finished && (
          <Btn onClick={handleViewMetrics}>View Metrics</Btn>
        )}
        <TypingInput
          value={userInput}
          onChange={onInputChange}
          readOnly={finished}
        />
        <MetricsModal
          isOpen={isMetricsModalOpen}
          onOpenChange={setIsMetricsModalOpen}
          correctWordCount={correctWordCount}
          totalWordCount={totalWordCount}
          timer={timer}
          letterAccuracyData={typedLetterAccuracy}
          onRestart={handleRestart}
        />
      </main>
    </div>
  );
}
