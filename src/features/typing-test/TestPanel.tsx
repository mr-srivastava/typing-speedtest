import React from 'react';
import { Card } from '@/shared/ui/card';
import TestToolbar from '@/features/typing-test/TestToolbar';
import TypingSurface from '@/features/typing-test/TypingSurface';
import { gradients } from '@/shared/lib/theme';
import { cn } from '@/shared/lib/cn';

interface TestPanelProps {
  referenceText: string;
  input: string;
  onInputChange: (value: string) => void;
  readOnly: boolean;
  focusKey?: string;
  timer: number;
  timerDuration: number;
  started: boolean;
  finished: boolean;
  onRestart: () => void;
  wpm: number;
  accuracy: number;
  correctWords: number;
  className?: string;
}

const TestPanel: React.FC<TestPanelProps> = ({
  referenceText,
  input,
  onInputChange,
  readOnly,
  focusKey,
  timer,
  timerDuration,
  started,
  finished,
  onRestart,
  wpm,
  accuracy,
  correctWords,
  className = '',
}) => {
  return (
    <Card className={cn('relative overflow-hidden w-full', className)}>
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-[2px]',
          gradients.primaryLinear,
        )}
      />
      <TestToolbar
        timer={timer}
        timerDuration={timerDuration}
        started={started}
        finished={finished}
        onRestart={onRestart}
        wpm={wpm}
        accuracy={accuracy}
        correctWords={correctWords}
      />
      <TypingSurface
        referenceText={referenceText}
        input={input}
        onInputChange={onInputChange}
        readOnly={readOnly}
        focusKey={focusKey}
      />
    </Card>
  );
};

export default TestPanel;
