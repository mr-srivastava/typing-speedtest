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
  className = '',
}) => {
  const [showCumulative, setShowCumulative] = useState(false);
  const hasCumulativeData = Boolean(
    sessionData && sessionData.cumulative.totalTests > 1,
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalBody
        title='Metrics'
        className={`w-full max-w-4xl mx-auto ${className}`}
      >
        <ModalContent>
          {hasCumulativeData && (
            <ViewToggle
              showCumulative={showCumulative}
              onToggle={setShowCumulative}
              totalTests={sessionData!.cumulative.totalTests}
            />
          )}

          <MetricsDisplay
            correctWordCount={correctWordCount}
            totalWordCount={totalWordCount}
            timer={timer}
            timerDuration={timerDuration}
            letterAccuracyData={letterAccuracyData}
            data={sessionData}
            showCumulative={showCumulative && hasCumulativeData}
          />
        </ModalContent>
        <ModalFooter className='gap-4 justify-end'>
          <button
            onClick={onRestart}
            className='bg-black text-white dark:bg-white dark:text-black text-sm px-4 py-2 rounded-md border border-black w-28'
          >
            Restart
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default MetricsModal;
