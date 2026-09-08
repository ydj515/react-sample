import { expect, test } from "@playwright/test";

import { login } from "./helpers";

test.describe("대시보드", () => {
  test("기간·담당자 조건이 화면 이동과 새로고침에서 유지된다", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/reports");
    await expect(page.getByText("전체 프로젝트")).toBeVisible();
    await page.getByLabel("집계 기간").selectOption("7");
    await page.getByLabel("프로젝트 담당자").selectOption("Mina");
    const menu = page.getByRole("navigation", { name: "주요 메뉴" });
    await expect(
      menu.getByRole("link", { name: "분석 리포트" }),
    ).toHaveAttribute("aria-current", "page");
    await page
      .getByRole("navigation", { name: "대시보드 화면" })
      .getByRole("link", { name: "프로젝트 운영" })
      .click();
    await expect(
      page.getByRole("heading", { name: "프로젝트 일정" }),
    ).toBeVisible();
    await expect(page.getByLabel("프로젝트 담당자")).toHaveValue("Mina");
    await expect(
      menu.getByRole("link", { name: "프로젝트 운영" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      menu.getByRole("link", { name: "종합 대시보드" }),
    ).not.toHaveAttribute("aria-current", "page");
    await page.reload();
    await expect(page.getByLabel("집계 기간")).toHaveValue("7");
    await page
      .getByRole("link", { name: "Design System", exact: true })
      .first()
      .click();
    await expect(
      page.getByRole("heading", { name: "Design System" }),
    ).toBeVisible();
    await page.goBack();
    await expect(page.getByLabel("프로젝트 담당자")).toHaveValue("Mina");
  });

  test("리포트 지표 전환과 다운로드 내용이 선택 조건에 맞는다", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/reports?days=7&owner=Mina");
    await page.getByLabel("분석 지표").selectOption("hours");
    await expect(
      page.getByRole("heading", { name: "완료 작업 공수 비교" }),
    ).toBeVisible();
    await page.getByText("일별 데이터 표 보기").click();
    await expect(page.getByRole("table")).toHaveCount(2);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "CSV 다운로드" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(
      "project-report-2026-07-09-2026-07-15.csv",
    );
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const content = Buffer.concat(chunks).toString("utf8");
    expect(content).toContain("Design System");
    expect(content).not.toContain("Billing Revamp");
    await page.reload();
    await expect(page.getByLabel("분석 지표")).toHaveValue("hours");
  });

  for (const width of [390, 1280]) {
    test(`${width}px에서 세 화면의 차트와 레이아웃을 확인한다`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await login(page);
      for (const [path, name] of [
        ["/", "종합 대시보드"],
        ["/operations", "프로젝트 운영"],
        ["/reports", "분석 리포트"],
      ]) {
        await page.goto(path!);
        await expect(
          page.getByRole("heading", { name, exact: true }),
        ).toBeVisible();
        await expect(
          page.getByText(path === "/" ? "신규 사용자" : "전체 프로젝트", {
            exact: true,
          }),
        ).toBeVisible();
        if (width < 1024) {
          await expect(
            page.getByRole("dialog", { name: "전체 메뉴" }),
          ).toHaveCount(0);
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: `/tmp/react-sample-dashboard-${width}-${path === "/" ? "overview" : path!.slice(1)}.png`,
          fullPage: true,
          animations: "disabled",
        });
      }
      await page.getByRole("button", { name: "다크 모드로 전환" }).click();
      await expect(page.getByTestId("dashboard-shell")).toHaveAttribute(
        "data-theme",
        "dark",
      );
      const darkText = await page.evaluate(
        () => getComputedStyle(document.documentElement).color,
      );
      await expect(page.getByTestId("dashboard-shell")).toHaveCSS(
        "color",
        darkText,
      );
      await page.screenshot({
        path: `/tmp/react-sample-dashboard-${width}-dark.png`,
        fullPage: true,
        animations: "disabled",
      });
      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: "카테고리별 매출 비중" }),
      ).toBeVisible();
      await expect(page.getByTestId("dashboard-shell")).toHaveAttribute(
        "data-theme",
        "dark",
      );
      await page.screenshot({
        path: `/tmp/react-sample-commerce-${width}-dark.png`,
        fullPage: true,
        animations: "disabled",
      });
    });
  }
});
