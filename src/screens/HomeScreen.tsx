'use client';
import React, { useState, useCallback, startTransition } from 'react';
import dynamic from 'next/dynamic';
import AppHeader from '@/components/organisms/AppHeader';
import HeroSection from '@/sections/HeroSection';
import { useSession } from '@/contexts/SessionContext';
import { gradients } from '@/lib/utils';
import type { OverallMetricsData } from '@/lib/metrics-display-utils';

const BackgroundBeams = dynamic(
  () =>
    import('@/components/ui/background-beams').then((mod) => mod.BackgroundBeams),
  { ssr: false },
);

const MetricsModal = dynamic(
  () => import('@/components/organisms/MetricsModal').then((mod) => mod.default),
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
      className={`min-h-screen w-full bg-background relative flex flex-col antialiased ${className}`}
    >
      <div className='grain-overlay' aria-hidden />
      <AppHeader />

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
          view={{ scope: 'cumulative' }}
        />
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 z-[1] ${gradients.primaryRadial}`}
      />
      <BackgroundBeams />
    </div>
  );
};

export default HomeScreen;
