'use client';
import React, { useCallback, useMemo, useState, startTransition } from 'react';
import dynamic from 'next/dynamic';
import AppHeader from '@/components/organisms/AppHeader';
import TestControlSection from '@/sections/TestControlSection';
import TypingSection from '@/sections/TypingSection';

import {
  useTypingTest,
  type TypingTestFinishedSnapshot,
} from '@/hooks/complex/useTypingTest';
import { Button } from '@/components/ui/button';
import { LetterMetrics, TestSession } from '@/types/metrics';
import { useSession } from '@/contexts/SessionContext';
import { calculateCurrentAccuracy } from '@/lib/metrics-utils';

const MetricsModal = dynamic(
  () => import('@/components/organisms/MetricsModal').then((mod) => mod.default),
  { ssr: false }
);

interface TestScreenProps {
  defaultTimer?: number;
  className?: string;
}

const TestScreen: React.FC<TestScreenProps> = ({
  defaultTimer = 60,
  className = '',
}) => {
  const { saveTestSession, data } = useSession();
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  const handleFinished = useCallback(
    (snapshot: TypingTestFinishedSnapshot) => {
      startTransition(() => setIsMetricsModalOpen(true));
      try {
        const testDuration = defaultTimer - snapshot.timer;
        const wpm =
          testDuration <= 0
            ? 0
            : Math.round(
                snapshot.correctWordCount / (testDuration / 60),
              );
        const accuracy = calculateCurrentAccuracy(
          snapshot.correctWordCount,
          snapshot.totalWordCount,
        );
        const wordsTyped = Math.round(snapshot.totalWordCount);
        const correctWords = Math.round(snapshot.correctWordCount);

        const testSession: TestSession = {
          wpm,
          accuracy,
          testDate: new Date().toISOString(),
          testDuration,
          wordsTyped,
          correctWords,
          letterAccuracy: snapshot.letterAccuracy,
        };

        saveTestSession(testSession);
      } catch (error) {
        console.warn('Failed to save session data:', error);
      }
    },
    [defaultTimer, saveTestSession]
  );

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
  } = useTypingTest(defaultTimer, { onFinished: handleFinished });

  const typedLetterAccuracy = useMemo(
    () => letterAccuracy as Record<string, LetterMetrics>,
    [letterAccuracy]
  );

  const handleRestart = useCallback(() => {
    onRestart();
    setIsMetricsModalOpen(false);
  }, [onRestart]);

  const handleViewMetrics = useCallback(() => {
    startTransition(() => setIsMetricsModalOpen(true));
  }, []);

  return (
    <div className={`min-h-screen bg-background relative ${className}`}>
      <div className="grain-overlay" aria-hidden />
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
          key={`${isMetricsModalOpen}-${data && data.cumulative.totalTests < 2 ? 'this-test' : 'both'}`}
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
