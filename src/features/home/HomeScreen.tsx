'use client';
import React, { useState, useCallback, startTransition } from 'react';
import dynamic from 'next/dynamic';
import AppHeader from '@/shared/ui/AppHeader';
import HeroSection from '@/features/home/HeroSection';
import { useSession } from '@/modules/session';
import { cn } from '@/shared/lib/cn';
import { gradients } from '@/shared/lib/theme';
import type { OverallMetricsData } from '@/features/metrics/metrics-display-utils';

const BackgroundBeams = dynamic(
  () =>
    import('@/shared/ui/background-beams').then((mod) => mod.BackgroundBeams),
  { ssr: false },
);

const MetricsModal = dynamic(
  () => import('@/features/metrics/MetricsModal').then((mod) => mod.default),
  { ssr: false },
);

interface HomeScreenProps {
  className?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ className = '' }) => {
  const { data, isLoading, isHydrated, hasSession } = useSession();
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  const handleViewStats = useCallback(() => {
    startTransition(() => setIsMetricsModalOpen(true));
  }, []);

  const handleCloseMetrics = useCallback(() => {
    setIsMetricsModalOpen(false);
  }, []);

  const overallMetrics: OverallMetricsData | null = data
    ? {
        wpm: data.cumulative.weightedWPM,
        accuracy: data.cumulative.weightedAccuracy,
        totalTests: data.cumulative.totalTests,
        totalTimeSpent: data.cumulative.totalTimeSpent,
        firstTestDate: data.cumulative.firstTestDate,
      }
    : null;

  return (
    <div
      className={cn(
        'h-dvh w-full bg-background relative flex flex-col antialiased overflow-hidden',
        className,
      )}
    >
      <div className='grain-overlay' aria-hidden />
      <AppHeader className='shrink-0' />

      <HeroSection
        isLoading={isLoading}
        isHydrated={isHydrated}
        hasSession={hasSession}
        overallMetrics={overallMetrics}
        onViewStats={hasSession ? handleViewStats : undefined}
      />

      {hasSession && data ? (
        <MetricsModal
          isOpen={isMetricsModalOpen}
          onOpenChange={setIsMetricsModalOpen}
          sessionData={data}
          onRestart={handleCloseMetrics}
          preference='cumulative'
          locked
        />
      ) : null}

      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-[1]',
          gradients.primaryRadial,
        )}
      />
      <BackgroundBeams />
    </div>
  );
};

export default HomeScreen;
