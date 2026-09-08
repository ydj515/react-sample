import { z } from "zod";
import { listSearchSchema } from "@/shared/lib/list-search";

export const productStatuses = ["active", "draft", "archived"] as const;
export const productStatusLabels = {
  active: "판매 중",
  draft: "임시 저장",
  archived: "판매 중지",
};
export const productCategories = ["신발", "의류", "액세서리", "기타"] as const;
export const productImages = [
  "/product-images/shoes.svg",
  "/product-images/clothing.svg",
  "/product-images/accessory.svg",
  "/product-images/other.svg",
] as const;
const imageSchema = z
  .string()
  .max(2800000, "이미지는 2MB 이하로 선택하세요.")
  .refine(
    (value) =>
      (productImages as readonly string[]).includes(value) ||
      /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value),
    "PNG, JPEG, WebP 이미지 또는 기본 이미지를 선택하세요.",
  );
export const productVariantSchema = z.object({
  color: z.string().trim().min(1).max(30),
  size: z.string().trim().min(1).max(20),
  stock: z.number().int().min(0).max(1000000),
});
export const productInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "상품명은 2자 이상 입력하세요.")
      .max(80, "상품명은 80자 이하로 입력하세요."),
    sku: z
      .string()
      .trim()
      .min(3, "SKU는 3자 이상 입력하세요.")
      .max(40)
      .regex(
        /^[A-Z0-9-]+$/,
        "SKU는 대문자, 숫자, 하이픈만 사용할 수 있습니다.",
      ),
    brand: z.string().trim().min(1, "브랜드를 입력하세요.").max(40),
    category: z.enum(productCategories),
    price: z
      .number()
      .int("가격은 정수로 입력하세요.")
      .min(0, "가격은 0원 이상이어야 합니다.")
      .max(100000000, "가격은 1억 원 이하여야 합니다."),
    stock: z
      .number()
      .int("재고는 정수로 입력하세요.")
      .min(0, "재고는 0개 이상이어야 합니다.")
      .max(1000000),
    status: z.enum(productStatuses),
    image: imageSchema,
    listPrice: z.number().int().min(0).max(100000000).optional(),
    variants: z.array(productVariantSchema).max(30).optional(),
    tags: z
      .array(z.string().trim().min(1).max(20, "태그는 20자 이하로 입력하세요."))
      .max(8, "태그는 최대 8개까지 등록할 수 있습니다.")
      .refine(
        (tags) =>
          new Set(tags.map((tag) => tag.toLocaleLowerCase())).size ===
          tags.length,
        "중복 태그를 제거하세요.",
      ),
    description: z
      .string()
      .trim()
      .max(1000, "설명은 1,000자 이하로 입력하세요."),
  })
  .superRefine((input, context) => {
    if (
      input.variants?.length &&
      input.variants.reduce((sum, item) => sum + item.stock, 0) !== input.stock
    )
      context.addIssue({
        code: "custom",
        path: ["stock"],
        message: "전체 재고는 옵션 재고의 합계와 같아야 합니다.",
      });
    const keys =
      input.variants?.map((item) =>
        JSON.stringify([item.color.toLowerCase(), item.size.toLowerCase()]),
      ) ?? [];
    if (new Set(keys).size !== keys.length)
      context.addIssue({
        code: "custom",
        path: ["variants"],
        message: "중복 옵션을 제거하세요.",
      });
  });
export const productSchema = productInputSchema.safeExtend({
  id: z.string(),
  listPrice: z.number().int().nonnegative().default(0),
  variants: z.array(productVariantSchema).default([]),
  sales: z
    .array(
      z.object({
        month: z.string(),
        quantity: z.number().nonnegative(),
        revenue: z.number().nonnegative(),
      }),
    )
    .default([]),
  reviews: z
    .array(
      z.object({
        id: z.string(),
        author: z.string(),
        rating: z.number().int().min(1).max(5),
        date: z.iso.date(),
        text: z.string(),
      }),
    )
    .default([]),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type ProductInput = z.infer<typeof productInputSchema>;
export type Product = z.infer<typeof productSchema>;
export const productsSearchSchema = listSearchSchema.extend({
  status: z.enum(["all", ...productStatuses]).catch("all"),
  stock: z.enum(["all", "low", "out"]).catch("all"),
});
