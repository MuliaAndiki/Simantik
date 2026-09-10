import { useAdminUpdateUserRole, useAdminUpdateUserStatus } from './state/mutate';
import { useAdminDashboard, useAdminUserDetail, useAdminUserList } from './state/query';

export const useAdmin = () => {
  return {
    query: {
      dashboard: useAdminDashboard,
      list: useAdminUserList,
      detail: useAdminUserDetail,
    },
    mutate: {
      updateStatus: useAdminUpdateUserStatus,
      updateRole: useAdminUpdateUserRole,
    },
  };
};

export default useAdmin;
