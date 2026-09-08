import { expect, test } from "@playwright/test";
import { login } from "./helpers";

for (const width of [390, 1280]) {
  test(`${width}px에서 목록 공통 요소의 크기와 페이지 이동을 맞춘다`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await login(page);
    const searchHeights: number[] = [];
    const tablePaddings: string[] = [];
    for (const [path, searchLabel, tableLabel] of [
      ["/", "주문 검색어", "주문 검색 결과"],
      ["/users", "사용자 검색", "사용자 목록"],
      ["/orders", "주문 검색", "주문 관리 목록"],
      ["/products", "상품 검색", ""],
      ["/projects", "검색", ""],
    ]) {
      await page.goto(path);
      const pager = page.getByRole("navigation", {
        name: "목록 페이지",
        exact: true,
      });
      await expect(pager).toBeVisible();
      await expect(
        pager.getByRole("button", { name: "1페이지", exact: true }),
      ).toHaveAttribute("aria-current", "page");
      await expect(
        pager.getByRole("button", { name: "이전 페이지", exact: true }),
      ).toBeDisabled();
      const input = page.getByRole("textbox", {
        name: searchLabel,
        exact: true,
      });
      searchHeights.push(
        await input.evaluate(
          (element) => element.getBoundingClientRect().height,
        ),
      );
      if (tableLabel) {
        const cell = page
          .getByRole("table", { name: tableLabel, exact: true })
          .getByRole("cell")
          .first();
        tablePaddings.push(
          await cell.evaluate((element) => getComputedStyle(element).padding),
        );
      }
      if (path !== "/projects") {
        await pager
          .getByRole("button", { name: "2페이지", exact: true })
          .click();
        await expect(
          pager.getByRole("button", { name: "2페이지", exact: true }),
        ).toHaveAttribute("aria-current", "page");
        await expect(pager).toContainText("9–16 / ");
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (path === "/users") {
        await page.screenshot({
          path: `/tmp/react-unified-users-${width}.png`,
          fullPage: true,
          animations: "disabled",
        });
        await input.fill("없는 사용자");
        await expect(pager).toContainText("0–0 / 0건");
        await expect(
          pager.getByRole("button", { name: "다음 페이지", exact: true }),
        ).toBeDisabled();
        await page
          .getByRole("button", { name: "필터 초기화", exact: true })
          .click();
        await expect(input).toHaveValue("");
      }
    }
    expect(new Set(searchHeights)).toEqual(new Set([40]));
    expect(new Set(tablePaddings)).toEqual(new Set(["16px"]));
    await page.goto("/reports");
    const report = page.getByRole("table");
    await expect(report).toBeVisible();
    expect(
      await report
        .getByRole("cell")
        .first()
        .evaluate((element) => getComputedStyle(element).padding),
    ).toBe("16px");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `/tmp/react-unified-report-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}
