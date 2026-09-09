import { describe, expect, it } from "vitest";
import { managementFixture } from "@/mocks/data/management";
import {
  selectShopProducts,
  shopSearchSchema,
  resolveCart,
  cartKey,
} from "./shop";

const products = managementFixture.products;
describe("storefront", () => {
  it("판매 중인 상품만 검색·필터·정렬한다", () => {
    const result = selectShopProducts(
      products,
      shopSearchSchema.parse({
        q: "nike",
        category: "신발",
        sort: "price-asc",
        inStock: true,
      }),
      [],
    );
    expect(result.total).toBeGreaterThan(0);
    expect(
      result.items.every(
        (p) => p.status === "active" && p.brand === "Nike" && p.stock > 0,
      ),
    ).toBe(true);
    expect(result.items.map((p) => p.price)).toEqual(
      result.items.map((p) => p.price).sort((a, b) => a - b),
    );
    expect(
      selectShopProducts(
        products,
        shopSearchSchema.parse({ favorites: true }),
        [],
      ).total,
    ).toBe(0);
  });
  it("옵션마다 수량과 가격을 계산하고 재고 초과를 거부한다", () => {
    const p = products[0]!;
    const v = p.variants[0]!;
    const line = { productId: p.id, color: v.color, size: v.size, quantity: 2 };
    const cart = resolveCart([line], products);
    expect(cart.valid).toBe(true);
    expect(cart.subtotal).toBe(p.price * 2);
    expect(cart.total).toBe(cart.subtotal + cart.shipping);
    expect(
      resolveCart([{ ...line, quantity: v.stock + 1 }], products).valid,
    ).toBe(false);
    expect(resolveCart([{ ...line, size: "없는옵션" }], products).valid).toBe(
      false,
    );
    expect(
      resolveCart([{ ...line, productId: "missing" }], products).valid,
    ).toBe(false);
    expect(resolveCart([], products).valid).toBe(false);
    expect(cartKey(line)).not.toBe(cartKey({ ...line, size: "다른옵션" }));
  });
  it("서로 다른 옵션도 전체 상품 재고를 초과할 수 없다", () => {
    const p = {
      ...products[0]!,
      stock: 2,
      variants: [
        { color: "black", size: "S", stock: 2 },
        { color: "black", size: "M", stock: 2 },
      ],
    };
    const lines = p.variants.map((v) => ({
      productId: p.id,
      ...v,
      quantity: 2,
    }));
    expect(resolveCart(lines, [p]).valid).toBe(false);
  });
});
