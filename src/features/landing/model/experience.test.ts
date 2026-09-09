import { expect, it } from "vitest";
import { createStaySchema, getStayQuote, getProductTotal } from "./experience";
it("숙박 날짜의 순서, 과거 날짜, 객실 정원과 최대 14박을 검증한다", () => {
  const schema = createStaySchema("2026-09-09");
  const values = {
    arrival: "2026-09-10",
    departure: "2026-09-12",
    room: "forest",
    guests: "2",
  };
  expect(schema.safeParse(values).success).toBe(true);
  for (const change of [
    { arrival: "2026-09-08" },
    { departure: "2026-09-10" },
    { departure: "2026-09-30" },
    { guests: "3" },
    { arrival: "2026-02-30" },
  ]) {
    expect(schema.safeParse({ ...values, ...change }).success).toBe(false);
  }
  expect(
    schema.safeParse({ ...values, room: "garden", guests: "4" }).success,
  ).toBe(true);
});
it("숙박 견적은 일광 절약 시간이나 시간대에 영향받지 않는 박수를 사용한다", () => {
  expect(
    getStayQuote({
      arrival: "2026-03-07",
      departure: "2026-03-09",
      room: "forest",
      guests: "2",
    }),
  ).toEqual({ nights: 2, total: 560000 });
});
it("상품 구성과 수량의 합계를 계산한다", () => {
  expect(getProductTotal("solo", 1)).toBe(239000);
  expect(getProductTotal("studio", 2)).toBe(578000);
});
