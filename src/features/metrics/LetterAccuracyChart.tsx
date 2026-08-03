'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LetterMetrics } from '@/modules/session';
import { calculateOverallWeightedAccuracy } from '@/modules/metrics';
import { cn } from '@/shared/lib/cn';
import { layoutClasses, radiusClasses } from '@/shared/layout/layout-utils';
import {
  accuracyLegendData,
  getLegendItemClasses,
  getLetterAccuracyColorClass,
} from '@/shared/layout/theme-display-utils';

interface LetterAccuracyChartProps {
  letterAccuracyData: Record<string, LetterMetrics>;
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
  className = '',
}) => {
  const reduceMotion = useReducedMotion();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const entranceEase = [0.23, 1, 0.32, 1] as const;

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

  const slideInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: 'translateY(12px)' };

  const slideAnimate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, transform: 'translateY(0px)' };

  const overallWeightedAccuracy = useMemo(
    () => calculateOverallWeightedAccuracy(letterAccuracyData),
    [letterAccuracyData],
  );

  /** Pinned click wins over hover preview. */
  const activeLetter = selectedLetter ?? hoveredLetter;
  const activeMetrics = activeLetter
    ? letterAccuracyData[activeLetter] || { correct: 0, total: 0 }
    : null;

  const getAccuracyColor = (correct: number, total: number) => {
    return getLetterAccuracyColorClass(correct, total, overallWeightedAccuracy);
  };

  const handleSelectLetter = (letter: string) => {
    setHoveredLetter(null);
    setSelectedLetter((current) => (current === letter ? null : letter));
  };

  const renderKey = (letter: string) => {
    const metrics = letterAccuracyData[letter] || { correct: 0, total: 0 };
    const isActive = activeLetter === letter;
    const accuracyLabel = formatAccuracy(metrics.correct, metrics.total);

    return (
      <button
        key={letter}
        type='button'
        aria-pressed={selectedLetter === letter}
        aria-label={`${letter.toUpperCase()}: ${metrics.correct} of ${metrics.total} correct, ${accuracyLabel}`}
        onClick={() => handleSelectLetter(letter)}
        onMouseEnter={() => setHoveredLetter(letter)}
        onMouseLeave={() =>
          setHoveredLetter((current) => (current === letter ? null : current))
        }
        onFocus={() => setHoveredLetter(letter)}
        onBlur={() =>
          setHoveredLetter((current) => (current === letter ? null : current))
        }
        className={cn(
          'w-8 h-8 text-white font-bold cursor-pointer transition-[transform,box-shadow] duration-200 ease-out fine-hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          radiusClasses.control,
          layoutClasses.flexCenter,
          getAccuracyColor(metrics.correct, metrics.total),
          isActive &&
            'ring-2 ring-foreground/80 ring-offset-2 ring-offset-card',
        )}
      >
        {letter.toUpperCase()}
      </button>
    );
  };

  const renderKeyboardRow = (row: string[], rowIndex: number) => (
    <motion.div
      key={rowIndex}
      className='flex justify-center gap-1 mb-1'
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
    return Object.values(letterAccuracyData).some(
      (metrics) => metrics.total > 0,
    );
  }, [letterAccuracyData]);

  if (!hasActualData) {
    return (
      <div className={cn('mt-4 text-center', className)}>
        <motion.div
          className='text-muted-foreground text-sm'
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
        className='text-center mb-3'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={fadeTransition(0.08)}
      >
        <p className='text-sm font-medium text-foreground'>Key accuracy</p>
        <p className='text-xs text-muted-foreground mt-0.5'>
          Weighted average {overallWeightedAccuracy.toFixed(0)}% · Hover or tap
          a key for details
        </p>
      </motion.div>

      <motion.div
        className='mb-3'
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
          'mb-4 mx-auto flex min-h-[4.5rem] max-w-xs items-center justify-center border px-4 py-3 text-center',
          radiusClasses.surface,
          activeLetter
            ? 'border-border bg-muted/40'
            : 'border-dashed border-border/60 bg-transparent',
        )}
        role='status'
        aria-live='polite'
      >
        {activeLetter && activeMetrics ? (
          <div key={activeLetter}>
            <div className='text-lg font-semibold tracking-wide'>
              {activeLetter.toUpperCase()}
            </div>
            <div className='mt-1 text-sm text-foreground'>
              {activeMetrics.correct} / {activeMetrics.total} correct
            </div>
            <div className='mt-0.5 text-sm text-muted-foreground'>
              {activeMetrics.total > 0
                ? `${((activeMetrics.correct / activeMetrics.total) * 100).toFixed(1)}% accuracy`
                : 'No presses yet'}
            </div>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>
            Select a key to inspect accuracy
          </p>
        )}
      </div>

      <motion.div
        className='flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm'
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
          <span>{accuracyLegendData.aboveAverage.label}</span>
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
          <span>{accuracyLegendData.nearAverage.label}</span>
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
          <span>{accuracyLegendData.belowAverage.label}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LetterAccuracyChart;
