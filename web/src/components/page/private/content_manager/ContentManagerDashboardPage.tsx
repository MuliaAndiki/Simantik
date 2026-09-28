import React from 'react';
import { ContentManagerDashboardTemplate } from '@/components/templates/content_manager';
import type {
  ContentManagerKpiStats,
  CuratorActivityItem,
  DistribusiBankSoalData,
  ManagedTryoutItem,
  PipelineMateriData,
  TryoutWorkflowAutomation,
} from '@/types/ui/content-manager-dashboard.types';

export interface ContentManagerDashboardPageProps {
  heroTitle?: string;
  heroSubtitle?: string;
  isLoading?: boolean;
  kpiStats?: ContentManagerKpiStats;
  tryoutWorkflow?: TryoutWorkflowAutomation;
  materiPipeline?: PipelineMateriData;
  bankSoalDistribusi?: DistribusiBankSoalData;
  managedTryouts?: ManagedTryoutItem[];
  curatorActivities?: CuratorActivityItem[];
  onAddMaterial?: () => void;
  onAddQuestion?: () => void;
  onCreateTryout?: () => void;
  onAddNews?: () => void;
  onManageQuestionsWorkflow?: () => void;
  onManageTryout?: (id: string) => void;
  onViewAllTryouts?: () => void;
  onOpenAuditTrail?: () => void;
  className?: string;
}

export const ContentManagerDashboardPage: React.FC<ContentManagerDashboardPageProps> = ({
  heroTitle,
  heroSubtitle,
  isLoading,
  kpiStats,
  tryoutWorkflow,
  materiPipeline,
  bankSoalDistribusi,
  managedTryouts,
  curatorActivities,
  onAddMaterial,
  onAddQuestion,
  onCreateTryout,
  onAddNews,
  onManageQuestionsWorkflow,
  onManageTryout,
  onViewAllTryouts,
  onOpenAuditTrail,
  className,
}) => {
  return (
    <ContentManagerDashboardTemplate
      className={className}
      heroProps={{
        title: heroTitle,
        subtitle: heroSubtitle,
      }}
      statCardsProps={{
        stats: kpiStats,
        isLoading,
        onAddMaterial,
        onAddQuestion,
        onCreateTryout,
        onAddNews,
      }}
      workflowCardProps={{
        workflow: tryoutWorkflow,
        isLoading,
        onManageQuestions: onManageQuestionsWorkflow,
      }}
      pipelineCardsProps={{
        materi: materiPipeline,
        bankSoal: bankSoalDistribusi,
        isLoading,
      }}
      managedTryoutsProps={{
        tryouts: managedTryouts,
        totalCount: kpiStats?.totalPaketTryout ?? 0,
        isLoading,
        onManageTryout,
        onViewAll: onViewAllTryouts,
      }}
      curatorActivitiesProps={{
        activities: curatorActivities,
        isLoading,
        onOpenAuditTrail,
      }}
    />
  );
};

export default ContentManagerDashboardPage;
