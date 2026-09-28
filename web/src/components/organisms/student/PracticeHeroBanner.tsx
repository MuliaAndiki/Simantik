import type * as React from 'react';
import { SplitHero } from '@/components/molecules/hero';

export interface PracticeHeroBannerProps {
  title?: string;
  description?: string;
  className?: string;
}

export function PracticeHeroBanner({
  title = 'Latihan Soal TKA Bahasa Indonesia',
  description = 'Latih kemampuan membaca dan pahami berbagai jenis teks untuk menghadapi TKA Bahasa Indonesia. Kerjakan paket soal terstandardisasi dan evaluasi akurasi jawabanmu.',
  className,
}: PracticeHeroBannerProps) {
  return (
    <SplitHero
      title={title}
      description={description}
      illustrationAlt="Latihan Soal Siswa"
      className={className}
    />
  );
}
