'use client';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@/shared/ui/animated-modal';
import MetricsDisplay from '@/features/metrics/MetricsDisplay';
import type { EnhancedStoredData } from '@/modules/session';
import {
  resolveMetricsDisplay,
  type LiveTestMetrics,
  type MetricsPreference,
} from '@/modules/metrics';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';

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
  liveMetrics?: LiveTestMetrics;
  sessionData?: EnhancedStoredData | null;
  onRestart: () => void;
  /** Initial preference; use locked for fixed scopes (e.g. home cumulative). */
  preference?: MetricsPreference;
  locked?: boolean;
  className?: string;
}

const MetricsModal: React.FC<MetricsModalProps> = ({
  isOpen,
  onOpenChange,
  liveMetrics,
  sessionData = null,
  onRestart,
  preference: initialPreference = 'auto',
  locked = false,
  className = '',
}) => {
  const [preference, setPreference] =
    useState<MetricsPreference>(initialPreference);

  const model = useMemo(
    () =>
      resolveMetricsDisplay({
        live: liveMetrics,
        session: sessionData,
        preference,
        locked,
      }),
    [liveMetrics, sessionData, preference, locked],
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalBody
        title='Metrics'
        className={cn('w-full max-w-4xl mx-auto', className)}
      >
        <ModalContent>
          {model.canToggle ? (
            <ViewToggle
              showCumulative={model.showingCumulative}
              onToggle={(showCumulative) =>
                setPreference(showCumulative ? 'cumulative' : 'live')
              }
              totalTests={model.totalTests}
            />
          ) : null}

          <MetricsDisplay model={model} />
        </ModalContent>
        <ModalFooter className='gap-4 justify-end'>
          <button
            onClick={onRestart}
            className='bg-black text-white dark:bg-white dark:text-black text-sm px-4 py-2 rounded-md border border-black w-28'
          >
            {model.view.scope === 'cumulative' ? 'Close' : 'Restart'}
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default MetricsModal;
