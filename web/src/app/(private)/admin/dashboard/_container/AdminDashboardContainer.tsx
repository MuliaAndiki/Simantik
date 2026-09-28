'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { AdminDashboardPage } from '@/components/page/private/admin/AdminDashboardPage';
import { useApi } from '@/hooks/useApi';

export function AdminDashboardContainer() {
  const router = useRouter();
  const api = useApi();

  const { data: dashboardData, isLoading: isDashboardLoading } = api.admin.query.dashboard();
  const { data: tryoutsData, isLoading: isTryoutsLoading } = api.tryout.query.list({
    limit: 100,
  });
  const { data: materialsData, isLoading: isMaterialsLoading } = api.learning.query.materials({
    limit: 100,
  });

  const isLoading = isDashboardLoading || isTryoutsLoading || isMaterialsLoading;

  const totalStudents = dashboardData?.total_students;
  const activeStudents = dashboardData?.active_students;
  const activeStudentsPercent = dashboardData?.active_students_percent;
  const studentGrowthRate = dashboardData?.student_growth_rate;

  const totalMaterials = dashboardData?.total_materials ?? materialsData?.total;
  const totalPracticePackages = dashboardData?.total_practice_packages;
  const totalTryouts = dashboardData?.total_tryouts ?? tryoutsData?.total;
  const completedTryouts = dashboardData?.completed_tryouts;
  const liveTryouts = dashboardData?.live_tryouts;

  return (
    <AdminDashboardPage
      heroProps={{
        title: 'Dashboard',
        subtitle: 'Kelola dan pantau aktivitas SIMANTIK dalam satu tempat.',
      }}
      quickActionsProps={{
        onAddStudent: () => router.push('/admin/students'),
        onAddMaterial: () => router.push('/admin/materials/create'),
        onAddPackage: () => router.push('/admin/practice'),
        onAddTryout: () => router.push('/admin/tryouts'),
        onAddNews: () => router.push('/admin/news/create'),
      }}
      statCardsProps={{
        totalStudents,
        activeStudents,
        activeStudentsPercent,
        studentGrowthRate,
        totalMaterials,
        totalPracticePackages,
        totalTryouts,
        completedTryouts,
        liveTryouts,
        isLoading,
      }}
      contentStatusProps={{
        materials: dashboardData?.material_status,
        practices: dashboardData?.practice_status,
        tryouts: dashboardData?.tryout_status,
        isLoading,
      }}
      recentActivitiesProps={{
        activities: dashboardData?.recent_audit_logs,
        isLoading,
        onViewAllLogs: () => router.push('/admin/settings'),
      }}
      growthChartProps={{
        data: dashboardData?.student_growth_chart,
        averageGrowthText: dashboardData?.average_monthly_growth
          ? `Rata-rata Pertumbuhan: ${dashboardData.average_monthly_growth}`
          : undefined,
        isLoading,
      }}
      recentStudentsTableProps={{
        students: dashboardData?.recent_students,
        totalStudents,
        isLoading,
        onManageStudent: (id: string) => router.push(`/admin/students/${id}`),
        onViewAllStudents: () => router.push('/admin/students'),
      }}
    />
  );
}

export default AdminDashboardContainer;
