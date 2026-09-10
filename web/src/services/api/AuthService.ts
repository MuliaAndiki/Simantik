import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  AuthResponse,
  ForgotPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOTPRequest,
  ResetPasswordRequest,
  VerifyOTPRequest,
  VerifyOTPResponse,
  VerifyRegisterOTPRequest,
} from '@/types/service';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class AuthService {
  public async LoginService(payload: LoginRequest): Promise<TResponse<AuthResponse>> {
    const res = await getHttp().PublicPostResponse<AuthResponse>(EndpointEntry.auth.login, payload);
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 200,
    });
  }

  public async RegisterService(payload: RegisterRequest): Promise<TResponse<RegisterResponse>> {
    const res = await getHttp().PublicPostResponse<RegisterResponse>(
      EndpointEntry.auth.register,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async VerifyRegisterOTPService(
    payload: VerifyRegisterOTPRequest
  ): Promise<TResponse<AuthResponse>> {
    const res = await getHttp().PublicPostResponse<AuthResponse>(
      EndpointEntry.auth.verifyRegisterOtp,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 200,
    });
  }

  public async ResendOTPService(payload: ResendOTPRequest): Promise<TResponse<null>> {
    const res = await getHttp().PublicPostResponse<null>(EndpointEntry.auth.resendOtp, payload);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async RefreshTokenService(payload?: RefreshRequest): Promise<TResponse<AuthResponse>> {
    const res = await getHttp().PublicPostResponse<AuthResponse>(
      EndpointEntry.auth.refreshToken,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async LogoutService(payload?: LogoutRequest): Promise<TResponse<null>> {
    const res = await getHttp().PublicPostResponse<null>(EndpointEntry.auth.logout, payload);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ForgotPasswordService(payload: ForgotPasswordRequest): Promise<TResponse<null>> {
    const res = await getHttp().PublicPostResponse<null>(
      EndpointEntry.auth.forgotPassword,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async VerifyOTPService(payload: VerifyOTPRequest): Promise<TResponse<VerifyOTPResponse>> {
    const res = await getHttp().PublicPostResponse<VerifyOTPResponse>(
      EndpointEntry.auth.verifyOtp,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ResetPasswordService(payload: ResetPasswordRequest): Promise<TResponse<null>> {
    const res = await getHttp().PublicPostResponse<null>(EndpointEntry.auth.resetPassword, payload);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GoogleLoginService(payload: GoogleLoginRequest): Promise<TResponse<AuthResponse>> {
    const res = await getHttp().PublicPostResponse<AuthResponse>(
      EndpointEntry.auth.google,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new AuthService();
