import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { describe, expect, it } from "vitest";
import {
  getOrder,
  getOrders,
  updateOrderStatus,
  addOrderNote,
} from "./order-api";
import { getCommerceDashboard } from "@/features/dashboard/api/commerce-api";

describe("order management API", () => {
  it("상태 전환을 처리 이력과 대시보드에 함께 반영한다", async () => {
    expect((await getOrders()).length).toBe(23);
    const updated = await updateOrderStatus("#2046", "완료");
    expect(updated.timeline.at(-1)?.status).toBe("완료");
    expect(
      (await getCommerceDashboard()).orders.find((item) => item.id === "#2046")
        ?.status,
    ).toBe("완료");
    await expect(updateOrderStatus("#2046", "대기")).rejects.toMatchObject({
      status: 409,
      code: "INVALID_ORDER_TRANSITION",
    });
  });
  it("메모를 저장하고 빈 메모는 거부한다", async () => {
    await addOrderNote("#2046", "  배송 완료 확인  ");
    expect((await getOrder("#2046")).notes[0]?.text).toBe("배송 완료 확인");
    await expect(addOrderNote("#2046", "  ")).rejects.toMatchObject({
      status: 400,
    });
  });
  it("알 수 없는 주문은 404를 반환한다", async () => {
    await expect(getOrder("#missing")).rejects.toMatchObject({ status: 404 });
  });
});

it("성공 응답의 스키마가 잘못되면 INVALID_RESPONSE로 거부한다", async () => {
  server.use(
    http.get("/api/orders", () => HttpResponse.json([{ id: "invalid" }])),
  );
  await expect(getOrders()).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
});

it("동일한 상태 재요청은 처리 이력을 중복 생성하지 않는다", async () => {
  const before = await getOrder("#2046");
  const same = await updateOrderStatus(before.id, before.status);
  expect(same.timeline).toEqual(before.timeline);
});
