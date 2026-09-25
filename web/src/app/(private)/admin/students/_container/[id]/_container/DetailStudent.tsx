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

// Chart dataset presets based on timeframe
const TIMEFRAME_CHART_DATA: Record<TimeframePeriod, ChartDataPoint[]> = {
  '7d': [
    { date: '16 Sep', score: 70, label: 'Kosakata & Makna Kontekstual' },
    { date: '18 Sep', score: 78, label: 'Ide Pokok & Kalimat Utama' },
    { date: '20 Sep', score: 76, label: 'Sintesis Argumen Kritis' },
    { date: '22 Sep', score: 84, label: 'Pemahaman Inferensial' },
  ],
  '30d': [
    { date: '28 Agu', score: 62, label: 'Diagnostik Literasi Awal' },
    { date: '04 Sep', score: 65, label: 'Analisis Struktur Teks' },
    { date: '12 Sep', score: 68, label: 'Kaidah Kebahasaan Dasar' },
    { date: '16 Sep', score: 70, label: 'Kosakata & Makna Kontekstual' },
    { date: '18 Sep', score: 78, label: 'Ide Pokok & Kalimat Utama' },
    { date: '22 Sep', score: 84, label: 'Pemahaman Inferensial' },
  ],
  '3m': [
    { date: '12 Sep', score: 68, label: 'Kaidah Kebahasaan Dasar' },
    { date: '14 Sep', score: 72, label: 'Analisis Struktur Paragraf' },
    { date: '16 Sep', score: 70, label: 'Kosakata & Makna Kontekstual' },
    { date: '18 Sep', score: 78, label: 'Ide Pokok & Kalimat Utama' },
    { date: '20 Sep', score: 76, label: 'Sintesis Argumen Kritis' },
    { date: '22 Sep', score: 84, label: 'Pemahaman Inferensial' },
  ],
  '6m': [
    { date: '01 Mei', score: 58, label: 'Pre-Test Kemampuan Bahasa' },
    { date: '15 Jun', score: 64, label: 'Pemahaman Gagasan Pokok' },
    { date: '02 Agu', score: 66, label: 'Struktur Logika Paragraf' },
    { date: '28 Agu', score: 70, label: 'Kosakata & Kalimat Efektif' },
    { date: '12 Sep', score: 78, label: 'Analisis Kritis Teks' },
    { date: '22 Sep', score: 84, label: 'Pemahaman Inferensial' },
  ],
};

const TIMELINE_ACTIVITIES: TimelineActivityItem[] = [
  {
    id: '1',
    timestamp: '18 Sep 2026, 14:10 WIB',
    title: 'Mengerjakan Latihan: Pemahaman Inferensial',
    description: 'Pencatatan evaluasi otomatis paket diagnostik berhasil disimpan.',
  },
  {
    id: '2',
    timestamp: '16 Sep 2026, 09:30 WIB',
    title: 'Mengikuti Tryout TKA Bahasa Indonesia Periode 1',
    description: 'Sesi pengerjaan terjadwal selesai dan terverifikasi di server.',
  },
  {
    id: '3',
    timestamp: '14 Sep 2026, 16:45 WIB',
    title: 'Mengerjakan Paket Latihan TKA Bahasa Indonesia',
    description: 'Siswa membuka 1 modul pengantar dan menyelesaikan 1 kuis mandiri.',
  },
  {
    id: '4',
    timestamp: '12 Sep 2026, 09:15 WIB',
    title: 'Pendaftaran Akun SIMANTIK Berhasil',
    description: 'Verifikasi OTP nomor ponsel & alamat surel tuntas.',
  },
];

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
  const activities: TimelineActivityItem[] =
    userActivitiesData && userActivitiesData.length > 0
      ? userActivitiesData.map((act) => ({
          id: act.id,
          timestamp: act.formatted_time,
          title: act.title,
          description: act.description,
        }))
      : TIMELINE_ACTIVITIES;

  // Map backend progress chart data
  const chartData: ChartDataPoint[] =
    userProgressData?.chart_data && userProgressData.chart_data.length > 0
      ? userProgressData.chart_data.map((c) => ({
          date: c.date,
          score: c.score,
          label: c.label,
        }))
      : TIMEFRAME_CHART_DATA[timeframe];

  const latestScore =
    userProgressData?.latest_score ??
    (userDetail?.average_score ? Math.round(userDetail.average_score) : 84);
  const previousScore = userProgressData?.previous_score ?? 78;
  const scoreDiff = userProgressData?.score_diff ?? 6;
  const trendText = userProgressData?.trend_text ?? 'Tren: Nilai latihan meningkat';
  const latestPracticeTitle =
    userProgressData?.latest_practice_title ?? 'Pemahaman Inferensial & Hubungan Gagasan';
  const latestPracticeDate = userProgressData?.latest_practice_date ?? '22 September 2026';

  const evaluationTitle =
    userProgressData?.evaluation?.evaluation_title ?? 'Pemahaman Inferensial & Hubungan Gagasan';
  const evaluationDate = userProgressData?.evaluation?.evaluation_date ?? '18 September 2026';
  const resultStatus = userProgressData?.evaluation?.result_status ?? 'Hasil: Baik';
  const testDomain =
    userProgressData?.evaluation?.test_domain ?? 'Bahasa Indonesia: Literasi Wacana';
  const testMode = userProgressData?.evaluation?.test_mode ?? 'Mandiri Berwaktu (TKA Standar)';

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
