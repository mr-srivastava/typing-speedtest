import React from 'react';
import TimerDisplay from '@/shared/ui/TimerDisplay';
import RestartButton from '@/shared/ui/RestartButton';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface TestControlsProps {
  timer: number;
  started: boolean;
  finished: boolean;
  onRestart: () => void;
  timerDuration?: number;
  showRestart?: boolean;
  restartDisabled?: boolean;
  className?: string;
}

const TestControls: React.FC<TestControlsProps> = ({
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

export default TestControls;
