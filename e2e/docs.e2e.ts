import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("문서는 공개 경로에서 검색, 섹션 링크와 이전·다음 탐색을 제공한다", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs");
  await expect(page).toHaveURL(/\/docs\/getting-started(?:\?q=)?$/);
  await expect(page).toHaveTitle("React Sample 시작하기 | React Sample Docs");
  await expect(
    page.getByRole("heading", { name: "React Sample 시작하기" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "코드 복사" }).first().click();
  await expect(page.getByRole("status")).toHaveText("복사했습니다.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "mise install",
  );
  await page.getByRole("searchbox").fill("키보드");
  await page
    .getByRole("list", { name: "문서 검색 결과" })
    .getByRole("link", { name: /컴포넌트 설계 가이드/ })
    .click();
  await expect(page).toHaveURL(/\/docs\/components(?:\?q=)?#accessibility$/);
  await expect(
    page.getByRole("heading", { name: "키보드와 접근성" }),
  ).toBeInViewport();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "키보드와 접근성" }),
  ).toBeInViewport();
  await page
    .getByRole("navigation", { name: "이전 및 다음 문서" })
    .getByRole("link", { name: /다음 문서/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "서버 상태와 데이터 흐름" }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "컴포넌트 설계 가이드" }),
  ).toBeAttached();
});
for (const width of [390, 1440]) {
  test(`${width}px 문서 메뉴, 목차와 다크 테마를 확인한다`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/components");
    if (width < 1024) {
      await page.getByRole("button", { name: "문서 메뉴 열기" }).click();
      const dialog = page.getByRole("dialog", { name: "문서 메뉴" });
      await expect(dialog).toBeVisible();
      expect(
        await dialog.evaluate((el) => getComputedStyle(el).borderTopLeftRadius),
      ).toBe("0px");
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "문서 메뉴 열기" }),
      ).toBeFocused();
      await page.getByRole("button", { name: "문서 메뉴 열기" }).click();
      await dialog.getByRole("link", { name: "입력과 폼 검증" }).click();
      await expect(dialog).not.toBeVisible();
      await page.getByText("이 페이지의 목차", { exact: true }).click();
      await page
        .getByRole("navigation", { name: "이 페이지의 목차" })
        .getByRole("link", { name: "실패 상태도 예제로 남기기" })
        .click();
      await expect(
        page.getByRole("heading", { name: "실패 상태도 예제로 남기기" }),
      ).toBeInViewport();
    } else {
      await page
        .getByRole("navigation", { name: "문서 탐색" })
        .getByRole("link", { name: "컴포넌트 설계 가이드" })
        .click();
      const toc = page.getByRole("navigation", { name: "이 페이지의 목차" });
      await toc.getByRole("link", { name: "키보드와 접근성" }).click();
      await expect(
        toc.getByRole("link", { name: "키보드와 접근성" }),
      ).toHaveAttribute("aria-current", "location");
    }
    await page.getByRole("button", { name: "다크 모드로 전환" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `/tmp/react-docs-${width}.png`,
      fullPage: true,
    });
  });
}
test("관리자에서 문서로 이동하고 잘못된 문서 주소를 복구한다", async ({
  page,
}) => {
  await login(page);
  await page.getByRole("button", { name: "샘플", exact: true }).click();
  await page.getByRole("link", { name: "Blog / Docs" }).click();
  await expect(
    page.getByRole("heading", { name: "React Sample 시작하기" }),
  ).toBeVisible();
  await page.goto("/docs/missing");
  await expect(
    page.getByRole("heading", { name: "문서를 찾을 수 없습니다" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "시작 문서로 이동" }).click();
  await expect(
    page.getByRole("heading", { name: "React Sample 시작하기" }),
  ).toBeVisible();
});

test("읽기 진행률이 스크롤, 창 크기와 문서 이동에 맞춰 갱신된다", async ({
  page,
}) => {
  await page.goto("/docs/getting-started");
  const progress = page.getByRole("progressbar", { name: "문서 읽기 진행률" });
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  await page.evaluate(() =>
    window.scrollTo(
      0,
      (document.documentElement.scrollHeight - window.innerHeight) / 2,
    ),
  );
  await expect
    .poll(async () => Number(await progress.getAttribute("aria-valuenow")))
    .toBeGreaterThan(40);
  await expect
    .poll(async () => Number(await progress.getAttribute("aria-valuenow")))
    .toBeLessThan(60);
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect(progress).toHaveAttribute("aria-valuenow", "100");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect(progress).toHaveAttribute("aria-valuenow", "100");
  await page
    .getByRole("navigation", { name: "이전 및 다음 문서" })
    .getByRole("link", { name: /다음 문서/ })
    .click();
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
});
