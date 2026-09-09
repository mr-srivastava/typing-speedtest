'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react';
import dynamic from 'next/dynamic';
import TestPanel from '@/features/typing-test/TestPanel';
import { AppShell } from '@/shared/layout/AppShell';
import {
  DEFAULT_TEST_CONFIG,
  useTypingTest,
  type TestConfig,
  type TypingTestFinishedSnapshot,
} from '@/modules/typing-test';
import { useSession } from '@/modules/session';
import {
  buildTestSession,
  calculateCurrentAccuracy,
  calculateWpm,
  resolveLiveElapsedSeconds,
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

const TestScreen: React.FC<TestScreenProps> = ({ defaultTimer = 60, className = '' }) => {
  const { recordTest, data } = useSession();
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [config, setConfig] = useState<TestConfig>(() => ({
    ...DEFAULT_TEST_CONFIG,
    timeSeconds: defaultTimer,
  }));

  const handleFinished = useCallback(
    (snapshot: TypingTestFinishedSnapshot) => {
      startTransition(() => setIsMetricsModalOpen(true));
      recordTest(buildTestSession(snapshot));
    },
    [recordTest],
  );

  const { content, status, mode, timing, timer, metrics, snapshot, actions } = useTypingTest(
    config,
    { onFinished: handleFinished },
  );

  const isFirstConfigRender = useRef(true);
  useEffect(() => {
    if (isFirstConfigRender.current) {
      isFirstConfigRender.current = false;
      return;
    }
    actions.reconfigure(config);
  }, [config, actions]);

  const handleRestart = useCallback(() => {
    actions.restart();
    setIsMetricsModalOpen(false);
  }, [actions]);

  // Word mode counts elapsed seconds up with no countdown, so the toolbar clock needs a
  // mode-aware source instead of timer.remaining.
  const displayTimer = mode === 'time' ? timer.remaining : timer.elapsedSeconds;
  const displayTimerDuration = mode === 'time' ? timer.duration : timer.elapsedSeconds;
  const targetWordCount = mode === 'words' ? config.wordCount : undefined;

  const liveElapsedSeconds = useMemo(() => resolveLiveElapsedSeconds(timing), [timing]);

  const liveMetrics: LiveTestMetrics = useMemo(
    () => ({
      correctWordCount: metrics.correctWordCount,
      totalWordCount: metrics.totalWordCount,
      correctChars: metrics.correctChars,
      typedChars: metrics.typedChars,
      ...timing,
      letterAccuracy: metrics.letterAccuracy,
      // Event-sourced stats only exist once the test has finished.
      consistency: snapshot?.consistency,
      wpmSeries: snapshot?.wpmSeries,
    }),
    [
      timing,
      metrics.correctWordCount,
      metrics.totalWordCount,
      metrics.correctChars,
      metrics.typedChars,
      metrics.letterAccuracy,
      snapshot,
    ],
  );

  const liveWpm = useMemo(
    () => calculateWpm(metrics.correctChars, liveElapsedSeconds),
    [metrics.correctChars, liveElapsedSeconds],
  );
  const liveAccuracy = useMemo(
    () => calculateCurrentAccuracy(metrics.correctWordCount, metrics.totalWordCount),
    [metrics.correctWordCount, metrics.totalWordCount],
  );

  return (
    <AppShell headerVariant="minimal" className={className}>
      <main
        className={cn(
          layoutClasses.containerPadding,
          'flex flex-1 min-h-0 items-center justify-center py-6',
        )}
      >
        <div className="w-full max-w-3xl">
          <TestPanel
            referenceText={content.text}
            input={content.input}
            onInputChange={actions.setInput}
            readOnly={status.finished || status.loading}
            focusKey={content.text}
            timer={displayTimer}
            timerDuration={displayTimerDuration}
            mode={mode}
            targetWordCount={targetWordCount}
            config={config}
            onConfigChange={setConfig}
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
            preference="auto"
          />
        </div>
      </main>
    </AppShell>
  );
};

export default TestScreen;
