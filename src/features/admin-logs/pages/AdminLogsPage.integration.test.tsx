import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderManagement } from "@/test/render-management";

const rowCountTestId = "관리자 활동 로그-row-count";

describe("admin logs", () => {
  it("활동 로그 페이지가 렌더되고 채널·심각도 필터링에 반응한다", async () => {
    const user = userEvent.setup();
    renderManagement("/admin/logs");
    await screen.findByRole("table", { name: /관리자 활동 로그/ });
    const count = await screen.findByTestId(rowCountTestId);
    expect(count).toHaveTextContent("420");

    await user.selectOptions(
      screen.getByRole("combobox", { name: "채널" }),
      "orders",
    );
    expect(count).toHaveTextContent("84");

    await user.selectOptions(
      screen.getByRole("combobox", { name: "심각도" }),
      "error",
    );
    expect(count).toHaveTextContent("28");

    await user.click(screen.getByRole("button", { name: "초기화" }));
    expect(count).toHaveTextContent("420");
  });
});
