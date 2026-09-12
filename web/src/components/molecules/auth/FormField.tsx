import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface FormFieldProps {
  id?: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ id, label, error, required, className, children }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full text-left', className)}>
      <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
