import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { expect, it } from "vitest";
import { managementFixture } from "@/mocks/data/management";
import { server } from "@/mocks/server";
import { renderWithProviders } from "@/shared/lib/test/render-with-providers";
import { OrderShippingForm } from "./OrderShippingForm";

it("저장 중 입력을 잠그고 서버 응답을 저장 기준으로 사용한다", async () => {
  const order = managementFixture.orders[0]!;
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let submitted: unknown;
  server.use(
    http.patch("/api/orders/:id/shipping", async ({ request }) => {
      submitted = await request.json();
      await gate;
      return HttpResponse.json({ ...order, trackingNumber: "NORMALIZED-123" });
    }),
  );
  const user = userEvent.setup();
  renderWithProviders(<OrderShippingForm order={order} />);
  const tracking = screen.getByRole("textbox", { name: "운송장 번호" });
  await user.clear(tracking);
  await user.type(tracking, "INPUT-123");
  await user.click(screen.getByRole("button", { name: "배송 정보 저장" }));
  try {
    await waitFor(() =>
      expect(submitted).toMatchObject({ trackingNumber: "INPUT-123" }),
    );
    expect(tracking).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "택배사" })).toBeDisabled();
    await user.type(tracking, "UNSAVED");
    expect(tracking).toHaveValue("INPUT-123");
  } finally {
    release();
  }
  await waitFor(() => expect(tracking).toHaveValue("NORMALIZED-123"));
  expect(tracking).toBeEnabled();
  expect(screen.getByRole("button", { name: "배송 정보 저장" })).toBeDisabled();
});
