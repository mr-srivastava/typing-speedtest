'use client';
import React, { useCallback, useState, startTransition, useMemo } from 'react';
import dynamic from 'next/dynamic';
import AppHeader from '@/components/organisms/AppHeader';
import TestControlSection from '@/sections/TestControlSection';
import TypingSection from '@/sections/TypingSection';

import {
  useTypingTest,
  type TypingTestFinishedSnapshot,
} from '@/hooks/complex/useTypingTest';
import { Button } from '@/components/ui/button';
import { LiveTestMetrics, MetricsView } from '@/types/metrics';
import { useSession } from '@/contexts/SessionContext';
import { buildTestSession } from '@/lib/metrics-utils';

const MetricsModal = dynamic(
  () => import('@/components/organisms/MetricsModal').then((mod) => mod.default),
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
  const { saveTestSession, data } = useSession();
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  const handleFinished = useCallback(
    (snapshot: TypingTestFinishedSnapshot) => {
      startTransition(() => setIsMetricsModalOpen(true));
      try {
        saveTestSession(buildTestSession(snapshot, defaultTimer));
      } catch (error) {
        console.warn('Failed to save session data:', error);
      }
    },
    [defaultTimer, saveTestSession],
  );

  const { content, status, timer, metrics, actions } = useTypingTest(
    defaultTimer,
    { onFinished: handleFinished },
  );

  const handleRestart = useCallback(() => {
    actions.restart();
    setIsMetricsModalOpen(false);
  }, [actions.restart]);

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

  const metricsView: MetricsView = useMemo(() => {
    if (data && data.cumulative.totalTests >= 2) {
      return { scope: 'toggle', initial: 'live' };
    }
    return { scope: 'live' };
  }, [data]);

  return (
    <div className={`min-h-screen bg-background relative ${className}`}>
      <div className='grain-overlay' aria-hidden />
      <AppHeader />

      <main className='mx-auto w-full max-w-6xl px-6 md:px-8'>
        <TestControlSection
          timer={timer.remaining}
          started={status.started}
          finished={status.finished}
          onRestart={handleRestart}
          timerDuration={timer.duration}
          className='mt-4'
        />

        <TypingSection
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
          key={`${isMetricsModalOpen}-${metricsView.scope}`}
          isOpen={isMetricsModalOpen}
          onOpenChange={setIsMetricsModalOpen}
          liveMetrics={liveMetrics}
          sessionData={data}
          onRestart={handleRestart}
          view={metricsView}
        />
      </main>
    </div>
  );
};

export default TestScreen;
