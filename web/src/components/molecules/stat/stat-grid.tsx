import type { LucideIcon } from 'lucide-react';
import React from 'react';
import { cn } from '@/utils/classname';

export interface StatGridItem {
  key: string;
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  icon?: LucideIcon;
  iconBoxClass?: string;
  iconClass?: string;
  valueClass?: string;
}

export interface StatGridProps {
  items: StatGridItem[];
  colsClassName?: string;
  className?: string;
}

// Grid kartu statistik seragam (materials, practice, tryouts, news, schools).
export function StatGrid({ items, colsClassName, className }: StatGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4',
        colsClassName,
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </p>
              <p
                className={cn('text-3xl font-black text-slate-900 tracking-tight', item.valueClass)}
              >
                {item.value}
              </p>
              {item.subtext && <p className="text-xs font-medium text-slate-500">{item.subtext}</p>}
            </div>
            {Icon && (
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl bg-[#EAF6F8] text-[#0E7490] flex items-center justify-center shrink-0',
                  item.iconBoxClass
                )}
              >
                <Icon className={cn('w-6 h-6', item.iconClass)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
