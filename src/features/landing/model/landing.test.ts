import { expect, it } from "vitest";
import { getPlanPrice, inquirySchema } from "./landing";

it("연간 플랜은 월 환산 가격과 실제 연간 합계를 일치시킨다", () => {
  expect(getPlanPrice(39000, "monthly")).toEqual({
    monthly: 39000,
    total: 39000,
  });
  expect(getPlanPrice(39000, "yearly")).toEqual({
    monthly: 31200,
    total: 374400,
  });
  expect(getPlanPrice(0, "yearly")).toEqual({ monthly: 0, total: 0 });
});
it("빈 이름과 잘못된 이메일을 거부하고 앞뒤 공백을 정리한다", () => {
  expect(
    inquirySchema.safeParse({ name: "  ", email: "invalid", message: "" })
      .success,
  ).toBe(false);
  expect(
    inquirySchema.parse({
      name: " 샘플 ",
      email: " demo@example.com ",
      message: " 문의 ",
    }),
  ).toEqual({ name: "샘플", email: "demo@example.com", message: "문의" });
});
