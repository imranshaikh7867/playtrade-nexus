import { useState, useEffect, useCallback } from "react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isExpired: boolean;
}

export function useAuctionTimer(endDate: Date | undefined): TimeRemaining {
  const calculateTimeRemaining = useCallback((): TimeRemaining => {
    if (!endDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isExpired: true };
    }

    const total = endDate.getTime() - Date.now();
    
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isExpired: true };
    }

    return {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / 1000 / 60) % 60),
      seconds: Math.floor((total / 1000) % 60),
      total,
      isExpired: false,
    };
  }, [endDate]);

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeRemaining]);

  return timeRemaining;
}
