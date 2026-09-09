import { z } from "zod";

import { projectStatuses } from "@/features/projects/model";
import { projectSchema } from "@/features/projects/model";

const taskSchema = z
  .object({
    id: z.string().min(1),
    projectId: z.string().min(1),
    title: z.string().min(1),
    startDate: z.iso.date(),
    dueDate: z.iso.date(),
    completedAt: z.iso.date().nullable(),
    hours: z.number().nonnegative().finite(),
  })
  .refine(
    (task) =>
      task.startDate <= task.dueDate &&
      (task.completedAt === null || task.completedAt >= task.startDate),
    "Invalid task dates",
  );

export const dashboardSchema = z
  .object({
    asOf: z.iso.date(),
    projects: projectSchema.array(),
    tasks: taskSchema.array(),
  })
  .refine((data) => {
    const ids = new Set(data.projects.map((project) => project.id));
    return (
      ids.size === data.projects.length &&
      new Set(data.tasks.map((task) => task.id)).size === data.tasks.length &&
      data.tasks.every(
        (task) =>
          ids.has(task.projectId) &&
          (task.completedAt === null || task.completedAt <= data.asOf),
      )
    );
  }, "Invalid dashboard snapshot");

export type DashboardSnapshot = z.infer<typeof dashboardSchema>;
export type DashboardTask = DashboardSnapshot["tasks"][number];

export const dashboardSearchSchema = z.object({
  days: z.preprocess(
    (value) =>
      typeof value === "string" || typeof value === "number"
        ? Number(value)
        : undefined,
    z.union([z.literal(7), z.literal(30), z.literal(90)]).catch(30),
  ),
  owner: z
    .string()
    .refine((value) => value.trim().length > 0)
    .catch("all"),
  status: z.enum(["all", ...projectStatuses]).catch("all"),
  metric: z.enum(["completed", "hours"]).catch("completed"),
});

export type DashboardSearch = z.infer<typeof dashboardSearchSchema>;
