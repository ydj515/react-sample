import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { InvoiceForm } from "./InvoiceForm";

it("validates the form and calculates multiple line items", async () => {
  const save = vi.fn();
  render(<InvoiceForm onSave={save} onCancel={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: "초안 저장" }));
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(save).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText("고객명"), {
    target: { value: "테스트 고객" },
  });
  fireEvent.change(screen.getByLabelText("설명"), {
    target: { value: "개발" },
  });
  fireEvent.change(screen.getByLabelText("수량"), { target: { value: "2" } });
  fireEvent.change(screen.getByLabelText("단가 (원)"), {
    target: { value: "1000" },
  });
  expect(screen.getByText("예상 합계: ₩2,200")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "라인 아이템 추가" }));
  expect(screen.getAllByLabelText("설명")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: "항목 2 제거" }));
  fireEvent.click(screen.getByRole("button", { name: "초안 저장" }));
  await waitFor(() => expect(save).toHaveBeenCalled());
});
