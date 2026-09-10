import React from 'react';
import TestToolbar from '@/features/typing-test/TestToolbar';
import TestSettingsBar from '@/features/typing-test/TestSettingsBar';
import TypingSurface from '@/features/typing-test/TypingSurface';
import { deriveLiveTypingAnalytics, type TestConfig } from '@/modules/typing-test';
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
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <TestToolbar
        timer={timer}
        timerDuration={timerDuration}
        mode={state.mode}
        targetWordCount={state.mode === 'words' ? config.wordCount : undefined}
        phase={state.phase}
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
        className="mt-8 sm:mt-12"
      />
    </div>
  );
};

export default TestPanel;
