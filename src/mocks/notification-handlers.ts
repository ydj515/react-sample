import { http, HttpResponse } from "msw";

import {
  countUnread,
  findNotification,
  listNotifications,
  markAllRead,
  markRead,
} from "@/mocks/data/notifications";
import { createMockApiError } from "./api-error";

function readParam(request: Request, name: string) {
  return new URL(request.url).searchParams.get(name);
}

export const notificationHandlers = [
  http.get("/api/notifications", ({ request }) => {
    const cursor = readParam(request, "cursor");

    const limit = readParam(request, "limit");

    const category = readParam(request, "category") ?? "all";

    const filter = readParam(request, "filter") ?? "all";

    const page = listNotifications({
      cursor,
      limit: limit ? Number.parseInt(limit, 10) : undefined,
      category,
      filter,
    });
    return HttpResponse.json(page);
  }),
  http.get("/api/notifications/unread-count", () => {
    return HttpResponse.json(countUnread());
  }),
  http.post("/api/notifications/:id/read", ({ request, params }) => {
    const id = String(params.id);

    const notification = markRead(id);
    if (!notification) {
      return createMockApiError({
        status: 404,
        code: "NOTIFICATION_NOT_FOUND",
        message: "알림을 찾을 수 없습니다.",
        path: new URL(request.url).pathname,
      });
    }
    return HttpResponse.json(notification);
  }),
  http.post("/api/notifications/read-all", () => {
    return HttpResponse.json(markAllRead());
  }),
];

// markRead 변경 후 카운트도 함께 갱신되도록 노출한다.
export function peekNotification(id: string) {
  return findNotification(id);
}
