import { WrapApi } from '@/utils/wrapApi';
import AuthService from './api/AuthService';

class Api {
  auth = WrapApi(AuthService);
}

export default Api;
