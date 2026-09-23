'use client';

import React, { useMemo, useState } from 'react';
import type { SchoolFormState } from '@/components/organisms/admin';
import { AdminSchoolListPage } from '@/components/page/private/admin/AdminSchoolListPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type {
  CreateSchoolRequest,
  SchoolLevel,
  SchoolResponse,
  SchoolStatusType,
} from '@/types/service';

const EMPTY_SCHOOL_FORM: SchoolFormState = {
  npsn: '',
  nama: '',
  jenjang: 'sma',
  status: 'negeri',
  alamat: '',
  provinsi: '',
  kabupaten: '',
  kecamatan: '',
};

export function SchoolListContainer() {
  const api = useApi();
  const ns = useAppNameSpace();

  // Filter state
  const [search, setSearch] = useState('');
  const [jenjangFilter, setJenjangFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<SchoolFormState>(EMPTY_SCHOOL_FORM);

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
    limit: perPage,
    offset: (page - 1) * perPage,
  });

  const createMutation = api.school.mutate.create();
  const updateMutation = api.school.mutate.update();
  const deleteMutation = api.school.mutate.delete();

  const schools = schoolsData?.schools ?? [];
  const total = schoolsData?.total ?? 0;

  // Stats calculation
  const stats = useMemo(() => {
    let negeri = 0;
    let swasta = 0;
    let smaCount = 0;
    let smkCount = 0;

    for (const s of schools) {
      if (s.status?.toLowerCase() === 'negeri') negeri++;
      else swasta++;

      if (s.jenjang?.toLowerCase() === 'sma') smaCount++;
      else if (s.jenjang?.toLowerCase() === 'smk') smkCount++;
    }

    return {
      total,
      negeri,
      swasta,
      smaCount,
      smkCount,
    };
  }, [schools, total]);

  const handleOpenCreate = () => {
    setDialogMode('create');
    setFormData(EMPTY_SCHOOL_FORM);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (school: SchoolResponse) => {
    setDialogMode('edit');
    setFormData({
      id: school.id,
      npsn: school.npsn,
      nama: school.nama,
      jenjang: (school.jenjang?.toLowerCase() as SchoolLevel) || 'sma',
      status: (school.status?.toLowerCase() as SchoolStatusType) || 'negeri',
      alamat: school.alamat || '',
      provinsi: school.provinsi || '',
      kabupaten: school.kabupaten || '',
      kecamatan: school.kecamatan || '',
    });
    setIsDialogOpen(true);
  };

  const handleFormFieldChange = <K extends keyof SchoolFormState>(
    field: K,
    value: SchoolFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.npsn.trim() || !formData.nama.trim() || !formData.alamat.trim()) {
      ns.alert.toast({
        title: 'Form Belum Lengkap',
        message: 'NPSN, Nama Sekolah, dan Alamat wajib diisi.',
        icon: 'warning',
      });
      return;
    }

    try {
      if (dialogMode === 'create') {
        const payload: CreateSchoolRequest = {
          npsn: formData.npsn.trim(),
          nama: formData.nama.trim(),
          jenjang: formData.jenjang,
          status: formData.status,
          alamat: formData.alamat.trim(),
          provinsi: formData.provinsi.trim() || undefined,
          kabupaten: formData.kabupaten.trim() || undefined,
          kecamatan: formData.kecamatan.trim() || undefined,
        };
        await createMutation.mutateAsync(payload);
      } else if (formData.id) {
        await updateMutation.mutateAsync({
          id: formData.id,
          body: {
            npsn: formData.npsn.trim(),
            nama: formData.nama.trim(),
            jenjang: formData.jenjang,
            status: formData.status,
            alamat: formData.alamat.trim(),
            provinsi: formData.provinsi.trim() || undefined,
            kabupaten: formData.kabupaten.trim() || undefined,
            kecamatan: formData.kecamatan.trim() || undefined,
          },
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch {
      // Toast handled by mutation
    }
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

  return (
    <AdminSchoolListPage
      stats={stats}
      schools={schools}
      isLoading={isLoading}
      search={search}
      jenjangFilter={jenjangFilter}
      statusFilter={statusFilter}
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
      onRefresh={() => refetch()}
      currentPage={page}
      totalItems={total}
      rowsPerPage={perPage}
      onPageChange={setPage}
      isDialogOpen={isDialogOpen}
      onOpenDialogChange={setIsDialogOpen}
      dialogMode={dialogMode}
      formData={formData}
      onFormFieldChange={handleFormFieldChange}
      onSubmitDialog={handleSubmit}
      isSubmitting={createMutation.isPending || updateMutation.isPending}
      onOpenCreate={handleOpenCreate}
      onEdit={handleOpenEdit}
      onDelete={handleDelete}
    />
  );
}

export default SchoolListContainer;
