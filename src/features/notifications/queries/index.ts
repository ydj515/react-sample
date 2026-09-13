// Public API: expose only contracts used outside this feature.
export {
  notificationKeys,
  notificationsInfiniteOptions,
  notificationUnreadOptions,
  useNotificationsInfiniteQuery,
  useNotificationUnreadQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "./notification-queries";
