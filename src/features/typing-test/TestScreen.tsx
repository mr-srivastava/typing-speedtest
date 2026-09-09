'use client';
import React, { useCallback, useEffect, useRef, useState, startTransition } from 'react';
import dynamic from 'next/dynamic';
import TestPanel from '@/features/typing-test/TestPanel';
import { AppShell } from '@/shared/layout/AppShell';
import { DEFAULT_TEST_CONFIG, type TestConfig } from '@/modules/typing-test/config';
import type { TypingTestFinishedSnapshot } from '@/modules/typing-test/create-typing-test';
import { useTypingTest } from '@/modules/typing-test/use-typing-test';
import { useSession } from '@/modules/session/session-provider';
import { buildTestSession } from '@/modules/metrics/build-test-session';
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

  const { content, status, loadError, mode, timer, metrics, analytics, actions } = useTypingTest(
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

  // Word mode shows elapsed time; time mode shows the countdown.
  const displayTimer = mode === 'time' ? timer.remaining : timer.elapsedSeconds;
  const displayTimerDuration = mode === 'time' ? timer.duration : timer.elapsedSeconds;
  const targetWordCount = mode === 'words' ? config.wordCount : undefined;

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
            readOnly={status.finished || status.loading || status.error}
            focusKey={content.text}
            timer={displayTimer}
            timerDuration={displayTimerDuration}
            mode={mode}
            targetWordCount={targetWordCount}
            config={config}
            onConfigChange={setConfig}
            started={status.started}
            finished={status.finished}
            loadError={loadError}
            onRestart={handleRestart}
            wpm={analytics.wpm}
            accuracy={analytics.accuracy}
            correctWords={metrics.correctWordCount}
          />

          <MetricsModal
            key={`${isMetricsModalOpen}-${data?.cumulative.totalTests ?? 0}`}
            isOpen={isMetricsModalOpen}
            onOpenChange={setIsMetricsModalOpen}
            liveMetrics={analytics}
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
