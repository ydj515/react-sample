import { expect, test } from "@playwright/test";

import { login } from "./helpers";

test("알림 센터: GNB 종 아이콘과 풀 페이지가 같은 데이터를 공유한다", async ({
  page,
}) => {
  await login(page);
  const bell = page.getByRole("button", { name: /알림 \d+건/ });
  await expect(bell).toBeVisible();
  const label = await bell.getAttribute("aria-label");

  const initial = Number((label ?? "알림 0건").replace(/[^0-9]/g, "")) || 0;
  expect(initial).toBeGreaterThan(0);

  await bell.click();
  const dropdown = page.getByRole("dialog", { name: "알림" });
  await expect(dropdown).toBeVisible();
  await dropdown.getByRole("button", { name: "모두 읽음" }).click();
  await page.getByRole("link", { name: "모든 알림 보기" }).click();
  await expect(page).toHaveURL(/\/notifications/);
  await expect(
    page.getByRole("heading", { name: "알림 센터", exact: true }),
  ).toBeVisible();

  const unreadCard = page
    .locator("p", { hasText: "읽지 않음" })
    .locator("xpath=..");
  await expect(unreadCard).toContainText("0");
});

test("알림 센터: 카테고리 필터 변경 시 URL과 결과가 갱신된다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/notifications");
  await expect(
    page.getByRole("heading", { name: "알림 센터", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "알림 카테고리" })
    .selectOption("order");
  await expect(page).toHaveURL(/category=order/);
  const items = page.locator('[data-testid^="notification-item-"]');

  const orderCount = await items.count();
  expect(orderCount).toBeGreaterThan(0);
  for (let index = 0; index < orderCount; index += 1) {
    await expect(items.nth(index)).toContainText("주문");
  }
});

test("개별 읽음 후 행 높이와 다음 행 위치를 유지한다", async ({ page }) => {
  await login(page);
  await page.goto("/notifications");
  const rows = page.locator('[data-testid^="notification-item-"]');

  const first = rows.first();
  await expect(
    first.getByRole("button", { name: "읽음으로 표시" }),
  ).toBeVisible();
  const before = await first.boundingBox();

  const nextBefore = await rows.nth(1).boundingBox();
  await first.getByRole("button", { name: "읽음으로 표시" }).click();
  await expect(first).toHaveAttribute("data-unread", "false");
  await expect(first.getByText("읽음", { exact: true })).toBeVisible();
  expect((await first.boundingBox())?.height).toBe(before?.height);
  expect((await rows.nth(1).boundingBox())?.y).toBe(nextBefore?.y);
});

test("모바일 알림 패널도 읽음 처리 후 크기를 유지한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await page.getByRole("button", { name: /알림 \d+건/ }).click();
  const dialog = page.getByRole("dialog", { name: "알림", exact: true });

  const rows = dialog.locator('[data-testid^="notification-item-"]');
  await expect(rows.first()).toBeVisible();
  const before = await rows.first().boundingBox();

  const nextBefore = await rows.nth(1).boundingBox();
  await rows.first().getByRole("button", { name: "읽음으로 표시" }).click();
  await expect(rows.first()).toHaveAttribute("data-unread", "false");
  expect((await rows.first().boundingBox())?.height).toBe(before?.height);
  expect((await rows.nth(1).boundingBox())?.y).toBe(nextBefore?.y);
});
