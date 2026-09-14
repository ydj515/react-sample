import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("설문 작성, 발행, 응답과 결과 복원", async ({ page }) => {
  await login(page);
  await page.goto("/surveys");
  await page.getByRole("button", { name: "새 설문" }).click();
  await page.getByLabel("설문 제목").fill("제품 설문");
  await page.getByLabel("질문 1 제목").fill("만족도");
  await page.getByLabel("질문 1 유형").selectOption("scale");
  await page.getByRole("button", { name: "초안 저장" }).click();
  await page.getByRole("button", { name: "설문 발행" }).click();
  await page.getByRole("button", { name: "응답 작성" }).click();
  await page.getByRole("radio", { name: "4", exact: true }).check();
  await page.getByRole("button", { name: "응답 제출" }).click();
  await expect(page.getByText("응답 1개 · 평균 4.0 / 5점")).toBeVisible();
  await page.reload();
  await page
    .getByLabel("설문 목록")
    .selectOption({ label: "제품 설문 · 응답 수집 중" });
  await expect(page.getByText("수집된 응답 1개")).toBeVisible();
});

for (const path of ["/surveys"]) {
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
