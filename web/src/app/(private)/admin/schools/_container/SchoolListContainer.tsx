'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useMemo, useState } from 'react';
import { AdminSchoolListPage } from '@/components/page/private/admin/AdminSchoolListPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { rejectSchoolSchema } from '@/schemas/school/school.schema';
import type { SchoolLevel, SchoolResponse, SchoolStatusType } from '@/types/service';

export function SchoolListContainer() {
  const router = useRouter();
  const api = useApi();
  const ns = useAppNameSpace();

  // Filter state
  const [search, setSearch] = useState('');
  const [jenjangFilter, setJenjangFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Action state
  const [isVerifyingId, setIsVerifyingId] = useState<string | null>(null);

  // Reject dialog state
  const [rejectTargetSchool, setRejectTargetSchool] = useState<SchoolResponse | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Queries
  const {
    data: schoolsData,
    isLoading,
    refetch,
    isRefetching,
  } = api.school.query.list({
    search: search.trim() || undefined,
    jenjang: jenjangFilter !== 'all' ? (jenjangFilter as SchoolLevel) : undefined,
    status: statusFilter !== 'all' ? (statusFilter as SchoolStatusType) : undefined,
    verificationStatus: verificationFilter !== 'all' ? verificationFilter : undefined,
    limit: perPage,
    offset: (page - 1) * perPage,
  });

  const deleteMutation = api.school.mutate.delete();
  const verifyMutation = api.school.mutate.verify();
  const rejectMutation = api.school.mutate.reject();

  const schools = schoolsData?.schools ?? [];
  const total = schoolsData?.total ?? 0;

  // Stats calculation (prefers global summary from backend, falls back to current page)
  const stats = useMemo(() => {
    const summary = schoolsData?.summary;
    if (summary) {
      return {
        total: summary.total,
        negeri: summary.negeri,
        swasta: summary.swasta,
        smaCount: summary.smaCount,
        smkCount: summary.smkCount,
        pending: summary.pending,
        verified: summary.verified,
        rejected: summary.rejected,
      };
    }

    let negeri = 0;
    let swasta = 0;
    let smaCount = 0;
    let smkCount = 0;
    let pending = 0;
    let verified = 0;
    let rejected = 0;

    for (const s of schools) {
      if (s.status?.toLowerCase() === 'negeri') negeri++;
      else swasta++;

      if (s.jenjang?.toLowerCase() === 'sma') smaCount++;
      else if (s.jenjang?.toLowerCase() === 'smk') smkCount++;

      if (s.verificationStatus === 'pending') pending++;
      else if (s.verificationStatus === 'rejected') rejected++;
      else verified++;
    }

    return {
      total,
      negeri,
      swasta,
      smaCount,
      smkCount,
      pending,
      verified,
      rejected,
    };
  }, [schools, schoolsData?.summary, total]);

  const handleOpenCreate = () => {
    router.push('/admin/schools/create');
  };

  const handleOpenEdit = (school: SchoolResponse) => {
    router.push(`/admin/schools/${school.id}/edit`);
  };

  const handleDelete = (school: SchoolResponse) => {
    ns.alert.confirm({
      title: 'Hapus Data Sekolah?',
      deskripsi: `Apakah Anda yakin ingin menghapus data "${school.nama}" (NPSN: ${school.npsn})? Data yang terhapus tidak dapat dikembalikan.`,
      icon: 'warning',
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(school.id);
          refetch();
        } catch {
          // Handled
        }
      },
    });
  };

  const handleVerify = (school: SchoolResponse) => {
    ns.alert.confirm({
      title: 'Verifikasi Pengajuan Sekolah?',
      deskripsi: `Setujui "${school.nama}" (NPSN: ${school.npsn}) agar tampil resmi di pencarian publik seluruh siswa?`,
      icon: 'info',
      onConfirm: async () => {
        try {
          setIsVerifyingId(school.id);
          await verifyMutation.mutateAsync(school.id);
          refetch();
        } catch {
          // Handled by useAppMutation
        } finally {
          setIsVerifyingId(null);
        }
      },
    });
  };

  const handleOpenReject = (school: SchoolResponse) => {
    setRejectTargetSchool(school);
    setRejectReason('');
  };

  const handleSubmitReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTargetSchool) return;

    const parsed = rejectSchoolSchema.safeParse({ reason: rejectReason });
    if (!parsed.success) {
      ns.alert.toast({
        title: 'Alasan Penolakan Belum Valid',
        message: parsed.error.issues[0]?.message || 'Alasan penolakan minimal 5 karakter.',
        icon: 'warning',
      });
      return;
    }

    try {
      setIsVerifyingId(rejectTargetSchool.id);
      await rejectMutation.mutateAsync({
        id: rejectTargetSchool.id,
        body: { reason: parsed.data.reason },
      });
      setRejectTargetSchool(null);
      setRejectReason('');
      refetch();
    } catch {
      // Handled by useAppMutation
    } finally {
      setIsVerifyingId(null);
    }
  };

  return (
    <AdminSchoolListPage
      stats={stats}
      schools={schools}
      isLoading={isLoading}
      search={search}
      jenjangFilter={jenjangFilter}
      statusFilter={statusFilter}
      verificationFilter={verificationFilter}
      isRefreshing={isRefetching}
      onSearchChange={(val) => {
        setSearch(val);
        setPage(1);
      }}
      onJenjangChange={(val) => {
        setJenjangFilter(val);
        setPage(1);
      }}
      onStatusChange={(val) => {
        setStatusFilter(val);
        setPage(1);
      }}
      onVerificationChange={(val) => {
        setVerificationFilter(val);
        setPage(1);
      }}
      onRefresh={() => refetch()}
      currentPage={page}
      totalItems={total}
      rowsPerPage={perPage}
      onPageChange={setPage}
      onOpenCreate={handleOpenCreate}
      onEdit={handleOpenEdit}
      onDelete={handleDelete}
      onVerify={handleVerify}
      onOpenReject={handleOpenReject}
      isVerifyingId={isVerifyingId}
      rejectTargetSchool={rejectTargetSchool}
      isRejectDialogOpen={!!rejectTargetSchool}
      onOpenRejectDialogChange={(open) => {
        if (!open) {
          setRejectTargetSchool(null);
          setRejectReason('');
        }
      }}
      rejectReason={rejectReason}
      onRejectReasonChange={setRejectReason}
      onSubmitReject={handleSubmitReject}
      isRejectSubmitting={rejectMutation.isPending}
    />
  );
}

export default SchoolListContainer;
