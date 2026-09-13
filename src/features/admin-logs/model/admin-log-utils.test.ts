import { describe, expect, it } from "vitest";
import {
  countAdminLogsByChannel,
  countAdminLogsBySeverity,
  validateAdminLogResponse,
} from "./admin-log-utils";
import type { AdminLog } from "./admin-log-schema";

const sample: AdminLog[] = [
  {
    id: "1",
    occurredAt: "2025-09-01T00:00:00.000Z",
    channel: "auth",
    severity: "info",
    actor: "system",
    message: "사용자 로그인",
    resource: "/api/login",
    actions: [],
  },
  {
    id: "2",
    occurredAt: "2025-09-01T00:01:00.000Z",
    channel: "orders",
    severity: "error",
    actor: "system",
    message: "결제 실패",
    resource: "/api/orders/1",
    actions: [],
  },
  {
    id: "3",
    occurredAt: "2025-09-01T00:02:00.000Z",
    channel: "orders",
    severity: "warning",
    actor: "admin@example.com",
    message: "주문 상태 변경",
    resource: "/api/orders/2",
    actions: [],
  },
];

describe("admin log utils", () => {
  it("채널별 개수를 센다", () => {
    expect(countAdminLogsByChannel(sample)).toEqual({
      auth: 1,
      orders: 2,
    });
  });

  it("심각도별 개수를 센다", () => {
    expect(countAdminLogsBySeverity(sample)).toEqual({
      info: 1,
      error: 1,
      warning: 1,
    });
  });

  it("응답을 AdminLog 배열로 검증한다", () => {
    expect(validateAdminLogResponse(sample)).toEqual(sample);
    expect(() =>
      validateAdminLogResponse([{ ...sample[0], severity: "unknown" }]),
    ).toThrow();
  });
});
