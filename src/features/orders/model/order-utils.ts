import { matchesSearch, paginate } from "@/shared/lib/list-search";
import { ordersSearchSchema, type ManagedOrder } from "./order-schema";
export function selectOrders(
  orders: ManagedOrder[],
  search: ReturnType<typeof ordersSearchSchema.parse>,
) {
  return paginate(
    orders
      .filter(
        (order) =>
          matchesSearch(search.q, order.id, order.customer, order.product) &&
          (search.status === "all" || order.status === search.status),
      )
      .sort((a, b) =>
        search.sort === "amount-desc"
          ? b.amount - a.amount
          : search.sort === "amount-asc"
            ? a.amount - b.amount
            : search.sort === "oldest"
              ? a.date.localeCompare(b.date)
              : b.date.localeCompare(a.date),
      ),
    search.page,
  );
}
