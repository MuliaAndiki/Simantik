import { Calendar, FileQuestion, Mail, Timer } from 'lucide-react';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { TryoutStandardFeatureCard } from '@/components/molecules/student/TryoutStandardFeatureCard';
import { cn } from '@/utils/classname';

export interface TryoutStandardsCardProps {
  className?: string;
}

export function TryoutStandardsCard({ className }: TryoutStandardsCardProps) {
  return (
    <Card
      className={cn(
        'p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-white space-y-6 shadow-xs',
        className
      )}
    >
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Calendar className="size-5 text-[#1A4D5C]" />
          <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
            Jadwal & Standar Asesmen TKA 2026
          </h2>
          <span className="inline-flex items-center rounded-md bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#059669] border border-emerald-200/60">
            Terverifikasi
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#546A72]">
          Simulasi resmi terstandarisasi Pusat Kurikulum dan Pembelajaran Nasional SMA / SMK.
        </p>
      </div>

      {/* 3 Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TryoutStandardFeatureCard
          icon={Timer}
          iconBgColor="bg-[#E0F7FA]"
          iconColor="text-[#0284C7]"
          title="Waktu Ketat 75 Menit"
          description="Pengatur waktu otomatis berjalan terus tanpa jeda. Pastikan ruang ujian kondusif."
        />

        <TryoutStandardFeatureCard
          icon={FileQuestion}
          iconBgColor="bg-[#FEF3C7]"
          iconColor="text-[#D97706]"
          title="30 Butir Soal Analitik"
          description="Menguji penalaran wacana, inferensi makna kalimat, dan kaidah kebahasaan formal."
        />

        <TryoutStandardFeatureCard
          icon={Mail}
          iconBgColor="bg-[#ECFDF5]"
          iconColor="text-[#059669]"
          title="Hasil Dikirim ke Email Resmi"
          description="Lembar skor, analisis diagnostik butir soal, dan sertifikat terkirim langsung ke email akun."
        />
      </div>
    </Card>
  );
}
