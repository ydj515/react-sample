import { useMutation } from "@tanstack/react-query";
import { createShopOrder } from "../api/shop-api";
export function useShopOrderMutation() {
  return useMutation({ mutationFn: createShopOrder, retry: false });
}
