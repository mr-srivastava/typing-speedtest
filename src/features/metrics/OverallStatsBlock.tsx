import React from 'react';
import MetricGroup from '@/shared/ui/MetricGroup';
import {
  getOverallMetricsClasses,
  getFormattedMetricsData,
  type OverallMetricsData,
} from '@/features/metrics/metrics-display-utils';
import { cn } from '@/shared/lib/cn';

interface OverallStatsBlockProps {
  metrics: OverallMetricsData;
  className?: string;
}

const OverallStatsBlock: React.FC<OverallStatsBlockProps> = ({ metrics, className = '' }) => {
  const classes = getOverallMetricsClasses();
  const data = getFormattedMetricsData(metrics);

  return (
    <div className={cn(classes.container, className)}>
      <div className={classes.statsRow}>
        <span className="typing-face text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          overall
        </span>
        <MetricGroup metrics={data.primaryMetrics} />
      </div>
      <div className={classes.detailsRow}>
        <MetricGroup metrics={data.detailMetrics} className="flex-wrap justify-center" />
      </div>
    </div>
  );
};

export default OverallStatsBlock;
