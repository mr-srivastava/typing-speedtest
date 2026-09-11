import React from 'react';
import { getTimerWarningClass } from '@/shared/layout/theme-display-utils';
import { cn } from '@/shared/lib/cn';

const MIN_IN_SEC = 60;

interface TimerDisplayProps {
  timer: number;
  timerDuration?: number;
  /** 'words' mode counts up with no fixed ceiling, so the near-expiry warning never applies. */
  mode?: 'time' | 'words';
  className?: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timer,
  timerDuration = 60,
  mode = 'time',
  className = '',
}) => {
  const isNearExpiry = mode === 'time' && timer !== timerDuration && timer % MIN_IN_SEC <= 10;

  function formatNumberWithTwoDigit(num: number) {
    return num.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  }

  function getTime() {
    const minutes = formatNumberWithTwoDigit(Math.floor(timer / MIN_IN_SEC));
    const seconds = formatNumberWithTwoDigit(timer % MIN_IN_SEC);
    return `${minutes}:${seconds}`;
  }

  return (
    <div className={cn('typing-face px-2 py-2 text-right cursor-default', className)}>
      <span
        className={cn(
          'inline-flex items-center px-1 py-1 text-lg font-medium tracking-tight md:text-xl',
          getTimerWarningClass(isNearExpiry),
        )}
        aria-live="polite"
        aria-label={mode === 'words' ? 'Time elapsed' : 'Time remaining'}
      >
        {getTime()}
      </span>
    </div>
  );
};

export default TimerDisplay;
