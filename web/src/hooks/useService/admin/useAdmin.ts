import { useAdminUpdateUserRole, useAdminUpdateUserStatus } from './state/mutate';
import {
  useAdminDashboard,
  useAdminUserActivities,
  useAdminUserDetail,
  useAdminUserList,
  useAdminUserProgress,
} from './state/query';

export const useAdmin = () => {
  return {
    query: {
      dashboard: useAdminDashboard,
      list: useAdminUserList,
      detail: useAdminUserDetail,
      activities: useAdminUserActivities,
      progress: useAdminUserProgress,
    },
    mutate: {
      updateStatus: useAdminUpdateUserStatus,
      updateRole: useAdminUpdateUserRole,
    },
  };
};

export default useAdmin;
