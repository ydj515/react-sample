import { useState } from "react";
import { ArrowLeft, Printer, Pencil, Send, Check, X } from "lucide-react";
import { InvoiceDocument } from "@/features/billing/components/InvoiceDocument";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import {
  initialInvoices,
  invoicesSchema,
  nextStatuses,
  transition,
} from "@/features/billing/model/billing";
import type { Invoice } from "@/features/billing/model/billing";
import { InvoiceForm } from "@/features/billing/components/InvoiceForm";
import { PageHeader } from "@/shared/ui/page-header";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { InvoiceList } from "@/features/billing/components/InvoiceList";
import { useLocalRecords } from "@/shared/lib/use-local-records";
import "./billing.css";

export function BillingPage() {
  const store = useLocalRecords(
    "react-sample-billing-v1",
    invoicesSchema,
    initialInvoices,
  );

  const invoices = store.data;

  const [editing, setEditing] = useState(false);

  const { invoiceId } = useParams({ strict: false });

  const navigate = useNavigate();

  const invoice = invoices.find((item) => item.id === invoiceId);

  function persist(next: Invoice[]) {
    return store.save(next);
  }
  return (
    <section className="billing-page grid gap-6">
      <div className="billing-controls grid gap-5">
        {invoiceId && (
          <Link
            to="/billing"
            className="text-ink-subtle hover:text-brand focus-visible:outline-brand inline-flex w-fit items-center gap-2 rounded py-1 text-sm focus-visible:outline-2"
          >
            <ArrowLeft className="size-4" aria-hidden />
            송장 목록으로
          </Link>
        )}
        <PageHeader
          title={invoiceId ? "송장 상세" : "인보이스 / 빌링"}
          description={
            invoice
              ? `${invoice.customer}에 청구할 내역과 진행 상태를 확인하세요.`
              : "송장을 작성하고 청구 내역과 결제 상태를 관리하세요."
          }
          metadataTitle={invoice ? `${invoice.customer} 송장` : undefined}
          metadataDescription={
            invoice
              ? `${invoice.customer}에 청구할 송장 상세와 진행 상태입니다.`
              : undefined
          }
          actions={
            !invoiceId && !editing ? (
              <Button disabled={store.blocked} onClick={() => setEditing(true)}>
                새 송장
              </Button>
            ) : undefined
          }
        />
        {invoice && !editing && (
          <div
            role="group"
            aria-label="송장 작업"
            className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap sm:justify-end"
          >
            <Button
              size="md"
              variant="secondary"
              className="min-w-0 whitespace-nowrap sm:min-w-32"
              disabled={invoice.status !== "draft"}
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-4 shrink-0" aria-hidden />
              초안 수정
            </Button>
            <Button
              size="md"
              variant="secondary"
              className="min-w-0 whitespace-nowrap sm:min-w-32"
              onClick={() => window.print()}
            >
              <Printer className="size-4 shrink-0" aria-hidden />
              송장 인쇄
            </Button>
            {nextStatuses[invoice.status].includes("cancelled") && (
              <Button
                size="md"
                variant="danger"
                className="min-w-0 whitespace-nowrap sm:min-w-32"
                onClick={() =>
                  persist(
                    invoices.map((item) =>
                      item.id === invoice.id
                        ? {
                            ...item,
                            status: transition(item.status, "cancelled"),
                          }
                        : item,
                    ),
                  )
                }
              >
                <X className="size-4 shrink-0" aria-hidden />
                송장 취소
              </Button>
            )}
            {nextStatuses[invoice.status]
              .filter((status) => status !== "cancelled")
              .map((status) => (
                <Button
                  key={status}
                  size="md"
                  className="min-w-0 whitespace-nowrap sm:min-w-32"
                  onClick={() =>
                    persist(
                      invoices.map((item) =>
                        item.id === invoice.id
                          ? { ...item, status: transition(item.status, status) }
                          : item,
                      ),
                    )
                  }
                >
                  {status === "issued" ? (
                    <Send className="size-4 shrink-0" aria-hidden />
                  ) : (
                    <Check className="size-4 shrink-0" aria-hidden />
                  )}
                  {status === "issued" ? "송장 발행" : "결제 완료 처리"}
                </Button>
              ))}
          </div>
        )}
      </div>
      {store.error && <p role="alert">{store.error}</p>}
      {editing && (!invoice || invoice.status === "draft") ? (
        <Card className="p-5">
          <InvoiceForm
            invoice={invoice}
            onCancel={() => setEditing(false)}
            onSave={(value) => {
              const saved: Invoice = {
                ...value,
                id: invoice?.id ?? `INV-${crypto.randomUUID()}`,
                status: "draft",
              };
              if (
                persist(
                  invoice
                    ? invoices.map((item) =>
                        item.id === invoice.id ? saved : item,
                      )
                    : [...invoices, saved],
                )
              ) {
                setEditing(false);
                void navigate({
                  to: "/billing/$invoiceId",
                  params: { invoiceId: saved.id },
                });
              }
            }}
          />
        </Card>
      ) : invoiceId ? (
        invoice ? (
          <InvoiceDocument invoice={invoice} />
        ) : (
          <p>
            송장을 찾을 수 없습니다.{" "}
            <Link to="/billing" className="text-brand underline">
              송장 목록
            </Link>
          </p>
        )
      ) : (
        <InvoiceList invoices={invoices} />
      )}
    </section>
  );
}
