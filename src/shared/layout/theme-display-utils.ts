/**
 * Shared utilities for theme-related display patterns
 */

import { themeColorClasses } from '@/shared/lib/theme';
import { size } from '@/shared/lib/tokens';
import { layoutClasses } from '@/shared/layout/layout-utils';

export const getLegendItemClasses = (sizeVariant: 'small' | 'medium' = 'small') => ({
  container: layoutClasses.flexStart,
  icon: sizeVariant === 'small' ? size.iconSm : size.icon,
  spacing: sizeVariant === 'small' ? 'mr-1' : 'mr-2',
});

export const accuracyLegendData = {
  correct: {
    colorClass: themeColorClasses.successBg,
    label: 'Correct',
    size: 'small' as const,
  },
  incorrect: {
    colorClass: themeColorClasses.dangerBg,
    label: 'Incorrect',
    size: 'small' as const,
  },
  aboveAverage: {
    colorClass: themeColorClasses.successBg,
    label: 'Above Average',
    size: 'medium' as const,
  },
  nearAverage: {
    colorClass: themeColorClasses.warningBg,
    label: 'Near Average',
    size: 'medium' as const,
  },
  belowAverage: {
    colorClass: themeColorClasses.dangerBg,
    label: 'Below Average',
    size: 'medium' as const,
  },
};

export const getAccuracyColorClass = (isCorrect: boolean): string => {
  return isCorrect
    ? themeColorClasses.successBg
    : themeColorClasses.dangerBg;
};

export const getLetterAccuracyColorClass = (
  correct: number,
  total: number,
  overallAccuracy: number,
): string => {
  if (total === 0) return 'bg-muted text-muted-foreground';

  const accuracy = (correct / total) * 100;

  if (accuracy > overallAccuracy + 5) {
    return themeColorClasses.successBg;
  }
  if (accuracy < overallAccuracy - 5) {
    return themeColorClasses.dangerBg;
  }
  return themeColorClasses.warningBg;
};

export const getTimerWarningClass = (isNearExpiry: boolean): string => {
  return isNearExpiry ? themeColorClasses.warning : '';
};
