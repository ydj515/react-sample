import { expect, test } from "@playwright/test";

test.describe("대시보드", () => {
  test("페이지가 로드되고 MSW 목 데이터로 지표가 표시된다", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "대시보드" })).toBeVisible();
    // 목 API 응답이 반영되어야 지표 카드가 렌더된다.
    await expect(page.getByText("전체 프로젝트")).toBeVisible();
  });
});
