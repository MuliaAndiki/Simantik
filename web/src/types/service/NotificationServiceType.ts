import type { ApiResponse, NotificationType, UserRole } from '../model';

// ============================================================================
// Notification DTOs
// ============================================================================

/**
 * In-app notification representation
 * Maps to backend: `dto.NotificationResponse`
 */
export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Filter parameters for fetching user notifications
 * Maps to backend: `dto.ListNotificationFilter`
 */
export interface ListNotificationFilter {
  type?: NotificationType;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Paginated notifications response with unread count
 * Maps to backend: `dto.PaginatedNotificationsResponse`
 */
export interface PaginatedNotificationsResponse {
  notifications: NotificationResponse[];
  total: number;
  limit: number;
  offset: number;
  unreadCount: number;
}

/**
 * Targeted notification payload sent by admin/system
 * Maps to backend: `dto.CreateNotificationRequest`
 */
export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

/**
 * Broadcast notification payload to group of users
 * Maps to backend: `dto.BroadcastNotificationRequest`
 */
export interface BroadcastNotificationRequest {
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
  targetRole?: 'all' | UserRole | string;
}

/**
 * Unread notification count for badge rendering
 * Maps to backend: `dto.UnreadCountResponse`
 */
export interface UnreadCountResponse {
  unreadCount: number;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type NotificationApiResponse = ApiResponse<NotificationResponse>;
export type PaginatedNotificationsApiResponse = ApiResponse<PaginatedNotificationsResponse>;
export type UnreadCountApiResponse = ApiResponse<UnreadCountResponse>;
