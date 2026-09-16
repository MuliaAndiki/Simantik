import { ArrowRight, BookOpen, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface ModuleMaterialSummaryItem {
  id: string;
  title: string;
  description?: string;
  type?: string;
  competencyName?: string;
  competencyCode?: string;
  isCompleted?: boolean;
  href?: string;
}

export interface ModuleMaterialsListGridProps {
  materials: ModuleMaterialSummaryItem[];
  onSelectMaterial?: (materialId: string) => void;
  className?: string;
}

export function ModuleMaterialsListGrid({
  materials,
  onSelectMaterial,
  className,
}: ModuleMaterialsListGridProps) {
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

  if (!materials || materials.length === 0) {
    return (
      <Card className="p-8 text-center rounded-2xl border border-[#E5E7EB] bg-white space-y-3">
        <div className="mx-auto size-12 rounded-full bg-[#F0F9FA] flex items-center justify-center text-[#0284C7]">
          <BookOpen className="size-6" />
        </div>
        <h3 className="text-base font-bold text-[#111827]">Belum Ada Materi</h3>
        <p className="text-xs sm:text-sm text-[#546A72] max-w-sm mx-auto">
          Materi pembelajaran pada modul ini sedang disiapkan oleh tim pengajar.
        </p>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4 pt-2', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#111827] tracking-tight">
            Daftar Materi Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm text-[#546A72]">
            Pilih materi yang ingin kamu pelajari secara berurutan.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
          {materials.length} Materi
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {materials.map((material, index) => (
          <Card
            key={material.id}
            className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-xs hover:shadow-md hover:border-[#8BBCC5]/50 transition-all duration-200 group"
          >
            <div className="space-y-3.5">
              {/* Badges Row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span
                  className={cn(
                    'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border',
                    getBadgeStyle(material.competencyCode)
                  )}
                >
                  {material.competencyName || `Materi ${index + 1}`}
                </span>

                {material.isCompleted ? (
                  <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-[#E6F4EA] text-[#0D9488] border border-[#A7F3D0]">
                    <CheckCircle className="size-3" />
                    <span>Selesai</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                    <Clock className="size-3" />
                    <span>Belum Selesai</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#111827] group-hover:text-[#1A4D5C] transition-colors line-clamp-2 leading-snug">
                  {material.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#546A72] leading-relaxed line-clamp-3 min-h-[2.5rem]">
                  {material.description ||
                    'Pelajari pembahasan materi terstruktur untuk menguasai kompetensi ini.'}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 mt-2">
              {onSelectMaterial ? (
                <Button
                  type="button"
                  onClick={() => onSelectMaterial(material.id)}
                  className="w-full h-10 rounded-xl bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] font-semibold text-xs sm:text-sm gap-2 border-none shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>Pelajari Materi</span>
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full h-10 rounded-xl bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] font-semibold text-xs sm:text-sm gap-2 border-none shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Link href={material.href || `/student/learning/material/${material.id}`}>
                    <span>Pelajari Materi</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
