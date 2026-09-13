// Public API: expose only contracts used outside this feature.
export {
  notificationCategories,
  notificationSchema,
  notificationPageSchema,
  notificationUnreadSchema,
  notificationListSearchSchema,
  notificationLabels,
  categoryLabel,
} from "./notification-schema";

export type {
  Notification,
  NotificationPage,
  NotificationUnread,
  NotificationListSearch,
} from "./notification-schema";
