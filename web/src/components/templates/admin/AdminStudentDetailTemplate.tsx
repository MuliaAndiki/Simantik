import React from 'react';
import {
  AdminStudentActivitySummaryCard,
  AdminStudentActivityTimelineCard,
  AdminStudentAuditEvaluationCard,
  AdminStudentDetailHeader,
  AdminStudentEditDialog,
  type AdminStudentEditFormData,
  AdminStudentInactiveBanner,
  AdminStudentInfoCard,
  AdminStudentProfileHero,
  AdminStudentProgressChartCard,
  AdminUserStatusDialog,
  type ChartDataPoint,
  type TimeframePeriod,
  type TimelineActivityItem,
} from '@/components/organisms/admin';
import type { AdminUserDetailResponse, UserStatus } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminStudentDetailTemplateProps {
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  userDetail?: AdminUserDetailResponse | null;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onReactivate: () => void;

  // Progress chart & timeframe
  timeframe: TimeframePeriod;
  onTimeframeChange: (tf: TimeframePeriod) => void;
  chartData?: ChartDataPoint[];
  latestScore?: number;
  previousScore?: number;
  scoreDiff?: number;
  trendText?: string;
  latestPracticeTitle?: string;
  latestPracticeDate?: string;
  onViewLatestPracticeDetail?: () => void;

  // Timeline & activities
  activities?: TimelineActivityItem[];
  onViewSystemLog?: () => void;

  // Evaluation
  evaluationTitle?: string;
  evaluationDate?: string;
  resultStatus?: string;
  testDomain?: string;
  testMode?: string;

  // Status Dialog
  statusDialogOpen: boolean;
  onStatusDialogOpenChange: (open: boolean) => void;
  statusValue: UserStatus;
  onStatusValueChange: (status: UserStatus) => void;
  onSubmitStatus: (e: React.FormEvent) => Promise<void> | void;
  isStatusSubmitting?: boolean;

  // Edit Dialog
  editDialogOpen: boolean;
  onEditDialogOpenChange: (open: boolean) => void;
  editFormData: AdminStudentEditFormData;
  onEditFormDataChange: (data: AdminStudentEditFormData) => void;
  onSubmitEdit: (e: React.FormEvent) => void;
  isEditSubmitting?: boolean;

  className?: string;
}

