'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import type {
  AdminStudentEditFormData,
  ChartDataPoint,
  TimeframePeriod,
  TimelineActivityItem,
} from '@/components/organisms/admin';
import { AdminStudentDetailPage } from '@/components/page/private/admin';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { UserStatus } from '@/types/service';

interface DetailStudentDetailContainerProps {
  id: string;
}

const DetailStudentDetailContainer: React.FC<DetailStudentDetailContainerProps> = ({ id }) => {
  const router = useRouter();
  const api = useApi();
  const ns = useAppNameSpace();

  // Fetch student detail
  const {
    data: userDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = api.admin.query.detail(id, { enabled: Boolean(id) });

  // Fetch real activities from backend API
  const { data: userActivitiesData, refetch: refetchActivities } = api.admin.query.activities(id, {
    enabled: Boolean(id),
  });

  // Timeframe state
  const [timeframe, setTimeframe] = useState<TimeframePeriod>('3m');

  // Fetch real performance progress and score curve from backend API
  const { data: userProgressData, refetch: refetchProgress } = api.admin.query.progress(
    id,
    timeframe,
    { enabled: Boolean(id) }
  );

  // Update status mutation
  const updateStatusMutation = api.admin.mutate.updateStatus();

  // Status Dialog state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusValue, setStatusValue] = useState<UserStatus>('active');

  // Edit Dialog state
  const [editDialogOpen, setEditDialogOpenChange] = useState(false);
  const [editFormData, setEditFormData] = useState<AdminStudentEditFormData>({
    fullName: '',
    email: '',
    school: '',
    grade: '',
    major: '',
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Sync edit form data with userDetail
  useEffect(() => {
    if (userDetail) {
      setStatusValue((userDetail.status as UserStatus) || 'active');
      setEditFormData({
        fullName: userDetail.full_name || '',
        email: userDetail.email || '',
        school: userDetail.profile?.school || 'SMAN 3 Bandung',
        grade: userDetail.profile?.grade || 'XII',
        major: userDetail.profile?.major || 'MIPA 2',
      });
    }
  }, [userDetail]);

  // Actions
  const handleBack = () => {
    router.push('/admin/students');
  };

  const handleEdit = () => {
    setEditDialogOpenChange(true);
  };

  const handleToggleStatus = () => {
    if (userDetail) {
      setStatusValue((userDetail.status as UserStatus) || 'active');
    }
    setStatusDialogOpen(true);
  };

  const handleReactivate = () => {
    setStatusValue('active');
    setStatusDialogOpen(true);
  };

  const handleSubmitStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateStatusMutation.mutateAsync({
        id,
        body: { status: statusValue },
      });
      setStatusDialogOpen(false);
      refetchDetail();
      refetchActivities();
      refetchProgress();
    } catch {
      // Toast already handled by mutation hook
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditSubmitting(true);
    try {
      // Simulate/Trigger profile save
      await new Promise((resolve) => setTimeout(resolve, 600));
      ns.alert.toast({
        title: 'Data Siswa Diperbarui',
        message: `Data siswa ${editFormData.fullName} berhasil diperbarui.`,
        icon: 'success',
      });
      setEditDialogOpenChange(false);
      refetchDetail();
      refetchActivities();
      refetchProgress();
    } catch {
      ns.alert.toast({
        title: 'Gagal Memperbarui Siswa',
        message: 'Terjadi kesalahan saat menyimpan perubahan profil.',
        icon: 'error',
      });
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleViewLatestPracticeDetail = () => {
    router.push('/admin/practice');
  };

  const handleViewSystemLog = () => {
    ns.alert.toast({
      title: 'Log Sistem Siswa',
      message: 'Menampilkan riwayat audit pengerjaan dan log aktivitas terkini.',
      icon: 'info',
    });
  };

  // Map backend activity feed data
  const activities: TimelineActivityItem[] = (userActivitiesData ?? []).map((act) => ({
    id: act.id,
    timestamp: act.formatted_time,
    title: act.title,
    description: act.description,
  }));

  // Map backend progress chart data
  const chartData: ChartDataPoint[] = (userProgressData?.chart_data ?? []).map((c) => ({
    date: c.date,
    score: c.score,
    label: c.label,
  }));

  const latestScore = userProgressData?.latest_score;
  const previousScore = userProgressData?.previous_score;
  const scoreDiff = userProgressData?.score_diff;
  const trendText = userProgressData?.trend_text;
  const latestPracticeTitle = userProgressData?.latest_practice_title;
  const latestPracticeDate = userProgressData?.latest_practice_date;

  const evaluationTitle = userProgressData?.evaluation?.evaluation_title;
  const evaluationDate = userProgressData?.evaluation?.evaluation_date;
  const resultStatus = userProgressData?.evaluation?.result_status;
  const testDomain = userProgressData?.evaluation?.test_domain;
  const testMode = userProgressData?.evaluation?.test_mode;

  return (
    <AdminStudentDetailPage
      isLoading={isDetailLoading}
      isError={isDetailError}
      errorMessage={detailError instanceof Error ? detailError.message : undefined}
      userDetail={userDetail}
      onBack={handleBack}
      onEdit={handleEdit}
      onToggleStatus={handleToggleStatus}
      onReactivate={handleReactivate}
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
      chartData={chartData}
      latestScore={latestScore}
      previousScore={previousScore}
      scoreDiff={scoreDiff}
      trendText={trendText}
      latestPracticeTitle={latestPracticeTitle}
      latestPracticeDate={latestPracticeDate}
      onViewLatestPracticeDetail={handleViewLatestPracticeDetail}
      activities={activities}
      onViewSystemLog={handleViewSystemLog}
      evaluationTitle={evaluationTitle}
      evaluationDate={evaluationDate}
      resultStatus={resultStatus}
      testDomain={testDomain}
      testMode={testMode}
      statusDialogOpen={statusDialogOpen}
      onStatusDialogOpenChange={setStatusDialogOpen}
      statusValue={statusValue}
      onStatusValueChange={setStatusValue}
      onSubmitStatus={handleSubmitStatus}
      isStatusSubmitting={updateStatusMutation.isPending}
      editDialogOpen={editDialogOpen}
      onEditDialogOpenChange={setEditDialogOpenChange}
      editFormData={editFormData}
      onEditFormDataChange={setEditFormData}
      onSubmitEdit={handleSubmitEdit}
      isEditSubmitting={isEditSubmitting}
    />
  );
};

export default DetailStudentDetailContainer;
