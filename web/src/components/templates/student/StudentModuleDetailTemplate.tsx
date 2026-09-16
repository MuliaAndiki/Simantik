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
  ModuleDetailHeroBanner,
  type ModuleDetailHeroBannerProps,
  ModuleMaterialsListGrid,
  type ModuleMaterialsListGridProps,
  StudentDashboardFooter,
} from '@/components/organisms/student';
import { cn } from '@/utils/classname';

export interface StudentModuleDetailTemplateProps {
  isLoading?: boolean;
  error?: Error | null;
  breadcrumbProps: LearningDetailBreadcrumbProps;
  heroProps: ModuleDetailHeroBannerProps;
  materialsProps: ModuleMaterialsListGridProps;
  onRetry?: () => void;
  onBackToList?: () => void;
  className?: string;
}

export function StudentModuleDetailTemplate({
  isLoading = false,
  error,
  breadcrumbProps,
  heroProps,
  materialsProps,
  onRetry,
  onBackToList,
  className,
}: StudentModuleDetailTemplateProps) {
  if (isLoading) {
    return (
      <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 py-2">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-5 w-48 rounded-md" />
        </div>

        {/* Hero Skeleton */}
        <Card className="p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="flex-1 space-y-4 w-full">
              <Skeleton className="h-6 w-36 rounded-md" />
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-3 w-48 rounded-full" />
            </div>
            <Skeleton className="w-full md:w-72 h-44 rounded-2xl" />
          </div>
        </Card>

        {/* Materials Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 rounded-2xl border border-[#E5E7EB] bg-white space-y-4">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </Card>
          ))}
        </div>

        <StudentDashboardFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
        <LearningDetailBreadcrumb {...breadcrumbProps} />

        <Card className="p-8 sm:p-12 rounded-2xl md:rounded-3xl border border-red-200 bg-red-50/50 text-center space-y-4">
          <div className="mx-auto size-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#111827]">Gagal Memuat Modul</h3>
            <p className="text-sm text-[#546A72] max-w-md mx-auto">
              {error.message ||
                'Terjadi kesalahan saat memuat modul pembelajaran. Silakan coba kembali.'}
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
                <span>Kembali ke Daftar Modul</span>
              </Button>
            )}
          </div>
        </Card>

        <StudentDashboardFooter />
      </div>
    );
  }

  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
      <LearningDetailBreadcrumb {...breadcrumbProps} />
      <ModuleDetailHeroBanner {...heroProps} />
      <ModuleMaterialsListGrid {...materialsProps} />
      <StudentDashboardFooter />
    </div>
  );
}
