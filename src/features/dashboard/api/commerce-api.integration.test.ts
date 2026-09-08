import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { getCommerceDashboard } from "./commerce-api";

describe("commerce dashboard API", () => {
  it("실제 fetch와 MSW를 통해 차트와 주문 스냅샷을 가져온다", async () => {
    const data = await getCommerceDashboard();
    expect(data.orders).toHaveLength(23);
    expect(data.traffic).toHaveLength(14);
    expect(data.revenue).toBe(4200000);
  });
  it("응답 스키마에 맞지 않는 주문을 거부한다", async () => {
    const data = await getCommerceDashboard();
    server.use(
      http.get("/api/dashboard/commerce", () =>
        HttpResponse.json({
          ...data,
          orders: [{ ...data.orders[0], amount: -1 }],
        }),
      ),
    );
    await expect(getCommerceDashboard()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });
});
