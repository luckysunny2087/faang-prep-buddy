import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInterviewTimerProps {
  durationMinutes: number | null | undefined;
  onTimeUp?: () => void;
  autoStart?: boolean;
}

interface UseInterviewTimerReturn {
  timeRemaining: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  isTimeUp: boolean;
  formattedTime: string;
  percentageRemaining: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export function useInterviewTimer({
  durationMinutes,
  onTimeUp,
  autoStart = true,
}: UseInterviewTimerProps): UseInterviewTimerReturn {
  const totalSeconds = durationMinutes ? durationMinutes * 60 : 0;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Auto-start timer when component mounts if duration is set
  useEffect(() => {
    if (durationMinutes && autoStart && !isRunning && !isPaused) {
      setIsRunning(true);
    }
  }, [durationMinutes, autoStart, isRunning, isPaused]);

  // Timer tick
  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimeUp(true);
            setIsRunning(false);
            onTimeUpRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeRemaining]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setTimeRemaining(totalSeconds);
    setIsRunning(false);
    setIsPaused(false);
    setIsTimeUp(false);
  }, [totalSeconds]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentageRemaining = totalSeconds > 0 ? (timeRemaining / totalSeconds) * 100 : 100;

  return {
    timeRemaining,
    isRunning,
    isPaused,
    isTimeUp,
    formattedTime: formatTime(timeRemaining),
    percentageRemaining,
    start,
    pause,
    resume,
    reset,
  };
}
