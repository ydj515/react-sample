import { useMutation } from "@tanstack/react-query";
import { createShopOrder } from "@/features/shop/api/shop-api";

export function useShopOrderMutation() {
  return useMutation({ mutationFn: createShopOrder, retry: false });
}
