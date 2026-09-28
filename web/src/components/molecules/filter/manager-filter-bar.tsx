import { ChevronDown, RotateCw, Search } from 'lucide-react';
import React from 'react';
import { cn } from '@/utils/classname';

export const JENJANG_FILTER_OPTIONS = ['Semua Jenjang', 'SD', 'SMP', 'SMA', 'SMK'];

export interface ManagerSelectOption {
  value: string;
  label: string;
}

export interface ManagerSelectConfig {
  value: string;
  options: (string | ManagerSelectOption)[];
  minWidthClass?: string;
  onChange: (value: string) => void;
}

export interface ManagerFilterBarProps {
  search: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  selects: ManagerSelectConfig[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  counter?: string;
  className?: string;
  searchWrapClassName?: string;
  searchInputClassName?: string;
}

function optionValue(opt: string | ManagerSelectOption): string {
  return typeof opt === 'string' ? opt : opt.value;
}

function optionLabel(opt: string | ManagerSelectOption): string {
  return typeof opt === 'string' ? opt : opt.label;
}

// Filter bar generik content-manager (materials, practice, tryouts, news):
// search + N native-select + refresh + counter opsional.
export function ManagerFilterBar({
  search,
  searchPlaceholder,
  onSearchChange,
  selects,
  onRefresh,
  isRefreshing = false,
  counter,
  className,
  searchWrapClassName,
  searchInputClassName,
}: ManagerFilterBarProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3',
        className
      )}
    >
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className={cn('relative flex-1 min-w-[220px]', searchWrapClassName)}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              'w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition',
              searchInputClassName
            )}
          />
        </div>

        {selects.map((select, i) => (
          <div
            key={`${select.value}-${i}`}
            className={cn('relative', select.minWidthClass ?? 'min-w-[130px]')}
          >
            <select
              value={select.value}
              onChange={(e) => select.onChange(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-cyan-600 focus:bg-white transition"
            >
              {select.options.map((opt) => (
                <option key={optionValue(opt)} value={optionValue(opt)}>
                  {optionLabel(opt)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        ))}
      </div>

      {(onRefresh || counter) && (
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              <RotateCw
                className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>Segarkan</span>
            </button>
          )}
          {counter && (
            <div className="text-xs font-medium text-slate-500 whitespace-nowrap">{counter}</div>
          )}
        </div>
      )}
    </div>
  );
}
