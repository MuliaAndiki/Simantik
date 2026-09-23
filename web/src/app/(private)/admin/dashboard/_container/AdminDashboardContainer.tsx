'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { AdminDashboardPage } from '@/components/page/private/admin/AdminDashboardPage';
import { useApi } from '@/hooks/useApi';

export function AdminDashboardContainer() {
  const router = useRouter();
  const api = useApi();

  const { data: dashboardData, isLoading } = api.admin.query.dashboard();
  const { data: schoolsData } = api.school.query.list({ limit: 100 });
  const { data: tryoutsData } = api.tryout.query.list({ limit: 100 });
  const { data: materialsData } = api.learning.query.materials({ limit: 100 });

  const totalSchools = schoolsData?.total ?? 0;
  const totalStudents = dashboardData?.total_students ?? 0;
  const totalQuestions = dashboardData?.total_questions ?? 0;
  const totalTryouts = dashboardData?.total_tryouts ?? tryoutsData?.total ?? 0;
  const totalMaterials = dashboardData?.total_materials ?? materialsData?.total ?? 0;
  const completedAttempts = dashboardData?.completed_attempts ?? 0;
  const averageScore = dashboardData?.average_tryout_score ?? 0;

  const recentActivities = useMemo(() => {
    return dashboardData?.recent_activities ?? [];
  }, [dashboardData]);

  return (
    <AdminDashboardPage
      statCardsProps={{
        totalStudents,
        totalSchools,
        totalTryouts,
        totalQuestions,
        completedAttempts,
        averageScore,
        isLoading,
      }}
      quickActionsProps={{
        onNavigateSchools: () => router.push('/admin/schools'),
        onNavigateStudents: () => router.push('/admin/students'),
        onNavigateContentManagers: () => router.push('/admin/content-managers'),
        onNavigateTryouts: () => router.push('/admin/tryouts'),
        onNavigateMaterials: () => router.push('/admin/materials'),
      }}
      recentAttemptsProps={{
        activities: recentActivities,
        onViewAllTryouts: () => router.push('/admin/tryouts'),
      }}
      curriculumSummaryProps={{
        totalMaterials,
        totalQuestions,
        totalTryouts,
        onCreateMaterial: () => router.push('/admin/materials/create'),
        onCreateNews: () => router.push('/admin/news/create'),
      }}
    />
  );
}

export default AdminDashboardContainer;
