import Image from 'next/image';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

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
    <Card
      className={cn(
        'relative overflow-hidden p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs',
        className
      )}
    >
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-10">
        {/* Left Informational Content */}
        <div className="flex-1 space-y-3 md:space-y-4 text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base text-[#546A72] leading-relaxed max-w-2xl font-normal">
            {description}
          </p>
        </div>

        {/* Right Study Desk Illustration */}
        <div className="w-full md:w-80 sm:w-64 max-w-xs shrink-0 flex items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-[#FAFCFD] to-[#F1F5F9] border border-[#E2E8F0]">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
            <Image
              src="/illustrations/student-learning.jpg"
              alt="Latihan Soal Siswa"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 192px, 256px"
              priority
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
