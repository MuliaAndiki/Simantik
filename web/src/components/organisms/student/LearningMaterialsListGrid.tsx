import { BookOpen, SearchX } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { CardSkeleton } from '@/components/atoms/loading';
import {
  type LearningMaterialItem,
  LearningMaterialItemCard,
} from '@/components/molecules/student/LearningMaterialItemCard';
import { cn } from '@/utils/classname';

export interface LearningMaterialsListGridProps {
  materials: LearningMaterialItem[];
  isLoading?: boolean;
  onLearnMaterial?: (materialId: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
  className?: string;
}

export function LearningMaterialsListGrid({
  materials,
  isLoading,
  onLearnMaterial,
  onResetFilters,
  isFiltered = false,
  className,
}: LearningMaterialsListGridProps) {
  return (
    <section className={cn('space-y-4 md:space-y-5', className)}>
      {/* Section Header with dynamic counter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E7EB] pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-[#111827]">Semua Materi</h2>
            <span className="inline-flex items-center rounded-full bg-[#E0F7FA] px-2.5 py-0.5 text-xs font-semibold text-[#0284C7] border border-[#BDEAF0]">
              {materials.length} materi
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#546A72]">
            Temukan materi Bahasa Indonesia yang sesuai dengan kebutuhanmu.
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
            <CardSkeleton key={`learning-skeleton-${i}`} lines={3} />
          ))}
        </div>
      ) : materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {materials.map((material) => (
            <LearningMaterialItemCard
              key={material.id}
              material={material}
              onLearn={onLearnMaterial}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 rounded-2xl border border-dashed border-[#E5E7EB] bg-white flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-12 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#546A72]">
            <SearchX className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#111827]">Materi Tidak Ditemukan</h3>
            <p className="text-xs md:text-sm text-[#546A72] max-w-sm">
              Tidak ada materi pembelajaran yang cocok dengan kata kunci atau filter kompetensi yang
              dipilih.
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
