import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface PageHeadingProps {
  title?: string;
  subtitle?: string;
  variant?: 'plain' | 'card';
  className?: string;
}

// Judul halaman generik (gantikan AdminDashboardHero & ContentManagerHeroBanner).
export function PageHeading({
  title = '',
  subtitle,
  variant = 'plain',
  className,
}: PageHeadingProps) {
  if (variant === 'card') {
    return (
      <div
        className={cn(
          'w-full bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8',
          className
        )}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-baseline gap-2 select-none', className)}>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-xs sm:text-sm text-slate-500 font-medium">{subtitle}</p>}
    </div>
  );
}
