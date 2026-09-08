import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("사용자의 역할과 상태를 변경하고 검색 조건으로 돌아온다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/users");
  await page.getByLabel("사용자 검색").fill("김민준");
  await page.getByRole("link", { name: "김민준", exact: true }).click();
  await page.getByRole("tab", { name: "권한 설정" }).click();
  await page.getByLabel("사용자 역할").selectOption("manager");
  await page.getByLabel("사용자 상태").selectOption("suspended");
  await page.getByRole("button", { name: "변경 사항 저장" }).click();
  await expect(
    page.getByRole("button", { name: "변경 사항 저장" }),
  ).toBeDisabled();
  await page.getByRole("tab", { name: "활동 로그" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("매니저 · 이용 중지");
  await page.getByRole("link", { name: "← 사용자 목록" }).click();
  await expect(page.getByLabel("사용자 검색")).toHaveValue("김민준");
  await expect(page.getByRole("table", { name: "사용자 목록" })).toContainText(
    "이용 중지",
  );
});

test("주문 상태와 메모를 변경하면 대시보드 주문에도 반영된다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/orders");
  await page.getByLabel("주문 검색", { exact: true }).fill("2046");
  await page.getByRole("link", { name: "#2046", exact: true }).click();
  await expect(page.getByRole("heading", { name: "주문 #2046" })).toBeVisible();
  await page.getByLabel("변경할 주문 상태").selectOption("완료");
  await page.getByRole("button", { name: "상태 변경", exact: true }).click();
  await expect(
    page.getByText("처리가 종료된 주문입니다.", { exact: false }),
  ).toBeVisible();
  await page
    .getByLabel("관리자 메모", { exact: true })
    .fill("고객에게 배송 완료를 안내했습니다.");
  await page.getByRole("button", { name: "메모 추가" }).click();
  await expect(
    page.getByText("고객에게 배송 완료를 안내했습니다.", { exact: true }),
  ).toBeVisible();
  const menu = page.getByRole("navigation", { name: "주요 메뉴" });
  await menu.getByRole("button", { name: "대시보드", exact: true }).click();
  await menu.getByRole("link", { name: "종합 대시보드" }).click();
  await expect(
    page
      .getByRole("table", { name: "최근 주문", exact: true })
      .getByRole("row")
      .filter({ hasText: "#2046" }),
  ).toContainText("완료");
});

