import React from 'react';
import { Button } from '@/components/ui/button';
import OverallMetricsDisplay from '@/components/organisms/OverallMetricsDisplay';
import Link from 'next/link';
import {
  getFeatureListClasses,
  type OverallMetricsData,
} from '@/lib/metrics-display-utils';
import {
  layoutClasses,
  textClasses,
  buttonClasses,
  layoutShiftClasses,
  gradientClasses,
} from '@/lib/layout-utils';
import { themeColorClasses, cn } from '@/lib/utils';

interface HeroSectionProps {
  isLoading?: boolean;
  isHydrated?: boolean;
  hasSession?: boolean;
  overallMetrics?: OverallMetricsData | null;
  onViewStats?: () => void;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  isLoading = false,
  isHydrated = true,
  hasSession = false,
  overallMetrics,
  onViewStats,
  className = '',
}) => {
  const showContent = isHydrated && !isLoading;
  const showLoadingState = !isHydrated || isLoading;

  return (
    <div className={cn('flex-1', layoutClasses.flexCenter, className)}>
      <div className={layoutShiftClasses.heroContainer}>
        <h1
          className={cn(
            'relative z-10 font-extrabold leading-[1.1] sm:leading-tight drop-shadow-xs',
            textClasses.heroTitle,
          )}
        >
          <span className={cn(gradientClasses.heroTextGradient, 'block sm:inline')}>
            Unleash Your
          </span>
          <br className='hidden sm:block' />
          <span
            className={cn(
              themeColorClasses.primary,
              'drop-shadow-xs block sm:inline mt-1 sm:mt-0',
            )}
          >
            Typing Fury!
          </span>
        </h1>

        {/* Content with consistent layout */}
        {showContent ? (
          <>
            <p
              className={cn(
                'text-muted-foreground max-w-2xl mx-auto mt-6 sm:mt-8 relative z-10 leading-relaxed px-2 sm:px-0',
                textClasses.heroSubtitle,
                layoutShiftClasses.heroDescription,
                layoutClasses.flexCenter,
              )}
            >
              {overallMetrics
                ? `Welcome back! Ready to improve your ${overallMetrics.wpm} WPM average?`
                : 'Ready to dominate the keyboard? Our fun typing speed test will put your skills to the test.'}
            </p>
            <div className={layoutShiftClasses.heroActions}>
              {/* Reserve space for OverallMetrics to prevent layout shift */}
              <div className={layoutShiftClasses.metricsReserved}>
                {overallMetrics ? (
                  <OverallMetricsDisplay metrics={overallMetrics} />
                ) : null}
              </div>
              <div className='flex flex-col sm:flex-row gap-3 items-center justify-center'>
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
                {overallMetrics && onViewStats ? (
                  <Button
                    variant={'outline'}
                    size={'lg'}
                    onClick={onViewStats}
                    className='whitespace-nowrap'
                  >
                    View All Stats
                  </Button>
                ) : null}
              </div>
              <p
                className={cn(
                  textClasses.mutedSmall,
                  'px-4 sm:px-0 text-center',
                  layoutShiftClasses.ctaSubtext,
                )}
              >
                {overallMetrics
                  ? 'Challenge yourself to improve your overall performance'
                  : 'Test your typing skills instantly — no login needed!'}
              </p>
            </div>
          </>
        ) : null}

        {/* Loading state with same layout */}
        {showLoadingState ? (
          <>
            <p
              className={cn(
                'text-muted-foreground max-w-2xl mx-auto mt-6 sm:mt-8 relative z-10 leading-relaxed px-2 sm:px-0 flex items-center justify-center',
                textClasses.heroSubtitle,
                layoutShiftClasses.heroDescription,
              )}
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
                className={cn(
                  textClasses.mutedSmall,
                  'px-4 sm:px-0 text-center',
                  layoutShiftClasses.ctaSubtext,
                )}
              >
                Test your typing skills instantly — no login needed!
              </p>
            </div>
          </>
        ) : null}

        {/* Session-aware future features preview */}
        {showContent ? (
          <div className='mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border/50'>
            <p className={cn(textClasses.mutedSmall, 'mb-3 sm:mb-4')}>
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
            {hasSession ? (
              <p
                className={cn(
                  'text-xs text-muted-foreground/60 mt-3 sm:mt-4 px-4 sm:px-0',
                )}
              >
                Your scores are currently stored locally. Persistent tracking
                coming soon!
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HeroSection;
