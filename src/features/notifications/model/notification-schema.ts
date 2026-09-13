import { z } from "zod";

export const notificationCategories = [
  "order",
  "project",
  "user",
  "product",
  "system",
] as const;

export const notificationSeverities = ["info", "success", "warning"] as const;

export const notificationSchema = z.object({
  id: z.string(),
  category: z.enum(notificationCategories),
  severity: z.enum(notificationSeverities),
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(280),
  createdAt: z.iso.datetime(),
  read: z.boolean(),
  actor: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  link: z
    .object({
      to: z.string(),
      label: z.string(),
    })
    .nullable(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const notificationPageSchema = z.object({
  items: notificationSchema.array(),
  nextCursor: z.string().nullable(),
});

export type NotificationPage = z.infer<typeof notificationPageSchema>;

export const notificationUnreadSchema = z.object({
  count: z.number().int().nonnegative(),
  latestId: z.string().nullable(),
});

export type NotificationUnread = z.infer<typeof notificationUnreadSchema>;

export const notificationListSearchSchema = z.object({
  category: z.enum(["all", ...notificationCategories]).catch("all"),
  filter: z.enum(["all", "unread"]).catch("all"),
});

export type NotificationListSearch = z.infer<
  typeof notificationListSearchSchema
>;

export const notificationLabels: Record<
  (typeof notificationCategories)[number],
  string
> = {
  order: "주문",
  project: "프로젝트",
  user: "사용자",
  product: "상품",
  system: "시스템",
};

export function categoryLabel(
  category: (typeof notificationCategories)[number],
) {
  return notificationLabels[category];
}
