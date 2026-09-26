import type { LearningDetailBreadcrumbProps } from '@/components/molecules/student/LearningDetailBreadcrumb';
import type { LearningDetailCtaBannerProps } from '@/components/molecules/student/LearningDetailCtaBanner';
import type { LearningDetailContentCardProps } from '@/components/organisms/student/LearningDetailContentCard';
import type { LearningDetailHeroBannerProps } from '@/components/organisms/student/LearningDetailHeroBanner';
import type { LearningDetailObjectivesCardProps } from '@/components/organisms/student/LearningDetailObjectivesCard';
import type { LearningDetailRelatedMaterialsProps } from '@/components/organisms/student/LearningDetailRelatedMaterials';
import { StudentLearningDetailTemplate } from '@/components/templates/student/StudentLearningDetailTemplate';

export interface StudentLearningDetailPageProps {
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

export function StudentLearningDetailPage({
  isLoading,
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
}: StudentLearningDetailPageProps) {
  return (
    <StudentLearningDetailTemplate
      isLoading={isLoading}
      error={error}
      breadcrumbProps={breadcrumbProps}
      heroProps={heroProps}
      objectivesProps={objectivesProps}
      contentProps={contentProps}
      ctaProps={ctaProps}
      relatedMaterialsProps={relatedMaterialsProps}
      onRetry={onRetry}
      onBackToList={onBackToList}
      className={className}
    />
  );
}

export default StudentLearningDetailPage;
