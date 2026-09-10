import { Api } from '@/api/api-entry';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import { TResponse } from '@/pkg/react-query/mutation-wrapper.type';
import {
  AuthResponse,
  LoginRequest,
  RefreshRequest,
  RegisterApiResponse,
  RegisterRequest,
} from '@/types/service';
import { toServiceResponse } from '@/utils/service.respone';

const { client, server } = Api();
class AuthService {
  public async LoginService(payload: LoginRequest): Promise<TResponse<AuthResponse>> {
    const res = await server.PublicPostResponse<AuthResponse>(EndpointEntry.auth.login, payload);
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 200,
    });
  }
  public async RegisterService(payload: RegisterRequest): Promise<TResponse<RegisterApiResponse>> {
    const res = await client.PublicPostResponse<RegisterApiResponse>(
      EndpointEntry.auth.register,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
  public async RefreshTokenService(payload: RefreshRequest): Promise<TResponse<AuthResponse>> {
    const res = await server.PublicPostResponse<AuthResponse>(
      EndpointEntry.auth.refreshToken,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new AuthService();
