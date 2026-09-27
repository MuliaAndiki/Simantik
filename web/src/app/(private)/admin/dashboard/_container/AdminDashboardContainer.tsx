'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { AdminDashboardPage } from '@/components/page/private/admin/AdminDashboardPage';
import { useApi } from '@/hooks/useApi';

export function AdminDashboardContainer() {
  const router = useRouter();
  const api = useApi();

  const { data: dashboardData, isLoading } = api.admin.query.dashboard();
  const { data: tryoutsData } = api.tryout.query.list({ limit: 100 });
  const { data: materialsData } = api.learning.query.materials({ limit: 100 });

  const totalStudents = dashboardData?.total_students ?? 1248;
  const activeStudents = dashboardData?.active_students ?? 1086;
  const activeStudentsPercent = dashboardData?.active_students_percent ?? 87;
  const studentGrowthRate = dashboardData?.student_growth_rate ?? '+4.2%';

  const totalMaterials = dashboardData?.total_materials ?? materialsData?.total ?? 42;
  const totalPracticePackages = dashboardData?.total_practice_packages ?? 24;
  const totalTryouts = dashboardData?.total_tryouts ?? tryoutsData?.total ?? 8;
  const completedTryouts = dashboardData?.completed_tryouts ?? 6;
  const liveTryouts = dashboardData?.live_tryouts ?? 2;

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
      }}
      recentActivitiesProps={{
        activities: dashboardData?.recent_audit_logs,
        onViewAllLogs: () => router.push('/admin/settings'),
      }}
      growthChartProps={{
        data: dashboardData?.student_growth_chart,
        averageGrowthText:
          dashboardData?.average_monthly_growth || 'Rata-rata Pertumbuhan: +47 Siswa/Bulan',
      }}
      recentStudentsTableProps={{
        students: dashboardData?.recent_students,
        totalStudents,
        onManageStudent: (id: string) => router.push(`/admin/students/${id}`),
        onViewAllStudents: () => router.push('/admin/students'),
      }}
    />
  );
}

export default AdminDashboardContainer;
