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
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { themeColors } from '@/lib/utils';
import { layoutClasses } from '@/lib/layout-utils';

interface RadialChartProps {
  title?: string;
  description?: string;
  value?: number;
  maxValue?: number;
  chartConfig?: ChartConfig;
  feedbackThresholds?: { [key: string]: number };
  feedbackMessages?: { [key: string]: string };
  averageInfo?: string;
  dataKey?: string;
  fillColor?: string;
  showPercentage?: boolean;
  className?: string;
}

const RadialChart: React.FC<RadialChartProps> = ({
  title,
  description,
  value = 0,
  maxValue = 100,
  chartConfig = {
    value: { label: 'value' },
    safari: { label: 'Safari', color: 'hsl(var(--chart-2))' },
  },
  feedbackThresholds = { excellent: 92, average: 90 },
  feedbackMessages = {
    excellent: 'Excellent! Your accuracy is top-notch.',
    average: "Keep practicing! You're close to average.",
    belowAverage: 'Focus on accuracy. Reduce those errors.',
  },
  averageInfo = 'The average typing accuracy for humans is around 92%.',
  dataKey = 'value',
  fillColor = themeColors.good,
  showPercentage = false,
  className = '',
}) => {
  const chartData = [{ [dataKey]: value, fill: fillColor }];

  function getFeedbackMessage(value: number) {
    if (value > feedbackThresholds.excellent) {
      return feedbackMessages.excellent;
    } else if (
      value <= feedbackThresholds.excellent &&
      value > feedbackThresholds.average
    ) {
      return feedbackMessages.average;
    } else {
      return feedbackMessages.belowAverage;
    }
  }

  return (
    <Card className={`flex flex-col shadow-md shadow-gray-500/20 ${className}`}>
      <CardHeader className='items-center pb-0'>
        {title && <CardTitle>{title.toUpperCase()}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[150px]'
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
            <RadialBar dataKey={dataKey} background cornerRadius={5} />
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
                          {showPercentage && '%'}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-xs'>
        <div
          className={`${layoutClasses.flexStart} ${layoutClasses.gap2} font-medium`}
        >
          {getFeedbackMessage(value)}
        </div>
        <div className='text-muted-foreground'>{averageInfo}</div>
      </CardFooter>
    </Card>
  );
};

export default RadialChart;
