import { expect, test } from "@playwright/test";

import { login } from "./helpers";

test.describe("대시보드", () => {
  test("로그인 후 MSW 목 데이터로 지표가 표시된다", async ({ page }) => {
    await login(page);

    // 목 API 응답이 반영되어야 지표 카드가 렌더된다.
    await expect(page.getByText("전체 프로젝트")).toBeVisible();
  });
});
