'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import MetricsDisplay from '@/features/metrics/MetricsDisplay';
import { resolveMetricsDisplay } from '@/modules/metrics/resolve-display';
import type { EnhancedStoredData } from '@/modules/session/types';
import { Button } from '@/shared/ui/button';
import { useOutsideClick } from '@/shared/hooks/useOutsideClick';
import { motion as motionTokens } from '@/shared/lib/tokens';
import { cn } from '@/shared/lib/cn';

interface StatsPanelProps {
  open: boolean;
  sessionData: EnhancedStoredData | null;
  onClose: () => void;
  className?: string;
}

/**
 * Floating overlay anchored under the "View Stats" toggle. Positioned absolutely so it never
 * displaces the test panel below it — closes on outside click or Escape, like a popover.
 */
const StatsPanel: React.FC<StatsPanelProps> = ({ open, sessionData, onClose, className = '' }) => {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(panelRef, () => {
    if (open) onClose();
  });

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const model = useMemo(
    () => resolveMetricsDisplay({ session: sessionData, preference: 'cumulative', locked: true }),
    [sessionData],
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          key="stats-panel"
          role="dialog"
          aria-label="Your stats"
          initial={{ opacity: 0, transform: 'translateY(-4px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          exit={{ opacity: 0, transform: 'translateY(-4px)' }}
          transition={{
            duration: reduceMotion ? 0.01 : motionTokens.durationUi,
            ease: motionTokens.easeOut,
          }}
          className={cn(
            'fixed right-4 top-[4.5rem] z-30 max-h-[75vh] w-[calc(100vw-2rem)] max-w-3xl overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-2xl shadow-black/10 sm:right-6 sm:top-24 sm:p-6',
            className,
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="typing-face text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                practice record
              </p>
              <h2 className="mt-1 text-lg font-semibold leading-tight tracking-tight sm:text-xl">
                Your stats
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Hide stats"
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <MetricsDisplay model={model} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default StatsPanel;
