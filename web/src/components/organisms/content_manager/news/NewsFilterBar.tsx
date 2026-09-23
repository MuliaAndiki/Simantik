import { ChevronDown, Search } from 'lucide-react';
import React from 'react';
import type { NewsFilterState } from '@/types/ui/content-manager';
import { NEWS_STATUS_FILTER_OPTIONS } from '@/types/ui/content-manager';

interface NewsFilterBarProps {
  filters: NewsFilterState;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
}

export const NewsFilterBar: React.FC<NewsFilterBarProps> = ({
  filters,
  onSearchChange,
  onStatusChange,
}) => {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari judul artikel, topik, penulis..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition outline-none"
        />
      </div>

      <div className="relative min-w-[150px]">
        <select
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
        >
          {NEWS_STATUS_FILTER_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};
