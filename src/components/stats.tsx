import React, { useMemo } from "react";
import StatsCard from "./stats-card";

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

      <div className="flex flex-col w-full justify-between items-center space-y-4 sm:flex-row">
        <StatsCard stat={wpm} statLabel={"words per minute"} />
        <StatsCard stat={`${accuracy}%`} statLabel={"accuracy"} />
      </div>
    </div>
  );
};

export default TypingStats;
