import { ChevronsRight } from 'lucide-react';
import type * as React from 'react';
import {
  EvaluationNextStepCard,
  type EvaluationNextStepItem,
} from '@/components/molecules/student';
import { cn } from '@/utils/classname';

export interface EvaluationNextStepsSectionProps {
  steps?: EvaluationNextStepItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const DEFAULT_NEXT_STEPS: EvaluationNextStepItem[] = [
  {
    id: 'step-01',
    stepNumber: '01',
    title: 'Perkuat Pemahaman Inferensial',
    description:
      'Latih kemampuan menyimpulkan informasi tersirat dan menyingkirkan jawaban pengecoh dari wacana panjang.',
    actionText: 'Lihat Kompetensi',
    actionVariant: 'outline',
  },
  {
    id: 'step-02',
    stepNumber: '02',
    title: 'Kerjakan Latihan',
    description:
      'Latih kemampuan membaca dan penalaran kritis melalui paket latihan 15 soal adaptif Bahasa Indonesia.',
    actionText: 'Mulai Latihan',
    actionVariant: 'solid',
  },
  {
    id: 'step-03',
    stepNumber: '03',
    title: 'Pelajari Materi',
    description:
      'Perdalam materi kaidah sintaksis, kohesi wacana, serta teknik dekonstruksi teks argumentatif formal.',
    actionText: 'Belajar',
    actionVariant: 'outline',
  },
];

export function EvaluationNextStepsSection({
  steps = DEFAULT_NEXT_STEPS,
  title = 'Langkah Selanjutnya',
  subtitle = 'Berdasarkan hasil evaluasimu, ini rekomendasi langkah terarah yang bisa kamu lakukan.',
  className,
}: EvaluationNextStepsSectionProps) {
  return (
    <section aria-label={title} className={cn('w-full space-y-4', className)}>
      {/* Section Header */}
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <ChevronsRight className="size-5 text-slate-800" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
      </div>

      {/* Steps 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-1">
        {steps.map((step) => (
          <div key={step.id} className="h-full">
            <EvaluationNextStepCard step={step} />
          </div>
        ))}
      </div>
    </section>
  );
}
