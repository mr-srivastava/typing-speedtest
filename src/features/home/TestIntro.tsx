import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import OverallStatsBlock from '@/features/metrics/OverallStatsBlock';
import { type OverallMetricsData } from '@/features/metrics/metrics-display-utils';
import { themeColorClasses } from '@/shared/lib/theme';
import { motion as motionTokens } from '@/shared/lib/tokens';
import { cn } from '@/shared/lib/cn';

interface TestIntroProps {
  isLoading?: boolean;
  isHydrated?: boolean;
  overallMetrics?: OverallMetricsData | null;
  statsOpen?: boolean;
  onToggleStats?: () => void;
  className?: string;
}

const TestIntro: React.FC<TestIntroProps> = ({
  isLoading = false,
  isHydrated = true,
  overallMetrics,
  statsOpen = false,
  onToggleStats,
  className = '',
}) => {
  const showContent = isHydrated && !isLoading;
  const hasMetrics = showContent && !!overallMetrics;

  return (
    <div className={cn('flex w-full max-w-3xl flex-col items-center gap-2 text-center', className)}>
      <p className="typing-face text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        a quiet place to practice
      </p>
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Type with <span className={themeColorClasses.primary}>intention.</span>
      </h1>

      <div className="min-h-6">
        {!showContent ? null : hasMetrics && overallMetrics ? (
          <div className="flex flex-col items-center gap-3">
            <OverallStatsBlock metrics={overallMetrics} />
            {onToggleStats ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleStats}
                aria-expanded={statsOpen}
                className="typing-face h-7 gap-1 px-1 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase hover:bg-transparent hover:text-foreground"
              >
                {statsOpen ? 'Hide stats' : 'View stats'}
                <ChevronDown
                  className={cn('h-4 w-4', motionTokens.transitionFast, statsOpen && 'rotate-180')}
                />
              </Button>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Start when you are ready. Your results stay on this device.
          </p>
        )}
      </div>
    </div>
  );
};

export default TestIntro;
