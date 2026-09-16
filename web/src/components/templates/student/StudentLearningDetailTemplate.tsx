import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { Skeleton } from '@/components/atoms/skeleton';
import {
  LearningDetailBreadcrumb,
  type LearningDetailBreadcrumbProps,
} from '@/components/molecules/student/LearningDetailBreadcrumb';
import {
  LearningDetailCtaBanner,
  type LearningDetailCtaBannerProps,
} from '@/components/molecules/student/LearningDetailCtaBanner';
import {
  LearningDetailContentCard,
  type LearningDetailContentCardProps,
  LearningDetailHeroBanner,
  type LearningDetailHeroBannerProps,
  LearningDetailObjectivesCard,
  type LearningDetailObjectivesCardProps,
  LearningDetailRelatedMaterials,
  type LearningDetailRelatedMaterialsProps,
  StudentDashboardFooter,
} from '@/components/organisms/student';
import { cn } from '@/utils/classname';

export interface StudentLearningDetailTemplateProps {
  isLoading?: boolean;
  error?: Error | null;
  breadcrumbProps: LearningDetailBreadcrumbProps;
  heroProps: LearningDetailHeroBannerProps;
  objectivesProps?: LearningDetailObjectivesCardProps;
  contentProps: LearningDetailContentCardProps;
  ctaProps?: LearningDetailCtaBannerProps;
  relatedMaterialsProps?: LearningDetailRelatedMaterialsProps;
  onRetry?: () => void;
  onBackToList?: () => void;
  className?: string;
}

export function StudentLearningDetailTemplate({
  isLoading = false,
  error,
  breadcrumbProps,
  heroProps,
  objectivesProps,
  contentProps,
  ctaProps,
  relatedMaterialsProps,
  onRetry,
  onBackToList,
  className,
}: StudentLearningDetailTemplateProps) {
  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 py-2">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-5 w-48 rounded-md" />
        </div>

        {/* Hero Banner Skeleton */}
        <Card className="p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="flex-1 space-y-4 w-full">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-6 w-40 rounded-md" />
              </div>
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-2/3 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md pt-2" />
            </div>
            <Skeleton className="w-full md:w-72 h-44 rounded-2xl" />
          </div>
        </Card>

        {/* Objectives Skeleton */}
        <Card className="p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white space-y-4">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-6 w-80 rounded-md" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-5 w-2/3 rounded-md" />
            <Skeleton className="h-5 w-4/5 rounded-md" />
          </div>
        </Card>

        {/* Content Skeleton */}
        <Card className="p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white space-y-6">
          <Skeleton className="h-7 w-36 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
          <Skeleton className="h-24 w-full rounded-2xl" />
        </Card>

        <StudentDashboardFooter />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
        <LearningDetailBreadcrumb {...breadcrumbProps} />

        <Card className="p-8 sm:p-12 rounded-2xl md:rounded-3xl border border-red-200 bg-red-50/50 text-center space-y-4">
          <div className="mx-auto size-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#111827]">Gagal Memuat Materi</h3>
            <p className="text-sm text-[#546A72] max-w-md mx-auto">
              {error.message ||
                'Terjadi kesalahan saat memuat materi pembelajaran. Silakan coba kembali.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onRetry && (
              <Button
                type="button"
                onClick={onRetry}
                className="gap-2 rounded-xl bg-[#1A4D5C] hover:bg-[#133944] text-white"
              >
                <RefreshCw className="size-4" />
                <span>Coba Lagi</span>
              </Button>
            )}
            {onBackToList && (
              <Button
                type="button"
                variant="outline"
                onClick={onBackToList}
                className="gap-2 rounded-xl border-[#E5E7EB]"
              >
                <ArrowLeft className="size-4" />
                <span>Kembali ke Daftar Materi</span>
              </Button>
            )}
          </div>
        </Card>

        <StudentDashboardFooter />
      </div>
    );
  }

  // 3. Normal State
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
      {/* 1. Breadcrumb / Back Action */}
      <LearningDetailBreadcrumb {...breadcrumbProps} />

      {/* 2. Top Informational Hero Banner */}
      <LearningDetailHeroBanner {...heroProps} />

      {/* 3. Learning Objectives Card */}
      <LearningDetailObjectivesCard {...objectivesProps} />

      {/* 4. Main Structured Material Content Card */}
      <LearningDetailContentCard {...contentProps} />

      {/* 5. Comprehension Check CTA Banner */}
      <LearningDetailCtaBanner {...ctaProps} />

      {/* 6. Related Materials Grid */}
      <LearningDetailRelatedMaterials {...relatedMaterialsProps} />

      {/* 7. Unified Footer */}
      <StudentDashboardFooter />
    </div>
  );
}
