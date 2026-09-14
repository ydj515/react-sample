import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("가계부 등록과 필터 집계", async ({ page }) => {
  await login(page);
  await page.goto("/expenses");
  await page.getByRole("button", { name: "내역 추가" }).click();
  await page.getByLabel("금액 (원)").fill("18000");
  await page.getByLabel("메모", { exact: true }).fill("브라우저 점심");
  await page.getByRole("button", { name: "내역 저장" }).click();
  await page.getByLabel("내역 검색").fill("브라우저 점심");
  await expect(page.getByText("거래 내역 1건")).toBeVisible();
  await expect(
    page.getByRole("progressbar", { name: "식비 지출" }),
  ).toHaveAttribute("value", "18000");
  await page.reload();
  await expect(page.getByText("브라우저 점심", { exact: true })).toBeVisible();
});

for (const path of ["/expenses"]) {
  test(`${path} 모바일 너비`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page);
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}
