'use client';

import * as React from 'react';
import { cn } from '@/utils/classname';

export interface OtpInputProps {
  id?: string;
  value?: string;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  onChange?: (e: { target: { value: string } }) => void;
}

export function OtpInput({
  id,
  value = '',
  length = 6,
  disabled = false,
  error = false,
  className,
  onChange,
}: OtpInputProps) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  // Array representation of current OTP digits
  const digits = React.useMemo(() => {
    const arr = value.split('').slice(0, length);
    while (arr.length < length) {
      arr.push('');
    }
    return arr;
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    // Only accept numbers
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      onChange?.({ target: { value: nextDigits.join('') } });
      return;
    }

    // Single digit entry
    const char = cleanVal.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = char;
    const nextOtp = nextDigits.join('');
    onChange?.({ target: { value: nextOtp } });

    // Advance focus to next input
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // If current slot is already empty, go back and clear previous slot
        const nextDigits = [...digits];
        nextDigits[index - 1] = '';
        onChange?.({ target: { value: nextDigits.join('') } });
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;

    onChange?.({ target: { value: pastedData } });
    const targetFocusIndex = Math.min(pastedData.length, length - 1);
    inputsRef.current[targetFocusIndex]?.focus();
  };

  return (
    <div
      id={id}
      className={cn('flex items-center justify-center gap-2 sm:gap-3', className)}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, index) => {
        const inputKey = `otp-digit-${index}`;
        return (
          <input
            key={inputKey}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[index] || ''}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              'w-11 h-13 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono text-slate-800 bg-white rounded-xl border transition-all outline-none',
              'border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
              disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
              digits[index] && 'border-teal-500/60 bg-teal-50/20'
            )}
            aria-label={`Digit OTP ${index + 1}`}
          />
        );
      })}
    </div>
  );
}
