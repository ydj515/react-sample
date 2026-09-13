import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useNotificationsInfiniteQuery } from "@/features/notifications/queries/notification-queries";
import type {
  Notification,
  NotificationListSearch,
} from "@/features/notifications/model/notification-schema";
import { NotificationItem } from "./NotificationItem";

interface NotificationDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: NotificationListSearch;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  markingAll: boolean;
  unreadCount: number;
  anchor?: React.RefObject<HTMLElement | null>;
}

export function NotificationDropdown({
  open,
  onOpenChange,
  search,
  onMarkRead,
  onMarkAllRead,
  markingAll,
  unreadCount,
  anchor,
}: NotificationDropdownProps) {
  const query = useNotificationsInfiniteQuery(search);

  const sentinelRef = useRef<HTMLLIElement | null>(null);

  const items = (query.data?.pages.flatMap((page) => page.items) ??
    []) as Notification[];

  const totalLoaded = items.length;

  const hasNextPage = Boolean(query.hasNextPage);

  const isLoadingMore = query.isFetchingNextPage;

  const isInitialLoading = query.isLoading;

  useEffect(() => {
    if (!open) return;
    const node = sentinelRef.current;
    if (!node || !hasNextPage || isLoadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void query.fetchNextPage();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [open, hasNextPage, isLoadingMore, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="notification-dropdown-description"
        className="bg-surface text-ink rounded-panel fixed top-12 right-3 left-auto z-40 flex h-[min(80vh,640px)] w-[min(420px,calc(100vw-1.5rem))] translate-x-0 translate-y-0 flex-col overflow-hidden border p-0 shadow-xl sm:right-6"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          anchor?.current?.focus();
        }}
      >
        <header className="border-line flex items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <DialogTitle className="text-sm font-semibold">알림</DialogTitle>
            <DialogDescription id="notification-dropdown-description">
              읽지 않은 알림 {unreadCount.toLocaleString("ko-KR")}건 · 표시된
              항목 {totalLoaded.toLocaleString("ko-KR")}건
            </DialogDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            disabled={markingAll || unreadCount === 0}
            onClick={onMarkAllRead}
          >
            {markingAll ? "처리 중…" : "모두 읽음"}
          </Button>
        </header>
        <div
          role="region"
          aria-label="알림 목록"
          className="grid flex-1 overflow-y-auto"
        >
          {isInitialLoading ? (
            <p
              role="status"
              className="text-ink-subtle flex items-center gap-2 px-4 py-6 text-sm"
            >
              <Loader2 className="size-4 animate-spin" aria-hidden /> 알림을
              불러오는 중
            </p>
          ) : items.length === 0 ? (
            <EmptyState
              title="표시할 알림이 없습니다."
              className="m-0 rounded-none border-0"
            />
          ) : (
            <ul className="divide-line grid divide-y" aria-label="알림">
              {items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={onMarkRead}
                  variant="compact"
                />
              ))}
              <li
                ref={sentinelRef}
                aria-hidden
                className="flex items-center justify-center py-3 text-xs"
              >
                {hasNextPage ? (
                  <span className="text-ink-subtle flex items-center gap-2">
                    {isLoadingMore ? (
                      <>
                        <Loader2
                          className="size-3.5 animate-spin"
                          aria-hidden
                        />
                        추가 알림 불러오는 중
                      </>
                    ) : (
                      "아래로 스크롤해 더 보기"
                    )}
                  </span>
                ) : (
                  <span className="text-ink-subtle">
                    마지막 알림까지 모두 표시했습니다.
                  </span>
                )}
              </li>
            </ul>
          )}
        </div>
        <footer className="border-line border-t px-4 py-2">
          <Link
            to="/notifications"
            onClick={() => onOpenChange(false)}
            className="text-brand block text-center text-sm font-medium hover:underline"
          >
            모든 알림 보기
          </Link>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
