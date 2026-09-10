import {
  useForgotPassword,
  useGoogleLogin,
  useLogin,
  useLogout,
  useRefreshToken,
  useRegister,
  useResendOTP,
  useResetPassword,
  useVerifyOTP,
  useVerifyRegisterOTP,
} from './state/mutate';
import { useMe } from './state/query';

export const useAuth = () => {
  return {
    query: {
      me: useMe,
    },
    mutate: {
      login: useLogin,
      register: useRegister,
      verifyRegisterOtp: useVerifyRegisterOTP,
      resendOtp: useResendOTP,
      refreshToken: useRefreshToken,
      logout: useLogout,
      forgotPassword: useForgotPassword,
      verifyOtp: useVerifyOTP,
      resetPassword: useResetPassword,
      googleLogin: useGoogleLogin,
    },
  };
};

export default useAuth;
