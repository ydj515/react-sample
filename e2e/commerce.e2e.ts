import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("상세 주문 조건, 페이지 선택과 CSV 내보내기가 같은 데이터를 사용한다", async ({
  page,
}) => {
  await login(page);
  const table = page.getByRole("table", { name: "주문 검색 결과" });
  await expect(table.getByRole("row")).toHaveCount(9);
  await page.getByRole("button", { name: "상세 필터" }).click();
  await page.getByLabel("주문일 시작").fill("2025-06-25");
  await page.getByLabel("주문일 종료").fill("2025-06-30");
  await page.getByLabel("최소 금액").fill("100000");
  await page.getByLabel("카테고리", { exact: true }).selectOption("신발");
  await page.getByText("전체 브랜드", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Nike", exact: true }).check();
  await page.getByLabel("담당 CS", { exact: true }).selectOption("김민준");
  await page.getByRole("button", { name: "필터 적용" }).click();
  await expect(table.getByRole("row")).toHaveCount(4);
  await expect(table).toContainText("Air Max 90 Essential");
  await expect(table).not.toContainText("Ultraboost 22");
  await page
    .getByRole("combobox", { name: "주문 정렬" })
    .selectOption("amount-asc");
  await expect(table.getByRole("row").nth(1)).toContainText("#2041");
  const filteredDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "주문 내보내기", exact: true })
    .click();
  const filtered = await filteredDownload;
  const stream = await filtered.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const content = Buffer.concat(chunks).toString("utf8");
  expect(content.split("\r\n")).toHaveLength(4);
  expect(content).toContain("Air Max 90 Essential");
  expect(content).not.toContain("Ultraboost 22");
  await page.getByRole("button", { name: "전체 초기화" }).click();
  await page.getByRole("button", { name: "2페이지" }).click();
  await page.getByRole("checkbox", { name: "현재 페이지 전체 선택" }).check();
  const selectedDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "선택 주문 내보내기" }).click();
  const selected = await selectedDownload;
  const selectedStream = await selected.createReadStream();
  const selectedChunks = [];
  for await (const chunk of selectedStream) selectedChunks.push(chunk);
  expect(
    Buffer.concat(selectedChunks).toString("utf8").split("\r\n"),
  ).toHaveLength(9);
  await page.getByRole("button", { name: "3페이지" }).click();
  await expect(page.getByText("8건 선택")).toHaveCount(0);
  await expect(table.getByRole("row")).toHaveCount(8);
});

test("차트 수치 조회와 새 보고서 생성이 동작한다", async ({ page }) => {
  await login(page);
  const chart = page.getByRole("group", { name: "월별 매출 금액 조회" });
  const april = chart.getByRole("button", { name: "4월 매출 ₩3,300,000" });
  await april.hover();
  await expect(page.getByRole("tooltip")).toContainText("4월: ₩3.3M");
  await chart.screenshot({ path: "/tmp/react-sample-monthly-hover.png" });
  await page.getByRole("heading", { name: "월별 매출 추이" }).hover();
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await april.focus();
  await expect(page.getByRole("tooltip")).toContainText("₩3,300,000");
  await april.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.getByLabel("방문 추이 날짜").selectOption("0");
  await expect(page.getByText("3,120명")).toBeVisible();
  await page.getByText("월별 매출 전체 보기").click();
  await expect(
    page.getByRole("table", { name: "월별 매출 데이터" }),
  ).toContainText("₩4,200,000");
  await page.getByRole("button", { name: "새 보고서", exact: true }).click();
  await page
    .getByRole("textbox", { name: "보고서 이름" })
    .fill("6월 운영 요약");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "보고서 생성" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("commerce-report-2025-06-30.csv");
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const content = Buffer.concat(chunks).toString("utf8");
  expect(content).toContain("6월 운영 요약");
  expect(content).toContain('"총 매출(원)","4200000"');
  await expect(page.getByRole("status")).toContainText(
    "보고서 다운로드를 시작했습니다.",
  );
});

test.describe("매출 차트 터치", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  test("첫 달과 마지막 달의 금액 툴팁이 화면 안에 표시된다", async ({
    page,
  }) => {
    await login(page);
    const chart = page.getByRole("group", { name: "월별 매출 금액 조회" });
    for (const month of ["12월 매출 ₩2,800,000", "6월 매출 ₩4,200,000"]) {
      await chart.getByRole("button", { name: month }).tap();
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible();
      const bounds = await tooltip.boundingBox();
      const chartBounds = await chart.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(chartBounds!.x);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
        chartBounds!.x + chartBounds!.width,
      );
      expect(bounds!.y).toBeGreaterThanOrEqual(chartBounds!.y);
    }
    await chart.screenshot({ path: "/tmp/react-sample-monthly-touch.png" });
    await page.getByRole("button", { name: "다크 모드로 전환" }).click();
    await chart.getByRole("button", { name: "6월 매출 ₩4,200,000" }).tap();
    await expect(page.getByRole("tooltip")).toContainText("6월: ₩4.2M");
    await chart.screenshot({
      path: "/tmp/react-sample-monthly-touch-dark.png",
    });
  });
});