test("상품 이미지를 등록하고 재고와 태그를 수정한다", async ({ page }) => {
  await login(page);
  await page.goto("/products");
  await page.getByRole("link", { name: "상품 등록", exact: true }).click();
  await page.getByLabel("상품명", { exact: true }).fill("샘플 캔버스 백");
  await page.getByLabel("SKU", { exact: true }).fill("SKU-001");
  await page.getByLabel("브랜드", { exact: true }).fill("Sample");
  await page
    .getByRole("combobox", { name: "카테고리", exact: true })
    .selectOption("액세서리");
  await page
    .getByRole("combobox", { name: "판매 상태", exact: true })
    .selectOption("active");
  await page.getByLabel("판매 가격 (원)").fill("29000");
  await page.getByLabel("재고 수량").fill("7");
  await page.getByLabel("태그", { exact: true }).fill("신상품");
  await page.getByRole("button", { name: "태그 추가" }).click();
  await page.getByLabel("이미지 업로드").setInputFiles({
    name: "sample.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(
    page.getByRole("img", { name: "상품 이미지 미리보기" }),
  ).toHaveAttribute("src", /^data:image\/png;base64,/);
  await page.getByRole("button", { name: "상품 저장" }).click();
  await expect(page.getByRole("alert")).toContainText("이미 사용 중인 SKU");
  await page.getByLabel("SKU", { exact: true }).fill("DEMO-CANVAS-BAG");
  await page.getByRole("button", { name: "상품 저장" }).click();
  await expect(
    page.getByRole("heading", { name: "샘플 캔버스 백", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "상품 수정", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "상품 수정", exact: true }),
  ).toBeVisible();
  await page.getByLabel("재고 수량").fill("0");
  await page.getByRole("button", { name: "신상품 태그 삭제" }).click();
  await page.getByLabel("태그", { exact: true }).fill("품절");
  await page.getByLabel("태그", { exact: true }).press("Enter");
  await page.getByRole("button", { name: "상품 저장" }).click();
  await expect(page.getByText("0개", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "품절 태그 삭제", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "← 상품 목록" }).click();
  await page.getByLabel("상품 검색").fill("샘플 캔버스 백");
  await page.getByLabel("재고 조건").selectOption("out");
  await expect(
    page.getByRole("heading", { name: "샘플 캔버스 백" }),
  ).toBeVisible();
});

for (const width of [390, 1280]) {
  test(`${width}px에서 관리 목록과 상세 화면을 표시한다`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await login(page);
    for (const [path, title] of [
      ["users", "사용자 관리"],
      ["orders", "주문 관리"],
      ["products", "상품 관리"],
    ]) {
      await page.goto(`/${path}`);
      await expect(
        page.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: "목록 페이지" }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `/tmp/react-sample-${path}-${width}.png`,
        fullPage: true,
        animations: "disabled",
      });
    }
    await page.goto("/users/user-1");
    await expect(page.getByLabel("닉네임")).toBeVisible();
    const profileName = await page
      .getByRole("heading", { name: "김민준", exact: true })
      .boundingBox();
    expect(profileName?.height).toBeLessThan(50);
    await page.screenshot({
      path: `/tmp/react-sample-user-detail-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("tab", { name: "기본 정보" }).focus();
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: "권한 설정" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.goto("/orders/%232046");
    await expect(
      page.getByRole("heading", { name: "주문 #2046" }),
    ).toBeVisible();
    await page.screenshot({
      path: `/tmp/react-sample-order-detail-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page.goto("/products/product-1/edit");
    await expect(page.getByLabel("상품명", { exact: true })).toHaveValue(
      "Air Max 90 Essential",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `/tmp/react-sample-product-editor-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page.getByRole("button", { name: "다크 모드로 전환" }).click();
    await page.screenshot({
      path: `/tmp/react-sample-product-editor-${width}-dark.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}

test("참고 상세 화면에서 회원 정보, 상품 옵션, 운송장을 편집한다", async ({
  page,
}) => {
  await login(page);
  await page.goto("/users/user-1");
  await page.getByLabel("닉네임").fill("minjun_sample");
  await page.getByLabel("회원 등급").selectOption("Platinum");
  await page.getByRole("button", { name: "회원 정보 저장" }).click();
  await expect(page.getByText("Platinum 회원")).toBeVisible();
  await page.getByRole("tab", { name: "권한 설정" }).click();
  await page.getByRole("switch", { name: "상품 리뷰 작성" }).uncheck();
  await page.getByRole("button", { name: "변경 사항 저장" }).click();
  await expect(
    page.getByRole("button", { name: "변경 사항 저장" }),
  ).toBeDisabled();
  await page.getByRole("tab", { name: "주문 내역" }).click();
  await page
    .getByRole("table", { name: "회원 주문 내역" })
    .getByRole("link")
    .first()
    .click();
  await expect(page.getByRole("heading", { name: "배송 현황" })).toBeVisible();
  await page.getByLabel("운송장 번호", { exact: true }).fill("DEMO-20250909");
  await page.getByRole("button", { name: "배송 정보 저장" }).click();
  await expect(
    page.getByRole("button", { name: "배송 정보 저장" }),
  ).toBeDisabled();
  await expect(page.getByRole("heading", { name: "결제 정보" })).toBeVisible();
  await page.getByRole("link", { name: "회원 상세 보기" }).click();
  await expect(page.getByLabel("닉네임")).toHaveValue("minjun_sample");
  await page.goto("/products/product-1");
  await page.getByRole("tab", { name: "재고 · 옵션" }).click();
  await page.getByLabel("화이트 250 재고").fill("20");
  await page.getByRole("button", { name: "상품 저장" }).click();
  await expect(page.getByText("48개", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "판매 통계" }).click();
  await page.getByRole("button", { name: "1월 180개" }).hover();
  await expect(page.getByRole("tooltip")).toHaveText("180개");
  await page.getByRole("tab", { name: "리뷰 (3)" }).click();
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "상품 미리보기" }),
  ).toBeVisible();
});
