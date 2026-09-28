import type * as React from 'react';
import { CardSkeleton } from '@/components/atoms/loading';
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
  isLoading?: boolean;
  onReadNews?: (newsId: string) => void;
  className?: string;
}

export function LatestUpdatesGrid({
  newsList,
  isLoading,
  onReadNews,
  className,
}: LatestUpdatesGridProps) {
  if (isLoading) {
    return (
      <section className={cn('space-y-4', className)}>
        <DashboardSectionHeader
          title="Informasi Terbaru"
          subtitle="Pembaruan silabus dan info resmi seleksi masuk perguruan tinggi"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={`news-skeleton-${i}`} lines={2} />
          ))}
        </div>
      </section>
    );
  }

  if (!newsList || newsList.length === 0) return null;

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
