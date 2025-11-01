'use client';
import React from 'react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import AppHeader from '@/components/organisms/AppHeader';
import HeroSection from '@/sections/HeroSection';
import { useSession } from '@/contexts/SessionContext';
import { gradients } from '@/lib/utils';

interface HomeScreenProps {
  className?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ className = '' }) => {
  const { data, isLoading, isHydrated, hasSession } = useSession();

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
      />

      {/* Subtle primary glow */}
      <div
        className={`pointer-events-none absolute inset-0 z-[1] ${gradients.primaryRadial}`}
      />
      <BackgroundBeams />
    </div>
  );
};

export default HomeScreen;
