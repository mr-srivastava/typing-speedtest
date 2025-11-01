/**
 * Shared utilities for theme-related display patterns
 */

import { themeColorClasses } from '@/lib/utils';
import { layoutClasses } from '@/lib/layout-utils';

/**
 * Get legend item class names and data
 */
export const getLegendItemClasses = (size: 'small' | 'medium' = 'small') => ({
  container: layoutClasses.flexStart,
  icon: size === 'small' ? 'w-3 h-3' : 'w-4 h-4',
  spacing: size === 'small' ? 'mr-1' : 'mr-2',
});

/**
 * Common accuracy legend item data
 */
export const accuracyLegendData = {
  correct: {
    colorClass: themeColorClasses.goodBg,
    label: 'Correct',
    size: 'small' as const,
  },
  incorrect: {
    colorClass: themeColorClasses.needsImprovementBg,
    label: 'Incorrect',
    size: 'small' as const,
  },
  aboveAverage: {
    colorClass: themeColorClasses.goodBg,
    label: 'Above Average',
    size: 'medium' as const,
  },
  nearAverage: {
    colorClass: themeColorClasses.poorBg,
    label: 'Near Average',
    size: 'medium' as const,
  },
  belowAverage: {
    colorClass: themeColorClasses.needsImprovementBg,
    label: 'Below Average',
    size: 'medium' as const,
  },
};

/**
 * Get theme color class based on accuracy performance (simple boolean)
 */
export const getAccuracyColorClass = (isCorrect: boolean): string => {
  return isCorrect
    ? themeColorClasses.goodBg
    : themeColorClasses.needsImprovementBg;
};

/**
 * Get theme color class based on accuracy metrics (for letter accuracy)
 */
export const getLetterAccuracyColorClass = (
  correct: number,
  total: number,
  overallAccuracy: number,
): string => {
  if (total === 0) return 'bg-gray-200 dark:bg-gray-700';

  const accuracy = (correct / total) * 100;

  if (accuracy > overallAccuracy + 5) {
    return themeColorClasses.goodBg;
  } else if (accuracy < overallAccuracy - 5) {
    return themeColorClasses.needsImprovementBg;
  } else {
    return themeColorClasses.poorBg;
  }
};

/**
 * Get timer warning class based on expiry status
 */
export const getTimerWarningClass = (isNearExpiry: boolean): string => {
  return isNearExpiry ? themeColorClasses.warning : '';
};
