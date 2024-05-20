import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MIN_IN_SEC = 60;

interface IClockProps {
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
  started: boolean;
  finished: boolean;
  handleTimerExpiry: () => void;
}

const Clock = (props: IClockProps) => {
  const { timer, setTimer } = props;
  const [isNearExpiry, setIsNearExpiry] = useState<boolean>(false);
  useEffect(() => {
    if (timer === 0) {
      props.handleTimerExpiry();
    }
    if (timer < 60 && !props.started) {
      setTimer(60);
      setIsNearExpiry(false);
    }
    const intervalId = setInterval(() => {
      if (!props.finished) {
        if (timer > 0 && props.started) {
          if (timer !== 60 && timer % MIN_IN_SEC <= 10) {
            setIsNearExpiry(true);
          }
          setTimer((t: number) => t - 1);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.finished, props.started, timer]);

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
    <div className="w-full px-3 py-3 text-right">
      <span className={cn(`text-3xl ${isNearExpiry ? "text-red-500" : ""}`)}>
        {getTime()}
      </span>
    </div>
  );
};

export default Clock;
