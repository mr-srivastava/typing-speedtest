import { CartesianGrid, Line, LineChart, ReferenceDot, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';
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
  return (
    <Card className={cn('border-0 bg-transparent shadow-none', className)}>
      <CardHeader className={cn('items-center', compact ? 'pb-0 pt-3' : 'pb-0')}>
        <CardTitle className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Speed over time
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(compact ? 'pt-2 pb-3' : 'pt-4 pb-4')}>
        <ChartContainer
          config={wpmHistoryChartConfig}
          className={cn('w-full', compact ? 'h-[140px]' : 'h-[220px]')}
        >
          <LineChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="2 5" />
            <XAxis
              dataKey="second"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}s`}
            />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line
              type="monotone"
              dataKey="wpm"
              stroke="var(--color-wpm)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="rawWpm"
              stroke="var(--color-rawWpm)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            {(
              correctionClusters ??
              paceBuckets
                ?.filter((bucket) => bucket.backspaces >= 2)
                .map((bucket) => ({
                  startSecond: bucket.second,
                  endSecond: bucket.second,
                  count: bucket.backspaces,
                }))
            )?.map((cluster) => (
              <ReferenceDot
                key={`${cluster.startSecond}-${cluster.endSecond}`}
                x={cluster.startSecond}
                y={data.find((point) => point.second === cluster.startSecond)?.rawWpm ?? 0}
                r={3}
                fill="hsl(var(--destructive))"
                stroke="none"
                aria-label={`${cluster.count} corrections from ${cluster.startSecond} to ${cluster.endSecond} seconds`}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      {correctionClusters && correctionClusters.length > 0 ? (
        <ul className="sr-only" aria-label="Correction clusters">
          {correctionClusters.map((cluster) => (
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
