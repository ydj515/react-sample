import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("캘린더 충돌 차단, 드래그 이동과 CRUD", async ({ page }) => {
  await login(page);
  await page.goto("/calendar");
  await page.getByLabel("기준 날짜").fill("2026-09-14");
  await page.getByRole("button", { name: "일정 추가", exact: true }).click();
  await page.getByLabel("일정 제목").fill("디자인 회의");
  await page.getByRole("button", { name: "일정 저장" }).click();
  await page.getByRole("button", { name: "일정 추가", exact: true }).click();
  await page.getByLabel("일정 제목").fill("겹치는 회의");
  await page.getByRole("button", { name: "일정 저장" }).click();
  await expect(page.getByRole("alert")).toContainText("시간이 겹치는 일정");
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  const handle = page.getByRole("button", { name: "디자인 회의 이동" });

  const target = page.getByTestId("calendar-cell-2026-09-15");
  await handle.scrollIntoViewIfNeeded();
  const start = await handle.boundingBox();

  const end = await target.boundingBox();
  if (!start || !end) throw new Error("Missing drag bounds");
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, {
    steps: 12,
  });
  await page.mouse.up();
  await expect(target.getByText("디자인 회의", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "주", exact: true }).click();
  await page.getByRole("button", { name: "일", exact: true }).click();
  await page.getByRole("button", { name: /디자인 회의 수정/ }).click();
  await expect(page.getByLabel("시작 (서울)")).toHaveValue("2026-09-15T09:00");
  await page.getByLabel("일정 제목").fill("수정된 회의");
  await page.getByRole("button", { name: "일정 저장" }).click();
  await page.reload();
  await page.getByLabel("기준 날짜").fill("2026-09-15");
  await page.getByRole("button", { name: /수정된 회의 수정/ }).click();
  await page.getByRole("button", { name: "일정 삭제" }).click();
  await expect(page.getByText("수정된 회의", { exact: true })).toHaveCount(0);
});

for (const path of ["/calendar"]) {
  test(`${path} 모바일 레이아웃`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page);
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
