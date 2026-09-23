'use client';

import React, { useMemo, useState } from 'react';
import { AdminContentManagerListPage } from '@/components/page/private/admin/AdminContentManagerListPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { AdminUserListItem, UserRole, UserStatus } from '@/types/service';

export function ContentManagerListContainer() {
  const api = useApi();
  const ns = useAppNameSpace();

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<UserStatus>('active');
  const [newRole, setNewRole] = useState<UserRole>('content_manager');

  // Queries
  const {
    data: usersData,
    isLoading,
    refetch,
    isRefetching,
  } = api.admin.query.list({
    role: 'content_manager',
    search: search.trim() || undefined,
    status: statusFilter !== 'all' ? (statusFilter as UserStatus) : undefined,
    limit: perPage,
    offset: (page - 1) * perPage,
  });

  const updateStatusMutation = api.admin.mutate.updateStatus();
  const updateRoleMutation = api.admin.mutate.updateRole();

  const users = usersData?.users ?? [];
  const total = usersData?.total ?? 0;

  // Stats calculation
  const stats = useMemo(() => {
    let active = 0;
    let suspended = 0;

    for (const u of users) {
      if (u.status?.toLowerCase() === 'active') active++;
      else if (u.status?.toLowerCase() === 'suspended') suspended++;
    }

    return {
      total,
      active,
      suspended,
    };
  }, [users, total]);

  const handleOpenStatusDialog = (user: AdminUserListItem) => {
    setSelectedUser(user);
    setNewStatus((user.status?.toLowerCase() as UserStatus) || 'active');
    setIsStatusDialogOpen(true);
  };

  const handleOpenRoleDialog = (user: AdminUserListItem) => {
    setSelectedUser(user);
    setNewRole((user.role?.toLowerCase() as UserRole) || 'content_manager');
    setIsRoleDialogOpen(true);
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

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateRoleMutation.mutateAsync({
        id: selectedUser.id,
        body: { role: newRole },
      });
      setIsRoleDialogOpen(false);
      refetch();
    } catch {
      // Toast handled by mutation
    }
  };

  return (
    <AdminContentManagerListPage
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
      isRoleDialogOpen={isRoleDialogOpen}
      onOpenRoleDialogChange={setIsRoleDialogOpen}
      roleFormValue={newRole}
      onRoleFormValueChange={setNewRole}
      onSubmitRoleDialog={handleSaveRole}
      isSubmittingRole={updateRoleMutation.isPending}
      onOpenRoleDialog={handleOpenRoleDialog}
    />
  );
}

export default ContentManagerListContainer;
