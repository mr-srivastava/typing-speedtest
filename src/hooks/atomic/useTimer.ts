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
  const [isNearExpiry, setIsNearExpiry] = useState<boolean>(false);

  // Use refs to store callbacks and values to avoid them being dependencies
  const onExpiryRef = useRef(onExpiry);
  const durationRef = useRef(duration);

  // Update refs when values change
  useEffect(() => {
    onExpiryRef.current = onExpiry;
    durationRef.current = duration;
  }, [onExpiry, duration]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimer(duration);
    setIsNearExpiry(false);
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
          // Timer will reach 0, stop it and call onExpiry
          setIsRunning(false);
          onExpiryRef.current?.();
          return 0;
        }

        const newTimer = prevTimer - 1;

        // Check if near expiry (last 10 seconds of any minute)
        if (newTimer !== durationRef.current && newTimer % 60 <= 10) {
          setIsNearExpiry(true);
        }

        return newTimer;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  // Reset near expiry when timer is reset
  useEffect(() => {
    if (timer === duration) {
      setIsNearExpiry(false);
    }
  }, [timer, duration]);

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
