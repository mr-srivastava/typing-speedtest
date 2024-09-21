import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A radial chart with text";

const chartConfig = {
  value: {
    label: "value",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface IRadialChartProps {
  title?: string;
  description?: string;
  value?: number;
  maxValue?: number;
}

export const RadialBarChartComponent: React.FC<IRadialChartProps> = (props) => {
  const { title, description, value = 0, maxValue = 100 } = props;

  const chartData = [{ browser: "safari", value, fill: "var(--color-safari)" }];

  function getFeedbackMessage(value: number) {
    if (value > 92) {
      return "Excellent! Your accuracy is top-notch.";
    } else if (value <= 92 && value > 90) {
      return "Keep practicing! You're close to average.";
    } else {
      return "Focus on accuracy. Reduce those errors.";
    }
  }

  return (
    <Card className="flex flex-col shadow-md shadow-gray-500/20">
      <CardHeader className="items-center pb-0 ">
        {title && <CardTitle>{title.toUpperCase()}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(value / maxValue) * 360}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {value.toLocaleString()}%
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {getFeedbackMessage(value)}
        </div>
        <div className="leading-none text-muted-foreground">
          The average typing accuracy for humans is around 92%.
        </div>
      </CardFooter>
    </Card>
  );
};
