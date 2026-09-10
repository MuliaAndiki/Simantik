import {
  useChangePassword,
  useUpdateAvatar,
  useUpdateProfile,
  useUpdateUserStatus,
} from './state/mutate';
import { useMe, useMyRoles, useUserDetail, useUserList } from './state/query';

export const useUser = () => {
  return {
    query: {
      me: useMe,
      roles: useMyRoles,
      list: useUserList,
      detail: useUserDetail,
    },
    mutate: {
      updateProfile: useUpdateProfile,
      changePassword: useChangePassword,
      updateAvatar: useUpdateAvatar,
      updateStatus: useUpdateUserStatus,
    },
  };
};

export default useUser;
