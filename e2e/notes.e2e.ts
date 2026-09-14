import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("노트 미리보기, 태그 검색, 로컬 복원", async ({ page }) => {
  await login(page);
  await page.goto("/notes");
  await page.getByLabel("노트 제목").fill("회의 기록");
  await page.getByLabel("태그 (쉼표 구분)").fill("회의, 개발");
  await page
    .getByLabel("마크다운 본문")
    .fill("# 결정 사항\n\n```ts\nconst answer = 42;\n```");
  await expect(page.getByRole("heading", { name: "결정 사항" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("저장 완료");
  await page.reload();
  await expect(page.getByLabel("노트 제목")).toHaveValue("회의 기록");
  await page.getByLabel("노트 검색").fill("없는태그");
  await expect(page.getByText("검색 결과가 없습니다.")).toBeVisible();
});

for (const path of ["/notes"]) {
  test(`${path} 모바일 레이아웃`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page);
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
