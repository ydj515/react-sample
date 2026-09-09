import { beforeEach, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { managementFixture } from "@/mocks/data/management";
import { renderShop } from "@/test/render-shop";
import { useShopStore } from "@/stores/shop-store";

const first = managementFixture.products[0]!;
const line = {
  productId: first.id,
  color: first.variants[0]!.color,
  size: first.variants[0]!.size,
  quantity: 1,
};
beforeEach(() => useShopStore.setState({ items: [], favorites: [] }));
it("목록 검색과 페이지네이션, 찜 및 빈 결과 초기화를 제공한다", async () => {
  const user = userEvent.setup();
  renderShop();
  await screen.findByRole("list", { name: "쇼핑 상품 목록" });
  await user.click(screen.getByRole("button", { name: "다음 페이지" }));
  expect(await screen.findByText(/2 \/ 3 페이지/)).toBeInTheDocument();
  await user.type(
    screen.getByRole("searchbox", { name: "상품 검색" }),
    "Air Max 90",
  );
  await user.click(
    await screen.findByRole("button", { name: "Air Max 90 Essential 찜" }),
  );
  expect(useShopStore.getState().favorites).toContain(first.id);
  await user.type(screen.getByRole("searchbox"), "없는상품");
  await screen.findByText("조건에 맞는 상품이 없습니다.");
  await user.click(screen.getByRole("button", { name: "필터 초기화" }));
  expect(screen.getByRole("searchbox")).toHaveValue("");
});
it("옵션을 고르고 수량을 담은 뒤 모의 주문으로 장바구니를 비운다", async () => {
  const user = userEvent.setup();
  renderShop("/shop/product-1");
  await screen.findByRole("heading", { name: first.name });
  expect(screen.getByRole("button", { name: "장바구니 담기" })).toBeDisabled();
  await user.selectOptions(
    screen.getByRole("combobox", { name: "사이즈" }),
    line.size,
  );
  await user.click(screen.getByRole("button", { name: "장바구니 담기" }));
  await user.click(screen.getByRole("link", { name: "장바구니 보기" }));
  await screen.findByRole("heading", { name: "장바구니" });
  await user.click(
    screen.getByRole("button", { name: `${first.name} 수량 늘리기` }),
  );
  expect(useShopStore.getState().items[0]?.quantity).toBe(2);
  await user.click(screen.getByRole("link", { name: "주문서 작성" }));
  await screen.findByRole("heading", { name: "주문서 작성" });
  await user.click(
    await screen.findByRole("button", { name: "모의 주문 완료하기" }),
  );
  await screen.findByRole("heading", { name: "모의 주문이 완료되었습니다" });
  expect(useShopStore.getState().items).toEqual([]);
});
it("주문 실패 시 배송 정보와 장바구니를 유지하고 재시도한다", async () => {
  useShopStore.getState().add(line);
  server.use(
    http.post("/api/shop/orders", () =>
      HttpResponse.json({ message: "주문 확인 실패" }, { status: 503 }),
    ),
  );
  const user = userEvent.setup();
  renderShop("/shop/checkout");
  const name = await screen.findByRole("textbox", { name: "받는 분" });
  await user.clear(name);
  await user.type(name, "테스트 고객");
  await user.click(screen.getByRole("button", { name: "모의 주문 완료하기" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("주문 확인 실패");
  expect(name).toHaveValue("테스트 고객");
  expect(useShopStore.getState().items).toHaveLength(1);
  server.resetHandlers();
  await user.click(screen.getByRole("button", { name: "모의 주문 완료하기" }));
  await screen.findByRole("heading", { name: "모의 주문이 완료되었습니다" });
});
it("빈 장바구니, 품절과 상품 조회 오류를 표시한다", async () => {
  const user = userEvent.setup();
  renderShop("/shop/cart");
  await screen.findByRole("heading", { name: "장바구니가 비어있습니다." });
  await user.click(screen.getByRole("link", { name: "상품 둘러보기" }));
  server.use(
    http.get("/api/products/:id", () =>
      HttpResponse.json({ message: "상품 조회 실패" }, { status: 500 }),
    ),
  );
  const list = await screen.findByRole("list", { name: "쇼핑 상품 목록" });
  await user.click(within(list).getAllByRole("link")[0]!);
  expect(await screen.findByRole("alert")).toHaveTextContent("상품 조회 실패");
  server.resetHandlers();
  await user.click(screen.getByRole("button", { name: "다시 시도" }));
  await screen.findByRole("button", { name: "상품 이미지 확대" });
});
