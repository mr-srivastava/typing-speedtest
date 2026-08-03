'use client';
import React, { useCallback, useState, startTransition, useMemo } from 'react';
import dynamic from 'next/dynamic';
import AppHeader from '@/shared/ui/AppHeader';
import TestControls from '@/features/typing-test/TestControls';
import TypingArea from '@/features/typing-test/TypingArea';

import {
  useTypingTest,
  type TypingTestFinishedSnapshot,
} from '@/modules/typing-test';
import { Button } from '@/shared/ui/button';
import { useSession } from '@/modules/session';
import {
  buildTestSession,
  type LiveTestMetrics,
} from '@/modules/metrics';
import { cn } from '@/shared/lib/cn';

const MetricsModal = dynamic(
  () => import('@/features/metrics/MetricsModal').then((mod) => mod.default),
  { ssr: false },
);

interface TestScreenProps {
  defaultTimer?: number;
  className?: string;
}

const TestScreen: React.FC<TestScreenProps> = ({
  defaultTimer = 60,
  className = '',
}) => {
  const { recordTest, data } = useSession();
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  const handleFinished = useCallback(
    (snapshot: TypingTestFinishedSnapshot) => {
      startTransition(() => setIsMetricsModalOpen(true));
      try {
        recordTest(buildTestSession(snapshot, defaultTimer));
      } catch (error) {
        console.warn('Failed to save session data:', error);
      }
    },
    [defaultTimer, recordTest],
  );

  const { content, status, timer, metrics, actions } = useTypingTest(
    defaultTimer,
    { onFinished: handleFinished },
  );

  const handleRestart = useCallback(() => {
    actions.restart();
    setIsMetricsModalOpen(false);
  }, [actions]);

  const handleViewMetrics = useCallback(() => {
    startTransition(() => setIsMetricsModalOpen(true));
  }, []);

  const liveMetrics: LiveTestMetrics = useMemo(
    () => ({
      correctWordCount: metrics.correctWordCount,
      totalWordCount: metrics.totalWordCount,
      timerRemaining: timer.remaining,
      timerDuration: timer.duration,
      letterAccuracy: metrics.letterAccuracy,
    }),
    [
      metrics.correctWordCount,
      metrics.totalWordCount,
      metrics.letterAccuracy,
      timer.remaining,
      timer.duration,
    ],
  );

  return (
    <div className={cn('min-h-screen bg-background relative', className)}>
      <div className='grain-overlay' aria-hidden />
      <AppHeader />

      <main className='mx-auto w-full max-w-6xl px-6 md:px-8'>
        <TestControls
          timer={timer.remaining}
          started={status.started}
          finished={status.finished}
          onRestart={handleRestart}
          timerDuration={timer.duration}
          className='mt-4'
        />

        <TypingArea
          text={content.text}
          userInput={content.input}
          onInputChange={actions.setInput}
          readOnly={status.finished}
          className='mt-4 md:mt-6'
        />

        {status.finished ? (
          <div className='mt-4'>
            <Button onClick={handleViewMetrics}>View Metrics</Button>
          </div>
        ) : null}

        <MetricsModal
          key={`${isMetricsModalOpen}-${data?.cumulative.totalTests ?? 0}`}
          isOpen={isMetricsModalOpen}
          onOpenChange={setIsMetricsModalOpen}
          liveMetrics={liveMetrics}
          sessionData={data}
          onRestart={handleRestart}
          preference='auto'
        />
      </main>
    </div>
  );
};

export default TestScreen;
