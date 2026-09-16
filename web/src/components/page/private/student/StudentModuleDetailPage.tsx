import type * as React from 'react';
import type { LearningDetailBreadcrumbProps } from '@/components/molecules/student/LearningDetailBreadcrumb';
import type { ModuleDetailHeroBannerProps } from '@/components/organisms/student/ModuleDetailHeroBanner';
import type { ModuleMaterialsListGridProps } from '@/components/organisms/student/ModuleMaterialsListGrid';
import { StudentModuleDetailTemplate } from '@/components/templates/student/StudentModuleDetailTemplate';

export interface StudentModuleDetailPageProps {
  isLoading?: boolean;
  error?: Error | null;
  breadcrumbProps: LearningDetailBreadcrumbProps;
  heroProps: ModuleDetailHeroBannerProps;
  materialsProps: ModuleMaterialsListGridProps;
  onRetry?: () => void;
  onBackToList?: () => void;
  className?: string;
}

export function StudentModuleDetailPage({
  isLoading,
  error,
  breadcrumbProps,
  heroProps,
  materialsProps,
  onRetry,
  onBackToList,
  className,
}: StudentModuleDetailPageProps) {
  return (
    <StudentModuleDetailTemplate
      isLoading={isLoading}
      error={error}
      breadcrumbProps={breadcrumbProps}
      heroProps={heroProps}
      materialsProps={materialsProps}
      onRetry={onRetry}
      onBackToList={onBackToList}
      className={className}
    />
  );
}

export default StudentModuleDetailPage;
