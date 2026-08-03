'use client';
import React, { useCallback, useMemo, useState, startTransition } from 'react';
import dynamic from 'next/dynamic';
import TestPanel from '@/features/typing-test/TestPanel';
import { AppShell } from '@/shared/layout/AppShell';
import {
  useTypingTest,
  type TypingTestFinishedSnapshot,
} from '@/modules/typing-test';
import { useSession } from '@/modules/session';
import {
  buildTestSession,
  calculateCurrentAccuracy,
  calculateLiveWpm,
  type LiveTestMetrics,
} from '@/modules/metrics';
import { layoutClasses } from '@/shared/layout/layout-utils';
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
      recordTest(buildTestSession(snapshot, defaultTimer));
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

  const liveWpm = useMemo(
    () =>
      calculateLiveWpm(
        metrics.correctWordCount,
        timer.duration,
        timer.remaining,
      ),
    [metrics.correctWordCount, timer.duration, timer.remaining],
  );
  const liveAccuracy = useMemo(
    () =>
      calculateCurrentAccuracy(
        metrics.correctWordCount,
        metrics.totalWordCount,
      ),
    [metrics.correctWordCount, metrics.totalWordCount],
  );

  return (
    <AppShell headerVariant='minimal' className={className}>
      <main
        className={cn(
          layoutClasses.containerPadding,
          'flex flex-1 min-h-0 items-center justify-center py-6',
        )}
      >
        <div className='w-full max-w-3xl'>
          <TestPanel
            referenceText={content.text}
            input={content.input}
            onInputChange={actions.setInput}
            readOnly={status.finished}
            focusKey={content.text}
            timer={timer.remaining}
            timerDuration={timer.duration}
            started={status.started}
            finished={status.finished}
            onRestart={handleRestart}
            wpm={liveWpm}
            accuracy={liveAccuracy}
            correctWords={metrics.correctWordCount}
          />

          <MetricsModal
            key={`${isMetricsModalOpen}-${data?.cumulative.totalTests ?? 0}`}
            isOpen={isMetricsModalOpen}
            onOpenChange={setIsMetricsModalOpen}
            liveMetrics={liveMetrics}
            sessionData={data}
            onRestart={handleRestart}
            preference='auto'
          />
        </div>
      </main>
    </AppShell>
  );
};

export default TestScreen;
