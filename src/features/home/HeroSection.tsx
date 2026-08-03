import React from 'react';
import { Button } from '@/shared/ui/button';
import OverallStatsBlock from '@/features/metrics/OverallStatsBlock';
import Link from 'next/link';
import {
  getFeatureListClasses,
  type OverallMetricsData,
} from '@/features/metrics/metrics-display-utils';
import {
  layoutClasses,
  textClasses,
  buttonClasses,
  layoutShiftClasses,
  gradientClasses,
} from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';
import { themeColorClasses } from '@/shared/lib/theme';

interface HeroSectionProps {
  isLoading?: boolean;
  isHydrated?: boolean;
  hasSession?: boolean;
  overallMetrics?: OverallMetricsData | null;
  onViewStats?: () => void;
  className?: string;
}

const DEFAULT_DESCRIPTION =
  'Ready to dominate the keyboard? Our fun typing speed test will put your skills to the test.';
const DEFAULT_CTA = 'Start Your Speed Test!';
const DEFAULT_SUBTEXT =
  'Test your typing skills instantly — no login needed!';

const HeroSection: React.FC<HeroSectionProps> = ({
  isLoading = false,
  isHydrated = true,
  hasSession = false,
  overallMetrics,
  onViewStats,
  className = '',
}) => {
  const showContent = isHydrated && !isLoading;
  const hasMetrics = showContent && !!overallMetrics;

  const description = hasMetrics
    ? `Welcome back! Ready to improve your ${overallMetrics.wpm} WPM average?`
    : DEFAULT_DESCRIPTION;
  const ctaLabel = hasMetrics ? 'Beat Your Average!' : DEFAULT_CTA;
  const subtext = hasMetrics
    ? 'Challenge yourself to improve your overall performance'
    : DEFAULT_SUBTEXT;

  return (
    <div
      className={cn(
        'flex-1 min-h-0 flex flex-col',
        layoutClasses.flexCenter,
        className,
      )}
    >
      <div className={layoutShiftClasses.heroContainer}>
        <div className='flex flex-1 min-h-0 flex-col justify-center'>
          <h1
            className={cn(
              'relative z-10 font-extrabold leading-[1.1] sm:leading-tight drop-shadow-xs',
              textClasses.heroTitle,
            )}
          >
            <span
              className={cn(gradientClasses.heroTextGradient, 'block sm:inline')}
            >
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

          <p
            className={cn(
              'text-muted-foreground max-w-2xl mx-auto mt-3 sm:mt-4 relative z-10 leading-relaxed px-2 sm:px-0',
              textClasses.heroSubtitle,
              layoutShiftClasses.heroDescription,
              showContent ? layoutClasses.flexCenter : 'flex items-center justify-center',
            )}
          >
            {description}
          </p>

          <div className={layoutShiftClasses.heroActions}>
            <div className={layoutShiftClasses.metricsReserved}>
              {hasMetrics ? (
                <OverallStatsBlock metrics={overallMetrics} />
              ) : null}
            </div>

            <div className='flex flex-col sm:flex-row gap-3 items-center justify-center'>
              <Button
                variant='default'
                size='lg'
                className={cn(buttonClasses.heroCta, buttonClasses.primaryCta)}
                asChild
              >
                <Link href='/octane' className='whitespace-nowrap'>
                  {ctaLabel}
                </Link>
              </Button>
              {hasMetrics && onViewStats ? (
                <Button
                  variant='outline'
                  size='lg'
                  onClick={onViewStats}
                  className={buttonClasses.heroCta}
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
              {subtext}
            </p>
          </div>
        </div>

        {showContent ? (
          <div className='shrink-0 pt-4 pb-4 sm:pb-6 border-t border-border/50'>
            <p className={cn(textClasses.mutedSmall, 'mb-2')}>
              {hasSession ? 'More Features Coming Soon' : 'Coming Soon'}
            </p>
            <div className={getFeatureListClasses().container}>
              {[
                'Global Leaderboards',
                hasSession
                  ? 'Persistent Progress Tracking'
                  : 'Progress Tracking',
                'Custom Challenges',
              ].map((feature) => (
                <div key={feature} className={getFeatureListClasses().item}>
                  <div className={getFeatureListClasses().bullet} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            {hasSession ? (
              <p
                className={cn(
                  'text-xs text-muted-foreground/60 mt-2 px-4 sm:px-0',
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
