import * as React from 'react';
import { cn } from '@/utils/classname';

export interface AuthInputProps extends React.ComponentProps<'input'> {
  icon?: React.ComponentType<{ className?: string }>;
  error?: boolean;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, icon: Icon, error, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full h-11 sm:h-12 py-2.5 bg-white rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none',
            Icon ? 'pl-10 pr-3.5' : 'px-3.5',
            'border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
