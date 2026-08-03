import React from 'react';
import { Orbitron } from 'next/font/google';
import { radiusClasses, surfaceClasses } from '@/shared/layout/layout-utils';
import { getTimerWarningClass } from '@/shared/layout/theme-display-utils';
import { cn } from '@/shared/lib/cn';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const MIN_IN_SEC = 60;

interface TimerDisplayProps {
  timer: number;
  timerDuration?: number;
  className?: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timer,
  timerDuration = 60,
  className = '',
}) => {
  const isNearExpiry = timer !== timerDuration && timer % MIN_IN_SEC <= 10;

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
    <div className={cn('px-2 py-2 text-right cursor-default', className)}>
      <span
        className={cn(
          'inline-flex items-center backdrop-blur px-3 py-1 text-2xl md:text-3xl',
          surfaceClasses.field,
          radiusClasses.pill,
          getTimerWarningClass(isNearExpiry),
          orbitron.className,
        )}
        aria-live='polite'
        aria-label='Time remaining'
      >
        {getTime()}
      </span>
    </div>
  );
};

export default TimerDisplay;
