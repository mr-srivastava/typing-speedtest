import React from 'react';
import { Button } from '@/components/ui/button';
import OverallMetricsDisplay from '@/components/organisms/OverallMetricsDisplay';
import Link from 'next/link';
import { getFeatureListClasses } from '@/lib/metrics-display-utils';
import {
  layoutClasses,
  textClasses,
  buttonClasses,
  layoutShiftClasses,
  gradientClasses,
} from '@/lib/layout-utils';
import { themeColorClasses } from '@/lib/utils';

interface HeroSectionProps {
  isLoading?: boolean;
  isHydrated?: boolean;
  hasSession?: boolean;
  overallMetrics?: {
    wpm: number;
    accuracy: number;
    totalTests: number;
    totalTimeSpent: number;
    firstTestDate: string;
  } | null;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  isLoading = false,
  isHydrated = true,
  hasSession = false,
  overallMetrics,
  className = '',
}) => {
  const showContent = isHydrated && !isLoading;
  const showLoadingState = !isHydrated || isLoading;

  return (
    <div className={`flex-1 ${layoutClasses.flexCenter} ${className}`}>
      <div className={layoutShiftClasses.heroContainer}>
        <h1
          className={`relative z-10 ${textClasses.heroTitle} font-extrabold leading-[1.1] sm:leading-tight drop-shadow-sm`}
        >
          <span
            className={`${gradientClasses.heroTextGradient} block sm:inline`}
          >
            Unleash Your
          </span>
          <br className='hidden sm:block' />
          <span
            className={`${themeColorClasses.primary} drop-shadow-sm block sm:inline mt-1 sm:mt-0`}
          >
            Typing Fury!
          </span>
        </h1>

        {/* Content with consistent layout */}
        {showContent && (
          <>
            <p
              className={`text-muted-foreground max-w-2xl mx-auto mt-6 sm:mt-8 ${textClasses.heroSubtitle} relative z-10 leading-relaxed px-2 sm:px-0 ${layoutShiftClasses.heroDescription} ${layoutClasses.flexCenter}`}
            >
              {overallMetrics
                ? `Welcome back! Ready to improve your ${overallMetrics.wpm} WPM average?`
                : 'Ready to dominate the keyboard? Our fun typing speed test will put your skills to the test.'}
            </p>
            <div className={layoutShiftClasses.heroActions}>
              {/* Reserve space for OverallMetrics to prevent layout shift */}
              <div className={layoutShiftClasses.metricsReserved}>
                {overallMetrics && (
                  <OverallMetricsDisplay metrics={overallMetrics} />
                )}
              </div>
              <Button
                variant={'default'}
                size={'lg'}
                className={buttonClasses.primaryCta}
                asChild
              >
                <Link href={'/octane'} className='whitespace-nowrap'>
                  {overallMetrics
                    ? 'Beat Your Average!'
                    : 'Start Your Speed Test!'}
                </Link>
              </Button>
              <p
                className={`${textClasses.mutedSmall} px-4 sm:px-0 text-center ${layoutShiftClasses.ctaSubtext}`}
              >
                {overallMetrics
                  ? 'Challenge yourself to improve your overall performance'
                  : 'Test your typing skills instantly — no login needed!'}
              </p>
            </div>
          </>
        )}

        {/* Loading state with same layout */}
        {showLoadingState && (
          <>
            <p
              className={`text-muted-foreground max-w-2xl mx-auto mt-6 sm:mt-8 ${textClasses.heroSubtitle} relative z-10 leading-relaxed px-2 sm:px-0 ${layoutShiftClasses.heroDescription} flex items-center justify-center`}
            >
              Ready to dominate the keyboard? Our fun typing speed test will put
              your skills to the test.
            </p>
            <div className={layoutShiftClasses.heroActions}>
              {/* Reserve space for OverallMetrics to prevent layout shift */}
              <div className={layoutShiftClasses.metricsReserved}>
                {/* Empty space reserved */}
              </div>
              <Button
                variant={'default'}
                size={'lg'}
                className={buttonClasses.primaryCta}
                asChild
              >
                <Link href={'/octane'} className='whitespace-nowrap'>
                  Start Your Speed Test!
                </Link>
              </Button>
              <p
                className={`${textClasses.mutedSmall} px-4 sm:px-0 text-center ${layoutShiftClasses.ctaSubtext}`}
              >
                Test your typing skills instantly — no login needed!
              </p>
            </div>
          </>
        )}

        {/* Session-aware future features preview */}
        {showContent && (
          <div className='mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border/50'>
            <p className={`${textClasses.mutedSmall} mb-3 sm:mb-4`}>
              {hasSession ? 'More Features Coming Soon' : 'Coming Soon'}
            </p>
            <div className={getFeatureListClasses().container}>
              {[
                'Global Leaderboards',
                hasSession
                  ? 'Persistent Progress Tracking'
                  : 'Progress Tracking',
                'Custom Challenges',
              ].map((feature, index) => (
                <div key={index} className={getFeatureListClasses().item}>
                  <div className={getFeatureListClasses().bullet}></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            {hasSession && (
              <p
                className={`${textClasses.mutedSubtle}/60 mt-3 sm:mt-4 px-4 sm:px-0`}
              >
                Your scores are currently stored locally. Persistent tracking
                coming soon!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
