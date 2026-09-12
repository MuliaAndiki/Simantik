'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/utils/classname';

export interface PasswordFieldProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  error?: boolean;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className, disabled, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative w-full">
        {/* Leading Lock Icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
          <Lock className="w-4 h-4" />
        </div>

        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          disabled={disabled}
          className={cn(
            'w-full h-11 sm:h-12 pl-10 pr-11 py-2.5 bg-white rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none',
            'border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
            className
          )}
          {...props}
        />

        {/* Trailing Eye Toggle Button */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-teal-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
