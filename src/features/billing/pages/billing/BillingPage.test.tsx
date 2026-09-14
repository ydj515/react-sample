import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import { BillingPage } from "./BillingPage";
import { renderBusiness } from "@/test/render-business";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

function renderBilling(initial = "/billing") {
  return renderBusiness(initial, [
    { path: "/billing", component: BillingPage },
    { path: "/billing/$invoiceId", component: BillingPage },
  ]);
}

it("creates an invoice, transitions it to paid and preserves its metadata", async () => {
  const user = userEvent.setup();

  const { router } = renderBilling();
  await user.click(await screen.findByRole("button", { name: "새 송장" }));
  await user.type(screen.getByLabelText("고객명"), "테스트 고객");
  await user.type(screen.getByLabelText("설명"), "서비스");
  await user.clear(screen.getByLabelText("단가 (원)"));
  await user.type(screen.getByLabelText("단가 (원)"), "1000");
  await user.click(screen.getByRole("button", { name: "초안 저장" }));
  expect(
    await screen.findByRole("heading", { name: "송장 상세" }),
  ).toBeVisible();
  expect(document.title).toBe("테스트 고객 송장 | React Sample");
  await user.click(screen.getByRole("button", { name: "송장 발행" }));
  await user.click(screen.getByRole("button", { name: "결제 완료 처리" }));
  expect(screen.getByRole("button", { name: "초안 수정" })).toBeDisabled();
  expect(
    JSON.parse(localStorage.getItem("react-sample-billing-v1") ?? "[]"),
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ customer: "테스트 고객", status: "paid" }),
    ]),
  );
  await router.navigate({ to: "/billing" });
  expect(
    await screen.findByRole("heading", { name: "인보이스 / 빌링" }),
  ).toBeVisible();
});

it("keeps the invoice unchanged and reports a storage failure", async () => {
  const user = userEvent.setup();
  renderBilling("/billing/INV-DEMO-001");
  const setItem = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("quota");
    });
  await user.click(await screen.findByRole("button", { name: "송장 발행" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "저장하지 못했습니다",
  );
  expect(screen.getByRole("button", { name: "송장 발행" })).toBeEnabled();
  expect(setItem).toHaveBeenCalled();
});
