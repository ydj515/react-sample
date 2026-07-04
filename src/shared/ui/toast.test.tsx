import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { toast, useToastStore } from "@/stores/toast-store";

import { Toaster } from "./toast";

describe("Toaster", () => {
  beforeEach(() => {
    useToastStore.getState().clear();
  });

  afterEach(() => {
    useToastStore.getState().clear();
  });

  it("토스트가 없으면 아무것도 렌더하지 않는다", () => {
    const { container } = render(<Toaster />);
    expect(container).toBeEmptyDOMElement();
  });

  it("toast.success로 띄운 알림을 렌더한다", () => {
    render(<Toaster />);

    act(() => {
      toast.success("저장되었습니다.");
    });

    expect(screen.getByRole("status")).toHaveTextContent("저장되었습니다.");
  });

  it("닫기 버튼으로 토스트를 제거한다", async () => {
    const user = userEvent.setup();
    render(<Toaster />);

    act(() => {
      toast.error("오류가 발생했습니다.");
    });
    expect(screen.getByText("오류가 발생했습니다.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "알림 닫기" }));

    expect(screen.queryByText("오류가 발생했습니다.")).not.toBeInTheDocument();
  });
});
