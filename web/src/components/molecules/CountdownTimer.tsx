'use client';

import * as React from 'react';

import { CountdownDigit } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface CountdownTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Target launch date (defaults to 30 days from now) */
  targetDate?: Date | string;
  onExpire?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const difference = target.getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate, onExpire, className, ...props }: CountdownTimerProps) {
  // Default launch date is set 30 days into the future if not provided
  const target = React.useMemo(() => {
    if (targetDate) {
      return typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    }
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    return defaultDate;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft(target));

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(target);
      setTimeLeft(remaining);

      if (
        remaining.days === 0 &&
        remaining.hours === 0 &&
        remaining.minutes === 0 &&
        remaining.seconds === 0
      ) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [target, onExpire]);

  if (!mounted) {
    // Skeleton placeholder to prevent layout shift during SSR hydration
    return (
      <div className={cn('flex items-center justify-center gap-2 sm:gap-3', className)} {...props}>
        {['Hari', 'Jam', 'Menit', 'Detik'].map((lbl) => (
          <CountdownDigit key={lbl} value="--" label={lbl} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center justify-center gap-2 sm:gap-3 md:gap-4', className)}
      role="timer"
      aria-label="Peluncuran dalam"
      {...props}
    >
      <CountdownDigit value={timeLeft.days} label="Hari" />
      <span className="font-extrabold text-xl sm:text-2xl text-[#8BBCC5] animate-pulse">:</span>
      <CountdownDigit value={timeLeft.hours} label="Jam" />
      <span className="font-extrabold text-xl sm:text-2xl text-[#8BBCC5] animate-pulse">:</span>
      <CountdownDigit value={timeLeft.minutes} label="Menit" />
      <span className="font-extrabold text-xl sm:text-2xl text-[#8BBCC5] animate-pulse">:</span>
      <CountdownDigit value={timeLeft.seconds} label="Detik" />
    </div>
  );
}
