import { describe, expect, it } from "vitest";
import { commerceFixture } from "@/mocks/data/commerce";
import {
  defaultOrderFilters,
  orderFiltersSchema,
  filterOrders,
  ordersCsv,
} from "./commerce-utils";

describe("commerce order search", () => {
  it("검색어, 상태, 기간, 금액, 카테고리, 브랜드와 담당 CS 조건을 함께 적용한다", () => {
    const sample = commerceFixture.orders[0]!;
    expect(
      filterOrders(
        commerceFixture.orders,
        {
          ...defaultOrderFilters,
          keyword: "2047",
          status: "완료",
          from: sample.date,
          to: sample.date,
          min: "189000",
          max: "189000",
          category: "신발",
          brands: ["Nike"],
          cs: sample.cs,
        },
        "newest",
      ),
    ).toEqual([sample]);
    expect(
      filterOrders(
        commerceFixture.orders,
        { ...defaultOrderFilters, keyword: "없는 주문" },
        "newest",
      ),
    ).toEqual([]);
  });
  it("금액 0 상한을 처리하고 입력 배열을 변경하지 않고 정렬한다", () => {
    expect(
      filterOrders(
        commerceFixture.orders,
        { ...defaultOrderFilters, max: "0" },
        "newest",
      ),
    ).toEqual([]);
    const before = [...commerceFixture.orders];
    const sorted = filterOrders(before, defaultOrderFilters, "amount-desc");
    expect(sorted[0]!.amount).toBe(298000);
    expect(before).toEqual(commerceFixture.orders);
    expect(filterOrders(before, defaultOrderFilters, "oldest")[0]!.id).toBe(
      "#2025",
    );
    expect(
      filterOrders(before, defaultOrderFilters, "amount-asc")[0]!.amount,
    ).toBe(39000);
  });
  it("역전 기간과 금액 범위, 음수·숫자가 아닌 금액을 거부한다", () => {
    for (const invalid of [
      { from: "2025-07-01", to: "2025-06-01" },
      { min: "20", max: "10" },
      { min: "-1" },
      { max: "hello" },
    ]) {
      expect(
        orderFiltersSchema.safeParse({ ...defaultOrderFilters, ...invalid })
          .success,
      ).toBe(false);
    }
  });
  it("CSV에서 수식 문자와 인용부호를 이스케이프한다", () => {
    const csv = ordersCsv([
      {
        ...commerceFixture.orders[0]!,
        customer: "=SUM(1,2)",
        product: 'Test "shoe"',
      },
    ]);
    expect(csv).toContain('"\'=SUM(1,2)"');
    expect(csv).toContain('"Test ""shoe"""');
    expect(csv.startsWith("\uFEFF")).toBe(true);
  });
  it("매출 KPI와 마지막 월, 카테고리 합계가 같은 원 단위를 사용한다", () => {
    expect(
      commerceFixture.categories.reduce((sum, item) => sum + item.amount, 0),
    ).toBe(commerceFixture.revenue);
    expect(commerceFixture.monthly.at(-1)!.amount).toBe(
      commerceFixture.revenue,
    );
  });
});
