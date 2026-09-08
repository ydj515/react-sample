import { z } from "zod";
import { listSearchSchema } from "@/shared/lib/list-search";

export const orderStatuses = ["완료", "배송중", "취소", "대기"] as const;
export const orderSchema = z.object({
  id: z.string(),
  customer: z.string(),
  product: z.string(),
  brand: z.string(),
  amount: z.number().nonnegative(),
  status: z.enum(orderStatuses),
  date: z.iso.date(),
  category: z.string(),
  cs: z.string(),
});
export type Order = z.infer<typeof orderSchema>;
export const orderTransitions: Record<Order["status"], Order["status"][]> = {
  대기: ["배송중", "취소"],
  배송중: ["완료"],
  완료: [],
  취소: [],
};
export const orderStatusInputSchema = z.object({
  status: z.enum(orderStatuses),
});
export const orderNoteInputSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "메모를 입력하세요.")
    .max(1000, "메모는 1,000자 이하로 입력하세요."),
});
export const orderShippingSchema = z.object({
  carrier: z.string().trim().min(1, "택배사를 입력하세요.").max(40),
  trackingNumber: z
    .string()
    .trim()
    .max(40)
    .regex(/^[A-Za-z0-9-]*$/, "운송장은 영문, 숫자, 하이픈만 입력하세요."),
});
export type OrderShipping = z.infer<typeof orderShippingSchema>;
export const managedOrderSchema = orderSchema.extend({
  email: z.email(),
  address: z.string(),
  paymentMethod: z.string(),
  customerId: z.string(),
  phone: z.string(),
  grade: z.string(),
  deliveryRequest: z.string(),
  carrier: z.string(),
  trackingNumber: z.string(),
  paidAt: z.iso.datetime(),
  approvalNumber: z.string(),
  discount: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  pointsUsed: z.number().nonnegative(),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      image: z.string(),
      color: z.string(),
      size: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    }),
  ),
  timeline: z.array(
    z.object({
      id: z.string(),
      status: z.enum(orderStatuses),
      text: z.string(),
      at: z.iso.datetime(),
    }),
  ),
  notes: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      author: z.string(),
      at: z.iso.datetime(),
    }),
  ),
});
export type ManagedOrder = z.infer<typeof managedOrderSchema>;
export const ordersSearchSchema = listSearchSchema.extend({
  status: z.enum(["all", ...orderStatuses]).catch("all"),
  sort: z
    .enum(["newest", "oldest", "amount-desc", "amount-asc"])
    .catch("newest"),
});
