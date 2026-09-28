import { ChevronRight, ClipboardList, Clock, FileSpreadsheet, User } from 'lucide-react';
import React from 'react';
import { CardSkeleton } from '@/components/atoms/loading';
import { ManagedTryoutItem } from '@/types/ui/content-manager-dashboard.types';
import { cn } from '@/utils/classname';

export interface ContentManagerManagedTryoutsProps {
  tryouts?: ManagedTryoutItem[];
  totalCount?: number;
  isLoading?: boolean;
  onManageTryout?: (id: string) => void;
  onViewAll?: () => void;
  className?: string;
}

export const ContentManagerManagedTryouts: React.FC<ContentManagerManagedTryoutsProps> = ({
  tryouts,
  totalCount = 0,
  isLoading,
  onManageTryout,
  onViewAll,
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          'w-full bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-7 space-y-3',
          className
        )}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={`tryout-skeleton-${i}`} lines={2} />
        ))}
      </div>
    );
  }

  if (!tryouts || tryouts.length === 0) return null;

  const displayItems = tryouts;

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-7 flex flex-col justify-between',
        className
      )}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Daftar Tryout Terkelola
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Konfigurasi sesi ujian dan kapasitas butir soal acak
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Lihat Semua ({totalCount})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tryout List */}
        <div className="space-y-3 mt-4">
          {displayItems.map((item) => {
            const isPublished = item.status === 'PUBLISHED';

            return (
              <div
                key={item.id}
                className="bg-[#F8FAFC] hover:bg-[#F1F6FB] border border-slate-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-150"
              >
                {/* Info Column */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase',
                        isPublished
                          ? 'bg-teal-50 text-teal-700 border border-teal-200/70'
                          : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                      )}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                      {item.totalSoalTersedia} Soal Tersedia
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {item.soalPerSiswa} Soal / Siswa
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.durasiMenit} Menit
                    </span>
                  </div>

                  {/* Date */}
                  <p className="text-[11px] text-slate-400 font-normal">
                    Diperbarui {item.diperbaruiTanggal}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => onManageTryout?.(item.id)}
                  className="self-start sm:self-center px-4 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 font-semibold text-xs rounded-xl transition cursor-pointer shrink-0"
                >
                  Kelola
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContentManagerManagedTryouts;
