'use client';
import React, { useMemo, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, useModal } from '@/shared/ui/animated-modal';
import MetricsDisplay from '@/features/metrics/MetricsDisplay';
import {
  getMetricsModalActionLabel,
  getMetricsModalTitle,
} from '@/features/metrics/metrics-modal-utils';
import type { EnhancedStoredData } from '@/modules/session';
import {
  resolveMetricsDisplay,
  type LiveTestMetrics,
  type MetricsPreference,
} from '@/modules/metrics';
import { Button } from '@/shared/ui/button';
import { radiusClasses } from '@/shared/layout/layout-utils';
import { cn } from '@/shared/lib/cn';

interface ViewToggleProps {
  showCumulative: boolean;
  onToggle: (showCumulative: boolean) => void;
  totalTests: number;
}

function ViewToggle({ showCumulative, onToggle, totalTests }: ViewToggleProps) {
  return (
    <div className={cn('flex bg-muted p-1', radiusClasses.surface)}>
      <Button
        variant={!showCumulative ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onToggle(false)}
      >
        This Test
      </Button>
      <Button
        variant={showCumulative ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onToggle(true)}
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
  const [preference, setPreference] = useState<MetricsPreference>(initialPreference);

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

  const modalTitle = getMetricsModalTitle(model, {
    locked,
    hasLiveMetrics: !!liveMetrics,
  });

  const actionLabel = getMetricsModalActionLabel(model, locked);
  const subtitle =
    modalTitle === 'Test Complete'
      ? `${model.wpm} WPM · ${model.accuracy}% accuracy`
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
