import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface RelatedMaterialItem {
  id: string;
  title: string;
  description: string;
  competencyCode?: string;
  competencyName?: string;
  href?: string;
}

export interface LearningDetailRelatedMaterialsProps {
  materials?: RelatedMaterialItem[];
  viewAllHref?: string;
  onOpenMaterial?: (materialId: string) => void;
  className?: string;
}

export function LearningDetailRelatedMaterials({
  materials,
  viewAllHref = '/student/learning',
  onOpenMaterial,
  className,
}: LearningDetailRelatedMaterialsProps) {
  // Tanpa data API = tidak tampil. Tidak ada lagi fallback hardcode.
  if (!materials || materials.length === 0) return null;
  const displayMaterials = materials;

  const getBadgeStyle = (code?: string) => {
    switch (code) {
      case 'pemahaman-inferensial':
      case 'INFERENSIAL':
        return 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]';
      case 'evaluasi-apresiasi':
      case 'EVALUASI':
        return 'bg-[#E6F4EA] text-[#0D9488] border-[#A7F3D0]';
      default:
        return 'bg-[#E0F7FA] text-[#0284C7] border-[#BDEAF0]';
    }
  };

  return (
    <div className={cn('space-y-4 pt-2', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#111827] tracking-tight">
          Materi Terkait
        </h3>

        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1A4D5C] hover:text-[#0F343F] hover:underline transition-colors"
        >
          <span>Lihat Semua Bab</span>
          <ChevronRight className="size-4" />
        </Link>
      </div>

      {/* Grid of Related Material Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {displayMaterials.slice(0, 3).map((item) => (
          <Card
            key={item.id}
            className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-xs hover:shadow-md hover:border-[#8BBCC5]/50 transition-all duration-200 group"
          >
            <div className="space-y-3">
              {/* Competency Pill Badge */}
              <span
                className={cn(
                  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border',
                  getBadgeStyle(item.competencyCode)
                )}
              >
                {item.competencyName || 'Materi Belajar'}
              </span>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-[#111827] group-hover:text-[#1A4D5C] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#546A72] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Action Link */}
            <div className="pt-4 mt-2">
              {onOpenMaterial ? (
                <button
                  type="button"
                  onClick={() => onOpenMaterial(item.id)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1A4D5C] group-hover:text-[#0F343F] hover:underline transition-colors cursor-pointer"
                >
                  <span>Buka Materi</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <Link
                  href={item.href || `/student/learning/${item.id}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1A4D5C] group-hover:text-[#0F343F] hover:underline transition-colors"
                >
                  <span>Buka Materi</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
