'use client';
import React, { useCallback, useMemo, useState } from 'react';
import Header from '@/components/header';
import Preview from '@/components/preview';
import { useTypingTest } from '@/hooks/useTypingTest';
import TypingInput from '@/components/typing-input';
import { MetricsModal } from '@/components/metrics-modal';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RestartButton from '@/components/restart-button';
import Clock from '@/components/clock';

const defaultTimer = 60;

import { LetterMetrics } from '@/types/metrics';

export default function Octane() {
  const {
    text,
    timer,
    userInput,
    started,
    finished,
    correctWordCount,
    totalWordCount,
    letterAccuracy,
    onRestart,
    onInputChange,
    setTimer,
    handleTimerExpiry,
  } = useTypingTest(defaultTimer);

  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  // Use useMemo to memoize typedLetterAccuracy
  const typedLetterAccuracy = useMemo(() => {
    return letterAccuracy as Record<string, LetterMetrics>;
  }, [letterAccuracy]);

  // Use useCallback for logging
  const logLetterAccuracy = useCallback(() => {
    console.log('Letter Level Accuracy', typedLetterAccuracy);
  }, [typedLetterAccuracy]);

  // Call the logging function
  React.useEffect(() => {
    logLetterAccuracy();
  }, [logLetterAccuracy]);

  React.useEffect(() => {
    if (finished) {
      setIsMetricsModalOpen(true);
    }
  }, [finished]);

  const handleRestart = () => {
    onRestart();
    setIsMetricsModalOpen(false);
  };

  const handleViewMetrics = () => {
    setIsMetricsModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <main className='mx-auto w-full max-w-6xl px-6 md:px-8'>
        {/* controls row: restart and timer */}
        <div className='mt-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <RestartButton onRestart={handleRestart} disabled={!started} />
          </div>
          <Clock
            timer={timer}
            setTimer={setTimer}
            started={started}
            finished={finished}
            handleTimerExpiry={handleTimerExpiry}
          />
        </div>

        <div className='mt-4 md:mt-6'>
          <Card className='relative overflow-hidden'>
            {/* top gradient accent */}
            <div className='pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,_transparent,_hsl(var(--primary))_30%,_hsl(var(--primary))_70%,_transparent)] opacity-30' />
            <CardContent className='p-6 md:p-8'>
              <div className='max-w-4xl text-base md:text-lg lg:text-xl leading-relaxed'>
                <Preview text={text} userInput={userInput} />
              </div>
              <div className='mt-4 md:mt-6'>
                <TypingInput
                  value={userInput}
                  onChange={onInputChange}
                  readOnly={finished}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {started && finished && (
          <div className='mt-4'>
            <Button onClick={handleViewMetrics}>View Metrics</Button>
          </div>
        )}
        <MetricsModal
          isOpen={isMetricsModalOpen}
          onOpenChange={setIsMetricsModalOpen}
          correctWordCount={correctWordCount}
          totalWordCount={totalWordCount}
          timer={timer}
          letterAccuracyData={typedLetterAccuracy}
          onRestart={handleRestart}
        />
      </main>
    </div>
  );
}
