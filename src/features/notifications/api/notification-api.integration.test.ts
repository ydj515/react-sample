import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { describe, expect, it } from "vitest";
import {
  getNotificationsPage,
  getNotificationUnread,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notification-api";
import { notificationListSearchSchema } from "@/features/notifications/model/notification-schema";

describe("notification API", () => {
  it("기본 알림 페이지와 카테고리/읽음 필터를 반환한다", async () => {
    const search = notificationListSearchSchema.parse({});

    const first = await getNotificationsPage({ search, limit: 5 });
    expect(first.items.length).toBe(5);
    expect(first.nextCursor).not.toBeNull();
    const second = await getNotificationsPage({
      search,
      cursor: first.nextCursor,
      limit: 5,
    });
    expect(second.items.length).toBeGreaterThan(0);
    const unreadOnly = await getNotificationsPage({
      search: { ...search, filter: "unread" },
      limit: 20,
    });
    expect(unreadOnly.items.every((item) => !item.read)).toBe(true);
    const orderOnly = await getNotificationsPage({
      search: { ...search, category: "order" },
      limit: 20,
    });
    expect(orderOnly.items.every((item) => item.category === "order")).toBe(
      true,
    );
  });

  it("개별 알림 읽음 처리와 모두 읽음 처리가 카운트를 갱신한다", async () => {
    const search = notificationListSearchSchema.parse({});

    const before = await getNotificationUnread();
    expect(before.count).toBeGreaterThan(0);
    const target = (await getNotificationsPage({ search, limit: 1 })).items[0]!;

    const updated = await markNotificationRead(target.id);
    expect(updated.read).toBe(true);
    const after = await getNotificationUnread();
    expect(after.count).toBe(before.count - 1);
    const allRead = await markAllNotificationsRead();
    expect(allRead.count).toBeGreaterThanOrEqual(0);
    const cleared = await getNotificationUnread();
    expect(cleared.count).toBe(0);
  });

  it("존재하지 않는 알림은 404를 반환한다", async () => {
    await expect(markNotificationRead("missing-id")).rejects.toMatchObject({
      status: 404,
      code: "NOTIFICATION_NOT_FOUND",
    });
  });
});

it("응답 스키마 위반은 INVALID_RESPONSE로 거부한다", async () => {
  server.use(
    http.get("/api/notifications/unread-count", () =>
      HttpResponse.json({ count: "not-a-number" }),
    ),
  );
  await expect(getNotificationUnread()).rejects.toMatchObject({
    code: "INVALID_RESPONSE",
  });
});
