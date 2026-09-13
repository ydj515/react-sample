import { useCallback, useState } from "react";

import { NotificationBell } from "./NotificationBell";
import { NotificationDropdown } from "./NotificationDropdown";
import { notificationListSearchSchema } from "@/features/notifications/model/notification-schema";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationUnreadQuery,
} from "@/features/notifications/queries/notification-queries";
import { useNotificationStream } from "@/features/notifications/hooks/use-notification-stream";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);

  const unread = useNotificationUnreadQuery();

  const markOne = useMarkNotificationReadMutation();

  const markAll = useMarkAllNotificationsReadMutation();
  // dropdown이 닫혀 있을 때도 폴링은 계속되어야 하므로 enabled를 항상 true로 둔다.
  useNotificationStream();
  const search = notificationListSearchSchema.parse({});

  const unreadCount = unread.data?.count ?? 0;

  const handleMarkRead = useCallback(
    (id: string) => {
      markOne.mutate(id);
    },
    [markOne],
  );

  const handleMarkAllRead = useCallback(() => {
    markAll.mutate();
  }, [markAll]);
  return (
    <>
      <NotificationBell
        unreadCount={unreadCount}
        onClick={() => setOpen((value) => !value)}
        open={open}
      />
      <NotificationDropdown
        open={open}
        onOpenChange={setOpen}
        search={search}
        unreadCount={unreadCount}
        markingAll={markAll.isPending}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
}
