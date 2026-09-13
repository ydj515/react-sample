import { apiRequest } from "@/shared/api/http-client";
import {
  notificationPageSchema,
  notificationSchema,
  notificationUnreadSchema,
  type NotificationListSearch,
} from "@/features/notifications/model/notification-schema";

const headers = { "Content-Type": "application/json" };

export function getNotificationsPage(params: {
  cursor?: string | null;
  limit?: number;
  search: NotificationListSearch;
}) {
  const search = new URLSearchParams();
  if (params.cursor) search.set("cursor", params.cursor);
  if (params.limit) search.set("limit", String(params.limit));
  if (params.search.category !== "all") {
    search.set("category", params.search.category);
  }
  if (params.search.filter !== "all") {
    search.set("filter", params.search.filter);
  }
  const query = search.toString();
  return apiRequest(`/api/notifications${query ? `?${query}` : ""}`, {
    schema: notificationPageSchema,
  });
}

export function getNotificationUnread() {
  return apiRequest("/api/notifications/unread-count", {
    schema: notificationUnreadSchema,
  });
}

export function markNotificationRead(id: string) {
  return apiRequest(`/api/notifications/${encodeURIComponent(id)}/read`, {
    schema: notificationSchema,
    method: "POST",
    headers,
  });
}

export function markAllNotificationsRead() {
  return apiRequest("/api/notifications/read-all", {
    schema: notificationUnreadSchema,
    method: "POST",
    headers,
  });
}
