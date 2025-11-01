'use client';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import AppHeader from '@/components/organisms/AppHeader';
import TestControlSection from '@/sections/TestControlSection';
import TypingSection from '@/sections/TypingSection';

import { useTypingTest } from '@/hooks/complex/useTypingTest';
import MetricsModal from '@/components/organisms/MetricsModal';
import { Button } from '@/components/ui/button';
import { LetterMetrics, TestSession } from '@/types/metrics';
import { useSession } from '@/contexts/SessionContext';
import { calculateCurrentAccuracy } from '@/lib/utils';

interface TestScreenProps {
  defaultTimer?: number;
  className?: string;
}

const TestScreen: React.FC<TestScreenProps> = ({
  defaultTimer = 60,
  className = '',
}) => {
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
  } = useTypingTest(defaultTimer);

  const { saveTestSession, data } = useSession();
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [hasSessionBeenSaved, setHasSessionBeenSaved] = useState(false);

  // Use useMemo to memoize typedLetterAccuracy
  const typedLetterAccuracy = useMemo(() => {
    return letterAccuracy as Record<string, LetterMetrics>;
  }, [letterAccuracy]);

  // Handle test completion and session saving
  useEffect(() => {
    if (finished && !hasSessionBeenSaved) {
      setIsMetricsModalOpen(true);
      setHasSessionBeenSaved(true);

      // Save enhanced session data
      try {
        const testDuration = defaultTimer - timer;
        const wpm = Math.round(correctWordCount / (testDuration / 60)) || 0;
        const accuracy = calculateCurrentAccuracy(
          correctWordCount,
          totalWordCount,
        );
        const wordsTyped = Math.round(totalWordCount);
        const correctWords = Math.round(correctWordCount);

        const testSession: TestSession = {
          wpm,
          accuracy,
          testDate: new Date().toISOString(),
          testDuration,
          wordsTyped,
          correctWords,
          letterAccuracy: typedLetterAccuracy,
        };

        saveTestSession(testSession);
      } catch (error) {
        console.warn('Failed to save session data:', error);
      }
    }
  }, [
    finished,
    hasSessionBeenSaved,
    correctWordCount,
    totalWordCount,
    timer,
    defaultTimer,
    typedLetterAccuracy,
    saveTestSession,
  ]);

  const handleRestart = useCallback(() => {
    onRestart();
    setIsMetricsModalOpen(false);
    setHasSessionBeenSaved(false); // Reset the flag for the next test
  }, [onRestart]);

  const handleViewMetrics = useCallback(() => {
    setIsMetricsModalOpen(true);
  }, []);

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <AppHeader />

      <main className='mx-auto w-full max-w-6xl px-6 md:px-8'>
        {/* Test Controls Section */}
        <TestControlSection
          timer={timer}
          started={started}
          finished={finished}
          onRestart={handleRestart}
          timerDuration={defaultTimer}
          className='mt-4'
        />

        {/* Typing Test Section */}
        <TypingSection
          text={text}
          userInput={userInput}
          onInputChange={onInputChange}
          readOnly={finished}
          className='mt-4 md:mt-6'
        />

        {/* View Metrics Button */}
        {finished && (
          <div className='mt-4'>
            <Button onClick={handleViewMetrics}>View Metrics</Button>
          </div>
        )}

        {/* Metrics Modal */}
        <MetricsModal
          isOpen={isMetricsModalOpen}
          onOpenChange={setIsMetricsModalOpen}
          correctWordCount={correctWordCount}
          totalWordCount={totalWordCount}
          timer={timer}
          timerDuration={defaultTimer}
          letterAccuracyData={typedLetterAccuracy}
          sessionData={data}
          onRestart={handleRestart}
          mode={data && data.cumulative.totalTests < 2 ? 'this-test' : 'both'}
        />
      </main>
    </div>
  );
};

export default TestScreen;
