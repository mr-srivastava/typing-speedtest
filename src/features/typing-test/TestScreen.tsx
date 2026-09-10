'use client';
import React, { startTransition, useCallback, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { ChartNoAxesColumn } from 'lucide-react';
import TestPanel from '@/features/typing-test/TestPanel';
import TestIntro from '@/features/home/TestIntro';
import MobileDesktopNotice from '@/features/home/MobileDesktopNotice';
import MetricsSheet from '@/features/metrics/MetricsSheet';
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

const DynamicMetricsSheet = dynamic(
  () => import('@/features/metrics/MetricsSheet').then((mod) => mod.default),
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

interface CompletionSheetProps {
  isOpen: boolean;
  data: ReturnType<typeof useSession>['data'];
  onOpenChange: (isOpen: boolean) => void;
  onRestart: () => void;
}

/** Scoped so live analytics are only subscribed to while the completion sheet can show them. */
function CompletionSheet({ data, isOpen, onOpenChange, onRestart }: CompletionSheetProps) {
  const analytics = useTypingTestAnalytics();

  return (
    <DynamicMetricsSheet
      open={isOpen}
      onClose={() => onOpenChange(false)}
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
  isCompletionSheetOpen: boolean;
  onCompletionSheetOpenChange: (isOpen: boolean) => void;
}

function DesktopTestScreen({
  config,
  onConfigChange,
  className,
  isCompletionSheetOpen,
  onCompletionSheetOpenChange,
}: TestScreenContentProps) {
  const { data, isLoading, isHydrated, hasSession } = useSession();
  const { restart } = useTypingTestActions();
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const handleRestart = useCallback(() => {
    restart();
    onCompletionSheetOpenChange(false);
  }, [onCompletionSheetOpenChange, restart]);

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
          'flex flex-col items-center gap-6 pt-12 pb-16 sm:pt-16 md:pt-20',
        )}
      >
        <TestIntro />

        <TestPanel
          config={config}
          onConfigChange={onConfigChange}
          onRestart={handleRestart}
          className="w-full max-w-screen-2xl"
        />
      </div>

      <MetricsSheet open={isStatsOpen} sessionData={data} onClose={() => setIsStatsOpen(false)} />

      <CompletionSheet
        data={data}
        isOpen={isCompletionSheetOpen}
        onOpenChange={onCompletionSheetOpenChange}
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
  const [isCompletionSheetOpen, setIsMetricsModalOpen] = useState(false);

  const handleFinished = useCallback(
    (snapshot: TypingTestFinishedSnapshot) => {
      startTransition(() => setIsMetricsModalOpen(true));
      recordTest(buildTestSession(snapshot, config));
    },
    [recordTest, config],
  );

  return (
    <TypingTestProvider config={config} onFinished={handleFinished}>
      <DesktopTestScreen
        config={config}
        onConfigChange={setConfig}
        className={className}
        isCompletionSheetOpen={isCompletionSheetOpen}
        onCompletionSheetOpenChange={setIsMetricsModalOpen}
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
