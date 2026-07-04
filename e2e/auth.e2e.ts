import { expect, test } from "@playwright/test";

test("미인증 상태로 보호 라우트 접근 시 로그인으로 리다이렉트된다", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/signin/);
  await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
});

test("로그인 후 원래 목적지(redirect)로 이동한다", async ({ page }) => {
  await page.goto("/settings");

  // 보호 라우트라 로그인으로 밀려난다.
  await expect(page).toHaveURL(/\/signin/);

  await page.getByLabel("이메일").fill("demo@example.com");
  await page.getByLabel("비밀번호").fill("password");
  await page.getByRole("button", { name: "로그인" }).click();

  // 로그인 후 원래 가려던 /settings로 복귀한다.
  await expect(page).toHaveURL(/\/settings/);
});
