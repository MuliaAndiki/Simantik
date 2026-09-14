import { Search, X } from 'lucide-react';
import type * as React from 'react';
import { Input } from '@/components/atoms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { cn } from '@/utils/classname';

export interface PracticeCompetencyOption {
  value: string;
  label: string;
}

export interface PracticeFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompetency: string;
  onCompetencyChange: (competency: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  competencyOptions?: PracticeCompetencyOption[];
  className?: string;
}

export const COMPETENCY_FILTER_OPTIONS: PracticeCompetencyOption[] = [
  { value: 'all', label: 'Semua Kompetensi' },
  { value: 'pemahaman-tekstual', label: 'Pemahaman Tekstual' },
  { value: 'pemahaman-inferensial', label: 'Pemahaman Inferensial' },
  { value: 'evaluasi-apresiasi', label: 'Evaluasi & Apresiasi' },
];

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'belum-dikerjakan', label: 'Belum dikerjakan' },
  { value: 'sudah-dikerjakan', label: 'Sudah dikerjakan' },
] as const;

export function PracticeFilterBar({
  searchQuery,
  onSearchChange,
  selectedCompetency,
  onCompetencyChange,
  selectedStatus,
  onStatusChange,
  competencyOptions = COMPETENCY_FILTER_OPTIONS,
  className,
}: PracticeFilterBarProps) {
  return (
    <div
      className={cn(
        'p-2.5 sm:p-3 rounded-2xl border border-[#E5E7EB] bg-white flex flex-col md:flex-row items-center gap-3 shadow-xs',
        className
      )}
    >
      {/* Search Input Box */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#546A72] pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari latihan atau topik bacaan..."
          className="pl-10 pr-9 h-11 rounded-xl border-[#E5E7EB] bg-[#FAFCFD] focus-visible:bg-white text-sm text-[#111827] placeholder:text-[#546A72] focus-visible:border-[#8BBCC5] focus-visible:ring-[#8BBCC5]/30 w-full"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-[#546A72] hover:text-[#111827] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Hapus pencarian"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Competency Filter Dropdown */}
      <div className="w-full md:w-56 shrink-0">
        <Select value={selectedCompetency} onValueChange={onCompetencyChange}>
          <SelectTrigger className="h-11 w-full rounded-xl border-[#E5E7EB] bg-[#FAFCFD] px-3.5 text-sm text-[#111827] font-medium shadow-none focus-visible:border-[#8BBCC5] focus-visible:ring-[#8BBCC5]/30">
            <SelectValue placeholder="Pilih Kompetensi" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#E5E7EB] bg-white shadow-lg">
            {competencyOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-sm rounded-lg focus:bg-[#E0F7FA] focus:text-[#1A4D5C] font-medium py-2"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter Dropdown */}
      <div className="w-full md:w-52 shrink-0">
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="h-11 w-full rounded-xl border-[#E5E7EB] bg-[#FAFCFD] px-3.5 text-sm text-[#111827] font-medium shadow-none focus-visible:border-[#8BBCC5] focus-visible:ring-[#8BBCC5]/30">
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#E5E7EB] bg-white shadow-lg">
            {STATUS_FILTER_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-sm rounded-lg focus:bg-[#E0F7FA] focus:text-[#1A4D5C] font-medium py-2"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
