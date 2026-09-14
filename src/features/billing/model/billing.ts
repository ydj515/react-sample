import { z } from "zod";

export const invoiceInputSchema = z.object({
  customer: z.string().trim().min(1, "고객명을 입력하세요.").max(100),
  dueDate: z.iso.date(),
  taxRate: z.number().min(0).max(100),
  items: z
    .array(
      z.object({
        description: z.string().trim().min(1).max(200),
        quantity: z.number().int().min(1).max(10000),
        price: z.number().int().min(0).max(100000000),
      }),
    )
    .min(1)
    .max(100),
});

export const statusSchema = z.enum(["draft", "issued", "paid", "cancelled"]);

export const invoiceSchema = invoiceInputSchema.extend({
  id: z.string(),
  status: statusSchema,
});

export const invoicesSchema = z.array(invoiceSchema).max(100);

export type InvoiceInput = z.infer<typeof invoiceInputSchema>;

export type Invoice = z.infer<typeof invoiceSchema>;

export type InvoiceStatus = Invoice["status"];

export const labels: Record<InvoiceStatus, string> = {
  draft: "초안",
  issued: "발행됨",
  paid: "결제 완료",
  cancelled: "취소됨",
};

export const nextStatuses: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft: ["issued", "cancelled"],
  issued: ["paid", "cancelled"],
  paid: [],
  cancelled: [],
};

export function transition(
  from: InvoiceStatus,
  to: InvoiceStatus,
): InvoiceStatus {
  if (!nextStatuses[from].includes(to)) {
    throw new Error("Invalid invoice transition");
  }
  return to;
}

export function totals(items: InvoiceInput["items"], taxRate: number) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  const tax = Math.round((subtotal * taxRate) / 100);
  return { subtotal, tax, total: subtotal + tax };
}

export const money = (amount: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
    Number.isFinite(amount) ? amount : 0,
  );

export function initialInvoices(): Invoice[] {
  return [
    {
      id: "INV-DEMO-001",
      customer: "샘플 스튜디오",
      dueDate: "2026-09-30",
      taxRate: 10,
      items: [{ description: "웹사이트 디자인", quantity: 1, price: 500000 }],
      status: "draft",
    },
  ];
}
