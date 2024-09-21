import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
interface IStatsCardProps {
  stat: string | number;
  statLabel: string;
  description?: string;
}
const StatsCard = (props: IStatsCardProps) => {
  const { stat, statLabel, description } = props;
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-4xl">{stat}</CardTitle>
        <CardDescription>{statLabel}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default StatsCard;
