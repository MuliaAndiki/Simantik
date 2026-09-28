import React from 'react';
import { PageHeading, type PageHeadingProps } from '@/components/molecules/hero';
import {
  AdminDashboardContentStatus,
  type AdminDashboardContentStatusProps,
  AdminDashboardGrowthChart,
  type AdminDashboardGrowthChartProps,
  AdminDashboardQuickActions,
  type AdminDashboardQuickActionsProps,
  AdminDashboardRecentActivities,
  type AdminDashboardRecentActivitiesProps,
  AdminDashboardRecentStudentsTable,
  type AdminDashboardRecentStudentsTableProps,
  AdminDashboardStatCards,
  type AdminDashboardStatCardsProps,
} from '@/components/organisms/admin';
import { cn } from '@/utils/classname';

export interface AdminDashboardTemplateProps {
  heroProps?: PageHeadingProps;
  quickActionsProps: AdminDashboardQuickActionsProps;
  statCardsProps: AdminDashboardStatCardsProps;
  contentStatusProps?: AdminDashboardContentStatusProps;
  recentActivitiesProps?: AdminDashboardRecentActivitiesProps;
  growthChartProps?: AdminDashboardGrowthChartProps;
  recentStudentsTableProps?: AdminDashboardRecentStudentsTableProps;
  className?: string;
}

export const AdminDashboardTemplate: React.FC<AdminDashboardTemplateProps> = ({
  heroProps,
  quickActionsProps,
  statCardsProps,
  contentStatusProps,
  recentActivitiesProps,
  growthChartProps,
  recentStudentsTableProps,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-6 pb-12', className)}>
      {/* 1. Header Hero / Page Title */}
      <PageHeading title={heroProps?.title ?? 'Dashboard'} subtitle={heroProps?.subtitle} />

      {/* 2. Quick Actions */}
      <AdminDashboardQuickActions {...quickActionsProps} />

      {/* 3. Primary KPI Stat Cards (5 cards) */}
      <AdminDashboardStatCards {...statCardsProps} />

      {/* 4. Middle Row: Content Status & Recent Activities Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex">
          <AdminDashboardContentStatus {...contentStatusProps} className="h-full" />
        </div>
        <div className="lg:col-span-6 flex">
          <AdminDashboardRecentActivities {...recentActivitiesProps} className="h-full" />
        </div>
      </div>

      {/* 5. Student Growth Chart */}
      <AdminDashboardGrowthChart {...growthChartProps} />

      {/* 6. Recent Registered Students Table */}
      <AdminDashboardRecentStudentsTable {...recentStudentsTableProps} />
    </div>
  );
};

export default AdminDashboardTemplate;
