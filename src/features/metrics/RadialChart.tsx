import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { ChartConfig, ChartContainer } from '@/shared/ui/chart';
import { cn } from '@/shared/lib/cn';
import type { RadialMetricConfig } from '@/shared/lib/chart-config';
import { themeColors } from '@/shared/lib/theme';
import { layoutClasses } from '@/shared/layout/layout-utils';
import { size } from '@/shared/lib/tokens';

const rechartsConfig: ChartConfig = {
  value: { label: 'value' },
  safari: { label: 'Safari', color: themeColors.chart2 },
};

interface RadialChartProps {
  title?: string;
  description?: string;
  value?: number;
  metricConfig: RadialMetricConfig;
  /** Tighter layout for modals — one feedback line, no average blurb, lighter chrome */
  compact?: boolean;
  className?: string;
}

const RadialChart: React.FC<RadialChartProps> = ({
  title,
  description,
  value = 0,
  metricConfig,
  compact = false,
  className = '',
}) => {
  const {
    maxValue,
    showPercentage,
    feedbackThresholds,
    feedbackMessages,
    averageInfo,
    fillColor,
  } = metricConfig;
  const chartData = [{ value, fill: fillColor }];

  function getFeedbackMessage(current: number) {
    if (current > feedbackThresholds.excellent) {
      return feedbackMessages.excellent;
    }
    if (current > feedbackThresholds.average) {
      return feedbackMessages.average;
    }
    return feedbackMessages.belowAverage;
  }

  return (
    <Card
      className={cn(
        'flex flex-col border-border/60 shadow-none',
        compact && 'bg-transparent',
        className,
      )}
    >
      <CardHeader className={cn('items-center', compact ? 'pb-0 pt-3' : 'pb-0')}>
        {title ? (
          <CardTitle className={cn(compact && 'text-sm font-medium')}>
            {title}
          </CardTitle>
        ) : null}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={rechartsConfig}
          className={cn(
            'mx-auto aspect-square',
            compact ? size.chartCompact : size.chartDefault,
          )}
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(value / maxValue) * 360}
            innerRadius={40}
            outerRadius={55}
          >
            <PolarGrid
              gridType='circle'
              radialLines={false}
              stroke='none'
              className='first:fill-muted last:fill-background'
              polarRadius={[43, 37]}
            />
            <RadialBar dataKey='value' background cornerRadius={5} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-2xl font-bold'
                        >
                          {value.toLocaleString()}
                          {showPercentage ? '%' : ''}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter
        className={cn(
          'flex-col text-xs',
          compact ? 'gap-1 pt-1 pb-3' : 'gap-2',
        )}
      >
        <div
          className={cn(
            layoutClasses.flexStart,
            'gap-2',
            'font-medium text-center justify-center',
          )}
        >
          {getFeedbackMessage(value)}
        </div>
        {!compact && averageInfo ? (
          <div className='text-muted-foreground text-center'>{averageInfo}</div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default RadialChart;
