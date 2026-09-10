import * as React from 'react';

import { cn } from '@/utils/classname';

export interface CountdownDigitProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number | string;
  label: string;
}

/**
 * Atomic primitive for displaying an individual countdown unit (e.g. 08 Hari)
 */
export function CountdownDigit({ value, label, className, ...props }: CountdownDigitProps) {
  const formattedValue = typeof value === 'number' ? String(value).padStart(2, '0') : value;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-w-[72px] sm:min-w-[88px] md:min-w-[96px] p-3 sm:p-4 rounded-2xl bg-white border border-[#E0F7FA] shadow-md shadow-[#4CA7B1]/10 card-hover transition-all duration-300',
        className
      )}
      {...props}
    >
      <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#111827] tabular-nums tracking-tight">
        {formattedValue}
      </span>
      <span className="text-[10px] sm:text-xs font-semibold text-[#546A72] uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
}
