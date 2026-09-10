import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  BroadcastNotificationRequest,
  ListNotificationFilter,
  PaginatedNotificationsResponse,
  UnreadCountResponse,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class NotificationService {
  public async GetMyNotificationsService(
    filter?: ListNotificationFilter
  ): Promise<TResponse<PaginatedNotificationsResponse>> {
    const url = buildQueryString(
      EndpointEntry.notification.notifications,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedNotificationsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetUnreadCountService(): Promise<TResponse<UnreadCountResponse>> {
    const res = await getHttp().GetResponse<UnreadCountResponse>(
      EndpointEntry.notification.unreadCount
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async MarkAllAsReadService(): Promise<TResponse<null>> {
    const res = await getHttp().PatchResponse<null>(EndpointEntry.notification.readAll);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async MarkAsReadService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().PatchResponse<null>(EndpointEntry.notification.markAsRead(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async BroadcastNotificationService(
    payload: BroadcastNotificationRequest
  ): Promise<TResponse<{ recipients_count: number }>> {
    const res = await getHttp().PostResponse<{ recipients_count: number }>(
      EndpointEntry.notification.broadcast,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new NotificationService();
