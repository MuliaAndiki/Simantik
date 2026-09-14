import { FileCheck } from 'lucide-react';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { TryoutPrepStepCard } from '@/components/molecules/student/TryoutPrepStepCard';
import { cn } from '@/utils/classname';

export interface TryoutPrepTipsCardProps {
  className?: string;
}

export function TryoutPrepTipsCard({ className }: TryoutPrepTipsCardProps) {
  return (
    <Card
      className={cn(
        'p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-white space-y-6 shadow-xs',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <FileCheck className="size-5 text-[#1A4D5C]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#111827]">Tips Sebelum Mulai</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#546A72]">
            Panduan persiapan teknis dan strategi sebelum membuka lembar ujian resmi.
          </p>
        </div>

        <span className="inline-flex items-center rounded-full bg-[#E0F7FA] px-3 py-1 text-xs font-semibold text-[#0284C7] border border-[#BDEAF0] w-fit">
          Petunjuk Resmi
        </span>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TryoutPrepStepCard
          stepNumber="01"
          badgeVariant="cyan"
          title="Siapkan Waktu"
          description="Luangkan waktu penuh tanpa gangguan selama pengerjaan tryout berlangsung. Gunakan koneksi internet stabil (minimal 5 Mbps) dan periksa baterai perangkat laptop atau PC."
          checkItemText="Sediakan ruang ujian kondusif & hening"
        />

        <TryoutPrepStepCard
          stepNumber="02"
          badgeVariant="amber"
          title="Perhatikan Durasi"
          description="Waktu berjalan mundur secara otomatis selama 75 menit begitu ujian dimulai. Alokasikan rata-rata 2,5 menit untuk setiap wacana analitik dan butir soal."
          checkItemText="Timer otomatis mengumpulkan jawaban saat habis"
        />

        <TryoutPrepStepCard
          stepNumber="03"
          badgeVariant="emerald"
          title="Kerjakan dengan Fokus"
          description="Baca teks wacana dengan teliti serta pahami maksud pertanyaan sebelum memilih opsi. Gunakan fitur penanda ragu-ragu jika masih memerlukan peninjauan ulang."
          checkItemText="Hasil dan analisis butir terkirim resmi ke email"
        />
      </div>
    </Card>
  );
}
