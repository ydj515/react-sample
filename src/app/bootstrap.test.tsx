import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { bootstrapApp } from "@/app/bootstrap";

describe("bootstrapApp", () => {
  it("mock worker 시작이 실패해도 앱 렌더링을 계속한다", async () => {
    const container = document.createElement("div");
    const render = vi.fn();
    const onMockingError = vi.fn();

    bootstrapApp({
      container,
      enableMocking: () => Promise.reject(new Error("msw failed")),
      onMockingError,
      render,
    });

    await waitFor(() => {
      expect(render).toHaveBeenCalledWith(container);
    });
    expect(onMockingError).toHaveBeenCalledWith(expect.any(Error));
  });
});
