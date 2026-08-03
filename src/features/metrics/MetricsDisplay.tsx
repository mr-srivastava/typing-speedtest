import React from 'react';
import RadialChart from '@/features/metrics/RadialChart';
import LetterAccuracyChart from '@/features/metrics/LetterAccuracyChart';
import OverallStatsBlock from '@/features/metrics/OverallStatsBlock';
import { type OverallMetricsData } from '@/features/metrics/metrics-display-utils';
import { layoutClasses, textClasses } from '@/shared/layout/layout-utils';
import type { MetricsDisplayModel } from '@/modules/metrics';
import { cn } from '@/shared/lib/cn';
import { wpmChartConfig, accuracyChartConfig } from '@/shared/lib/chart-config';

interface MetricsDisplayProps {
  model: MetricsDisplayModel;
  overallMetrics?: OverallMetricsData | null;
  /** Compact charts for modal results */
  compact?: boolean;
  className?: string;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  model,
  overallMetrics = null,
  compact = false,
  className = '',
}) => {
  return (
    <div className={cn('w-full text-center space-y-5', className)}>
      {overallMetrics ? (
        <OverallStatsBlock metrics={overallMetrics} className='mb-2' />
      ) : null}

      {model.statsTitle && !compact ? (
        <div className={cn(textClasses.mutedSmall)}>{model.statsTitle}</div>
      ) : null}

      <div className={layoutClasses.responsiveFlex}>
        <div className='w-full max-w-[280px]'>
          <RadialChart
            value={model.wpm}
            maxValue={wpmChartConfig.value}
            title='Words per minute'
            showPercentage={wpmChartConfig.showPercentage}
            feedbackThresholds={wpmChartConfig.feedbackThresholds}
            feedbackMessages={wpmChartConfig.feedbackMessages}
            averageInfo={wpmChartConfig.averageInfo}
            fillColor={wpmChartConfig.fillColor}
            compact={compact}
          />
        </div>
        <div className='w-full max-w-[280px]'>
          <RadialChart
            value={model.accuracy}
            maxValue={accuracyChartConfig.value}
            title='Accuracy'
            showPercentage={accuracyChartConfig.showPercentage}
            feedbackThresholds={accuracyChartConfig.feedbackThresholds}
            feedbackMessages={accuracyChartConfig.feedbackMessages}
            averageInfo={accuracyChartConfig.averageInfo}
            fillColor={accuracyChartConfig.fillColor}
            compact={compact}
          />
        </div>
      </div>

      <div className='border-t border-border/60 pt-4'>
        <LetterAccuracyChart
          key={model.view.scope}
          letterAccuracyData={model.letterAccuracy}
        />
      </div>
    </div>
  );
};

export default MetricsDisplay;
