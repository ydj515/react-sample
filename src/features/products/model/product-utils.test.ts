import { describe, it, expect } from "vitest";
import { managementFixture } from "@/mocks/data/management";
import { selectProducts } from "./product-utils";
import { productInputSchema, productsSearchSchema } from "./product-schema";
describe("product filters and input", () => {
  it("품절과 재고 부족을 구분하고 태그도 검색한다", () => {
    const products = managementFixture.products;
    const out = selectProducts(
      products,
      productsSearchSchema.parse({ stock: "out" }),
    );
    expect(out.total).toBeGreaterThan(0);
    expect(out.items.every((p) => p.stock === 0)).toBe(true);
    const low = selectProducts(
      products,
      productsSearchSchema.parse({ stock: "low" }),
    );
    expect(low.items.every((p) => p.stock > 0 && p.stock <= 10)).toBe(true);
    const tagged = selectProducts(
      products,
      productsSearchSchema.parse({ q: "인기", status: "active" }),
    );
    expect(tagged.total).toBeGreaterThan(0);
    expect(
      tagged.items.every(
        (p) => p.tags.includes("인기") && p.status === "active",
      ),
    ).toBe(true);
  });
  it.each(["oldest", "newest", "name"])(
    "%s 정렬 결과를 페이지 단위로 제공한다",
    (sort) => {
      const result = selectProducts(
        managementFixture.products,
        productsSearchSchema.parse({ sort }),
      );
      expect(result.items).toHaveLength(8);
      if (sort === "oldest") expect(result.items[0]?.id).toBe("product-1");
      if (sort === "newest") expect(result.items[0]?.id).toBe("product-23");
      if (sort === "name") expect(result.items[0]?.name).toBe("990v5");
    },
  );
  it.each([
    { price: -1 },
    { stock: 1.5 },
    { sku: "bad sku" },
    { tags: ["new", "NEW"] },
    { tags: Array.from({ length: 9 }, (_, i) => String(i)) },
    { image: "javascript:alert(1)" },
    { image: "https://example.com/image.png" },
  ])("유효하지 않은 상품 입력 %j를 거부한다", (patch) => {
    expect(
      productInputSchema.safeParse({
        ...managementFixture.products[0],
        ...patch,
      }).success,
    ).toBe(false);
  });
});
