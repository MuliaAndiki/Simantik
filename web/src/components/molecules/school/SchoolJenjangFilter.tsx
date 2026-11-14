import type * as React from 'react';
import { cn } from '@/utils/classname';
import {
  SCHOOL_LEVEL_FILTER_OPTIONS,
  type SchoolLevelFilterValue,
} from '@/utils/school-picker.util';

export interface SchoolJenjangFilterProps {
  value: SchoolLevelFilterValue;
  onChange: (value: SchoolLevelFilterValue) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const SchoolJenjangFilter: React.FC<SchoolJenjangFilterProps> = ({
  value,
  onChange,
  disabled = false,
  className,
  ariaLabel = 'Filter jenjang sekolah',
}) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex flex-wrap items-center gap-1.5', className)}
    >
      {SCHOOL_LEVEL_FILTER_OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'h-8 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
              isActive
                ? 'bg-[#1A4D5C] text-white border-[#1A4D5C] shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SchoolJenjangFilter;
