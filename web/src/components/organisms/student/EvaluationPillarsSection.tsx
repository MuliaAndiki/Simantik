import { ArrowRight, FileText } from 'lucide-react';
import type * as React from 'react';
import { EvaluationPillarCard, type EvaluationPillarItem } from '@/components/molecules/student';
import { cn } from '@/utils/classname';

export interface EvaluationPillarsSectionProps {
  pillars?: EvaluationPillarItem[];
  title?: string;
  subtitle?: string;
  detailActionText?: string;
  onViewDetail?: () => void;
  className?: string;
}

export const DEFAULT_PILLARS: EvaluationPillarItem[] = [
  {
    id: 'pilar-01',
    pillarNumber: 'PILAR 01',
    title: 'Pemahaman Tekstual',
    description:
      'Kemampuan melacak fakta tersurat, ide pokok paragraf, dan struktur gramatikal secara eksplisit.',
    score: 84,
    maxScore: 100,
    accuracyOrStatusText: 'Akurasi 92%',
    accuracyOrStatusColor: 'emerald',
    levelBadgeText: 'Taraf Baik',
    levelBadgeVariant: 'emerald',
    isFocusPillar: false,
    footerLeftText: 'Skor Ambang Minimal: 75',
    footerRightText: 'Melampaui Target',
  },
  {
    id: 'pilar-02',
    pillarNumber: 'PILAR 02',
    title: 'Pemahaman Inferensial',
    description:
      'Mendeduksi makna implisit, membaca intonasi tersembunyi, dan mengonstruksi premis wacana.',
    score: 76,
    maxScore: 100,
    accuracyOrStatusText: 'Perlu Latihan',
    accuracyOrStatusColor: 'amber',
    levelBadgeText: 'Taraf Cukup',
    levelBadgeVariant: 'amber',
    isFocusPillar: true,
    focusBadgeText: 'FOKUS PENGUATAN',
    footerLeftText: 'Rekomendasi Modul: 04',
    footerRightText: 'Pelajari Topik',
  },
  {
    id: 'pilar-03',
    pillarNumber: 'PILAR 03',
    title: 'Evaluasi dan Apresiasi',
    description:
      'Menilai keabsahan argumen, mendeteksi bias penulis, serta mengukur relevansi bukti logis.',
    score: 82,
    maxScore: 100,
    accuracyOrStatusText: 'Konsisten',
    accuracyOrStatusColor: 'teal',
    levelBadgeText: 'Taraf Baik',
    levelBadgeVariant: 'emerald',
    isFocusPillar: false,
    footerLeftText: 'Daya Kritis Logis: Kuat',
    footerRightText: 'Stabil',
  },
];

export function EvaluationPillarsSection({
  pillars = DEFAULT_PILLARS,
  title = 'Ringkasan Kompetensi',
  subtitle = 'Berikut gambaran performamu pada tiga pilar kompetensi TKA Bahasa Indonesia.',
  detailActionText = 'Lihat Detail Kompetensi',
  onViewDetail,
  className,
}: EvaluationPillarsSectionProps) {
  return (
    <section aria-label={title} className={cn('w-full space-y-4', className)}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-slate-800" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
        </div>

        {onViewDetail && (
          <button
            type="button"
            onClick={onViewDetail}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-teal-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>{detailActionText}</span>
            <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>

      {/* Pillars 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-1">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="h-full">
            <EvaluationPillarCard pillar={pillar} />
          </div>
        ))}
      </div>
    </section>
  );
}
