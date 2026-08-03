import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  duration?: number;
  onExpiry?: () => void;
}

interface UseTimerReturn {
  timer: number;
  setTimer: (value: number | ((prev: number) => number)) => void;
  isNearExpiry: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  isRunning: boolean;
  formatTime: () => string;
}

export function useTimer({
  duration = 60,
  onExpiry,
}: UseTimerOptions = {}): UseTimerReturn {
  const [timer, setTimer] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const isNearExpiry = isRunning && timer > 0 && timer <= 10;

  const onExpiryRef = useRef(onExpiry);
  const durationRef = useRef(duration);

  useEffect(() => {
    onExpiryRef.current = onExpiry;
  }, [onExpiry]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimer(duration);
  }, [duration]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(timer / 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const seconds = (timer % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    return `${minutes}:${seconds}`;
  }, [timer]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setIsRunning(false);
          onExpiryRef.current?.();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  return {
    timer,
    setTimer,
    isNearExpiry,
    start,
    stop,
    reset,
    isRunning,
    formatTime,
  };
}
