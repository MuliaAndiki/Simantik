import { RefreshCw, Search } from 'lucide-react';
import React from 'react';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectConfig {
  value: string;
  placeholder: string;
  widthClass?: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
}

export interface AdminFilterBarProps {
  search: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  selects: FilterSelectConfig[];
  isRefreshing?: boolean;
  onRefresh: () => void;
  className?: string;
}

// Filter bar generik admin (students, schools, content-managers):
// search + N select + tombol refresh.
export function AdminFilterBar({
  search,
  searchPlaceholder,
  onSearchChange,
  selects,
  isRefreshing = false,
  onRefresh,
  className,
}: AdminFilterBarProps) {
  return (
    <div className={cn('flex flex-col md:flex-row items-center gap-3', className)}>
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
        />
      </div>

      <div className="flex items-center gap-2.5 w-full md:w-auto">
        {selects.map((select) => (
          <Select key={select.placeholder} value={select.value} onValueChange={select.onChange}>
            <SelectTrigger
              className={cn(
                'h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold',
                select.widthClass ?? 'w-[160px]'
              )}
            >
              <SelectValue placeholder={select.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {select.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-10 px-3.5 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
}
