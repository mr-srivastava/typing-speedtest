import React, { useMemo, useCallback } from "react";
import { RadialBarChartComponent } from "./radial-chart";
import { LetterAccuracyMetrics } from "./letter-accuracy-metrics";

const AVG_WORD_LEN = 5;

interface LetterMetrics {
  correct: number;
  total: number;
}

interface ITypingStatsProps {
  correctWordCount: number;
  totalWordCount: number;
  timer: number;
  letterAccuracyData: Record<string, LetterMetrics>;
}

const TypingStats = React.memo((props: ITypingStatsProps) => {
  const { correctWordCount, totalWordCount, timer, letterAccuracyData } = props;

  const wpm = useMemo(
    () => Math.round(correctWordCount / (AVG_WORD_LEN * (1 - timer / 60))) || 0,
    [correctWordCount, timer]
  );

  const accuracy = useMemo(
    () => Math.round((correctWordCount / totalWordCount) * 100) || 0,
    [correctWordCount, totalWordCount]
  );

  const renderRadialChart = useCallback(
    (
      value: number,
      title: string,
      maxValue?: number,
      showPercentage?: boolean,
      feedbackThresholds?: any,
      feedbackMessages?: any,
      averageInfo?: string
    ) => (
      <div className="w-full max-w-[350px]">
        <RadialBarChartComponent
          value={value}
          maxValue={maxValue}
          title={title}
          showPercentage={showPercentage}
          feedbackThresholds={feedbackThresholds}
          feedbackMessages={feedbackMessages}
          averageInfo={averageInfo}
        />
      </div>
    ),
    []
  );

  return (
    <div className="w-full text-center space-y-2">
      <div className="flex flex-col w-full justify-evenly items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        {renderRadialChart(
          wpm,
          "Words per minute",
          120,
          false,
          { excellent: 60, average: 40 },
          {
            excellent: "Impressive speed! You're a typing wizard.",
            average: "Good pace! Keep practicing to improve.",
            belowAverage: "Focus on increasing your typing speed.",
          },
          "The average typing speed is around 40 WPM."
        )}
        {renderRadialChart(
          accuracy,
          "Accuracy",
          undefined,
          true,
          { excellent: 92, average: 90 },
          {
            excellent: "Excellent! Your accuracy is top-notch.",
            average: "Keep practicing! You're close to average.",
            belowAverage: "Focus on accuracy. Reduce those errors.",
          },
          "The average typing accuracy for humans is around 92%."
        )}
      </div>
      <div>
        <LetterAccuracyMetrics letterAccuracyData={letterAccuracyData} />
      </div>
    </div>
  );
});

TypingStats.displayName = "TypingStats";

export default TypingStats;
