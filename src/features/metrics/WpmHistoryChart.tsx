import { useMemo } from 'react';
import { defineChart, dot, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { Chart } from '@tanstack/charts/react';
import { tooltip } from '@tanstack/charts/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { wpmHistoryChartConfig } from '@/shared/lib/chart-config';
import type { WpmSeriesPoint } from '@/modules/typing-test';
import type { CorrectionCluster, PaceBucket } from '@/modules/session/types';
import { cn } from '@/shared/lib/cn';

interface WpmHistoryChartProps {
  data: WpmSeriesPoint[];
  /** Tighter layout for modal results. */
  compact?: boolean;
  paceBuckets?: PaceBucket[];
  correctionClusters?: CorrectionCluster[];
  className?: string;
}

const WpmHistoryChart: React.FC<WpmHistoryChartProps> = ({
  data,
  compact = false,
  paceBuckets,
  correctionClusters,
  className = '',
}) => {
  const clusters = useMemo(
    () =>
      correctionClusters ??
      paceBuckets
        ?.filter((bucket) => bucket.backspaces >= 2)
        .map((bucket) => ({
          startSecond: bucket.second,
          endSecond: bucket.second,
          count: bucket.backspaces,
        })),
    [correctionClusters, paceBuckets],
  );

  const clusterPoints = useMemo(
    () =>
      (clusters ?? []).map((cluster) => ({
        second: cluster.startSecond,
        rawWpm: data.find((point) => point.second === cluster.startSecond)?.rawWpm ?? 0,
        count: cluster.count,
        endSecond: cluster.endSecond,
      })),
    [clusters, data],
  );

  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          lineY(data, {
            id: wpmHistoryChartConfig.wpm.label,
            x: 'second',
            y: 'wpm',
            stroke: wpmHistoryChartConfig.wpm.color,
            strokeWidth: 2,
          }),
          lineY(data, {
            id: wpmHistoryChartConfig.rawWpm.label,
            x: 'second',
            y: 'rawWpm',
            stroke: wpmHistoryChartConfig.rawWpm.color,
            strokeWidth: 2,
            strokeDasharray: '4 4',
          }),
          dot(clusterPoints, {
            id: 'Corrections',
            x: 'second',
            y: 'rawWpm',
            r: 3,
            fill: 'hsl(var(--destructive))',
          }),
        ],
        scales: {
          x: {
            scale: scaleLinear,
            axis: { ticks: { format: (value) => `${value}s` } },
          },
          y: {
            scale: scaleLinear,
            grid: true,
          },
        },
        focus: 'group-x',
        tooltip,
      }),
    [data, clusterPoints],
  );

  return (
    <Card className={cn('border-0 bg-transparent shadow-none', className)}>
      <CardHeader className={cn('items-center', compact ? 'pb-0 pt-3' : 'pb-0')}>
        <CardTitle className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Speed over time
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(compact ? 'pt-2 pb-3' : 'pt-4 pb-4')}>
        <Chart
          definition={definition}
          ariaLabel="Speed over time"
          className={cn('w-full text-xs', compact ? 'h-[140px]' : 'h-[220px]')}
        />
      </CardContent>
      {clusters && clusters.length > 0 ? (
        <ul className="sr-only" aria-label="Correction clusters">
          {clusters.map((cluster) => (
            <li key={`${cluster.startSecond}-${cluster.endSecond}`}>
              {cluster.count} corrections from {cluster.startSecond} to {cluster.endSecond} seconds
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
};

export default WpmHistoryChart;
