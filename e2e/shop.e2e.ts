import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("쇼핑 검색 조건을 보존하고 옵션·장바구니·모의 주문을 연결한다", async ({
  page,
}) => {
  await page.goto("/shop");
  await page.getByRole("searchbox", { name: "상품 검색" }).fill("Air Max 90");
  await page
    .getByRole("link", { name: "Air Max 90 Essential 상세 보기" })
    .click();
  await expect(
    page.getByRole("button", { name: "장바구니 담기" }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "← 상품 목록" }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("Air Max 90");
  await page
    .getByRole("link", { name: "Air Max 90 Essential 상세 보기" })
    .click();
  await page.getByRole("button", { name: "상품 이미지 확대" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("tab", { name: "리뷰 (3)" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("착용감이 편안하고");
  await page.getByRole("combobox", { name: "사이즈" }).selectOption("250");
  await page.getByRole("spinbutton", { name: "수량" }).fill("2");
  await page.getByRole("button", { name: "장바구니 담기" }).click();
  await page.getByRole("link", { name: "장바구니 보기" }).click();
  await page.reload();
  await expect(page.getByLabel("수량", { exact: true })).toHaveText("2");
  await page
    .getByRole("button", { name: "Air Max 90 Essential 수량 줄이기" })
    .click();
  await page.getByRole("link", { name: "주문서 작성", exact: true }).click();
  const name = page.getByRole("textbox", { name: "받는 분" });
  await name.fill("");
  await page.getByRole("button", { name: "모의 주문 완료하기" }).click();
  await expect(page.getByRole("alert")).toContainText("이름을 2자 이상");
  await name.fill("샘플 고객");
  await page.getByRole("button", { name: "모의 주문 완료하기" }).click();
  await expect(
    page.getByRole("heading", { name: "모의 주문이 완료되었습니다" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "장바구니 0개" })).toBeVisible();
  await expect(
    page.getByText("189,000원", { exact: true }).first(),
  ).toBeVisible();
});
for (const width of [390, 1440]) {
  test(`${width}px에서 쇼핑 필터, 찜, 상품 상세와 장바구니를 표시한다`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/shop");
    if (width < 1024)
      await page.getByRole("button", { name: "필터 열기" }).click();
    const filters =
      width < 1024 ? page.getByRole("dialog") : page.getByRole("complementary");
    await filters
      .getByRole("combobox", { name: "브랜드", exact: true })
      .selectOption("Nike");
    await filters.getByRole("checkbox", { name: "구매 가능한 상품만" }).check();
    if (width < 1024) {
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "필터 열기" }),
      ).toBeFocused();
    }
    await page.getByRole("searchbox").fill("Air Max 90");
    await page.getByRole("button", { name: "Air Max 90 Essential 찜" }).click();
    await page.getByRole("link", { name: "찜한 상품", exact: true }).click();
    await expect(
      page.getByRole("list", { name: "쇼핑 상품 목록" }).getByRole("article"),
    ).toHaveCount(1);
    await page
      .getByRole("link", { name: "Air Max 90 Essential 상세 보기" })
      .click();
    await expect(
      page.getByRole("heading", { name: "Air Max 90 Essential" }),
    ).toBeVisible();
    await page.getByRole("combobox", { name: "사이즈" }).selectOption("260");
    await page.getByRole("button", { name: "장바구니 담기" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `/tmp/react-shop-detail-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("link", { name: "장바구니 보기" }).click();
    await expect(
      page.getByRole("heading", { name: "장바구니", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Air Max 90 Essential 삭제" })
      .click();
    await expect(
      page.getByRole("heading", { name: "장바구니가 비어있습니다." }),
    ).toBeVisible();
    await page.goto("/shop");
    await page.getByRole("list", { name: "쇼핑 상품 목록" }).waitFor();
    await page.screenshot({
      path: `/tmp/react-shop-list-${width}.png`,
      fullPage: true,
    });
  });
}
test("품절·판매 중지·알 수 없는 상품을 안전하게 표시한다", async ({ page }) => {
  await page.goto("/shop/product-3");
  await expect(
    page.getByRole("button", { name: "품절된 상품입니다" }),
  ).toBeDisabled();
  await page.goto("/shop/product-7");
  await expect(
    page.getByRole("heading", { name: "판매하지 않는 상품입니다." }),
  ).toBeVisible();
  await page.goto("/shop/missing");
  await expect(page.getByRole("alert")).toContainText(
    "상품을 찾을 수 없습니다.",
  );
});
test("관리자 메뉴에서 쇼핑 화면으로 이동한다", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "샘플", exact: true }).click();
  await page.getByRole("link", { name: "E-commerce" }).click();
  await expect(
    page.getByRole("heading", { name: "일상의 다음 한 걸음." }),
  ).toBeVisible();
});
