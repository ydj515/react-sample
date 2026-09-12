import type { ManagedOrder } from "@/features/orders/model/order-schema";
import { Card } from "@/shared/ui/card";
import { money } from "./order-detail-format";

export function OrderPayment({ order }: { order: ManagedOrder }) {
  return (
    <Card className="p-5">
      <h2 className="font-semibold">결제 정보</h2>
      <dl className="mt-5 grid gap-3 text-sm">
        {[
          [
            "상품 금액",
            money(
              order.items.reduce(
                (sum, item) => sum + item.unitPrice * item.quantity,
                0,
              ),
            ),
          ],
          ["할인 금액", `−${money(order.discount)}`],
          ["배송비", money(order.shippingFee)],
          ["포인트 사용", `−${money(order.pointsUsed)}`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-ink-subtle">{label}</dt>
            <dd className="tabular-nums">{value}</dd>
          </div>
        ))}
        <div className="border-line mt-1 flex items-center justify-between gap-3 border-t pt-4">
          <dt className="font-semibold">최종 결제 금액</dt>
          <dd className="text-brand text-xl font-bold tabular-nums">
            {money(order.amount)}
          </dd>
        </div>
      </dl>
      <dl className="border-line mt-5 grid gap-3 border-t pt-4 text-xs">
        {[
          ["결제 수단", order.paymentMethod],
          ["결제 일시", new Date(order.paidAt).toLocaleString("ko-KR")],
          ["승인 번호", order.approvalNumber],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-ink-subtle shrink-0">{label}</dt>
            <dd className="text-right break-all">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
