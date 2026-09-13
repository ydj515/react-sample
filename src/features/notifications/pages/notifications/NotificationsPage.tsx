import { useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { PageHeader } from "@/shared/ui/page-header";
import { PageMetadata } from "@/shared/ui/page-metadata";
import { cn } from "@/shared/lib/cn";
import {
  notificationListSearchSchema,
  type Notification,
} from "@/features/notifications/model/notification-schema";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationUnreadQuery,
  useNotificationsInfiniteQuery,
} from "@/features/notifications/queries/notification-queries";
import { NotificationFilters } from "@/features/notifications/components/NotificationFilters";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";

function NotificationsPageContent() {
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;

  const search = notificationListSearchSchema.parse(rawSearch);

  const navigate = useNavigate();

  const query = useNotificationsInfiniteQuery(search);

  const unread = useNotificationUnreadQuery();

  const markOne = useMarkNotificationReadMutation();

  const markAll = useMarkAllNotificationsReadMutation();

  const items = useMemo<Notification[]>(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  const sentinelRef = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !query.hasNextPage || query.isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void query.fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [query]);

  const updateSearch = useCallback(
    (patch: Partial<typeof search>) => {
      void navigate({
        to: "/notifications",
        search: { ...search, ...patch },
        replace: true,
      });
    },
    [navigate, search],
  );

  const handleMarkRead = useCallback(
    (id: string) => {
      markOne.mutate(id);
    },
    [markOne],
  );

  const handleMarkAll = useCallback(() => {
    markAll.mutate();
  }, [markAll]);

  const unreadCount = unread.data?.count ?? 0;

  const hasNextPage = Boolean(query.hasNextPage);

  const isLoadingMore = query.isFetchingNextPage;

  const isInitialLoading = query.isLoading;

  return (
    <section className="grid min-w-0 gap-6">
      <PageMetadata
        title="알림 센터"
        description="주문·프로젝트·사용자 알림을 확인하고 읽음 처리하세요."
      />
      <PageHeader
        title="알림 센터"
        description="5초 주기로 새 알림을 확인하고, 무한 스크롤로 이전 알림을 더 볼 수 있습니다."
        actions={
          <Button
            variant="secondary"
            disabled={
              markAll.isPending ||
              unreadCount === 0 ||
              isInitialLoading ||
              unread.isFetching
            }
            onClick={handleMarkAll}
          >
            {markAll.isPending ? "처리 중…" : "모두 읽음으로 표시"}
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-ink-subtle text-xs">읽지 않음</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {unreadCount.toLocaleString("ko-KR")}
            <span className="text-ink-subtle ml-1 text-xs font-normal">건</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-ink-subtle text-xs">현재 화면 표시</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {items.length.toLocaleString("ko-KR")}
            <span className="text-ink-subtle ml-1 text-xs font-normal">건</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-ink-subtle text-xs">마지막 동기화</p>
          <p className="mt-2 text-sm font-medium">
            {unread.isFetching
              ? "동기화 중…"
              : unread.dataUpdatedAt
                ? new Date(unread.dataUpdatedAt).toLocaleTimeString("ko-KR")
                : "대기 중"}
          </p>
        </Card>
      </div>
      <NotificationFilters
        search={search}
        onChange={updateSearch}
        onReset={() => updateSearch(notificationListSearchSchema.parse({}))}
      />
      {query.error ? (
        <Card role="alert" className="border-negative/30 p-4 text-sm">
          알림을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.
        </Card>
      ) : isInitialLoading ? (
        <p
          role="status"
          className="text-ink-subtle flex items-center gap-2 text-sm"
        >
          <Loader2 className="size-4 animate-spin" aria-hidden /> 알림을
          불러오는 중
        </p>
      ) : items.length === 0 ? (
        <EmptyState title="표시할 알림이 없습니다." />
      ) : (
        <Card className={cn("overflow-hidden p-0")} aria-label="알림 목록">
          <ul className="divide-line grid divide-y">
            {items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
              />
            ))}
            <li
              ref={sentinelRef}
              aria-hidden
              className="flex items-center justify-center py-4 text-xs"
            >
              {hasNextPage ? (
                <span className="text-ink-subtle flex items-center gap-2">
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      추가 알림을 불러오는 중
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
        </Card>
      )}
      <p className="text-ink-subtle text-xs">
        다른 화면에서도 종 아이콘으로 같은 알림을 확인할 수 있습니다.{" "}
        <Link
          to="/operations"
          className="text-brand font-medium hover:underline"
        >
          운영 화면
        </Link>
        으로 돌아가도 카운트와 토스트는 계속 동기화됩니다.
      </p>
    </section>
  );
}

export function NotificationsPage() {
  return <NotificationsPageContent />;
}
