import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test("React 19 examples preserve drafts, metadata and deferred content", async ({
  page,
}) => {
  await login(page);
  await page.goto("/users/user-1");
  await page.getByLabel("닉네임", { exact: true }).fill("저장하지 않은 초안");
  await page.getByRole("tab", { name: "주문 내역" }).click();
  await page.getByRole("tab", { name: "기본 정보" }).click();
  await expect(page.getByLabel("닉네임", { exact: true })).toHaveValue(
    "저장하지 않은 초안",
  );
  await page.goto("/projects");
  await expect(page).toHaveTitle("프로젝트 | React Sample");
  await page.getByRole("link", { name: "Design System", exact: true }).click();
  await expect(page).toHaveTitle("Design System | React Sample");
  await page.getByLabel("프로젝트 상태 변경").selectOption("completed");
  await expect(page.getByLabel("프로젝트 상태 변경")).toBeEnabled();
  await expect(page.getByLabel("프로젝트 상태 변경")).toHaveValue("completed");
  await page.goto("/react-19");
  await expect(page).toHaveTitle("React 19 예제 | React Sample");
  await page.getByRole("button", { name: "프로젝트 데이터 보기" }).click();
  await expect(page.getByText("Design System", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "데이터 새로고침" }).click();
  await expect(page.getByText("Design System", { exact: true })).toBeVisible();
  await expect(page.locator("head title")).toHaveCount(1);
});
