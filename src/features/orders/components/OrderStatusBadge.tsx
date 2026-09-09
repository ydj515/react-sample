import { Badge } from "@/shared/ui/badge";
import type { Order } from "@/features/orders/model/order-schema";

const variants = {
  완료: "success",
  배송중: "warning",
  취소: "danger",
  대기: "neutral",
} as const;
export function OrderStatusBadge({ status }: { status: Order["status"] }) {
  return (
    <Badge className="whitespace-nowrap" variant={variants[status]}>
      {status}
    </Badge>
  );
}
