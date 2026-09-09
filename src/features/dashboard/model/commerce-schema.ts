import { z } from "zod";

import { orderSchema } from "@/features/orders/model";

export { orderStatuses } from "@/features/orders/model";
export type { Order } from "@/features/orders/model";

export const commerceSchema = z.object({
  asOf: z.iso.date(),
  revenue: z.number().nonnegative(),
  newUsers: z.number().int().nonnegative(),
  conversionRate: z.number().nonnegative(),
  sessions: z.number().int().nonnegative(),
  monthly: z
    .array(z.object({ label: z.string(), amount: z.number().nonnegative() }))
    .min(2),
  traffic: z
    .array(
      z.object({
        date: z.iso.date(),
        visitors: z.number().nonnegative(),
        converted: z.number().nonnegative(),
      }),
    )
    .min(2),
  categories: z.array(
    z.object({ label: z.string(), amount: z.number().nonnegative() }),
  ),
  activities: z.array(
    z.object({
      text: z.string(),
      time: z.string(),
      tone: z.enum(["info", "success", "warning"]),
    }),
  ),
  orders: z.array(orderSchema),
});
export type CommerceDashboard = z.infer<typeof commerceSchema>;
