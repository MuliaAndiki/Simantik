import * as React from 'react';

import { FeaturePreviewCard } from '@/components/molecules';
import { cn } from '@/utils/classname';

export interface ComingSoonFeaturesProps extends React.HTMLAttributes<HTMLDivElement> {
  sectionTitle?: string;
  sectionSubtitle?: string;
}

const defaultFeatures = [
  {
    icon: 'lucide:brain-circuit',
    title: 'Adaptive Computerized Testing (CAT)',
    description:
      'Tingkat kesulitan soal menyesuaikan kemampuan siswa secara otomatis dan dinamis di setiap langkah pengerjaan tryout.',
    badgeText: 'Algoritma Pintar',
  },
  {
    icon: 'lucide:book-open-check',
    title: 'Bank Soal & Pembahasan IRT',
    description:
      'Ribuan butir soal terstandarisasi dengan model Item Response Theory dilengkapi tips & trik pembahasan mendalam.',
    badgeText: 'Terstandar SNBT',
  },
  {
    icon: 'lucide:layers',
    title: 'Modul Belajar Terarah (LMS)',
    description:
      'Materi micro-learning terstruktur yang dirancang untuk menguatkan pemahaman konseptual dan menutup celah kelemahan.',
    badgeText: 'Micro-Learning',
  },
  {
    icon: 'lucide:line-chart',
    title: 'Analitik & Rekomendasi Presisi',
    description:
      'Laporan performa kompetensi tekstual, inferensial, dan evaluasi dengan rekomendasi materi belajar yang dipersonalisasi.',
    badgeText: 'Diagnostik Akurat',
  },
];

export function ComingSoonFeatures({
  sectionTitle = 'Fitur Unggulan yang Akan Hadir',
  sectionSubtitle = 'Dirancang untuk memberikan pengalaman belajar terbaik dengan teknologi evaluasi terkini.',
  className,
  ...props
}: ComingSoonFeaturesProps) {
  return (
    <section
      className={cn(
        'max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-[#E5E7EB]/60',
        className
      )}
      {...props}
    >
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
        <h2 className="font-bold text-2xl sm:text-3xl text-[#111827] tracking-tight">
          {sectionTitle}
        </h2>
        <p className="text-sm sm:text-base text-[#546A72] leading-relaxed">{sectionSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {defaultFeatures.map((feat) => (
          <FeaturePreviewCard
            key={feat.title}
            icon={feat.icon}
            title={feat.title}
            description={feat.description}
            badgeText={feat.badgeText}
          />
        ))}
      </div>
    </section>
  );
}
