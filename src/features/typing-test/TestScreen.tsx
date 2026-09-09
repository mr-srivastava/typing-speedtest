'use client';
import React, { startTransition, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import TestPanel from '@/features/typing-test/TestPanel';
import TestIntro from '@/features/home/TestIntro';
import ComingSoonStrip from '@/features/home/ComingSoonStrip';
import StatsPanel from '@/features/metrics/StatsPanel';
import { AppShell } from '@/shared/layout/AppShell';
import {
  DEFAULT_TEST_CONFIG,
  type TestConfig,
  type TypingTestFinishedSnapshot,
} from '@/modules/typing-test';
import { useSession } from '@/modules/session/session-provider';
import { buildTestSession } from '@/modules/metrics/build-test-session';
import { toOverallMetricsData } from '@/features/metrics/metrics-display-utils';
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

interface CompletionModalProps {
  isOpen: boolean;
  data: ReturnType<typeof useSession>['data'];
  onOpenChange: (isOpen: boolean) => void;
  onRestart: () => void;
}

/** Scoped so live analytics are only subscribed to while the completion modal can show them. */
function CompletionModal({ data, isOpen, onOpenChange, onRestart }: CompletionModalProps) {
  const analytics = useTypingTestAnalytics();

  return (
    <MetricsModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      liveMetrics={analytics}
      sessionData={data}
      onRestart={onRestart}
    />
  );
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
  const { data, isLoading, isHydrated, hasSession } = useSession();
  const { restart } = useTypingTestActions();
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const handleRestart = useCallback(() => {
    restart();
    onMetricsModalOpenChange(false);
  }, [onMetricsModalOpenChange, restart]);

  const overallMetrics = data ? toOverallMetricsData(data.cumulative) : null;

  return (
    <AppShell className={className}>
      <div
        className={cn(
          layoutClasses.containerPadding,
          'flex flex-col items-center gap-7 py-9 sm:py-12',
        )}
      >
        <div className="relative flex w-full flex-col items-center">
          <TestIntro
            isLoading={isLoading}
            isHydrated={isHydrated}
            overallMetrics={overallMetrics}
            statsOpen={isStatsOpen}
            onToggleStats={hasSession ? () => setIsStatsOpen((open) => !open) : undefined}
          />

          <StatsPanel open={isStatsOpen} sessionData={data} onClose={() => setIsStatsOpen(false)} />
        </div>

        <TestPanel
          config={config}
          onConfigChange={onConfigChange}
          onRestart={handleRestart}
          className="w-full max-w-3xl"
        />

        <ComingSoonStrip hasSession={hasSession} />
      </div>

      <CompletionModal
        data={data}
        isOpen={isMetricsModalOpen}
        onOpenChange={onMetricsModalOpenChange}
        onRestart={handleRestart}
      />
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
