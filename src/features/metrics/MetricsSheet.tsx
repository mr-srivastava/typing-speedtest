'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import MetricsDisplay from '@/features/metrics/MetricsDisplay';
import {
  getMetricsSheetActionLabel,
  getMetricsSheetTitle,
} from '@/features/metrics/metrics-sheet-utils';
import { resolveMetricsDisplay } from '@/modules/metrics/resolve-display';
import type { LiveTestMetrics, MetricsPreference } from '@/modules/metrics/types';
import type { EnhancedStoredData } from '@/modules/session/types';
import { Button } from '@/shared/ui/button';
import { motion as motionTokens, width } from '@/shared/lib/tokens';
import { cn } from '@/shared/lib/cn';

interface ViewToggleProps {
  showCumulative: boolean;
  onToggle: (showCumulative: boolean) => void;
  totalTests: number;
}

function ViewToggle({ showCumulative, onToggle, totalTests }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle(false)}
        aria-pressed={!showCumulative}
        className={cn(
          'font-normal hover:bg-transparent',
          !showCumulative
            ? 'font-semibold text-primary hover:text-primary'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        This Test
      </Button>

      <span className="mx-2 h-4 w-px bg-border" aria-hidden />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggle(true)}
        aria-pressed={showCumulative}
        className={cn(
          'font-normal hover:bg-transparent',
          showCumulative
            ? 'font-semibold text-primary hover:text-primary'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        All Tests ({totalTests})
      </Button>
    </div>
  );
}

interface MetricsSheetProps {
  open: boolean;
  onClose: () => void;
  sessionData: EnhancedStoredData | null;
  /** Present when opened right after a test finishes; absent for the header "view stats" trigger. */
  liveMetrics?: LiveTestMetrics;
  /** Only shown (as a footer action) when opened from a just-finished test. */
  onRestart?: () => void;
  className?: string;
}

/**
 * Full-screen sheet sliding in from the right. Shows the just-finished test (with a toggle to
 * cumulative stats) when `liveMetrics`/`onRestart` are given, or locked cumulative stats otherwise.
 */
const MetricsSheet: React.FC<MetricsSheetProps> = ({
  open,
  onClose,
  sessionData,
  liveMetrics,
  onRestart,
  className = '',
}) => {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [preference, setPreference] = useState<MetricsPreference>('auto');
  const hasLiveMetrics = Boolean(liveMetrics);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    getFocusable()[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  const model = useMemo(
    () =>
      resolveMetricsDisplay({
        live: liveMetrics,
        session: sessionData,
        preference: hasLiveMetrics ? preference : 'cumulative',
        locked: !hasLiveMetrics,
      }),
    [liveMetrics, sessionData, preference, hasLiveMetrics],
  );

  const eyebrow = hasLiveMetrics ? null : 'practice record';
  const title = hasLiveMetrics ? getMetricsSheetTitle(model, { hasLiveMetrics }) : 'Your stats';
  const subtitle = hasLiveMetrics
    ? title === 'Test Complete'
      ? `${model.wpm} wpm · ${model.accuracy}% accuracy`
      : model.statsTitle
    : model.statsTitle;
  const actionLabel = hasLiveMetrics ? getMetricsSheetActionLabel(model) : null;
  const isRestartAction = actionLabel === 'Restart';

  const closedX = reduceMotion ? '0%' : '100%';

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          key="metrics-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={hasLiveMetrics ? 'Test results' : 'Your stats'}
          initial={{ opacity: reduceMotion ? 0 : 1, transform: `translateX(${closedX})` }}
          animate={{ opacity: 1, transform: 'translateX(0%)' }}
          exit={{ opacity: reduceMotion ? 0 : 1, transform: `translateX(${closedX})` }}
          transition={{
            duration: reduceMotion ? 0.15 : motionTokens.durationModal,
            ease: reduceMotion ? motionTokens.easeOut : [0.4, 0, 0.2, 1],
          }}
          className={cn('fixed inset-0 z-30 flex h-dvh w-screen flex-col bg-card', className)}
        >
          <div className="flex w-full flex-1 flex-col overflow-y-auto p-4 sm:p-6">
            <div
              className={cn(
                'mx-auto my-auto flex w-full flex-col',
                hasLiveMetrics ? width.panel : 'max-w-6xl',
              )}
            >
              <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
                <div className="min-w-0">
                  {eyebrow ? (
                    <p className="typing-face text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                      {eyebrow}
                    </p>
                  ) : null}
                  <h2
                    className={cn(
                      'mt-1 font-semibold leading-tight tracking-tight',
                      hasLiveMetrics ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl',
                    )}
                  >
                    {title}
                  </h2>
                  {subtitle ? (
                    <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
                  ) : null}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label={hasLiveMetrics ? 'Close' : 'Hide stats'}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {model.canToggle ? (
                <div className="mb-8 flex justify-center">
                  <ViewToggle
                    showCumulative={model.showingCumulative}
                    onToggle={(showCumulative) =>
                      setPreference(showCumulative ? 'cumulative' : 'live')
                    }
                    totalTests={model.totalTests}
                  />
                </div>
              ) : null}

              <MetricsDisplay model={model} compact={hasLiveMetrics} />
            </div>
          </div>

          {onRestart && actionLabel ? (
            <div className="shrink-0 p-4 sm:px-6">
              <div className={cn('mx-auto flex w-full justify-end gap-3', width.panel)}>
                {isRestartAction ? (
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                ) : null}
                <Button onClick={isRestartAction ? onRestart : onClose} className="min-w-28">
                  {actionLabel}
                </Button>
              </div>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MetricsSheet;
