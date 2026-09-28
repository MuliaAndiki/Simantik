import type * as React from 'react';
import { CardGridSkeleton } from '@/components/atoms/loading';
import { EmptyState, ListSectionHeader } from '@/components/molecules/feedback';
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
      <ListSectionHeader
        title="Daftar Paket Latihan"
        description="Pilih paket soal untuk menguji pemahaman teks dan membaca kritis."
      />

      {isLoading ? (
        <CardGridSkeleton />
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
        <EmptyState
          title="Paket Latihan Tidak Ditemukan"
          description="Tidak ada paket latihan yang cocok dengan kata kunci atau filter kompetensi/status yang dipilih."
          actionLabel={isFiltered ? 'Reset Pencarian & Filter' : undefined}
          onAction={onResetFilters}
        />
      )}
    </section>
  );
}
