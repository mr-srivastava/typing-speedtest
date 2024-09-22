import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const MIN_IN_SEC = 60;

interface IClockProps {
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
  started: boolean;
  finished: boolean;
  handleTimerExpiry: () => void;
  timerDuration?: number;
}

const Clock = (props: IClockProps) => {
  const { timer, setTimer, timerDuration = 60 } = props;
  const [isNearExpiry, setIsNearExpiry] = useState<boolean>(false);
  useEffect(() => {
    if (timer === 0) {
      props.handleTimerExpiry();
    }
    if (timer < timerDuration && !props.started) {
      setTimer(timerDuration);
      setIsNearExpiry(false);
    }
    const intervalId = setInterval(() => {
      if (!props.finished) {
        if (timer > 0 && props.started) {
          if (timer !== timerDuration && timer % MIN_IN_SEC <= 10) {
            setIsNearExpiry(true);
          }
          setTimer((t: number) => t - 1);
        } else if (timer === timerDuration) {
          // Reset isNearExpiry when restarted
          setIsNearExpiry(false);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.finished, props.started, timer, timerDuration]);

  function formatNumberWithTwoDigit(num: number) {
    return num.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  }

  function getTime() {
    const minutes = formatNumberWithTwoDigit(Math.floor(timer / MIN_IN_SEC));
    const seconds = formatNumberWithTwoDigit(timer % MIN_IN_SEC);
    return `${minutes}:${seconds}`;
  }

  return (
    <div className="w-full px-3 py-3 text-right cursor-default">
      <span
        className={cn(
          `text-3xl ${isNearExpiry ? "text-red-500" : ""}`,
          orbitron.className
        )}
      >
        {getTime()}
      </span>
    </div>
  );
};

export default Clock;
