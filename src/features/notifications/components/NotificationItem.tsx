import { useTransition } from "react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import type { Notification } from "@/features/notifications/model/notification-schema";
import { categoryLabel } from "@/features/notifications/model/notification-schema";
import { NotificationCategoryIcon } from "./NotificationCategoryIcon";
import { formatNotificationTime } from "./notification-time";

export function NotificationItem({
  notification,
  onMarkRead,
  variant = "list",
}: {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  variant?: "list" | "compact";
}) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (notification.read) return;
    startTransition(() => onMarkRead?.(notification.id));
  };
  return (
    <li
      data-testid={`notification-item-${notification.id}`}
      data-unread={!notification.read}
      className={cn(
        "border-line flex gap-3 border-b px-4 py-3 last:border-b-0",
        !notification.read && "bg-brand-soft/40",
        variant === "compact" && "px-3 py-2",
      )}
    >
      <NotificationCategoryIcon
        category={notification.category}
        severity={notification.severity}
      />
      <div className="grid min-w-0 flex-1 gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">
            {categoryLabel(notification.category)}
          </Badge>
          <span
            aria-label={notification.read ? undefined : "읽지 않음"}
            aria-hidden={notification.read || undefined}
            className={cn(
              "bg-brand size-1.5 shrink-0 rounded-full",
              notification.read && "invisible",
            )}
          />
          <span className="text-ink-subtle ml-auto text-xs">
            {formatNotificationTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-ink-subtle text-xs">{notification.body}</p>
        {notification.actor || notification.link || onMarkRead ? (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            {notification.actor ? (
              <span className="text-ink-subtle">
                작성자 {notification.actor.name}
              </span>
            ) : null}
            {notification.link ? (
              <Link
                to={notification.link.to}
                className="text-brand font-medium hover:underline"
              >
                {notification.link.label}
              </Link>
            ) : null}
            {onMarkRead ? (
              <div className="ml-auto grid h-8 w-28 shrink-0 place-items-center">
                {notification.read ? (
                  <span className="text-ink-subtle text-xs">읽음</span>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={pending}
                    onClick={handleClick}
                    className="h-8 w-full"
                  >
                    {pending ? "처리 중…" : "읽음으로 표시"}
                  </Button>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}
