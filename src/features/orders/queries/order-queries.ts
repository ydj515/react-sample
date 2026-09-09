import type {
  ManagedOrder,
  Order,
  OrderShipping,
} from "@/features/orders/model/order-schema";
import { commerceKeys } from "@/features/dashboard/queries";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getOrders,
  getOrder,
  updateOrderStatus,
  addOrderNote,
  updateOrderShipping,
} from "@/features/orders/api/order-api";

export const orderKeys = {
  all: ["orders"] as const,
  list: ["orders", "list"] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};
export const ordersQueryOptions = () =>
  queryOptions({ queryKey: orderKeys.list, queryFn: getOrders });
export const orderQueryOptions = (id: string) =>
  queryOptions({ queryKey: orderKeys.detail(id), queryFn: () => getOrder(id) });

function useOrderSaved(onSaved: () => void) {
  const client = useQueryClient();
  return async (order: ManagedOrder) => {
    client.setQueryData(orderKeys.detail(order.id), order);
    await Promise.all([
      client.invalidateQueries({ queryKey: orderKeys.all }),
      client.invalidateQueries({ queryKey: commerceKeys.all }),
    ]);
    onSaved();
  };
}
export function useUpdateOrderStatusMutation(
  orderId: string,
  onSaved: () => void,
) {
  const saved = useOrderSaved(onSaved);
  return useMutation({
    mutationFn: (status: Order["status"]) => updateOrderStatus(orderId, status),
    onSuccess: saved,
  });
}
export function useAddOrderNoteMutation(orderId: string, onSaved: () => void) {
  const saved = useOrderSaved(onSaved);
  return useMutation({
    mutationFn: (text: string) => addOrderNote(orderId, text),
    onSuccess: saved,
  });
}

export function useUpdateOrderShippingMutation(
  orderId: string,
  onSaved: () => void,
) {
  const saved = useOrderSaved(onSaved);
  return useMutation({
    mutationFn: (input: OrderShipping) => updateOrderShipping(orderId, input),
    onSuccess: saved,
  });
}
