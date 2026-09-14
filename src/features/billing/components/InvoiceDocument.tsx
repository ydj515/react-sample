import { labels, money, totals } from "@/features/billing/model/billing";
import type { Invoice } from "@/features/billing/model/billing";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

export function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  const amount = totals(invoice.items, invoice.taxRate);

  return (
    <Card className="invoice-print min-w-0 overflow-hidden">
      <div className="grid gap-8 p-6 sm:gap-10 sm:p-10 lg:p-12">
        <header className="border-line flex flex-wrap items-start justify-between gap-5 border-b pb-8">
          <div className="grid min-w-0 gap-3">
            <p className="text-ink-subtle text-xs font-semibold tracking-widest">
              PROJECTHUB / INVOICE
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">청구서</h2>
            <p className="text-ink-subtle max-w-lg font-mono text-xs leading-6 break-all">
              {invoice.id}
            </p>
          </div>
          <Badge
            className="shrink-0 px-3 py-1"
            variant={
              invoice.status === "paid"
                ? "success"
                : invoice.status === "issued"
                  ? "info"
                  : invoice.status === "cancelled"
                    ? "danger"
                    : "neutral"
            }
          >
            {labels[invoice.status]}
          </Badge>
        </header>
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="grid content-start gap-3" aria-label="청구 대상">
            <h3 className="text-ink-subtle text-xs font-medium">청구 대상</h3>
            <p className="text-lg font-semibold break-words">
              {invoice.customer}
            </p>
          </section>
          <section
            className="grid content-start gap-3 sm:text-right"
            aria-label="납부 정보"
          >
            <h3 className="text-ink-subtle text-xs font-medium">납부 기한</h3>
            <p className="text-base font-medium tabular-nums">
              {invoice.dueDate}
            </p>
            <p className="text-ink-subtle text-xs">
              청구 통화 · KRW (대한민국 원)
            </p>
          </section>
        </div>
        <section className="grid min-w-0 gap-4" aria-label="청구 항목">
          <h3 className="font-semibold">
            청구 항목{" "}
            <span className="text-ink-subtle ml-1 text-sm font-normal">
              {invoice.items.length}건
            </span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">송장 라인 아이템</caption>
              <thead className="bg-surface-muted text-ink-subtle">
                <tr>
                  <th
                    scope="col"
                    className="rounded-l-lg px-3 py-3 font-medium sm:px-4"
                  >
                    설명
                  </th>
                  {["수량", "단가", "금액"].map((heading) => (
                    <th
                      scope="col"
                      key={heading}
                      className="px-3 py-3 text-right font-medium last:rounded-r-lg sm:px-4"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-line border-b">
                    <td className="min-w-24 px-3 py-5 leading-6 break-words sm:px-4">
                      {item.description}
                    </td>
                    <td className="px-3 py-5 text-right tabular-nums sm:px-4">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-5 text-right whitespace-nowrap tabular-nums sm:px-4">
                      {money(item.price)}
                    </td>
                    <td className="px-3 py-5 text-right font-medium whitespace-nowrap tabular-nums sm:px-4">
                      {money(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <dl className="bg-surface-muted grid w-full gap-4 rounded-xl p-5 sm:ml-auto sm:max-w-sm sm:p-6">
          <div className="flex items-center justify-between gap-6 text-sm">
            <dt className="text-ink-subtle">소계</dt>
            <dd className="font-medium tabular-nums">
              {money(amount.subtotal)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-6 text-sm">
            <dt className="text-ink-subtle">세금 ({invoice.taxRate}%)</dt>
            <dd className="font-medium tabular-nums">{money(amount.tax)}</dd>
          </div>
          <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <dt className="font-semibold">합계</dt>
            <dd className="text-2xl font-semibold tracking-tight tabular-nums">
              {money(amount.total)}
            </dd>
          </div>
        </dl>
        <footer className="border-line border-t pt-6">
          <p className="text-ink-subtle text-xs leading-6">
            데모 송장 · 법적 세금계산서가 아닙니다. 실제 결제나 이메일 발송은
            수행하지 않습니다.
          </p>
        </footer>
      </div>
    </Card>
  );
}
