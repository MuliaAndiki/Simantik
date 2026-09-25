'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { AdminStudentListPage } from '@/components/page/private/admin/AdminStudentListPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { AdminUserListItem, UserStatus } from '@/types/service';

export function StudentListContainer() {
  const router = useRouter();
  const api = useApi();
  const ns = useAppNameSpace();

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Dialog state
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<UserStatus>('active');
  const [detailUserId, setDetailUserId] = useState<string | null>(null);

  // Queries
  const {
    data: usersData,
    isLoading,
    refetch,
    isRefetching,
  } = api.admin.query.list({
    role: 'student',
    search: search.trim() || undefined,
    status: statusFilter !== 'all' ? (statusFilter as UserStatus) : undefined,
    limit: perPage,
    offset: (page - 1) * perPage,
  });

  const { data: userDetail, isLoading: isDetailLoading } = api.admin.query.detail(
    detailUserId || '',
    { enabled: !!detailUserId }
  );

  const updateStatusMutation = api.admin.mutate.updateStatus();

  const users = usersData?.users ?? [];
  const total = usersData?.total ?? 0;

  // Stats calculation
  const stats = useMemo(() => {
    let active = 0;
    let suspended = 0;
    let totalAttempts = 0;

    for (const u of users) {
      if (u.status?.toLowerCase() === 'active') active++;
      else if (u.status?.toLowerCase() === 'suspended') suspended++;
      totalAttempts += u.total_attempts || 0;
    }

    return {
      total,
      active,
      suspended,
      totalAttempts,
    };
  }, [users, total]);

  const handleOpenStatusDialog = (user: AdminUserListItem) => {
    setSelectedUser(user);
    setNewStatus((user.status?.toLowerCase() as UserStatus) || 'active');
    setIsStatusDialogOpen(true);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: selectedUser.id,
        body: { status: newStatus },
      });
      setIsStatusDialogOpen(false);
      refetch();
    } catch {
      // Toast handled by mutation
    }
  };

  return (
    <AdminStudentListPage
      stats={stats}
      users={users}
      isLoading={isLoading}
      search={search}
      statusFilter={statusFilter}
      isRefreshing={isRefetching}
      onSearchChange={(val) => {
        setSearch(val);
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
      selectedUser={selectedUser}
      isStatusDialogOpen={isStatusDialogOpen}
      onOpenStatusDialogChange={setIsStatusDialogOpen}
      statusFormValue={newStatus}
      onStatusFormValueChange={setNewStatus}
      onSubmitStatusDialog={handleSaveStatus}
      isSubmittingStatus={updateStatusMutation.isPending}
      onOpenStatusDialog={handleOpenStatusDialog}
      detailUserId={detailUserId}
      onOpenDetailDialog={(userId: string) => router.push(`/admin/students/${userId}`)}
      onCloseDetailDialog={() => setDetailUserId(null)}
      userDetail={userDetail}
      isDetailLoading={isDetailLoading}
    />
  );
}

export default StudentListContainer;
