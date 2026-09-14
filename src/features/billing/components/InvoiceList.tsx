import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  FileText,
  ArrowUpRight,
  Wallet,
  CircleCheck,
} from "lucide-react";
import { labels, money, totals } from "@/features/billing/model/billing";
import type { Invoice } from "@/features/billing/model/billing";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const [query, setQuery] = useState("");

  const [status, setStatus] = useState("all");

  const filtered = invoices.filter(
    (invoice) =>
      (status === "all" || invoice.status === status) &&
      `${invoice.customer} ${invoice.id}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  const issued = invoices.filter((invoice) => invoice.status === "issued");

  const paid = invoices.filter((invoice) => invoice.status === "paid");

  function reset() {
    setQuery("");
    setStatus("all");
  }
  return (
    <div className="grid min-w-0 gap-6">
      <section aria-label="청구 현황" className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "전체 송장",
            value: `${invoices.length}건`,
            description: `초안 ${invoices.filter((invoice) => invoice.status === "draft").length}건 포함`,
            icon: FileText,
          },
          {
            label: "결제 대기",
            value: money(
              issued.reduce(
                (sum, invoice) =>
                  sum + totals(invoice.items, invoice.taxRate).total,
                0,
              ),
            ),
            description: `발행된 송장 ${issued.length}건`,
            icon: Wallet,
          },
          {
            label: "결제 완료",
            value: money(
              paid.reduce(
                (sum, invoice) =>
                  sum + totals(invoice.items, invoice.taxRate).total,
                0,
              ),
            ),
            description: `결제된 송장 ${paid.length}건`,
            icon: CircleCheck,
          },
        ].map(({ label, value, description, icon: Icon }) => (
          <Card
            key={label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-4 sm:grid-cols-1 sm:gap-4 sm:p-6"
          >
            <div className="text-ink-subtle flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium">{label}</h2>
              <Icon className="hidden size-4 sm:block" aria-hidden />
            </div>
            <p className="col-start-2 row-span-2 row-start-1 text-xl font-semibold tracking-tight break-all tabular-nums sm:col-auto sm:row-auto sm:text-2xl">
              {value}
            </p>
            <p className="text-ink-subtle text-xs">{description}</p>
          </Card>
        ))}
      </section>
      <Card className="min-w-0 overflow-hidden">
        <div className="border-line grid gap-5 border-b p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">송장 목록</h2>
            <p role="status" className="text-ink-subtle text-sm">
              전체 {invoices.length}건 중 {filtered.length}건
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="grid flex-1 gap-2 text-xs font-medium">
              송장 검색
              <div className="relative">
                <Search
                  className="text-ink-subtle pointer-events-none absolute top-3 left-3 size-4"
                  aria-hidden
                />
                <Input
                  type="search"
                  aria-label="송장 검색"
                  placeholder="고객명 또는 송장 번호 검색"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full pl-9"
                />
              </div>
            </label>
            <label className="grid gap-2 text-xs font-medium sm:w-40">
              상태 필터
              <Select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="all">전체 상태</option>
                {Object.entries(labels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </label>
            {(query || status !== "all") && (
              <Button variant="ghost" className="shrink-0" onClick={reset}>
                필터 초기화
              </Button>
            )}
          </div>
        </div>
        {filtered.length ? (
          <>
            <ul className="divide-line divide-y md:hidden">
              {filtered.map((invoice) => (
                <li key={invoice.id} className="grid gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to="/billing/$invoiceId"
                      params={{ invoiceId: invoice.id }}
                      className="focus-visible:outline-brand grid min-w-0 gap-2 rounded focus-visible:outline-2"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {invoice.customer}
                        <ArrowUpRight
                          className="size-3.5 shrink-0"
                          aria-hidden
                        />
                      </span>
                      <span className="text-ink-subtle font-mono text-xs break-all">
                        {invoice.id}
                      </span>
                    </Link>
                    <Badge
                      className="shrink-0"
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
                  </div>
                  <dl className="flex flex-wrap items-end justify-between gap-4">
                    <div className="grid gap-1">
                      <dt className="text-ink-subtle text-xs">납부 기한</dt>
                      <dd className="text-sm tabular-nums">
                        {invoice.dueDate}
                      </dd>
                    </div>
                    <div className="grid gap-1 text-right">
                      <dt className="text-ink-subtle text-xs">청구 금액</dt>
                      <dd className="font-semibold tabular-nums">
                        {money(totals(invoice.items, invoice.taxRate).total)}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">송장 목록</caption>
                <thead className="bg-surface-muted text-ink-subtle">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                      고객 / 송장 번호
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-medium whitespace-nowrap"
                    >
                      납부 기한
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      상태
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-right font-medium sm:px-6"
                    >
                      청구 금액
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-line hover:bg-surface-muted/50 border-t transition-colors"
                    >
                      <td className="min-w-48 px-5 py-5 sm:px-6">
                        <Link
                          to="/billing/$invoiceId"
                          params={{ invoiceId: invoice.id }}
                          className="focus-visible:outline-brand group grid gap-2 rounded focus-visible:outline-2"
                        >
                          <span className="group-hover:text-brand flex items-center gap-2 font-semibold">
                            {invoice.customer}
                            <ArrowUpRight
                              className="text-ink-subtle size-3.5 shrink-0"
                              aria-hidden
                            />
                          </span>
                          <span className="text-ink-subtle max-w-64 font-mono text-xs leading-5 break-all">
                            {invoice.id}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap tabular-nums">
                        {invoice.dueDate}
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap">
                        <Badge
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
                      </td>
                      <td className="px-5 py-5 text-right font-semibold whitespace-nowrap tabular-nums sm:px-6">
                        {money(totals(invoice.items, invoice.taxRate).total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="grid justify-items-center gap-3 px-6 py-14 text-center">
            <FileText className="text-ink-subtle mb-1 size-8" aria-hidden />
            <h3 className="font-semibold">
              {invoices.length
                ? "조건에 맞는 송장이 없습니다."
                : "아직 송장이 없습니다."}
            </h3>
            <p className="text-ink-subtle text-sm">
              {invoices.length
                ? "검색어나 상태를 변경해 다시 확인하세요."
                : "상단의 새 송장 버튼으로 첫 청구서를 작성하세요."}
            </p>
            {invoices.length > 0 && (
              <Button variant="secondary" onClick={reset}>
                검색 조건 지우기
              </Button>
            )}
          </div>
        )}
        <div className="border-line text-ink-subtle border-t px-5 py-4 text-xs leading-5 sm:px-6">
          금액은 세금 포함 KRW 기준입니다. 이 브라우저에 저장된 데모 송장만
          표시됩니다.
        </div>
      </Card>
    </div>
  );
}
