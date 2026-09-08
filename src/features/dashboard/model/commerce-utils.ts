import { z } from "zod";
import { orderStatuses, type Order } from "./commerce-schema";

const optionalDate = z.union([z.literal(""), z.iso.date()]);
const amountInput = z
  .string()
  .refine(
    (value) =>
      value === "" ||
      (/^\d+(\.\d+)?$/.test(value) && Number.isFinite(Number(value))),
    "0 이상의 금액을 입력하세요.",
  );
export const orderFiltersSchema = z
  .object({
    keyword: z.string(),
    status: z.enum(["all", ...orderStatuses]),
    from: optionalDate,
    to: optionalDate,
    min: amountInput,
    max: amountInput,
    category: z.string(),
    brands: z.array(z.string()),
    cs: z.string(),
  })
  .refine((value) => !value.from || !value.to || value.from <= value.to, {
    message: "종료일은 시작일 이후여야 합니다.",
    path: ["to"],
  })
  .refine(
    (value) =>
      value.min === "" ||
      value.max === "" ||
      Number(value.min) <= Number(value.max),
    { message: "최대 금액은 최소 금액 이상이어야 합니다.", path: ["max"] },
  );
export type OrderFilters = z.infer<typeof orderFiltersSchema>;
export type OrderSort = "newest" | "oldest" | "amount-desc" | "amount-asc";
export const defaultOrderFilters: OrderFilters = {
  keyword: "",
  status: "all",
  from: "",
  to: "",
  min: "",
  max: "",
  category: "",
  brands: [],
  cs: "",
};
export function filterOrders(
  orders: Order[],
  filters: OrderFilters,
  sort: OrderSort,
) {
  const keyword = filters.keyword.trim().toLocaleLowerCase("ko-KR");
  return orders
    .filter(
      (order) =>
        (!keyword ||
          [order.id, order.customer, order.product, order.brand].some((value) =>
            value.toLocaleLowerCase("ko-KR").includes(keyword),
          )) &&
        (filters.status === "all" || order.status === filters.status) &&
        (!filters.from || order.date >= filters.from) &&
        (!filters.to || order.date <= filters.to) &&
        (filters.min === "" || order.amount >= Number(filters.min)) &&
        (filters.max === "" || order.amount <= Number(filters.max)) &&
        (!filters.category || order.category === filters.category) &&
        (!filters.brands.length || filters.brands.includes(order.brand)) &&
        (!filters.cs || order.cs === filters.cs),
    )
    .sort((a, b) => {
      if (sort === "amount-desc") return b.amount - a.amount;
      if (sort === "amount-asc") return a.amount - b.amount;
      return sort === "oldest"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date);
    });
}
export function formatWon(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}
export function createCsv(rows: (string | number)[][]) {
  return (
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((value) => {
            const text = String(value);
            const safe = /^[\s]*[=+\-@\t\r\n]/.test(text) ? `'${text}` : text;
            return `"${safe.replaceAll('"', '""')}"`;
          })
          .join(","),
      )
      .join("\r\n")
  );
}
export function ordersCsv(orders: Order[]) {
  return createCsv([
    [
      "주문번호",
      "고객",
      "상품",
      "브랜드",
      "금액(원)",
      "상태",
      "주문일",
      "카테고리",
      "담당 CS",
    ],
    ...orders.map((order) => [
      order.id,
      order.customer,
      order.product,
      order.brand,
      order.amount,
      order.status,
      order.date,
      order.category,
      order.cs,
    ]),
  ]);
}
