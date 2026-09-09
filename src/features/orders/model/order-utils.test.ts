import { describe, it, expect } from "vitest";
import { managementFixture } from "@/mocks/data/management";
import { selectOrders } from "./order-utils";
import { ordersSearchSchema } from "./order-schema";

describe("order filters", () => {
  it("주문 번호와 상태를 조합하고 페이지 범위를 맞춘다", () => {
    const result = selectOrders(
      managementFixture.orders,
      ordersSearchSchema.parse({ q: "2046", status: "배송중", page: 100 }),
    );
    expect(result.items.map((o) => o.id)).toEqual(["#2046"]);
    expect(result.page).toBe(1);
  });
  it.each(["amount-desc", "amount-asc", "oldest", "newest"])(
    "%s 순으로 주문을 정렬한다",
    (sort) => {
      const result = selectOrders(
        managementFixture.orders,
        ordersSearchSchema.parse({ sort }),
      );
      const values = result.items.map((o) =>
        sort.startsWith("amount") ? o.amount : Date.parse(o.date),
      );
      expect(values).toEqual(
        [...values].sort((a, b) =>
          sort === "amount-desc" || sort === "newest" ? b - a : a - b,
        ),
      );
    },
  );
});
