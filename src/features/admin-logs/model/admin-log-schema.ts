import { z } from "zod";

export const adminLogSeverities = ["info", "warning", "error"] as const;

export const adminLogSeveritiesLabels: Record<
  (typeof adminLogSeverities)[number],
  string
> = {
  info: "정보",
  warning: "주의",
  error: "오류",
};

export const adminLogChannels = [
  "auth",
  "orders",
  "products",
  "users",
  "system",
] as const;

export const adminLogChannelsLabels: Record<
  (typeof adminLogChannels)[number],
  string
> = {
  auth: "인증",
  orders: "주문",
  products: "상품",
  users: "사용자",
  system: "시스템",
};

export const adminLogActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  tone: z.enum(["primary", "secondary", "danger", "ghost"]).optional(),
});

export type AdminLogAction = z.infer<typeof adminLogActionSchema>;

export const adminLogSchema = z.object({
  id: z.string(),
  occurredAt: z.iso.datetime(),
  channel: z.enum(adminLogChannels),
  severity: z.enum(adminLogSeverities),
  actor: z.string(),
  message: z.string(),
  resource: z.string(),
  actions: z.array(adminLogActionSchema).default([]),
});

export type AdminLog = z.infer<typeof adminLogSchema>;

export const adminLogsQuerySchema = z.object({
  channel: z.enum(["all", ...adminLogChannels]).catch("all"),
  severity: z.enum(["all", ...adminLogSeverities]).catch("all"),
});

export type AdminLogsQuery = z.infer<typeof adminLogsQuerySchema>;
