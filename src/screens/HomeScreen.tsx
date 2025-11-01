'use client';
import React, { useState } from 'react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import AppHeader from '@/components/organisms/AppHeader';
import HeroSection from '@/sections/HeroSection';
import MetricsModal from '@/components/organisms/MetricsModal';
import { useSession } from '@/contexts/SessionContext';
import { gradients } from '@/lib/utils';

interface HomeScreenProps {
  className?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ className = '' }) => {
  const { data, isLoading, isHydrated, hasSession } = useSession();
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  // Extract overall metrics for display
  const overallMetrics = data
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
      <AppHeader />

      <HeroSection
        isLoading={isLoading}
        isHydrated={isHydrated}
        hasSession={hasSession}
        overallMetrics={overallMetrics}
        onViewStats={hasSession ? () => setIsMetricsModalOpen(true) : undefined}
      />

      {/* Metrics Modal */}
      {hasSession && data && (
        <MetricsModal
          isOpen={isMetricsModalOpen}
          onOpenChange={setIsMetricsModalOpen}
          correctWordCount={0}
          totalWordCount={0}
          timer={0}
          timerDuration={60}
          letterAccuracyData={{}}
          sessionData={data}
          onRestart={() => setIsMetricsModalOpen(false)}
          mode='all-tests'
        />
      )}

      {/* Subtle primary glow */}
      <div
        className={`pointer-events-none absolute inset-0 z-[1] ${gradients.primaryRadial}`}
      />
      <BackgroundBeams />
    </div>
  );
};

export default HomeScreen;
