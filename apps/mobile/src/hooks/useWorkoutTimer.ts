import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseWorkoutTimerReturn {
  elapsedSeconds: number;
  isRunning: boolean;
  formattedTime: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setElapsed: (secs: number) => void;
}

export function useWorkoutTimer(initialSeconds: number = 0, autoStart: boolean = false): UseWorkoutTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
  }, []);

  const setElapsed = useCallback((secs: number) => {
    setElapsedSeconds(secs);
  }, []);

  const formatDigits = (num: number) => num.toString().padStart(2, '0');
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const hours = Math.floor(mins / 60);
  const formattedTime =
    hours > 0
      ? `${formatDigits(hours)}:${formatDigits(mins % 60)}:${formatDigits(secs)}`
      : `${formatDigits(mins)}:${formatDigits(secs)}`;

  return {
    elapsedSeconds,
    isRunning,
    formattedTime,
    start,
    pause,
    reset,
    setElapsed,
  };
}
