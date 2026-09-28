import type * as React from 'react';
import { SplitHero } from '@/components/molecules/hero';

export interface LearningHeroBannerProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LearningHeroBanner({
  title = 'Materi Bahasa Indonesia',
  description = 'Pelajari berbagai materi untuk membantu kamu memahami soal TKA Bahasa Indonesia. Dirancang terstruktur mencakup seluruh domain uji kompetensi nasional.',
  className,
}: LearningHeroBannerProps) {
  return (
    <SplitHero
      title={title}
      description={description}
      illustrationAlt="Materi Pembelajaran Siswa"
      className={className}
    />
  );
}
