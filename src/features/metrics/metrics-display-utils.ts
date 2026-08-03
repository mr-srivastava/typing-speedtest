/**
 * Shared utilities for metrics display patterns
 */

import type { CumulativeStats } from '@/modules/session/types';
import { layoutClasses, textClasses } from '@/shared/layout/layout-utils';
import { formatTimeSpent, formatDateRange } from '@/shared/lib/format';

export interface OverallMetricsData {
  wpm: number;
  accuracy: number;
  totalTests: number;
  totalTimeSpent: number;
  firstTestDate: string;
}

export function toOverallMetricsData(
  cumulative: CumulativeStats,
): OverallMetricsData {
  return {
    wpm: cumulative.weightedWPM,
    accuracy: cumulative.weightedAccuracy,
    totalTests: cumulative.totalTests,
    totalTimeSpent: cumulative.totalTimeSpent,
    firstTestDate: cumulative.firstTestDate,
  };
}

/**
 * Get class names for overall metrics display pattern
 */
export const getOverallMetricsClasses = () => ({
  container: `${layoutClasses.flexCenterCol} gap-2 sm:gap-3`,
  statsRow: `${layoutClasses.responsiveFlexCol} ${textClasses.smallResponsive}`,
  detailsRow: `${layoutClasses.responsiveFlexCol} ${textClasses.mutedSubtle}`,
});

/**
 * Get formatted metrics data for display
 */
export const getFormattedMetricsData = (metrics: OverallMetricsData) => ({
  primaryMetrics: [
    { value: `${metrics.wpm} WPM avg`, variant: 'success' as const },
    { value: `${metrics.accuracy}% accuracy`, variant: 'muted' as const },
  ],
  detailMetrics: [
    {
      value: `${metrics.totalTests} test${metrics.totalTests !== 1 ? 's' : ''}`,
    },
    {
      value: `${formatTimeSpent(metrics.totalTimeSpent)} practiced`,
    },
    {
      value: formatDateRange(metrics.firstTestDate),
    },
  ],
});

/**
 * Get class names for feature list display pattern
 */
export const getFeatureListClasses = () => ({
  container: `flex flex-wrap justify-center gap-3 sm:gap-4 ${textClasses.smallResponsive} px-4 sm:px-0`,
  item: 'flex items-center gap-2 text-muted-foreground/70',
  bullet: 'w-2 h-2 rounded-full bg-muted-foreground/30',
});
