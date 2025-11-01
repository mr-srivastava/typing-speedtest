'use client';
import React from 'react';
import MetricGroup from '@/components/molecules/MetricGroup';
import {
  getOverallMetricsClasses,
  getFormattedMetricsData,
  OverallMetricsData,
} from '@/lib/metrics-display-utils';

interface OverallMetricsDisplayProps {
  metrics: OverallMetricsData;
  className?: string;
}

const OverallMetricsDisplay: React.FC<OverallMetricsDisplayProps> = ({
  metrics,
  className = '',
}) => {
  const classes = getOverallMetricsClasses();
  const data = getFormattedMetricsData(metrics);

  return (
    <div className={`${classes.container} ${className}`}>
      <div className={classes.statsRow}>
        <span className='text-muted-foreground'>Overall stats:</span>
        <MetricGroup metrics={data.primaryMetrics} />
      </div>
      <div className={classes.detailsRow}>
        <MetricGroup
          metrics={data.detailMetrics}
          className='flex-wrap justify-center'
        />
      </div>
    </div>
  );
};

export default OverallMetricsDisplay;
