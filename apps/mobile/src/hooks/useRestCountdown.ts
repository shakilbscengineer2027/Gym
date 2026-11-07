import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export interface UseRestCountdownReturn {
  secondsRemaining: number;
  isActive: boolean;
  startCountdown: (durationSeconds: number) => void;
  stopCountdown: () => void;
  addSeconds: (extra: number) => void;
}

export function useRestCountdown(onComplete?: () => void): UseRestCountdownReturn {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<any>(null);

  const triggerHaptic = (type: 'tick' | 'done') => {
    if (Platform.OS === 'web') return;
    try {
      if (type === 'done') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // Haptics not available on current target
    }
  };

  useEffect(() => {
    if (isActive && secondsRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            triggerHaptic('done');
            if (onComplete) onComplete();
            return 0;
          }
          if (prev <= 4) {
            triggerHaptic('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, secondsRemaining, onComplete]);

  const startCountdown = useCallback((duration: number) => {
    setSecondsRemaining(duration);
    setIsActive(true);
  }, []);

  const stopCountdown = useCallback(() => {
    setIsActive(false);
    setSecondsRemaining(0);
  }, []);

  const addSeconds = useCallback((extra: number) => {
    setSecondsRemaining((prev) => Math.max(0, prev + extra));
  }, []);

  return {
    secondsRemaining,
    isActive,
    startCountdown,
    stopCountdown,
    addSeconds,
  };
}
