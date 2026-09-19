import { ChevronDown, RotateCw, Search } from 'lucide-react';
import React from 'react';
import { MATERIAL_STATUSES } from '@/data/materialManager.data';
import type { MaterialFilterState } from '@/types/ui/material-manager.types';

const JENJANG_FILTER_OPTIONS = ['Semua Jenjang', 'SD', 'SMP', 'SMA', 'SMK'];

interface MaterialFilterBarProps {
  filters: MaterialFilterState;
  totalItems: number;
  displayedCount: number;
  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const MaterialFilterBar: React.FC<MaterialFilterBarProps> = ({
  filters,
  totalItems,
  displayedCount,
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Left Filters */}
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul materi, bab, ID..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          />
        </div>

        {/* Jenjang Dropdown */}
        <div className="relative min-w-[130px]">
          <select
            value={filters.jenjang}
            onChange={(e) => onJenjangChange(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          >
            {JENJANG_FILTER_OPTIONS.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Status Dropdown */}
        <div className="relative min-w-[130px]">
          <select
            value={filters.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          >
            {MATERIAL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Right Controls: Refresh & Counter */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
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

        <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
          Menampilkan 1-{displayedCount} dari {totalItems} Materi
        </div>
      </div>
    </div>
  );
};
