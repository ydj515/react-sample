import { expect, test } from "@playwright/test";

test("로그인 페이지가 렌더되고 폼 필드가 보인다", async ({ page }) => {
  await page.goto("/signin");

  await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  await expect(page.getByLabel("이메일")).toBeVisible();
  await expect(page.getByLabel("비밀번호")).toBeVisible();
});
