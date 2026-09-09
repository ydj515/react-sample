import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("랜딩 필터는 새로고침과 뒤로가기로 복원된다", async ({ page }) => {
  await page.goto("/landing/event");
  await page.getByRole("button", { name: "DAY 2 · 11.13" }).click();
  await expect(page).toHaveURL(/day=2/);
  await page.getByRole("button", { name: "Culture", exact: true }).click();
  await expect(page).toHaveURL(/track=Culture/);
  await page.reload();
  await expect(page.getByRole("status")).toContainText("0개 세션");
  await page.goBack();
  await expect(
    page.getByRole("button", { name: "전체", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/landing/agency?category=브랜딩");
  await expect(page.getByRole("status")).toContainText("1개의");
});

test("문서 검색어와 적용한 주문 조건을 URL에서 복원한다", async ({ page }) => {
  await page.goto("/docs/getting-started?q=키보드");
  await expect(page.getByRole("searchbox", { name: "문서 검색" })).toHaveValue(
    "키보드",
  );
  await page.reload();
  await expect(
    page.getByRole("list", { name: "문서 검색 결과" }),
  ).toBeVisible();
  await login(page);
  await page.getByLabel("주문 검색어").fill("Nike");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  await expect(page).toHaveURL(/orderFilters=/);
  await page.reload();
  await expect(page.getByLabel("주문 검색어")).toHaveValue("Nike");
});

test("프로젝트의 검색, 정렬, 페이지를 URL로 연다", async ({ page }) => {
  await login(page);
  await page.goto("/projects?q=없는프로젝트&status=paused&sort=name&page=2");
  await expect(
    page.getByText("조건에 맞는 프로젝트가 없습니다."),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("조건에 맞는 프로젝트가 없습니다."),
  ).toBeVisible();
});
