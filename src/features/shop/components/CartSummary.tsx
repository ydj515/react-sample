import { shopMoney } from "../model/shop";
export function CartSummary({
  subtotal,
  shipping,
  total,
}: {
  subtotal: number;
  shipping: number;
  total: number;
}) {
  return (
    <dl className="space-y-4 text-sm">
      <div className="flex justify-between gap-3">
        <dt className="text-ink-muted">상품 금액</dt>
        <dd>{shopMoney(subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-ink-muted">배송비</dt>
        <dd>{shipping ? shopMoney(shipping) : "무료"}</dd>
      </div>
      <div className="border-line flex justify-between gap-3 border-t pt-4">
        <dt className="font-semibold">총 주문 금액</dt>
        <dd className="text-brand text-lg font-bold">{shopMoney(total)}</dd>
      </div>
    </dl>
  );
}
