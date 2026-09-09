import { TestRouter } from "@/shared/lib/test/TestRouter";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { commerceFixture } from "@/mocks/data/commerce";
import {
  MonthlyRevenue,
  VisitorTrend,
  CategoryRevenue,
} from "./CommerceCharts";
import { OrderSearch } from "./OrderSearch";

describe("commerce snapshot changes", () => {
  it("방문 시계열이 줄어들면 선택 날짜를 새 데이터 범위에 맞춘다", () => {
    const { rerender } = render(
      <VisitorTrend data={commerceFixture.traffic} />,
    );
    rerender(<VisitorTrend data={commerceFixture.traffic.slice(0, 2)} />);
    expect(
      screen.getByRole("combobox", { name: "방문 추이 날짜" }),
    ).toHaveValue("1");
    expect(screen.getByText("2,980명")).toBeInTheDocument();
  });
  it("빈 카테고리의 총 매출은 0으로 표시한다", () => {
    render(<CategoryRevenue data={[]} />);
    expect(screen.getByText("₩0.0M")).toBeInTheDocument();
  });
  it("새 주문 스냅샷을 받으면 페이지와 선택을 초기화한다", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <OrderSearch
        orders={commerceFixture.orders}
        asOf={commerceFixture.asOf}
      />,
      { wrapper: TestRouter },
    );
    await user.click(await screen.findByRole("button", { name: "3페이지" }));
    await user.click(
      screen.getByRole("checkbox", { name: "현재 페이지 전체 선택" }),
    );
    expect(screen.getByText("7건 선택")).toBeInTheDocument();
    rerender(
      <OrderSearch
        orders={commerceFixture.orders.slice(0, 2)}
        asOf={commerceFixture.asOf}
      />,
    );
    expect(screen.getByText("1–2 / 2건")).toBeInTheDocument();
    expect(screen.queryByText("7건 선택")).not.toBeInTheDocument();
  });
});

describe("monthly revenue inspection", () => {
  it("호버와 키보드로 월별 금액을 확인하고 Escape로 닫는다", async () => {
    const user = userEvent.setup();
    render(<MonthlyRevenue data={commerceFixture.monthly} />);
    const april = screen.getByRole("button", { name: "4월 매출 ₩3,300,000" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.hover(april);
    expect(screen.getByRole("tooltip")).toHaveTextContent("4월: ₩3.3M");
    expect(screen.getByRole("tooltip")).toHaveTextContent("₩3,300,000");
    await user.unhover(april);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("tooltip")).toHaveTextContent("12월: ₩2.8M");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("tooltip")).toHaveTextContent("1월: ₩3.2M");
  });
  it("터치에 대응하는 클릭으로 값을 확인하고 데이터가 사라지면 툴팁을 제거한다", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <MonthlyRevenue data={commerceFixture.monthly} />,
    );
    await user.click(
      screen.getByRole("button", { name: "6월 매출 ₩4,200,000" }),
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent("6월: ₩4.2M");
    rerender(<MonthlyRevenue data={commerceFixture.monthly.slice(0, 2)} />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
