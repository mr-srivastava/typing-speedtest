import React, { useMemo, useCallback } from 'react';
import RadialChart from '@/components/organisms/RadialChart';
import LetterAccuracyChart from '@/components/organisms/LetterAccuracyChart';
import { LetterMetrics, EnhancedStoredData } from '@/types/metrics';
import {
  getOverallMetricsClasses,
  getFormattedMetricsData,
} from '@/lib/metrics-display-utils';
import MetricGroup from '@/components/molecules/MetricGroup';
import { layoutClasses } from '@/lib/layout-utils';
import {
  getWpmValue,
  getAccuracyValue,
  getLetterAccuracyData,
  generateStatsTitle,
  wpmChartConfig,
  accuracyChartConfig,
} from '@/lib/utils';

interface MetricsDisplayProps {
  correctWordCount: number;
  totalWordCount: number;
  timer: number;
  timerDuration?: number;
  letterAccuracyData: Record<string, LetterMetrics>;
  data?: EnhancedStoredData | null;
  showCumulative?: boolean;
  showOverallStats?: boolean;
  className?: string;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  correctWordCount,
  totalWordCount,
  timer,
  timerDuration = 60,
  letterAccuracyData,
  data,
  showCumulative = false,
  showOverallStats = false,
  className = '',
}) => {
  const wpm = useMemo(
    () =>
      getWpmValue(correctWordCount, timer, data, showCumulative, timerDuration),
    [correctWordCount, timer, data, showCumulative, timerDuration],
  );

  const accuracy = useMemo(
    () =>
      getAccuracyValue(correctWordCount, totalWordCount, data, showCumulative),
    [correctWordCount, totalWordCount, data, showCumulative],
  );

  const displayLetterAccuracy = useMemo(
    () => getLetterAccuracyData(letterAccuracyData, data, showCumulative),
    [letterAccuracyData, data, showCumulative],
  );

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

  const statsTitle = useMemo(
    () => generateStatsTitle(data, showCumulative),
    [data, showCumulative],
  );

  // Overall stats metrics for display
  const overallMetrics = useMemo(() => {
    if (!showOverallStats || !data) return null;

    return {
      wpm: data.cumulative.weightedWPM,
      accuracy: data.cumulative.weightedAccuracy,
      totalTests: data.cumulative.totalTests,
      totalTimeSpent: data.cumulative.totalTimeSpent,
      firstTestDate: data.cumulative.firstTestDate,
    };
  }, [showOverallStats, data]);

  return (
    <div className={`w-full text-center space-y-4 ${className}`}>
      {/* Overall Stats Header */}
      {overallMetrics && (
        <div className={`${getOverallMetricsClasses().container} mb-6`}>
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
      )}

      {/* Session Stats Title */}
      {statsTitle && (
        <div className='text-sm text-muted-foreground mb-4'>{statsTitle}</div>
      )}

      {/* Main Metrics Charts */}
      <div className={layoutClasses.responsiveFlex}>
        {renderRadialChart(wpm, 'Words per minute', wpmChartConfig)}
        {renderRadialChart(accuracy, 'Accuracy', accuracyChartConfig)}
      </div>

      {/* Letter Accuracy Details */}
      <div className='mt-6'>
        <LetterAccuracyChart letterAccuracyData={displayLetterAccuracy} />
      </div>
    </div>
  );
};

export default MetricsDisplay;
