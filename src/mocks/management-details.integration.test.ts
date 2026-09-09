import { z } from "zod";
import { describe, it, expect } from "vitest";
import { apiRequest } from "@/shared/api/http-client";
import { getUser } from "@/features/users/api";
import { getOrder } from "@/features/orders/api";

describe("management detail editing", () => {
  it("회원 정보 편집을 저장하고 활동 이력을 남긴다", async () => {
    const user = await getUser("user-1");
    await apiRequest("/api/users/user-1/profile", {
      schema: z.unknown(),
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...user,
        name: "김민준 수정",
        nickname: "minjun",
        phone: "010-0000-0000",
        grade: "Gold",
        address: "서울 샘플로",
        memo: "선호 배송 시간 확인",
      }),
    });
    expect(await getUser("user-1")).toMatchObject({
      name: "김민준 수정",
      memo: "선호 배송 시간 확인",
    });
  });
  it("배송 정보를 저장하고 잘못된 운송장은 거부한다", async () => {
    const path = "/api/orders/%232046/shipping";
    await apiRequest(path, {
      schema: z.unknown(),
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carrier: "CJ대한통운",
        trackingNumber: "DEMO-123456",
      }),
    });
    expect(await getOrder("#2046")).toMatchObject({
      carrier: "CJ대한통운",
      trackingNumber: "DEMO-123456",
    });
    await expect(
      apiRequest(path, {
        schema: z.unknown(),
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrier: "CJ대한통운",
          trackingNumber: "<invalid>",
        }),
      }),
    ).rejects.toMatchObject({ status: 400 });
  });
});
