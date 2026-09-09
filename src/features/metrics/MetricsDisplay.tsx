import React from 'react';
import RadialChart from '@/features/metrics/RadialChart';
import WpmHistoryChart from '@/features/metrics/WpmHistoryChart';
import LetterAccuracyChart from '@/features/metrics/LetterAccuracyChart';
import OverallStatsBlock from '@/features/metrics/OverallStatsBlock';
import { type OverallMetricsData } from '@/features/metrics/metrics-display-utils';
import { layoutClasses, textClasses } from '@/shared/layout/layout-utils';
import { width as widthTokens } from '@/shared/lib/tokens';
import type { MetricsDisplayModel } from '@/modules/metrics/types';
import MetricGroup from '@/shared/ui/MetricGroup';
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
    <div className={cn('w-full text-center space-y-6', className)}>
      {overallMetrics ? <OverallStatsBlock metrics={overallMetrics} className="mb-2" /> : null}

      {model.statsTitle && !compact ? (
        <div className={cn(textClasses.mutedSmall)}>{model.statsTitle}</div>
      ) : null}

      <div className={layoutClasses.responsiveFlex}>
        <div className={cn('w-full', widthTokens.chart)}>
          <RadialChart
            value={model.wpm}
            title="Words per minute"
            caption={`Raw ${model.rawWpm}`}
            metricConfig={wpmChartConfig}
            compact={compact}
          />
        </div>
        <div className={cn('w-full', widthTokens.chart)}>
          <RadialChart
            value={model.accuracy}
            title="Accuracy"
            metricConfig={accuracyChartConfig}
            compact={compact}
          />
        </div>
      </div>

      {model.consistency !== undefined ? (
        <MetricGroup
          metrics={[{ value: `${model.consistency}%`, label: 'consistency', variant: 'muted' }]}
          className="justify-center"
        />
      ) : null}

      {model.wpmSeries && model.wpmSeries.length > 0 ? (
        <WpmHistoryChart data={model.wpmSeries} compact={compact} />
      ) : null}

      <div className="border-t border-border/60 pt-4">
        <LetterAccuracyChart key={model.view.scope} letterAccuracyData={model.letterAccuracy} />
      </div>
    </div>
  );
};

export default MetricsDisplay;
