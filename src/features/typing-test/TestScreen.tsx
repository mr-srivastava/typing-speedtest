'use client';
import React, { startTransition, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import TestPanel from '@/features/typing-test/TestPanel';
import { AppShell } from '@/shared/layout/AppShell';
import { DEFAULT_TEST_CONFIG, type TestConfig } from '@/modules/typing-test/config';
import type { TypingTestFinishedSnapshot } from '@/modules/typing-test/create-typing-test';
import { useSession } from '@/modules/session/session-provider';
import { buildTestSession } from '@/modules/metrics/build-test-session';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';
import {
  TypingTestProvider,
  useTypingTestActions,
  useTypingTestAnalytics,
} from './typing-test-react';

const MetricsModal = dynamic(
  () => import('@/features/metrics/MetricsModal').then((mod) => mod.default),
  { ssr: false },
);

interface TestScreenProps {
  defaultTimer?: number;
  className?: string;
}

interface TestScreenContentProps {
  config: TestConfig;
  onConfigChange: (config: TestConfig) => void;
  className: string;
  isMetricsModalOpen: boolean;
  onMetricsModalOpenChange: (isOpen: boolean) => void;
}

function TestScreenContent({
  config,
  onConfigChange,
  className,
  isMetricsModalOpen,
  onMetricsModalOpenChange,
}: TestScreenContentProps) {
  const { data } = useSession();
  const analytics = useTypingTestAnalytics();
  const { restart } = useTypingTestActions();

  const handleRestart = useCallback(() => {
    restart();
    onMetricsModalOpenChange(false);
  }, [onMetricsModalOpenChange, restart]);

  return (
    <AppShell headerVariant="minimal" className={className}>
      <main
        className={cn(
          layoutClasses.containerPadding,
          'flex flex-1 min-h-0 items-center justify-center py-6',
        )}
      >
        <div className="w-full max-w-3xl">
          <TestPanel config={config} onConfigChange={onConfigChange} onRestart={handleRestart} />

          <MetricsModal
            key={`${isMetricsModalOpen}-${data?.cumulative.totalTests ?? 0}`}
            isOpen={isMetricsModalOpen}
            onOpenChange={onMetricsModalOpenChange}
            liveMetrics={analytics}
            sessionData={data}
            onRestart={handleRestart}
            preference="auto"
          />
        </div>
      </main>
    </AppShell>
  );
}

const TestScreen: React.FC<TestScreenProps> = ({ defaultTimer = 60, className = '' }) => {
  const { recordTest } = useSession();
  const [config, setConfig] = useState<TestConfig>(() => ({
    ...DEFAULT_TEST_CONFIG,
    timeSeconds: defaultTimer,
  }));
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const handleFinished = useCallback(
    (snapshot: TypingTestFinishedSnapshot) => {
      startTransition(() => setIsMetricsModalOpen(true));
      recordTest(buildTestSession(snapshot));
    },
    [recordTest],
  );

  return (
    <TypingTestProvider config={config} onFinished={handleFinished}>
      <TestScreenContent
        config={config}
        onConfigChange={setConfig}
        className={className}
        isMetricsModalOpen={isMetricsModalOpen}
        onMetricsModalOpenChange={setIsMetricsModalOpen}
      />
    </TypingTestProvider>
  );
};

export default TestScreen;
