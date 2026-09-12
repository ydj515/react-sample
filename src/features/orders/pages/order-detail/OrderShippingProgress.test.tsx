import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { managementFixture } from "@/mocks/data/management";
import { OrderShippingProgress } from "./OrderShippingProgress";

describe("OrderShippingProgress", () => {
  it.each([
    ["대기", "배송 준비"],
    ["배송중", "배송 중"],
    ["완료", "배송 완료"],
  ] as const)("%s 주문의 현재 배송 단계를 표시한다", (status, label) => {
    render(
      <OrderShippingProgress
        order={{ ...managementFixture.orders[0]!, status }}
      />,
    );
    const steps = screen.getByRole("list", { name: "배송 진행 단계" });
    const current = within(steps).getByRole("listitem", { current: "step" });
    expect(current).toHaveTextContent(label);
    expect(current).toHaveTextContent(status === "완료" ? "완료" : "진행 중");
  });

  it("취소 주문은 배송 단계 대신 취소 안내와 처리 이력을 표시한다", () => {
    const order = {
      ...managementFixture.orders[0]!,
      status: "취소" as const,
      timeline: [
        {
          id: "cancel",
          status: "취소" as const,
          text: "고객 요청 취소",
          at: "2026-09-12T00:00:00Z",
        },
      ],
    };
    render(<OrderShippingProgress order={order} />);
    expect(
      screen.queryByRole("list", { name: "배송 진행 단계" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("취소된 주문입니다. 배송을 진행하지 않습니다."),
    ).toBeInTheDocument();
    expect(screen.getByText("처리 타임라인 (1건)")).toBeInTheDocument();
    expect(screen.getByText("고객 요청 취소")).toBeInTheDocument();
  });
});
