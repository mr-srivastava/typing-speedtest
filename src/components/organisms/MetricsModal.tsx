'use client';
import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@/components/ui/animated-modal';
import MetricsDisplay from '@/components/organisms/MetricsDisplay';
import {
  LiveTestMetrics,
  EnhancedStoredData,
  MetricsView,
} from '@/types/metrics';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

function initialShowCumulative(view: MetricsView): boolean {
  if (view.scope === 'cumulative') return true;
  if (view.scope === 'toggle') return view.initial === 'cumulative';
  return false;
}

interface MetricsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  liveMetrics?: LiveTestMetrics;
  sessionData?: EnhancedStoredData | null;
  onRestart: () => void;
  view?: MetricsView;
  className?: string;
}

const MetricsModal: React.FC<MetricsModalProps> = ({
  isOpen,
  onOpenChange,
  liveMetrics,
  sessionData,
  onRestart,
  view = { scope: 'toggle', initial: 'live' },
  className = '',
}) => {
  const [showCumulative, setShowCumulative] = useState(() =>
    initialShowCumulative(view),
  );

  const hasCumulativeData = Boolean(
    sessionData && sessionData.cumulative.totalTests > 1,
  );

  const showToggle = view.scope === 'toggle' && hasCumulativeData;

  const effectiveShowCumulative =
    view.scope === 'cumulative'
      ? true
      : view.scope === 'live'
        ? false
        : showCumulative && hasCumulativeData;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalBody
        title='Metrics'
        className={cn('w-full max-w-4xl mx-auto', className)}
      >
        <ModalContent>
          {showToggle ? (
            <ViewToggle
              showCumulative={showCumulative}
              onToggle={setShowCumulative}
              totalTests={sessionData?.cumulative.totalTests ?? 0}
            />
          ) : null}

          <MetricsDisplay
            liveMetrics={liveMetrics}
            sessionData={sessionData}
            showCumulative={effectiveShowCumulative}
          />
        </ModalContent>
        <ModalFooter className='gap-4 justify-end'>
          <button
            onClick={onRestart}
            className='bg-black text-white dark:bg-white dark:text-black text-sm px-4 py-2 rounded-md border border-black w-28'
          >
            {view.scope === 'cumulative' ? 'Close' : 'Restart'}
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default MetricsModal;
