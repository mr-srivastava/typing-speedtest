import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';
import { wpmHistoryChartConfig } from '@/shared/lib/chart-config';
import type { WpmSeriesPoint } from '@/modules/typing-test/replay';
import { cn } from '@/shared/lib/cn';

interface WpmHistoryChartProps {
  data: WpmSeriesPoint[];
  /** Tighter layout for modals, matching RadialChart's compact mode. */
  compact?: boolean;
  className?: string;
}

const WpmHistoryChart: React.FC<WpmHistoryChartProps> = ({
  data,
  compact = false,
  className = '',
}) => {
  return (
    <Card className={cn('border-border/60 shadow-none', compact && 'bg-transparent', className)}>
      <CardHeader className={cn('items-center', compact ? 'pb-0 pt-3' : 'pb-0')}>
        <CardTitle className={cn(compact && 'text-sm font-medium')}>Speed over time</CardTitle>
      </CardHeader>
      <CardContent className={cn(compact ? 'pt-2 pb-3' : 'pt-4 pb-4')}>
        <ChartContainer
          config={wpmHistoryChartConfig}
          className={cn('w-full', compact ? 'h-[140px]' : 'h-[220px]')}
        >
          <LineChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WpmHistoryChart;
