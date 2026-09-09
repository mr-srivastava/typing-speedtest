import React from 'react';
import { Card } from '@/shared/ui/card';
import TestToolbar from '@/features/typing-test/TestToolbar';
import TestSettingsBar from '@/features/typing-test/TestSettingsBar';
import TypingSurface from '@/features/typing-test/TypingSurface';
import type { TestConfig, TestMode } from '@/modules/typing-test';
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
  mode: TestMode;
  targetWordCount?: number;
  config: TestConfig;
  onConfigChange: (next: TestConfig) => void;
  started: boolean;
  finished: boolean;
  loadError: string | null;
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
  mode,
  targetWordCount,
  config,
  onConfigChange,
  started,
  finished,
  loadError,
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
        mode={mode}
        targetWordCount={targetWordCount}
        started={started}
        finished={finished}
        loadError={loadError}
        onRestart={onRestart}
        wpm={wpm}
        accuracy={accuracy}
        correctWords={correctWords}
      />
      <TestSettingsBar config={config} onConfigChange={onConfigChange} disabled={started} />
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
