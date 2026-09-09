import { z } from "zod";
import {
  productCategories,
  type Product,
} from "@/features/products/model/product-schema";
import { matchesSearch, paginate } from "@/shared/lib/list-search";

export const shopSearchSchema = z.object({
  q: z.string().catch(""),
  category: z.enum(["all", ...productCategories]).catch("all"),
  brand: z.string().catch("all"),
  price: z.enum(["all", "under100", "100to200", "over200"]).catch("all"),
  sort: z
    .enum(["popular", "newest", "price-asc", "price-desc"])
    .catch("popular"),
  inStock: z.boolean().catch(false),
  favorites: z.boolean().catch(false),
  page: z.coerce.number().int().min(1).max(10000).catch(1),
});
export type ShopSearch = z.infer<typeof shopSearchSchema>;
export function selectShopProducts(
  products: Product[],
  search: ShopSearch,
  favorites: string[],
) {
  return paginate(
    products
      .filter(
        (p) =>
          p.status === "active" &&
          matchesSearch(search.q, p.name, p.brand, ...p.tags) &&
          (search.category === "all" || p.category === search.category) &&
          (search.brand === "all" || p.brand === search.brand) &&
          (!search.inStock || p.stock > 0) &&
          (!search.favorites || favorites.includes(p.id)) &&
          (search.price === "all" ||
            (search.price === "under100"
              ? p.price < 100000
              : search.price === "100to200"
                ? p.price >= 100000 && p.price < 200000
                : p.price >= 200000)),
      )
      .sort((a, b) =>
        search.sort === "price-asc"
          ? a.price - b.price
          : search.sort === "price-desc"
            ? b.price - a.price
            : search.sort === "newest"
              ? b.createdAt.localeCompare(a.createdAt)
              : b.sales.reduce((n, s) => n + s.quantity, 0) -
                a.sales.reduce((n, s) => n + s.quantity, 0),
      ),
    search.page,
  );
}
export const cartEntrySchema = z.object({
  productId: z.string().min(1),
  color: z.string().max(30),
  size: z.string().max(20),
  quantity: z.number().int().min(1).max(99),
});
export type CartEntry = z.infer<typeof cartEntrySchema>;
export function cartKey(
  entry: Pick<CartEntry, "productId" | "color" | "size">,
) {
  return JSON.stringify([entry.productId, entry.color, entry.size]);
}
export const recipientSchema = z.object({
  name: z.string().trim().min(2, "받는 분 이름을 2자 이상 입력하세요.").max(40),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+() -]{7,20}$/, "연락처를 확인하세요."),
  address: z.string().trim().min(5, "주소를 5자 이상 입력하세요.").max(200),
});
export type Recipient = z.infer<typeof recipientSchema>;
export const checkoutSchema = z.object({
  expectedTotal: z.number().int().nonnegative(),
  recipient: recipientSchema,
  items: z
    .array(cartEntrySchema)
    .min(1)
    .max(50)
    .refine(
      (items) => new Set(items.map(cartKey)).size === items.length,
      "중복 상품 옵션입니다.",
    ),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export const receiptSchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime(),
  subtotal: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  total: z.number().nonnegative(),
  items: z.array(
    cartEntrySchema.extend({
      name: z.string(),
      unitPrice: z.number().nonnegative(),
    }),
  ),
});
export type Receipt = z.infer<typeof receiptSchema>;
export function availableStock(product: Product, color: string, size: string) {
  if (product.status !== "active") return 0;
  const option = product.variants.find(
    (v) => v.color === color && v.size === size,
  );
  return product.variants.length
    ? Math.min(product.stock, option?.stock ?? 0)
    : color === "" && size === ""
      ? product.stock
      : 0;
}
export function resolveCart(entries: CartEntry[], products: Product[]) {
  const lines = entries.map((entry) => {
    const product = products.find((p) => p.id === entry.productId);
    const available = product
      ? Math.min(99, availableStock(product, entry.color, entry.size))
      : 0;
    const totalQuantity = entries
      .filter((line) => line.productId === entry.productId)
      .reduce((n, line) => n + line.quantity, 0);
    const error =
      !product || product.status !== "active"
        ? "판매하지 않는 상품입니다."
        : !available
          ? "선택한 옵션이 품절되었거나 변경되었습니다."
          : entry.quantity > available || totalQuantity > product.stock
            ? "현재 재고보다 수량이 많습니다."
            : undefined;
    return {
      key: cartKey(entry),
      entry,
      product,
      available,
      error,
      amount: (product?.price ?? 0) * entry.quantity,
    };
  });
  const subtotal = lines.reduce((n, line) => n + line.amount, 0);
  const shipping = entries.length === 0 || subtotal >= 100000 ? 0 : 3000;
  return {
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    valid:
      entries.length > 0 &&
      new Set(entries.map(cartKey)).size === entries.length &&
      entries.every((entry) => cartEntrySchema.safeParse(entry).success) &&
      lines.every((line) => !line.error),
  };
}
export function shopMoney(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}
