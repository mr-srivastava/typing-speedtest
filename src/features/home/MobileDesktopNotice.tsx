import React from 'react';
import type { OverallMetricsData } from '@/features/metrics/metrics-display-utils';
import { themeColorClasses } from '@/shared/lib/theme';
import { cn } from '@/shared/lib/cn';

interface MobileDesktopNoticeProps {
  isLoading: boolean;
  isHydrated: boolean;
  overallMetrics: OverallMetricsData | null;
  className?: string;
}

/** A non-interactive continuation of the desktop composition for touch-only screens. */
const MobileDesktopNotice: React.FC<MobileDesktopNoticeProps> = ({
  isLoading,
  isHydrated,
  overallMetrics,
  className = '',
}) => {
  const showStats = isHydrated && !isLoading && overallMetrics;

  return (
    <section
      className={cn('flex w-full max-w-3xl flex-col items-center px-6 pt-9 text-center', className)}
      aria-labelledby="desktop-only-heading"
    >
      <p className="typing-face text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        a quiet place to practice
      </p>
      <h1 id="desktop-only-heading" className="mt-2 text-xl font-semibold tracking-tight">
        Type with <span className={themeColorClasses.primary}>intention.</span>
      </h1>
      <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
        Typing tests are available on desktop and laptop keyboards.
      </p>

      <div className="mt-8 w-full max-w-sm border-t border-border/70 pt-5">
        <p className="typing-face text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          overall
        </p>
        {showStats ? (
          <>
            <div className="mt-4 grid grid-cols-2 divide-x divide-border/70">
              <div className="px-3">
                <p className="typing-face text-xl font-semibold text-primary">
                  {overallMetrics.wpm}
                </p>
                <p className="mt-1 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  wpm average
                </p>
              </div>
              <div className="px-3">
                <p className="typing-face text-xl font-semibold">{overallMetrics.accuracy}%</p>
                <p className="mt-1 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  accuracy
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {overallMetrics.totalTests} test{overallMetrics.totalTests === 1 ? '' : 's'} completed
              on this device
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No completed tests on this device yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default MobileDesktopNotice;
