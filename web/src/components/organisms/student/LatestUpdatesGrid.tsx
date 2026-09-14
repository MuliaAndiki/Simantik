import type * as React from 'react';
import { DashboardSectionHeader } from '@/components/molecules/student/DashboardSectionHeader';
import { NewsUpdateCard } from '@/components/molecules/student/NewsUpdateCard';
import { cn } from '@/utils/classname';

export interface NewsItem {
  id: string;
  category: string;
  categoryVariant?: 'cyan' | 'amber' | 'indigo' | 'default';
  date: string;
  title: string;
  excerpt: string;
  href?: string;
}

export interface LatestUpdatesGridProps {
  newsList?: NewsItem[];
  onReadNews?: (newsId: string) => void;
  className?: string;
}

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    category: 'Panduan TKA',
    categoryVariant: 'cyan',
    date: '18 Feb 2025',
    title: 'Distribusi Tipe Soal Bahasa Indonesia TKA 2025 Resmi Dirilis',
    excerpt:
      'Badan Standar Kurikulum mengumumkan bobot inferensial dan analitis kini mencakup 45% dari keseluruhan...',
  },
  {
    id: 'news-2',
    category: 'Jadwal Tryout',
    categoryVariant: 'amber',
    date: '15 Feb 2025',
    title: 'Jadwal Tryout TKA Akbar Serentak Periode Maret Dibuka',
    excerpt:
      'Pendaftaran simulasi akbar telah dibuka untuk seluruh siswa SMA/SMK. Hasil pengerjaan tryout lengkap akan...',
  },
  {
    id: 'news-3',
    category: 'Tips Belajar',
    categoryVariant: 'indigo',
    date: '10 Feb 2025',
    title: 'Strategi Menjawab Soal Hubungan Antarkalimat dengan Cepat',
    excerpt:
      'Pelajari trik mengidentifikasi konjungsi koordinatif dan subordinatif untuk memangkas waktu pengerjaan teks...',
  },
];

export function LatestUpdatesGrid({
  newsList = DEFAULT_NEWS,
  onReadNews,
  className,
}: LatestUpdatesGridProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <DashboardSectionHeader
        title="Informasi Terbaru"
        subtitle="Pembaruan silabus dan info resmi seleksi masuk perguruan tinggi"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {newsList.map((item) => (
          <NewsUpdateCard
            key={item.id}
            category={item.category}
            categoryVariant={item.categoryVariant}
            date={item.date}
            title={item.title}
            excerpt={item.excerpt}
            actionText="Baca Selengkapnya"
            onReadMore={() => onReadNews?.(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
