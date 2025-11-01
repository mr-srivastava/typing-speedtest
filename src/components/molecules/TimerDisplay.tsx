import React from 'react';
import { cn } from '@/lib/utils';
import { Orbitron } from 'next/font/google';
import { getTimerWarningClass } from '@/lib/theme-display-utils';

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
  // Check if near expiry (last 10 seconds of any minute)
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
    <div className={`px-2 py-1.5 text-right cursor-default ${className}`}>
      <span
        className={cn(
          `inline-flex items-center rounded-full border border-border bg-secondary/60 backdrop-blur px-3 py-1 text-2xl md:text-3xl ${getTimerWarningClass(
            isNearExpiry,
          )}`,
          orbitron.className,
        )}
      >
        {getTime()}
      </span>
    </div>
  );
};

export default TimerDisplay;
