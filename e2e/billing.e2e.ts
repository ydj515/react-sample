import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("송장을 작성하고 발행, 결제 및 인쇄 레이아웃을 확인한다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/billing");
  await page.getByRole("button", { name: "새 송장", exact: true }).click();
  await page.getByLabel("고객명").fill("브라우저 고객");
  await page.getByLabel("설명", { exact: true }).fill("개발 작업");
  await page.getByLabel("수량", { exact: true }).fill("2");
  await page.getByLabel("단가 (원)").fill("10000");
  await page.getByRole("button", { name: "초안 저장" }).click();
  await expect(page.getByRole("heading", { name: "송장 상세" })).toBeVisible();
  await expect(page.locator("dd").last()).toHaveText("₩22,000");
  await page.getByRole("button", { name: "송장 발행" }).click();
  await page.getByRole("button", { name: "결제 완료 처리" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "초안 수정" })).toBeDisabled();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".invoice-print")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "송장 인쇄" }),
  ).not.toBeVisible();
});

for (const path of ["/billing"]) {
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

for (const width of [390, 1280]) {
  test(`송장 상세의 탐색과 작업 영역을 구분한다 (${width}px)`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await login(page);
    await page.goto("/billing/INV-DEMO-001");
    await expect(
      page.getByRole("navigation", { name: "현재 위치" }),
    ).toContainText("송장 상세");
    const back = page.getByRole("link", { name: "송장 목록으로" });

    const title = page.getByRole("heading", { name: "송장 상세", exact: true });
    await expect(back).toBeVisible();
    expect((await back.boundingBox())!.y).toBeLessThan(
      (await title.boundingBox())!.y,
    );
    const actions = page.getByRole("group", { name: "송장 작업" });
    await expect(actions.getByRole("link")).toHaveCount(0);
    const buttons = await actions.getByRole("button").all();

    const boxes = await Promise.all(
      buttons.map((button) => button.boundingBox()),
    );
    expect(new Set(boxes.map((box) => box!.height)).size).toBe(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("송장 목록에서 번호 검색, 상태 필터와 초기화를 사용한다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/billing");
  await expect(page.getByRole("region", { name: "청구 현황" })).toBeVisible();
  await page.getByRole("searchbox", { name: "송장 검색" }).fill("INV-DEMO-001");
  await expect(page.getByRole("link", { name: /샘플 스튜디오/ })).toBeVisible();
  await page.getByLabel("상태 필터").selectOption("paid");
  await expect(page.getByText("조건에 맞는 송장이 없습니다.")).toBeVisible();
  await page.getByRole("button", { name: "필터 초기화" }).click();
  await expect(page.getByRole("searchbox", { name: "송장 검색" })).toHaveValue(
    "",
  );
  await page.getByRole("link", { name: /샘플 스튜디오/ }).click();
  await expect(
    page.getByRole("heading", { name: "송장 상세", exact: true }),
  ).toBeVisible();
});
