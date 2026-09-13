import { useEffect, useRef } from "react";

import { toast } from "@/stores/toast-store";
import { useNotificationUnreadQuery } from "@/features/notifications/queries/notification-queries";
import type { NotificationUnread } from "@/features/notifications/model/notification-schema";

const STREAM_TOAST_LIMIT = 3;

export function useNotificationStream({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) {
  const query = useNotificationUnreadQuery();

  const previous = useRef<NotificationUnread | null>(null);

  const announced = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;
    const current = query.data;
    if (!current) return;
    const previousValue = previous.current;
    previous.current = current;
    if (!previousValue) return;
    if (current.count <= previousValue.count) return;
    const delta = Math.min(
      current.count - previousValue.count,
      STREAM_TOAST_LIMIT,
    );
    if (delta <= 0) return;
    const stamped = `${current.count}:${current.latestId ?? "none"}`;
    if (announced.current.has(stamped)) return;
    announced.current.add(stamped);
    if (announced.current.size > 10) {
      const [first] = announced.current;
      if (first) announced.current.delete(first);
    }
    toast.info(
      delta === 1
        ? "새 알림이 도착했습니다."
        : `새 알림 ${delta.toLocaleString("ko-KR")}건이 도착했습니다.`,
    );
  }, [enabled, query.data]);

  return query;
}
