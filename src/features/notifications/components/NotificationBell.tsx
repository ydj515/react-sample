import { forwardRef } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";

export interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
  open?: boolean;
}

export const NotificationBell = forwardRef<
  HTMLButtonElement,
  NotificationBellProps
>(function NotificationBell({ unreadCount, onClick, open }, ref) {
  const label =
    unreadCount > 0 ? `알림 ${unreadCount.toLocaleString("ko-KR")}건` : "알림";
  return (
    <Button
      ref={ref}
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={open}
      size="icon"
      variant="ghost"
      onClick={onClick}
      className="relative shrink-0"
    >
      <Bell className="size-5" aria-hidden />
      <span
        className={cn(
          "absolute top-1 right-1 grid min-w-[1.1rem] place-items-center rounded-full px-1 text-[10px] leading-none font-semibold",
          unreadCount > 0
            ? "bg-negative text-white"
            : "bg-surface-muted text-ink-subtle",
        )}
        aria-hidden
      >
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
      <span className="sr-only">{label}</span>
    </Button>
  );
});
