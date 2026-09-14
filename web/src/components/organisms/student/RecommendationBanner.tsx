import { Play, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { DashboardSectionHeader } from '@/components/molecules/student/DashboardSectionHeader';
import { cn } from '@/utils/classname';

export interface RecommendationBannerProps {
  topicTitle?: string;
  recommendationDescription?: string;
  badgeText?: string;
  onStartPractice?: () => void;
  practiceHref?: string;
  className?: string;
}

export function RecommendationBanner({
  topicTitle = 'Perkuat Pemahaman Inferensial',
  recommendationDescription = 'Kamu dapat meningkatkan kemampuan dengan berlatih menemukan informasi tersirat dan hubungan antargagasan dalam teks. Berdasarkan evaluasi terakhir, latihan ini akan menaikkan skor TKA secara signifikan.',
  badgeText = 'Rekomendasi Latihan Terarah',
  onStartPractice,
  practiceHref = '/student/practice',
  className,
}: RecommendationBannerProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <DashboardSectionHeader
        title="Rekomendasi Untukmu"
        subtitle="Rekomendasi tindakan berbasis analisis kelemahan kompetensi"
      />

      <Card className="p-6 md:p-8 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-6 md:gap-10">
          {/* Left Text & CTA */}
          <div className="flex-1 space-y-4 md:space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200/60">
              <Zap className="size-3.5 fill-amber-500 text-amber-500" />
              <span>{badgeText}</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
              {topicTitle}
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-[#546A72] leading-relaxed max-w-2xl font-normal">
              {recommendationDescription}
            </p>

            <div className="pt-2">
              {practiceHref ? (
                <Button
                  asChild
                  className="h-11 px-6 rounded-xl bg-[#F7CE46] hover:bg-[#ebc238] text-[#1A4D5C] font-bold text-sm shadow-sm gap-2 border-none transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link href={practiceHref} onClick={onStartPractice}>
                    <Play className="size-4 fill-[#1A4D5C] text-[#1A4D5C]" />
                    <span>Mulai Latihan</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={onStartPractice}
                  className="h-11 px-6 rounded-xl bg-[#F7CE46] hover:bg-[#ebc238] text-[#1A4D5C] font-bold text-sm shadow-sm gap-2 border-none transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Play className="size-4 fill-[#1A4D5C] text-[#1A4D5C]" />
                  <span>Mulai Latihan</span>
                </Button>
              )}
            </div>
          </div>

          {/* Right Student Character Illustration */}
          <div className="w-full lg:w-72 sm:w-60 max-w-xs shrink-0 flex items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-[#FAFCFD] to-[#F1F5F9] border border-[#E2E8F0]">
            <div className="relative w-48 h-56 md:w-56 md:h-64">
              <Image
                src="/illustrations/student-recommendation.jpg"
                alt="Rekomendasi Belajar Siswa"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 192px, 224px"
                priority
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
