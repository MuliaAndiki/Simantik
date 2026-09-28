import type * as React from 'react';
import { DashboardGrid } from '@/components/molecules/grid';
import { NewsUpdateCard } from '@/components/molecules/student/NewsUpdateCard';

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
  return (
    <DashboardGrid
      title="Informasi Terbaru"
      subtitle="Pembaruan silabus dan info resmi seleksi masuk perguruan tinggi"
      isLoading={isLoading}
      isEmpty={!newsList || newsList.length === 0}
      className={className}
    >
      {(newsList ?? []).map((item) => (
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
    </DashboardGrid>
  );
}
