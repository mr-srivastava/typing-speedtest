import React, { useMemo } from "react";
import { RadialBarChartComponent } from "./radial-chart";

const AVG_WORD_LEN = 5;

interface ITypingStatsProps {
  correctWordCount: number;
  totalWordCount: number;
  timer: number;
}

const TypingStats = (props: ITypingStatsProps) => {
  const { correctWordCount, totalWordCount, timer } = props;

  const wpm = useMemo(
    () => Math.round(correctWordCount / (AVG_WORD_LEN * (1 - timer / 60))) || 0,
    [correctWordCount, timer]
  );

  const accuracy = useMemo(
    () => Math.round((correctWordCount / totalWordCount) * 100) || 0,
    [correctWordCount, totalWordCount]
  );
  return (
    <div className="w-full text-center space-y-4 my-10">
      <h2 className="font-bold text-xl">Results</h2>
      <div className="flex flex-col w-full justify-evenly items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="w-full max-w-[350px]">
          <RadialBarChartComponent
            value={wpm}
            maxValue={120}
            title="Words per minute"
            feedbackThresholds={{ excellent: 60, average: 40 }}
            feedbackMessages={{
              excellent: "Impressive speed! You're a typing wizard.",
              average: "Good pace! Keep practicing to improve.",
              belowAverage: "Focus on increasing your typing speed.",
            }}
            averageInfo="The average typing speed is around 40 WPM."
          />
        </div>
        <div className="w-full max-w-[350px]">
          <RadialBarChartComponent
            value={accuracy}
            title="Accuracy"
            showPercentage
            feedbackThresholds={{ excellent: 92, average: 90 }}
            feedbackMessages={{
              excellent: "Excellent! Your accuracy is top-notch.",
              average: "Keep practicing! You're close to average.",
              belowAverage: "Focus on accuracy. Reduce those errors.",
            }}
            averageInfo="The average typing accuracy for humans is around 92%."
          />
        </div>
      </div>
    </div>
  );
};

export default TypingStats;
