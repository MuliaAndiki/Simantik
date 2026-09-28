import type * as React from 'react';
import { CardGridSkeleton } from '@/components/atoms/loading';
import { EmptyState, ListSectionHeader } from '@/components/molecules/feedback';
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
      <ListSectionHeader
        title="Semua Materi"
        description="Temukan materi Bahasa Indonesia yang sesuai dengan kebutuhanmu."
        countBadge={
          <span className="inline-flex items-center rounded-full bg-[#E0F7FA] px-2.5 py-0.5 text-xs font-semibold text-[#0284C7] border border-[#BDEAF0]">
            {materials.length} materi
          </span>
        }
      />

      {isLoading ? (
        <CardGridSkeleton />
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
        <EmptyState
          title="Materi Tidak Ditemukan"
          description="Tidak ada materi pembelajaran yang cocok dengan kata kunci atau filter kompetensi yang dipilih."
          actionLabel={isFiltered ? 'Reset Pencarian & Filter' : undefined}
          onAction={onResetFilters}
        />
      )}
    </section>
  );
}