export const AdminStudentDetailTemplate: React.FC<AdminStudentDetailTemplateProps> = ({
  isLoading = false,
  isError = false,
  errorMessage,
  userDetail,
  onBack,
  onEdit,
  onToggleStatus,
  onReactivate,
  timeframe,
  onTimeframeChange,
  chartData,
  latestScore,
  previousScore,
  scoreDiff,
  trendText,
  latestPracticeTitle,
  latestPracticeDate,
  onViewLatestPracticeDetail,
  activities,
  onViewSystemLog,
  evaluationTitle,
  evaluationDate,
  resultStatus,
  testDomain,
  testMode,
  statusDialogOpen,
  onStatusDialogOpenChange,
  statusValue,
  onStatusValueChange,
  onSubmitStatus,
  isStatusSubmitting,
  editDialogOpen,
  onEditDialogOpenChange,
  editFormData,
  onEditFormDataChange,
  onSubmitEdit,
  isEditSubmitting,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={cn('w-full max-w-7xl mx-auto space-y-6 pb-12', className)}>
        {/* Skeleton Header */}
        <div className="space-y-3">
          <div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-8 w-60 bg-slate-200 rounded-xl animate-pulse" />
            <div className="flex gap-2">
              <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Skeleton Hero */}
        <div className="h-32 w-full bg-white rounded-2xl border border-slate-100 p-6 animate-pulse" />

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-64 w-full bg-white rounded-2xl border border-slate-100 p-6 animate-pulse" />
            <div className="h-96 w-full bg-white rounded-2xl border border-slate-100 p-6 animate-pulse" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-36 w-full bg-white rounded-2xl border border-slate-100 p-6 animate-pulse" />
            <div className="h-64 w-full bg-white rounded-2xl border border-slate-100 p-6 animate-pulse" />
            <div className="h-44 w-full bg-white rounded-2xl border border-slate-100 p-6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !userDetail) {
    return (
      <div className={cn('w-full max-w-7xl mx-auto space-y-6 pb-12', className)}>
        <AdminStudentDetailHeader
          onBack={onBack}
          onEdit={() => {}}
          onToggleStatus={() => {}}
          isInactive={false}
        />
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            !
          </div>
          <h3 className="text-lg font-bold text-slate-900">Data Siswa Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {errorMessage ||
              'Siswa yang Anda cari mungkin telah dihapus atau ID yang dimasukkan tidak valid.'}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#134653] text-white hover:bg-[#0e353f] transition-colors"
          >
            Kembali ke Daftar Siswa
          </button>
        </div>
      </div>
    );
  }

  const isInactive = userDetail.status === 'inactive' || userDetail.status === 'suspended';

  // Format creation & update dates
  const registeredDateStr = userDetail.created_at
    ? new Date(userDetail.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '12 September 2026';

  const registeredDateTimeStr = userDetail.created_at
    ? `${new Date(userDetail.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}, ${new Date(userDetail.created_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })} WIB`
    : '12 September 2026, 09:15 WIB';

  const lastUpdatedDateTimeStr = userDetail.last_login_at
    ? `${new Date(userDetail.last_login_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}, ${new Date(userDetail.last_login_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })} WIB`
    : '18 September 2026, 14:20 WIB';

  const schoolName = userDetail.profile?.school || 'SMAN 3 Bandung';
  const gradeAndMajor =
    `${userDetail.profile?.grade || 'XII'} ${userDetail.profile?.major || 'MIPA 2'}`.trim();
  const nis = '202609012';

  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 pb-12', className)}>
      {/* 1. Header Row */}
      <AdminStudentDetailHeader
        studentName={userDetail.full_name}
        isInactive={isInactive}
        onBack={onBack}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
      />

      {/* 2. Inactive Banner (Conditionally rendered) */}
      {isInactive && (
        <AdminStudentInactiveBanner
          suspendedDate={lastUpdatedDateTimeStr.split(',')[0]}
          onReactivate={onReactivate}
        />
      )}

      {/* 3. Hero Profile Card */}
      <AdminStudentProfileHero
        fullName={userDetail.full_name}
        email={userDetail.email}
        status={userDetail.status}
        nis={nis}
        schoolName={schoolName}
        gradeAndMajor={gradeAndMajor}
        registeredDate={registeredDateStr}
      />

      {/* 4. 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Informasi Akun */}
          <AdminStudentInfoCard
            fullName={userDetail.full_name}
            email={userDetail.email}
            status={userDetail.status}
            isEmailVerified={userDetail.is_email_verified}
            registeredDate={registeredDateTimeStr}
            lastUpdatedDate={lastUpdatedDateTimeStr}
            onEdit={onEdit}
          />

          {/* Perkembangan Nilai Latihan */}
          <AdminStudentProgressChartCard
            timeframe={timeframe}
            onTimeframeChange={onTimeframeChange}
            latestScore={latestScore}
            previousScore={previousScore}
            scoreDiff={scoreDiff}
            trendText={trendText}
            latestPracticeTitle={latestPracticeTitle}
            latestPracticeDate={latestPracticeDate}
            onViewLatestPracticeDetail={onViewLatestPracticeDetail}
            chartData={chartData}
          />
        </div>

        {/* Right Column (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Ringkasan Aktivitas */}
          <AdminStudentActivitySummaryCard
            practiceCount={Number(userDetail.completed_materials_count ?? 0)}
            tryoutCount={Number(userDetail.attempt_count ?? 0)}
          />

          {/* Aktivitas Terbaru */}
          <AdminStudentActivityTimelineCard
            activities={activities}
            onViewSystemLog={onViewSystemLog}
          />

          {/* Audit Evaluasi Terakhir */}
          <AdminStudentAuditEvaluationCard
            evaluationTitle={evaluationTitle}
            evaluationDate={evaluationDate}
            resultStatus={resultStatus}
            testDomain={testDomain}
            testMode={testMode}
          />
        </div>
      </div>

      {/* Status Update Dialog */}
      <AdminUserStatusDialog
        variant="student"
        open={statusDialogOpen}
        onOpenChange={onStatusDialogOpenChange}
        selectedUser={{
          id: userDetail.id,
          email: userDetail.email,
          full_name: userDetail.full_name,
          role: userDetail.role,
          status: userDetail.status,
          is_email_verified: userDetail.is_email_verified,
          total_attempts: userDetail.attempt_count,
          created_at: userDetail.created_at,
          last_login_at: userDetail.last_login_at,
        }}
        status={statusValue}
        onStatusChange={onStatusValueChange}
        onSubmit={onSubmitStatus}
        isSubmitting={isStatusSubmitting}
      />

      {/* Edit Student Dialog */}
      <AdminStudentEditDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogOpenChange}
        formData={editFormData}
        onFormDataChange={onEditFormDataChange}
        onSubmit={onSubmitEdit}
        isSubmitting={isEditSubmitting}
      />
    </div>
  );
};

export default AdminStudentDetailTemplate;
