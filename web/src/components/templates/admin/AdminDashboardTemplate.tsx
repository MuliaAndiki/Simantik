import React from 'react';
import {
  AdminDashboardCurriculumSummary,
  type AdminDashboardCurriculumSummaryProps,
  AdminDashboardHero,
  type AdminDashboardHeroProps,
  AdminDashboardQuickActions,
  type AdminDashboardQuickActionsProps,
  AdminDashboardRecentAttempts,
  type AdminDashboardRecentAttemptsProps,
  AdminDashboardStatCards,
  type AdminDashboardStatCardsProps,
} from '@/components/organisms/admin';
import { cn } from '@/utils/classname';

export interface AdminDashboardTemplateProps {
  heroProps?: AdminDashboardHeroProps;
  statCardsProps: AdminDashboardStatCardsProps;
  quickActionsProps: AdminDashboardQuickActionsProps;
  recentAttemptsProps: AdminDashboardRecentAttemptsProps;
  curriculumSummaryProps: AdminDashboardCurriculumSummaryProps;
  className?: string;
}

export const AdminDashboardTemplate: React.FC<AdminDashboardTemplateProps> = ({
  heroProps,
  statCardsProps,
  quickActionsProps,
  recentAttemptsProps,
  curriculumSummaryProps,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-7 pb-10', className)}>
      {/* 1. Header Hero Banner */}
      <AdminDashboardHero {...heroProps} />

      {/* 2. Platform Overview KPI Cards */}
      <AdminDashboardStatCards {...statCardsProps} />

      {/* 3. Management & Quick Actions */}
      <AdminDashboardQuickActions {...quickActionsProps} />

      {/* 4. Bottom Row: Recent Exam Attempts Feed & Curriculum Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-7 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 flex">
          <AdminDashboardRecentAttempts {...recentAttemptsProps} className="h-full" />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex">
          <AdminDashboardCurriculumSummary {...curriculumSummaryProps} className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardTemplate;
