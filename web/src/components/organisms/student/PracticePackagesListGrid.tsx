import { SearchX } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { CardSkeleton } from '@/components/atoms/loading';
import {
  PracticePackageCard,
  type PracticePackageItem,
} from '@/components/molecules/student/PracticePackageCard';
import { cn } from '@/utils/classname';

export interface PracticePackagesListGridProps {
  packages: PracticePackageItem[];
  totalAllPackages?: number;
  isLoading?: boolean;
  onStartPractice?: (packageId: string) => void;
  onViewResult?: (packageId: string, latestAttemptId?: string) => void;
  onRetryPractice?: (packageId: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
  className?: string;
}

export function PracticePackagesListGrid({
  packages,
  totalAllPackages = 0,
  isLoading,
  onStartPractice,
  onViewResult,
  onRetryPractice,
  onResetFilters,
  isFiltered = false,
  className,
}: PracticePackagesListGridProps) {
  return (
    <section className={cn('space-y-4 md:space-y-5', className)}>
      {/* Section Header with dynamic counter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E7EB] pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-bold tracking-tight text-[#111827]">
              Daftar Paket Latihan
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#546A72]">
            Pilih paket soal untuk menguji pemahaman teks dan membaca kritis.
          </p>
        </div>

        <div className="text-xs text-[#546A72] font-medium shrink-0">
          Standar: <span className="font-semibold text-[#111827]">Asesmen TKA 2024/2025</span>
        </div>
      </div>

      {/* Grid, Skeleton, or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={`practice-skeleton-${i}`} lines={3} />
          ))}
        </div>
      ) : packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {packages.map((pkg) => (
            <PracticePackageCard
              key={pkg.id}
              packageItem={pkg}
              onStartPractice={onStartPractice}
              onViewResult={onViewResult}
              onRetryPractice={onRetryPractice}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 rounded-2xl border border-dashed border-[#E5E7EB] bg-white flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-12 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#546A72]">
            <SearchX className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#111827]">Paket Latihan Tidak Ditemukan</h3>
            <p className="text-xs md:text-sm text-[#546A72] max-w-sm">
              Tidak ada paket latihan yang cocok dengan kata kunci atau filter kompetensi/status
              yang dipilih.
            </p>
          </div>
          {isFiltered && (
            <Button
              type="button"
              variant="outline"
              onClick={onResetFilters}
              className="mt-2 rounded-xl text-xs font-semibold h-9"
            >
              Reset Pencarian & Filter
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
