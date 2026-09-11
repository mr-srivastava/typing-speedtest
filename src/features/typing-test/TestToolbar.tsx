import React from 'react';
import { ResetIcon } from '@radix-ui/react-icons';
import TimerDisplay from '@/shared/ui/TimerDisplay';
import { Button } from '@/shared/ui/button';
import type { TestMode, TypingTestPhase } from '@/modules/typing-test';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface TestToolbarProps {
  timer: number;
  timerDuration: number;
  mode: TestMode;
  /** Word-mode completion target. */
  targetWordCount?: number;
  phase: TypingTestPhase;
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
  phase,
  onRestart,
  wpm,
  accuracy,
  correctWords,
  className = '',
}) => {
  const started = phase === 'active' || phase === 'finished';
  const hasLoadError = phase === 'error';
  const restartDisabled = phase === 'idle' || phase === 'loading';

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 px-1 py-2 sm:h-14 sm:gap-3 sm:py-0',
        className,
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onRestart}
        disabled={restartDisabled}
        className="order-1 shrink-0 gap-2 font-normal text-muted-foreground hover:text-foreground"
        aria-label="Restart test"
      >
        <ResetIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Restart</span>
      </Button>

      <TimerDisplay
        timer={timer}
        timerDuration={timerDuration}
        mode={mode}
        className="order-2 shrink-0 sm:order-3"
      />

      <div
        className={cn(
          layoutClasses.flexCenter,
          'order-3 w-full basis-full gap-3 text-xs sm:order-2 sm:w-auto sm:basis-auto sm:flex-1 sm:gap-6 sm:text-sm',
        )}
        aria-live="polite"
      >
        {hasLoadError ? (
          <span className="text-destructive text-center truncate">
            Unable to load text — restart to try again
          </span>
        ) : started ? (
          <>
            <span className="tabular-nums">
              <span className="font-semibold text-primary">{wpm}</span>
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
            timer starts on your first keystroke
          </span>
        )}
      </div>
    </div>
  );
};

export default TestToolbar;
