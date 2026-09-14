import { SearchX } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import {
  PracticePackageCard,
  type PracticePackageItem,
} from '@/components/molecules/student/PracticePackageCard';
import { cn } from '@/utils/classname';

export interface PracticePackagesListGridProps {
  packages: PracticePackageItem[];
  totalAllPackages?: number;
  onStartPractice?: (packageId: string) => void;
  onViewResult?: (packageId: string) => void;
  onRetryPractice?: (packageId: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
  className?: string;
}

export const DEFAULT_PRACTICE_PACKAGES: PracticePackageItem[] = [
  {
    id: 'pkg-1',
    competencyCode: 'pemahaman-tekstual',
    competencyName: 'Pemahaman Tekstual',
    status: 'belum-dikerjakan',
    title: 'Menemukan Informasi Tersurat',
    description: 'Latihan mengidentifikasi informasi yang disampaikan secara langsung dalam teks.',
    totalQuestions: 10,
  },
  {
    id: 'pkg-2',
    competencyCode: 'pemahaman-inferensial',
    competencyName: 'Pemahaman Inferensial',
    status: 'belum-dikerjakan',
    title: 'Menyimpulkan Informasi Tersirat',
    description: 'Latihan menarik kesimpulan berdasarkan informasi yang tersirat dalam teks.',
    totalQuestions: 10,
  },
  {
    id: 'pkg-3',
    competencyCode: 'evaluasi-apresiasi',
    competencyName: 'Evaluasi & Apresiasi',
    status: 'belum-dikerjakan',
    title: 'Menilai Ketepatan Informasi',
    description: 'Latihan menilai relevansi, keakuratan, dan kecukupan informasi dalam teks.',
    totalQuestions: 10,
  },
  {
    id: 'pkg-4',
    competencyCode: 'pemahaman-inferensial',
    competencyName: 'Pemahaman Inferensial',
    status: 'sudah-dikerjakan',
    title: 'Hubungan Antarkalimat & Paragraf',
    description: 'Latihan memahami hubungan makna antarkalimat dan kohesi antarparagraf.',
    totalQuestions: 15,
    score: 80,
  },
  {
    id: 'pkg-5',
    competencyCode: 'pemahaman-tekstual',
    competencyName: 'Pemahaman Tekstual',
    status: 'sudah-dikerjakan',
    title: 'Makna Kata dalam Konteks',
    description:
      'Latihan menentukan makna kata berdasarkan konteks penggunaannya dalam teks wacana.',
    totalQuestions: 10,
    score: 90,
  },
  {
    id: 'pkg-6',
    competencyCode: 'evaluasi-apresiasi',
    competencyName: 'Evaluasi & Apresiasi',
    status: 'belum-dikerjakan',
    title: 'Menilai Penggunaan Bahasa & PUEBI',
    description: 'Latihan menilai ketepatan dan kesesuaian penggunaan bahasa baku dalam teks...',
    totalQuestions: 10,
  },
  {
    id: 'pkg-7',
    competencyCode: 'pemahaman-tekstual',
    competencyName: 'Pemahaman Tekstual',
    status: 'belum-dikerjakan',
    title: 'Ide Pokok & Penalaran Deduktif',
    description: 'Latihan mengidentifikasi ide pokok dan premis deduktif dalam wacana analitis.',
    totalQuestions: 10,
  },
  {
    id: 'pkg-8',
    competencyCode: 'evaluasi-apresiasi',
    competencyName: 'Evaluasi & Apresiasi',
    status: 'sudah-dikerjakan',
    title: 'Membedakan Fakta dan Opini',
    description: 'Latihan memisahkan pernyataan faktual objektif dengan opini subjektif penulis.',
    totalQuestions: 12,
    score: 85,
  },
  {
    id: 'pkg-9',
    competencyCode: 'pemahaman-inferensial',
    competencyName: 'Pemahaman Inferensial',
    status: 'belum-dikerjakan',
    title: 'Prediksi Alur Cerita & Latar',
    description: 'Latihan memprediksi kelanjutan alur cerita berdasarkan petunjuk implisit.',
    totalQuestions: 10,
  },
  {
    id: 'pkg-10',
    competencyCode: 'pemahaman-tekstual',
    competencyName: 'Pemahaman Tekstual',
    status: 'belum-dikerjakan',
    title: 'Struktur Frasa dan Pola Kalimat',
    description: 'Latihan mengenali struktur gramatikal baku dan pola kalimat efektif.',
    totalQuestions: 10,
  },
  {
    id: 'pkg-11',
    competencyCode: 'evaluasi-apresiasi',
    competencyName: 'Evaluasi & Apresiasi',
    status: 'belum-dikerjakan',
    title: 'Analisis Pesan Moral dan Amanat',
    description: 'Latihan mengevaluasi pesan moral dan refleksi filosofis teks naratif.',
    totalQuestions: 10,
  },
  {
    id: 'pkg-12',
    competencyCode: 'pemahaman-inferensial',
    competencyName: 'Pemahaman Inferensial',
    status: 'belum-dikerjakan',
    title: 'Interpretasi Gaya Bahasa Majas',
    description: 'Latihan menafsirkan arti majas metafora, personifikasi, dan asosiasi teks.',
    totalQuestions: 10,
  },
];

export function PracticePackagesListGrid({
  packages,
  totalAllPackages = DEFAULT_PRACTICE_PACKAGES.length,
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
            <span className="inline-flex items-center rounded-full bg-[#E0F7FA] px-3 py-1 text-xs font-semibold text-[#0284C7] border border-[#BDEAF0]">
              Menampilkan: {packages.length} Paket Latihan Terpilih (Total {totalAllPackages})
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#546A72]">
            Pilih paket soal untuk menguji pemahaman teks dan membaca kritis.
          </p>
        </div>

        <div className="text-xs text-[#546A72] font-medium shrink-0">
          Standar: <span className="font-semibold text-[#111827]">Asesmen TKA 2024/2025</span>
        </div>
      </div>

      {/* Grid or Empty State */}
      {packages.length > 0 ? (
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
