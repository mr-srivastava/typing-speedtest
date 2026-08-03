import React from 'react';
import TimerDisplay from '@/components/molecules/TimerDisplay';
import RestartButton from '@/components/atoms/RestartButton';
import { layoutClasses } from '@/lib/layout-utils';
import { cn } from '@/lib/utils';

interface TestControlSectionProps {
  timer: number;
  started: boolean;
  finished: boolean;
  onRestart: () => void;
  timerDuration?: number;
  showRestart?: boolean;
  restartDisabled?: boolean;
  className?: string;
}

const TestControlSection: React.FC<TestControlSectionProps> = ({
  timer,
  started,
  finished,
  onRestart,
  timerDuration = 60,
  showRestart = true,
  restartDisabled = false,
  className = '',
}) => {
  return (
    <section className={cn('w-full', className)}>
      {/* Controls row: restart and timer */}
      <div className={layoutClasses.flexBetween}>
        <div className={cn(layoutClasses.flexStart, layoutClasses.gap2)}>
          {showRestart ? (
            <RestartButton
              onRestart={onRestart}
              disabled={restartDisabled || (!started && !finished)}
            />
          ) : null}
        </div>
        <TimerDisplay timer={timer} timerDuration={timerDuration} />
      </div>
    </section>
  );
};

export default TestControlSection;
