import { z } from "zod";

export const kanbanColumnIds = [
  "backlog",
  "in_progress",
  "review",
  "done",
] as const;

export type KanbanColumnId = (typeof kanbanColumnIds)[number];

export const kanbanPriorities = ["low", "medium", "high", "urgent"] as const;

export type KanbanPriority = (typeof kanbanPriorities)[number];

export const kanbanColumnSchema = z.object({
  id: z.enum(kanbanColumnIds),
  title: z.string().min(1).max(40),
  accent: z.string(),
  description: z.string().min(1).max(120),
});

export type KanbanColumn = z.infer<typeof kanbanColumnSchema>;

export const kanbanCardSchema = z.object({
  id: z.string(),
  columnId: z.enum(kanbanColumnIds),
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(280),
  priority: z.enum(kanbanPriorities),
  assignee: z.object({
    id: z.string(),
    name: z.string(),
    initials: z.string().min(1).max(2),
  }),
  tags: z.array(z.string().min(1).max(20)).max(4),
  dueDate: z.iso.date().nullable(),
  order: z.number().int().nonnegative(),
});

export type KanbanCard = z.infer<typeof kanbanCardSchema>;

export const kanbanBoardSchema = z.object({
  columns: kanbanColumnSchema.array(),
  cards: kanbanCardSchema.array(),
});

export type KanbanBoard = z.infer<typeof kanbanBoardSchema>;

export const kanbanMoveInputSchema = z.object({
  cardId: z.string(),
  toColumnId: z.enum(kanbanColumnIds),
  toIndex: z.number().int().nonnegative(),
});

export type KanbanMoveInput = z.infer<typeof kanbanMoveInputSchema>;

export const kanbanSearchSchema = z.object({
  q: z.string().catch(""),
  priority: z.enum(["all", ...kanbanPriorities]).catch("all"),
  assignee: z.string().catch("all"),
  column: z.enum(["all", ...kanbanColumnIds]).catch("all"),
});

export type KanbanSearch = z.infer<typeof kanbanSearchSchema>;

export const kanbanColumnLabels: Record<KanbanColumnId, string> = {
  backlog: "백로그",
  in_progress: "진행 중",
  review: "리뷰",
  done: "완료",
};

export const kanbanPriorityLabels: Record<KanbanPriority, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  urgent: "긴급",
};

export const kanbanPriorityAccents: Record<KanbanPriority, string> = {
  low: "bg-surface-muted text-ink-muted",
  medium: "bg-info-soft text-info",
  high: "bg-caution-soft text-caution",
  urgent: "bg-negative-soft text-negative",
};
