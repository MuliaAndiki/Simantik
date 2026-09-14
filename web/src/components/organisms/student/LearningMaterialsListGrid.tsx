import { BookOpen, SearchX } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import {
  type LearningMaterialItem,
  LearningMaterialItemCard,
} from '@/components/molecules/student/LearningMaterialItemCard';
import { cn } from '@/utils/classname';

export interface LearningMaterialsListGridProps {
  materials: LearningMaterialItem[];
  onLearnMaterial?: (materialId: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
  className?: string;
}

export const DEFAULT_LEARNING_MATERIALS: LearningMaterialItem[] = [
  {
    id: 'mat-1',
    competencyCode: 'pemahaman-tekstual',
    competencyName: 'Pemahaman Tekstual',
    title: 'Ide Pokok dan Gagasan Pendukung',
    description:
      'Memahami gagasan utama dan informasi pendukung yang terdapat dalam teks secara komprehensif.',
  },
  {
    id: 'mat-2',
    competencyCode: 'pemahaman-tekstual',
    competencyName: 'Pemahaman Tekstual',
    title: 'Informasi Tersurat',
    description:
      'Menemukan informasi yang disampaikan secara langsung dalam teks tanpa interpretasi tambahan.',
  },
  {
    id: 'mat-3',
    competencyCode: 'pemahaman-inferensial',
    competencyName: 'Pemahaman Inferensial',
    title: 'Makna Tersirat dalam Teks',
    description:
      'Menafsirkan informasi yang tidak disampaikan secara langsung berdasarkan konteks dan petunjuk teks.',
  },
  {
    id: 'mat-4',
    competencyCode: 'pemahaman-inferensial',
    competencyName: 'Pemahaman Inferensial',
    title: 'Hubungan Antarparagraf',
    description:
      'Menganalisis hubungan makna antara satu paragraf dengan paragraf lainnya dalam struktur wacana.',
  },
  {
    id: 'mat-5',
    competencyCode: 'evaluasi-apresiasi',
    competencyName: 'Evaluasi & Apresiasi',
    title: 'Fakta, Opini, dan Argumen',
    description:
      'Membedakan fakta dan opini serta menilai kekuatan argumen dalam teks argumentatif dan eksposisi.',
  },
  {
    id: 'mat-6',
    competencyCode: 'evaluasi-apresiasi',
    competencyName: 'Evaluasi & Apresiasi',
    title: 'Menilai Ketepatan Informasi',
    description:
      'Menilai keakuratan, kesesuaian, kecukupan, dan ketepatan informasi dalam teks akademik dan artikel ilmiah.',
  },
  {
    id: 'mat-7',
    competencyCode: 'pemahaman-tekstual',
    competencyName: 'Pemahaman Tekstual',
    title: 'Struktur dan Kebahasaan Teks',
    description:
      'Mengenali struktur teks dan penggunaan unsur kebahasaan baku dalam bacaan ragam formal.',
  },
  {
    id: 'mat-8',
    competencyCode: 'pemahaman-inferensial',
    competencyName: 'Pemahaman Inferensial',
    title: 'Prediksi Lanjutan Teks',
    description:
      'Memprediksi lanjutan atau akhir uraian berdasarkan alur logis serta fakta yang disajikan dalam teks.',
  },
  {
    id: 'mat-9',
    competencyCode: 'evaluasi-apresiasi',
    competencyName: 'Evaluasi & Apresiasi',
    title: 'Karakter, Peristiwa, dan Latar',
    description:
      'Menganalisis karakter, jalinan peristiwa, dan latar sosial-budaya berdasarkan bukti konkret dari teks fiksi.',
  },
  {
    id: 'mat-10',
    competencyCode: 'pemahaman-inferensial',
    competencyName: 'Pemahaman Inferensial',
    title: 'Menyimpulkan Tujuan Penulis',
    description:
      'Mengidentifikasi maksud, sikap, serta sudut pandang penulis terhadap isu yang diangkat dalam bacaan.',
  },
  {
    id: 'mat-11',
    competencyCode: 'pemahaman-tekstual',
    competencyName: 'Pemahaman Tekstual',
    title: 'Kosakata Kontekstual & Polisemi',
    description:
      'Menentukan makna istilah teknis dan ungkapan kiasan berdasarkan konteks kalimat dalam teks.',
  },
  {
    id: 'mat-12',
    competencyCode: 'evaluasi-apresiasi',
    competencyName: 'Evaluasi & Apresiasi',
    title: 'Analisis Gaya Bahasa dan Retorika',
    description:
      'Mengapresiasi keindahan gaya bahasa, majas, dan efek emosional yang dibangun dalam teks sastra.',
  },
];

export function LearningMaterialsListGrid({
  materials,
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

      {/* Grid or Empty State */}
      {materials.length > 0 ? (
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
