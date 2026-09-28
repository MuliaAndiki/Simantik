import React from 'react';
import { PageHeading, type PageHeadingProps } from '@/components/molecules/hero';
import {
  ContentManagerCuratorActivities,
  type ContentManagerCuratorActivitiesProps,
  ContentManagerManagedTryouts,
  type ContentManagerManagedTryoutsProps,
  ContentManagerPipelineCards,
  type ContentManagerPipelineCardsProps,
  ContentManagerStatCards,
  type ContentManagerStatCardsProps,
  ContentManagerTryoutWorkflowCard,
  type ContentManagerTryoutWorkflowCardProps,
} from '@/components/organisms/content_manager';
import { cn } from '@/utils/classname';

export interface ContentManagerDashboardTemplateProps {
  heroProps?: PageHeadingProps;
  statCardsProps?: ContentManagerStatCardsProps;
  workflowCardProps?: ContentManagerTryoutWorkflowCardProps;
  pipelineCardsProps?: ContentManagerPipelineCardsProps;
  managedTryoutsProps?: ContentManagerManagedTryoutsProps;
  curatorActivitiesProps?: ContentManagerCuratorActivitiesProps;
  className?: string;
}

export const ContentManagerDashboardTemplate: React.FC<ContentManagerDashboardTemplateProps> = ({
  heroProps,
  statCardsProps,
  workflowCardProps,
  pipelineCardsProps,
  managedTryoutsProps,
  curatorActivitiesProps,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-7 pb-10', className)}>
      {/* 1. Header / Hero Banner */}
      <PageHeading variant="card" {...heroProps} />

      {/* 2. Platform Overview KPI Cards */}
      <ContentManagerStatCards {...statCardsProps} />

      {/* 3. Automated Tryout Distribution Workflow */}
      <ContentManagerTryoutWorkflowCard {...workflowCardProps} />

      {/* 4. Pipeline & Bank Soal Status Cards */}
      <ContentManagerPipelineCards {...pipelineCardsProps} />

      {/* 5. Bottom Row: Managed Tryouts & Curator Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-7 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 flex">
          <ContentManagerManagedTryouts {...managedTryoutsProps} className="h-full" />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex">
          <ContentManagerCuratorActivities {...curatorActivitiesProps} className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default ContentManagerDashboardTemplate;
