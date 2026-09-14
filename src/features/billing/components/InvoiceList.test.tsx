import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { TestRouter } from "@/shared/lib/test/TestRouter";
import { InvoiceList } from "./InvoiceList";
import type { Invoice } from "@/features/billing/model/billing";

const invoices: Invoice[] = (
  ["draft", "issued", "paid", "cancelled"] as const
).map((status, index) => ({
  id: `INV-${index}`,
  customer: `고객 ${index}`,
  dueDate: "2026-09-30",
  taxRate: 10,
  status,
  items: [{ description: "서비스", quantity: 1, price: 1000 * (index + 1) }],
}));

it("summarizes issued and paid amounts separately and combines search with status", async () => {
  const user = userEvent.setup();
  render(
    <TestRouter>
      <InvoiceList invoices={invoices} />
    </TestRouter>,
  );
  const overview = await screen.findByRole("region", { name: "청구 현황" });
  expect(within(overview).getByText("₩2,200")).toBeVisible();
  expect(within(overview).getByText("₩3,300")).toBeVisible();
  expect(within(overview).queryByText("₩4,400")).not.toBeInTheDocument();
  await user.type(
    screen.getByRole("searchbox", { name: "송장 검색" }),
    "inv-1",
  );
  expect(screen.getByRole("status")).toHaveTextContent("전체 4건 중 1건");
  await user.selectOptions(screen.getByLabelText("상태 필터"), "paid");
  expect(screen.getByText("조건에 맞는 송장이 없습니다.")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "필터 초기화" }));
  expect(screen.getByRole("status")).toHaveTextContent("전체 4건 중 4건");
});

it("shows a useful first-invoice empty state", async () => {
  render(
    <TestRouter>
      <InvoiceList invoices={[]} />
    </TestRouter>,
  );
  expect(await screen.findByText("아직 송장이 없습니다.")).toBeVisible();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});
