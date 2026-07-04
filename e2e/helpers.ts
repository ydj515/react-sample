import { expect, type Page } from "@playwright/test";

// 데모 인증으로 로그인하고 대시보드가 뜰 때까지 기다린다.
export async function login(page: Page) {
  await page.goto("/signin");
  await page.getByLabel("이메일").fill("demo@example.com");
  await page.getByLabel("비밀번호").fill("password");
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByRole("heading", { name: "대시보드" })).toBeVisible();
}
