'use client';
import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@/components/ui/animated-modal';
import MetricsDisplay from '@/components/organisms/MetricsDisplay';
import { LetterMetrics, EnhancedStoredData } from '@/types/metrics';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  showCumulative: boolean;
  onToggle: (showCumulative: boolean) => void;
  totalTests: number;
}

function ViewToggle({ showCumulative, onToggle, totalTests }: ViewToggleProps) {
  return (
    <div className='flex justify-center mb-6'>
      <div className='flex bg-muted rounded-lg p-1'>
        <Button
          variant={!showCumulative ? 'default' : 'ghost'}
          size='sm'
          onClick={() => onToggle(false)}
          className='text-sm'
        >
          This Test
        </Button>
        <Button
          variant={showCumulative ? 'default' : 'ghost'}
          size='sm'
          onClick={() => onToggle(true)}
          className='text-sm'
        >
          All Tests ({totalTests})
        </Button>
      </div>
    </div>
  );
}

interface MetricsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  correctWordCount: number;
  totalWordCount: number;
  timer: number;
  timerDuration?: number;
  letterAccuracyData: Record<string, LetterMetrics>;
  sessionData?: EnhancedStoredData | null;
  onRestart: () => void;
  mode?: 'this-test' | 'all-tests' | 'both';
  className?: string;
}

const MetricsModal: React.FC<MetricsModalProps> = ({
  isOpen,
  onOpenChange,
  correctWordCount,
  totalWordCount,
  timer,
  timerDuration = 60,
  letterAccuracyData,
  sessionData,
  onRestart,
  mode = 'both',
  className = '',
}) => {
  // Determine initial view based on mode
  const getInitialView = React.useCallback(() => {
    if (mode === 'all-tests') return true;
    if (mode === 'this-test') return false;
    // For 'both' mode, default to this test
    return false;
  }, [mode]);

  const [showCumulative, setShowCumulative] = useState(getInitialView);

  // Reset view when mode changes
  React.useEffect(() => {
    setShowCumulative(getInitialView());
  }, [mode, isOpen, getInitialView]);

  const hasCumulativeData = Boolean(
    sessionData && sessionData.cumulative.totalTests > 1,
  );

  // Determine if toggle should be shown
  const showToggle = mode === 'both' && hasCumulativeData;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalBody
        title='Metrics'
        className={`w-full max-w-4xl mx-auto ${className}`}
      >
        <ModalContent>
          {showToggle && (
            <ViewToggle
              showCumulative={showCumulative}
              onToggle={setShowCumulative}
              totalTests={sessionData?.cumulative.totalTests ?? 0}
            />
          )}

          <MetricsDisplay
            correctWordCount={correctWordCount}
            totalWordCount={totalWordCount}
            timer={timer}
            timerDuration={timerDuration}
            letterAccuracyData={letterAccuracyData}
            data={sessionData}
            showCumulative={
              mode === 'all-tests' ? true : showCumulative && hasCumulativeData
            }
          />
        </ModalContent>
        <ModalFooter className='gap-4 justify-end'>
          <button
            onClick={onRestart}
            className='bg-black text-white dark:bg-white dark:text-black text-sm px-4 py-2 rounded-md border border-black w-28'
          >
            {mode === 'all-tests' ? 'Close' : 'Restart'}
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default MetricsModal;
