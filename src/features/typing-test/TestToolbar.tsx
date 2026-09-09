import React from 'react';
import { ResetIcon } from '@radix-ui/react-icons';
import TimerDisplay from '@/shared/ui/TimerDisplay';
import { Button } from '@/shared/ui/button';
import type { TestMode } from '@/modules/typing-test';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface TestToolbarProps {
  timer: number;
  timerDuration: number;
  mode: TestMode;
  /** Word-mode target word count, shown as "correct/target" instead of a bare count. */
  targetWordCount?: number;
  started: boolean;
  finished: boolean;
  onRestart: () => void;
  wpm: number;
  accuracy: number;
  correctWords: number;
  className?: string;
}

const TestToolbar: React.FC<TestToolbarProps> = ({
  timer,
  timerDuration,
  mode,
  targetWordCount,
  started,
  finished,
  onRestart,
  wpm,
  accuracy,
  correctWords,
  className = '',
}) => {
  const restartDisabled = !started && !finished;

  return (
    <div
      className={cn(
        'flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 md:px-6',
        className,
      )}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onRestart}
        disabled={restartDisabled}
        className="gap-2 shrink-0"
        aria-label="Restart test"
      >
        <ResetIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Restart</span>
      </Button>

      <div
        className={cn(layoutClasses.flexCenter, 'min-w-0 flex-1 gap-3 sm:gap-6 text-xs sm:text-sm')}
        aria-live="polite"
      >
        {started ? (
          <>
            <span className="tabular-nums">
              <span className="font-semibold text-success">{wpm}</span>
              <span className="text-muted-foreground ml-1">WPM</span>
            </span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="tabular-nums">
              <span className="font-semibold">{accuracy}%</span>
              <span className="text-muted-foreground ml-1">accuracy</span>
            </span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="tabular-nums">
              <span className="font-semibold">
                {targetWordCount ? `${correctWords}/${targetWordCount}` : correctWords}
              </span>
              <span className="text-muted-foreground ml-1">words</span>
            </span>
          </>
        ) : (
          <span className="text-muted-foreground text-center truncate">
            Start typing — timer begins on your first keystroke
          </span>
        )}
      </div>

      <TimerDisplay timer={timer} timerDuration={timerDuration} mode={mode} className="shrink-0" />
    </div>
  );
};

export default TestToolbar;
