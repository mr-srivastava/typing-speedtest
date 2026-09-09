import React from 'react';
import { Card } from '@/shared/ui/card';
import TestToolbar from '@/features/typing-test/TestToolbar';
import TestSettingsBar from '@/features/typing-test/TestSettingsBar';
import TypingSurface from '@/features/typing-test/TypingSurface';
import type { TestConfig } from '@/modules/typing-test/config';
import { deriveLiveTypingAnalytics } from '@/modules/typing-test/analytics';
import { gradients } from '@/shared/lib/theme';
import { cn } from '@/shared/lib/cn';
import { useTypingTestActions, useTypingTestState } from './typing-test-react';

interface TestPanelProps {
  config: TestConfig;
  onConfigChange: (next: TestConfig) => void;
  onRestart: () => void;
  className?: string;
}

const TestPanel: React.FC<TestPanelProps> = ({
  config,
  onConfigChange,
  onRestart,
  className = '',
}) => {
  const state = useTypingTestState();
  const analytics = deriveLiveTypingAnalytics(state);
  const { setInput } = useTypingTestActions();
  const started = state.phase === 'active' || state.phase === 'finished';
  const finished = state.phase === 'finished';
  const timer = state.mode === 'time' ? state.timerRemaining : state.elapsedSeconds;
  const timerDuration = state.mode === 'time' ? state.timerDuration : state.elapsedSeconds;

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
        mode={state.mode}
        targetWordCount={state.mode === 'words' ? config.wordCount : undefined}
        started={started}
        finished={finished}
        loadError={state.loadError}
        onRestart={onRestart}
        wpm={analytics.wpm}
        accuracy={analytics.accuracy}
        correctWords={state.correctWordCount}
      />
      <TestSettingsBar config={config} onConfigChange={onConfigChange} disabled={started} />
      <TypingSurface
        referenceText={state.referenceText}
        input={state.input}
        onInputChange={setInput}
        readOnly={finished || state.phase === 'loading' || state.phase === 'error'}
        focusKey={state.referenceText}
      />
    </Card>
  );
};

export default TestPanel;
