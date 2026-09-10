'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { LetterMetrics } from '@/modules/typing-test';
import type { KeyTelemetry } from '@/modules/session/types';
import { cn } from '@/shared/lib/cn';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { accuracyLegendData, getLegendItemClasses } from '@/shared/layout/theme-display-utils';
import { motion as motionTokens, size, space } from '@/shared/lib/tokens';

interface LetterAccuracyChartProps {
  letterAccuracyData: Record<string, LetterMetrics>;
  /** Bigger keys and spacing for spacious, full-screen layouts */
  large?: boolean;
  keyTelemetry?: Record<string, KeyTelemetry>;
  className?: string;
}

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

function formatAccuracy(correct: number, total: number): string {
  if (total <= 0) return '—';
  return `${((correct / total) * 100).toFixed(0)}%`;
}

const LetterAccuracyChart: React.FC<LetterAccuracyChartProps> = ({
  letterAccuracyData,
  large = false,
  keyTelemetry,
  className = '',
}) => {
  const reduceMotion = useReducedMotion();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const entranceEase = [0.4, 0, 0.2, 1] as const;

  const fadeTransition = (delay = 0) => ({
    duration: reduceMotion ? 0.15 : 0.25,
    delay: reduceMotion ? 0 : delay,
    ease: entranceEase,
  });

  const slideTransition = (delay = 0) => ({
    duration: reduceMotion ? 0.15 : 0.25,
    delay: reduceMotion ? 0 : delay,
    ease: entranceEase,
  });

  const slideInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(6px)' };

  const slideAnimate = reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'translateY(0px)' };

  /** A pinned key stays selected while hover offers a lightweight preview. */
  const activeLetter = selectedLetter ?? hoveredLetter;
  const activeMetrics = activeLetter
    ? letterAccuracyData[activeLetter] || { correct: 0, total: 0 }
    : null;

  const getAccuracyColor = (correct: number, total: number) => {
    if (total < 5) return 'bg-muted text-muted-foreground';
    const accuracy = (correct / total) * 100;
    if (accuracy >= 92) return 'bg-success/80 text-on-status';
    if (accuracy >= 80) return 'bg-warning text-on-status';
    return 'bg-destructive/80 text-on-status';
  };

  const handleSelectLetter = (letter: string) => {
    setHoveredLetter(null);
    setSelectedLetter((current) => (current === letter ? null : letter));
  };

  const renderKey = (letter: string) => {
    const metrics = letterAccuracyData[letter] || { correct: 0, total: 0 };
    const isSelected = selectedLetter === letter;
    const isHovered = hoveredLetter === letter && !isSelected;
    const accuracyLabel = formatAccuracy(metrics.correct, metrics.total);

    return (
      <button
        key={letter}
        type="button"
        aria-pressed={selectedLetter === letter}
        aria-label={`${letter.toUpperCase()}: ${metrics.correct} of ${metrics.total} correct, ${accuracyLabel}`}
        onClick={() => handleSelectLetter(letter)}
        onMouseEnter={() => setHoveredLetter(letter)}
        onMouseLeave={() => setHoveredLetter((current) => (current === letter ? null : current))}
        onFocus={() => setHoveredLetter(letter)}
        onBlur={() => setHoveredLetter((current) => (current === letter ? null : current))}
        className={cn(
          large ? size.keyLarge : size.key,
          'typing-face cursor-pointer font-semibold opacity-80',
          large ? 'text-sm' : 'text-xs',
          motionTokens.transitionUi,
          'fine-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          'rounded-sm',
          layoutClasses.flexCenter,
          getAccuracyColor(metrics.correct, metrics.total),
          isHovered && 'opacity-100 ring-1 ring-foreground/35 ring-offset-1 ring-offset-card',
          isSelected && 'opacity-100 ring-2 ring-foreground/70 ring-offset-2 ring-offset-card',
        )}
      >
        {letter.toUpperCase()}
      </button>
    );
  };

  const renderKeyboardRow = (row: string[], rowIndex: number) => (
    <motion.div
      key={rowIndex}
      className={cn(
        'flex justify-center',
        large ? space.loose : space.comfortable,
        rowIndex === 1 && 'translate-x-3',
        rowIndex === 2 && 'translate-x-6',
        'mb-3',
      )}
      initial={slideInitial}
      animate={slideAnimate}
      transition={slideTransition(0.04 * rowIndex)}
    >
      {row.map(renderKey)}
    </motion.div>
  );

  const hasActualData = useMemo(() => {
    if (!letterAccuracyData || Object.keys(letterAccuracyData).length === 0) {
      return false;
    }
    return Object.values(letterAccuracyData).some((metrics) => metrics.total > 0);
  }, [letterAccuracyData]);

  if (!hasActualData) {
    return (
      <div className={cn('mt-4 text-center', className)}>
        <motion.div
          className="text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={fadeTransition()}
        >
          No letter-level accuracy data available for this view.
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn('mt-4', className)}>
      <motion.div
        className="text-center mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={fadeTransition(0.08)}
      >
        <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Key accuracy
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Grey needs 5 presses · Hover to preview, click to pin
        </p>
      </motion.div>

      <motion.div
        className="mb-4 px-2 py-1"
        initial={slideInitial}
        animate={slideAnimate}
        transition={slideTransition(0.04)}
        onMouseLeave={() => setHoveredLetter(null)}
      >
        {keyboardLayout.map(renderKeyboardRow)}
      </motion.div>

      {/*
        Single in-flow detail strip — avoids Radix multi-open and modal overflow clipping.
        Absolute/portaled tooltips fight overflow-y-auto (which also forces x clipping).
      */}
      <div
        className={cn(
          `mb-4 mx-auto flex ${size.detailStrip} max-w-xs items-center justify-center px-4 py-3 text-center`,
          'rounded-sm',
          motionTokens.transitionColors,
          activeLetter ? 'bg-muted/40' : 'bg-transparent',
        )}
        aria-live={selectedLetter ? 'polite' : 'off'}
      >
        {activeLetter && activeMetrics ? (
          <div key={activeLetter}>
            <div className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {activeLetter.toUpperCase()} key {selectedLetter ? 'selected' : 'preview'}
            </div>
            <div className="mt-1 text-lg font-semibold tabular-nums">
              {activeMetrics.total > 0
                ? `${((activeMetrics.correct / activeMetrics.total) * 100).toFixed(1)}% accuracy`
                : 'No presses yet'}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {activeMetrics.correct} of {activeMetrics.total} correct
            </div>
            {keyTelemetry?.[activeLetter]?.errorPairs[0] ? (
              <div className="mt-1 text-xs text-muted-foreground">
                Most often: {activeLetter.toUpperCase()} →{' '}
                {keyTelemetry[activeLetter].errorPairs[0].typed.toUpperCase()} (
                {keyTelemetry[activeLetter].errorPairs[0].count}×)
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Hover a key to preview its accuracy</p>
        )}
      </div>

      <motion.div
        className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm"
        initial={slideInitial}
        animate={slideAnimate}
        transition={slideTransition(0.12)}
      >
        <div className={getLegendItemClasses('medium').container}>
          <div
            className={cn(
              getLegendItemClasses('medium').icon,
              'rounded-full',
              accuracyLegendData.aboveAverage.colorClass,
              getLegendItemClasses('medium').spacing,
            )}
          />
          <span>Solid</span>
        </div>
        <div className={getLegendItemClasses('medium').container}>
          <div
            className={cn(
              getLegendItemClasses('medium').icon,
              'rounded-full',
              accuracyLegendData.nearAverage.colorClass,
              getLegendItemClasses('medium').spacing,
            )}
          />
          <span>Inconsistent</span>
        </div>
        <div className={getLegendItemClasses('medium').container}>
          <div
            className={cn(
              getLegendItemClasses('medium').icon,
              'rounded-full',
              accuracyLegendData.belowAverage.colorClass,
              getLegendItemClasses('medium').spacing,
            )}
          />
          <span>Weak</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LetterAccuracyChart;
