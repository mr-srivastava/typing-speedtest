import React, { useMemo, useCallback } from 'react';
import RadialChart from '@/components/organisms/RadialChart';
import LetterAccuracyChart from '@/components/organisms/LetterAccuracyChart';
import {
  LiveTestMetrics,
  EnhancedStoredData,
} from '@/types/metrics';
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
} from '@/lib/metrics-utils';
import { wpmChartConfig, accuracyChartConfig, cn } from '@/lib/utils';

const EMPTY_LIVE_METRICS: LiveTestMetrics = {
  correctWordCount: 0,
  totalWordCount: 0,
  timerRemaining: 0,
  timerDuration: 60,
  letterAccuracy: {},
};

interface MetricsDisplayProps {
  liveMetrics?: LiveTestMetrics;
  sessionData?: EnhancedStoredData | null;
  showCumulative?: boolean;
  showOverallStats?: boolean;
  className?: string;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  liveMetrics = EMPTY_LIVE_METRICS,
  sessionData,
  showCumulative = false,
  showOverallStats = false,
  className = '',
}) => {
  const {
    correctWordCount,
    totalWordCount,
    timerRemaining,
    timerDuration,
    letterAccuracy,
  } = liveMetrics;

  const wpm = useMemo(
    () =>
      getWpmValue(
        correctWordCount,
        timerRemaining,
        sessionData,
        showCumulative,
        timerDuration,
      ),
    [
      correctWordCount,
      timerRemaining,
      sessionData,
      showCumulative,
      timerDuration,
    ],
  );

  const accuracy = useMemo(
    () =>
      getAccuracyValue(
        correctWordCount,
        totalWordCount,
        sessionData,
        showCumulative,
      ),
    [correctWordCount, totalWordCount, sessionData, showCumulative],
  );

  const displayLetterAccuracy = useMemo(
    () => getLetterAccuracyData(letterAccuracy, sessionData, showCumulative),
    [letterAccuracy, sessionData, showCumulative],
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
    () => generateStatsTitle(sessionData, showCumulative),
    [sessionData, showCumulative],
  );

  const overallMetrics = useMemo(() => {
    if (!showOverallStats || !sessionData) return null;

    return {
      wpm: sessionData.cumulative.weightedWPM,
      accuracy: sessionData.cumulative.weightedAccuracy,
      totalTests: sessionData.cumulative.totalTests,
      totalTimeSpent: sessionData.cumulative.totalTimeSpent,
      firstTestDate: sessionData.cumulative.firstTestDate,
    };
  }, [showOverallStats, sessionData]);

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

      {statsTitle ? (
        <div className='text-sm text-muted-foreground mb-4'>{statsTitle}</div>
      ) : null}

      <div className={layoutClasses.responsiveFlex}>
        {renderRadialChart(wpm, 'Words per minute', wpmChartConfig)}
        {renderRadialChart(accuracy, 'Accuracy', accuracyChartConfig)}
      </div>

      <div className='mt-6'>
        <LetterAccuracyChart letterAccuracyData={displayLetterAccuracy} />
      </div>
    </div>
  );
};

export default MetricsDisplay;
