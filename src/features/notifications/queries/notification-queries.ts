import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getNotificationUnread,
  getNotificationsPage,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/features/notifications/api/notification-api";
import type {
  NotificationListSearch,
  NotificationPage,
} from "@/features/notifications/model/notification-schema";

const PAGE_SIZE = 8;

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (search: NotificationListSearch) =>
    [...notificationKeys.all, "list", search] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
};

export function notificationsInfiniteOptions(search: NotificationListSearch) {
  return infiniteQueryOptions({
    queryKey: notificationKeys.list(search),
    queryFn: ({ pageParam }) =>
      getNotificationsPage({
        search,
        cursor: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: NotificationPage) => lastPage.nextCursor,
  });
}

export function notificationUnreadOptions() {
  return queryOptions({
    queryKey: notificationKeys.unread(),
    queryFn: getNotificationUnread,
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
  });
}

export function useNotificationsInfiniteQuery(search: NotificationListSearch) {
  return useInfiniteQuery(notificationsInfiniteOptions(search));
}

export function useNotificationUnreadQuery() {
  return useQuery(notificationUnreadOptions());
}

export function useMarkNotificationReadMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: async (notification) => {
      client.setQueryData(
        notificationKeys.unread(),
        (current: { count: number; latestId: string | null } | undefined) => {
          if (!current) return current;
          if (notification.read) {
            return {
              count: Math.max(0, current.count - 1),
              latestId: current.latestId,
            };
          }
          return current;
        },
      );
      await client.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: async () => {
      client.setQueryData(notificationKeys.unread(), {
        count: 0,
        latestId: null,
      });
      await client.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
