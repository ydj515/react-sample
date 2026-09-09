import { expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { managementData, managementFixture } from "@/mocks/data/management";
import { resolveCart } from "../model/shop";
import { createShopOrder } from "./shop-api";

const product = managementFixture.products[0]!;
const items = [
  {
    productId: product.id,
    color: product.variants[0]!.color,
    size: product.variants[0]!.size,
    quantity: 2,
  },
];
const input = {
  items,
  expectedTotal: resolveCart(items, managementFixture.products).total,
  recipient: {
    name: "샘플 고객",
    phone: "010-0000-0000",
    address: "서울특별시 샘플로 10",
  },
};
it("검증한 현재 가격으로 모의 주문을 만들고 실제 주문과 재고는 유지한다", async () => {
  const stock = managementData.products[0]!.stock;
  const orderCount = managementData.orders.length;
  const receipt = await createShopOrder(input);
  expect(receipt.id).toMatch(/^DEMO-/);
  expect(receipt.total).toBe(product.price * 2);
  expect(receipt.items[0]).toMatchObject({
    ...items[0],
    name: product.name,
    unitPrice: product.price,
  });
  expect(managementData.products[0]!.stock).toBe(stock);
  expect(managementData.orders).toHaveLength(orderCount);
});
it("빈 장바구니와 중복 옵션, 잘못된 수량을 거부한다", async () => {
  for (const cart of [
    [],
    [...items, ...items],
    [{ ...items[0]!, quantity: 0 }],
  ]) {
    await expect(
      createShopOrder({ ...input, items: cart }),
    ).rejects.toMatchObject({ status: 400, code: "INVALID_CHECKOUT" });
  }
});
it("삭제된 상품, 옵션 변경, 초과 재고와 판매 중지를 확인한다", async () => {
  for (const item of [
    { ...items[0]!, productId: "missing" },
    { ...items[0]!, size: "missing" },
    { ...items[0]!, quantity: 99 },
  ]) {
    await expect(
      createShopOrder({ ...input, items: [item] }),
    ).rejects.toMatchObject({ status: 409, code: "CART_UNAVAILABLE" });
  }
  managementData.products[0]!.status = "draft";
  await expect(createShopOrder(input)).rejects.toMatchObject({
    code: "CART_UNAVAILABLE",
  });
});
it("가격이 바뀌면 조용히 주문하지 않고 새 금액 확인을 요구한다", async () => {
  managementData.products[0]!.price += 1000;
  await expect(createShopOrder(input)).rejects.toMatchObject({
    status: 409,
    code: "PRICE_CHANGED",
  });
});
it("정상 HTTP 응답도 계약과 다르면 거부한다", async () => {
  server.use(
    http.post("/api/shop/orders", () => HttpResponse.json({ id: "bad" })),
  );
  await expect(createShopOrder(input)).rejects.toMatchObject({
    code: "INVALID_RESPONSE",
  });
});
