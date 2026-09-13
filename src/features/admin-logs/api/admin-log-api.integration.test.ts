import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";
import { getAdminLogs } from "./admin-log-api";

describe("admin log API", () => {
  it("관리자 활동 로그 목록을 반환한다", async () => {
    const logs = await getAdminLogs();
    expect(logs.length).toBeGreaterThan(0);
    const sample = logs[0];
    expect(sample).toMatchObject({
      channel: expect.any(String),
      severity: expect.any(String),
      message: expect.any(String),
      occurredAt: expect.any(String),
    });
  });

  it("응답 스키마 위반은 INVALID_RESPONSE로 거부한다", async () => {
    server.use(
      http.get("/api/admin/logs", () => HttpResponse.json([{ id: "x" }])),
    );
    await expect(getAdminLogs()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });
});
