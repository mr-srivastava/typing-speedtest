'use client';
import React, { useMemo, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, useModal } from '@/shared/ui/animated-modal';
import MetricsDisplay from '@/features/metrics/MetricsDisplay';
import {
  getMetricsModalActionLabel,
  getMetricsModalTitle,
} from '@/features/metrics/metrics-modal-utils';
import type { EnhancedStoredData } from '@/modules/session/types';
import { resolveMetricsDisplay } from '@/modules/metrics/resolve-display';
import type { LiveTestMetrics, MetricsPreference } from '@/modules/metrics/types';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';

interface ViewToggleProps {
  showCumulative: boolean;
  onToggle: (showCumulative: boolean) => void;
  totalTests: number;
}

function ViewToggle({ showCumulative, onToggle, totalTests }: ViewToggleProps) {
  return (
    <div className="flex border border-border/80 p-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle(false)}
        className={cn(
          'rounded-sm font-normal text-muted-foreground',
          !showCumulative &&
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        )}
      >
        This Test
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle(true)}
        className={cn(
          'rounded-sm font-normal text-muted-foreground',
          showCumulative &&
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        )}
      >
        All Tests ({totalTests})
      </Button>
    </div>
  );
}

function MetricsModalFooter({
  actionLabel,
  onRestart,
}: {
  actionLabel: string;
  onRestart: () => void;
}) {
  const { setOpen } = useModal();
  const isRestart = actionLabel === 'Restart';

  return (
    <ModalFooter className="gap-3">
      {isRestart ? (
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Close
        </Button>
      ) : null}
      <Button onClick={isRestart ? onRestart : () => setOpen(false)} className="min-w-28">
        {actionLabel}
      </Button>
    </ModalFooter>
  );
}

interface MetricsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  liveMetrics?: LiveTestMetrics;
  sessionData?: EnhancedStoredData | null;
  onRestart: () => void;
  className?: string;
}

/** Always shows the just-finished test, with an optional toggle to this session's cumulative average. */
const MetricsModal: React.FC<MetricsModalProps> = ({
  isOpen,
  onOpenChange,
  liveMetrics,
  sessionData = null,
  onRestart,
  className = '',
}) => {
  const [preference, setPreference] = useState<MetricsPreference>('auto');

  const model = useMemo(
    () => resolveMetricsDisplay({ live: liveMetrics, session: sessionData, preference }),
    [liveMetrics, sessionData, preference],
  );

  const modalTitle = getMetricsModalTitle(model, { hasLiveMetrics: !!liveMetrics });
  const actionLabel = getMetricsModalActionLabel(model);
  const subtitle =
    modalTitle === 'Test Complete'
      ? `${model.wpm} wpm · ${model.accuracy}% accuracy`
      : (model.statsTitle ?? undefined);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalBody
        title={modalTitle}
        subtitle={subtitle}
        className={className}
        toolbar={
          model.canToggle ? (
            <ViewToggle
              showCumulative={model.showingCumulative}
              onToggle={(showCumulative) => setPreference(showCumulative ? 'cumulative' : 'live')}
              totalTests={model.totalTests}
            />
          ) : null
        }
      >
        <ModalContent>
          <MetricsDisplay model={model} compact />
        </ModalContent>
        <MetricsModalFooter actionLabel={actionLabel} onRestart={onRestart} />
      </ModalBody>
    </Modal>
  );
};

export default MetricsModal;
