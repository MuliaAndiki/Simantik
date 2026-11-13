import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type { GeoPlace } from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class GeoService {
  public async SearchSchoolsService(q: string): Promise<TResponse<GeoPlace[]>> {
    const url = buildQueryString(EndpointEntry.geo.searchSchools, { q: q.trim() });
    const res = await getHttp().GetResponse<GeoPlace[]>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ReverseService(lat: number, lon: number): Promise<TResponse<GeoPlace>> {
    const url = buildQueryString(EndpointEntry.geo.reverse, { lat, lon });
    const res = await getHttp().GetResponse<GeoPlace>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new GeoService();
