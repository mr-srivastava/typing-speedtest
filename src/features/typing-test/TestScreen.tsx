'use client';
import React, { startTransition, useCallback, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { ChartNoAxesColumn } from 'lucide-react';
import TestPanel from '@/features/typing-test/TestPanel';
import TestIntro from '@/features/home/TestIntro';
import ComingSoonStrip from '@/features/home/ComingSoonStrip';
import MobileDesktopNotice from '@/features/home/MobileDesktopNotice';
import StatsPanel from '@/features/metrics/StatsPanel';
import { AppShell } from '@/shared/layout/AppShell';
import { Button } from '@/shared/ui/button';
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

const desktopMediaQuery = '(min-width: 768px)';

function subscribeToDesktopViewport(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(desktopMediaQuery);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getDesktopViewportSnapshot() {
  return window.matchMedia(desktopMediaQuery).matches;
}

/** The server starts with the non-interactive state; the client promotes eligible viewports. */
function useDesktopViewport() {
  return useSyncExternalStore(subscribeToDesktopViewport, getDesktopViewportSnapshot, () => false);
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

function DesktopTestScreen({
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

  const showStatsTrigger = isHydrated && !isLoading && hasSession;

  return (
    <AppShell
      className={className}
      headerActions={
        showStatsTrigger ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsStatsOpen((open) => !open)}
            aria-expanded={isStatsOpen}
            aria-label={isStatsOpen ? 'Hide stats' : 'View stats'}
            className={cn(isStatsOpen && 'text-primary')}
          >
            <ChartNoAxesColumn className="h-4 w-4" />
          </Button>
        ) : null
      }
    >
      <div
        className={cn(
          layoutClasses.containerPadding,
          'flex flex-col items-center gap-8 py-10 md:py-16',
        )}
      >
        <TestIntro />

        <TestPanel
          config={config}
          onConfigChange={onConfigChange}
          onRestart={handleRestart}
          className="w-full max-w-screen-2xl"
        />

        <ComingSoonStrip hasSession={hasSession} />
      </div>

      <StatsPanel open={isStatsOpen} sessionData={data} onClose={() => setIsStatsOpen(false)} />

      <CompletionModal
        data={data}
        isOpen={isMetricsModalOpen}
        onOpenChange={onMetricsModalOpenChange}
        onRestart={handleRestart}
      />
    </AppShell>
  );
}

function DesktopTypingTest({ defaultTimer = 60, className = '' }: TestScreenProps) {
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
      <DesktopTestScreen
        config={config}
        onConfigChange={setConfig}
        className={className}
        isMetricsModalOpen={isMetricsModalOpen}
        onMetricsModalOpenChange={setIsMetricsModalOpen}
      />
    </TypingTestProvider>
  );
}

function MobileTestScreen({ className }: Pick<TestScreenProps, 'className'>) {
  const { data, isLoading, isHydrated } = useSession();
  const overallMetrics = data ? toOverallMetricsData(data.cumulative) : null;

  return (
    <AppShell className={className}>
      <MobileDesktopNotice
        isLoading={isLoading}
        isHydrated={isHydrated}
        overallMetrics={overallMetrics}
      />
    </AppShell>
  );
}

const TestScreen: React.FC<TestScreenProps> = ({ defaultTimer = 60, className = '' }) => {
  const isDesktop = useDesktopViewport();

  return isDesktop ? (
    <DesktopTypingTest defaultTimer={defaultTimer} className={className} />
  ) : (
    <MobileTestScreen className={className} />
  );
};

export default TestScreen;
