'use client';
import React, { useCallback, useState, startTransition } from 'react';
import dynamic from 'next/dynamic';
import AppHeader from '@/shared/ui/AppHeader';
import HeroSection from '@/features/home/HeroSection';
import { toOverallMetricsData } from '@/features/metrics/metrics-display-utils';
import { useSession } from '@/modules/session';
import { AmbientBackground } from '@/shared/layout/AmbientBackground';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

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

  const overallMetrics = data ? toOverallMetricsData(data.cumulative) : null;

  return (
    <div className={cn(layoutClasses.pageShell, className)}>
      <AmbientBackground />
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
    </div>
  );
};

export default HomeScreen;
