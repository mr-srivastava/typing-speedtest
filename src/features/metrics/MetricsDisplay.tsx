import React, { useCallback } from 'react';
import RadialChart from '@/features/metrics/RadialChart';
import LetterAccuracyChart from '@/features/metrics/LetterAccuracyChart';
import {
  getOverallMetricsClasses,
  getFormattedMetricsData,
  type OverallMetricsData,
} from '@/features/metrics/metrics-display-utils';
import MetricGroup from '@/shared/ui/MetricGroup';
import { layoutClasses } from '@/shared/layout/layout-utils';
import type { MetricsDisplayModel } from '@/modules/metrics';
import { cn } from '@/shared/lib/cn';
import { wpmChartConfig, accuracyChartConfig } from '@/shared/lib/chart-config';

interface MetricsDisplayProps {
  model: MetricsDisplayModel;
  overallMetrics?: OverallMetricsData | null;
  className?: string;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  model,
  overallMetrics = null,
  className = '',
}) => {
  const renderRadialChart = useCallback(
    (
      value: number,
      title: string,
      config: typeof wpmChartConfig | typeof accuracyChartConfig,
    ) => (
      <div className='w-full max-w-[350px]'>
        <RadialChart
          value={value}
          maxValue={config.value}
          title={title}
          showPercentage={config.showPercentage}
          feedbackThresholds={config.feedbackThresholds}
          feedbackMessages={config.feedbackMessages}
          averageInfo={config.averageInfo}
          fillColor={config.fillColor}
        />
      </div>
    ),
    [],
  );

  return (
    <div className={cn('w-full text-center space-y-4', className)}>
      {overallMetrics ? (
        <div className={cn(getOverallMetricsClasses().container, 'mb-6')}>
          <div className={getOverallMetricsClasses().statsRow}>
            <span className='text-muted-foreground'>Overall stats:</span>
            <MetricGroup
              metrics={getFormattedMetricsData(overallMetrics).primaryMetrics}
            />
          </div>
          <div className={getOverallMetricsClasses().detailsRow}>
            <MetricGroup
              metrics={getFormattedMetricsData(overallMetrics).detailMetrics}
              className='flex-wrap justify-center'
            />
          </div>
        </div>
      ) : null}

      {model.statsTitle ? (
        <div className='text-sm text-muted-foreground mb-4'>
          {model.statsTitle}
        </div>
      ) : null}

      <div className={layoutClasses.responsiveFlex}>
        {renderRadialChart(model.wpm, 'Words per minute', wpmChartConfig)}
        {renderRadialChart(model.accuracy, 'Accuracy', accuracyChartConfig)}
      </div>

      <div className='mt-6'>
        <LetterAccuracyChart letterAccuracyData={model.letterAccuracy} />
      </div>
    </div>
  );
};

export default MetricsDisplay;
