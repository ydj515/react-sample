import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { describe, expect, it } from "vitest";
import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./product-api";
import type { ProductInput } from "../model/product-schema";

const input: ProductInput = {
  name: "Canvas Tote",
  sku: "TEST-TOTE",
  brand: "Sample",
  category: "액세서리",
  price: 29000,
  stock: 12,
  status: "active",
  image: "/product-images/accessory.svg",
  tags: ["신상품"],
  description: "가벼운 데일리 가방",
};
describe("product management API", () => {
  it("상품을 등록하고 가격·재고·태그를 수정한다", async () => {
    const created = await createProduct(input);
    const updated = await updateProduct(created.id, {
      ...input,
      price: 31000,
      stock: 0,
      tags: ["품절"],
    });
    expect(updated.stock).toBe(0);
    expect(await getProduct(created.id)).toMatchObject({
      price: 31000,
      tags: ["품절"],
    });
    expect((await getProducts()).some((item) => item.id === created.id)).toBe(
      true,
    );
  });
  it("중복 SKU와 잘못된 재고는 저장하지 않는다", async () => {
    await createProduct(input);
    await expect(createProduct(input)).rejects.toMatchObject({
      status: 409,
      code: "DUPLICATE_SKU",
    });
    await expect(
      createProduct({ ...input, sku: "OTHER", stock: -1 }),
    ).rejects.toMatchObject({ status: 400 });
    await expect(getProduct("missing")).rejects.toMatchObject({ status: 404 });
  });
});

it("성공 응답의 스키마가 잘못되면 INVALID_RESPONSE로 거부한다", async () => {
  server.use(
    http.get("/api/products", () => HttpResponse.json([{ id: "invalid" }])),
  );
  await expect(getProducts()).rejects.toMatchObject({
    code: "INVALID_RESPONSE",
  });
});

it("수정 시 다른 상품의 SKU를 사용할 수 없다", async () => {
  const original = await getProduct("product-1");
  await expect(
    updateProduct(original.id, { ...original, sku: "SKU-002" }),
  ).rejects.toMatchObject({ status: 409, code: "DUPLICATE_SKU" });
  expect((await getProduct(original.id)).sku).toBe(original.sku);
});

it("중복 옵션과 전체 재고 불일치를 거부한다", async () => {
  const original = await getProduct("product-1");
  await expect(
    updateProduct(original.id, { ...original, stock: 100 }),
  ).rejects.toMatchObject({ status: 400 });
  await expect(
    createProduct({
      ...input,
      stock: 0,
      variants: [
        { color: "White", size: "M", stock: 0 },
        { color: "white", size: "m", stock: 0 },
      ],
    }),
  ).rejects.toMatchObject({ status: 400 });
  expect((await getProduct(original.id)).stock).toBe(original.stock);
});
