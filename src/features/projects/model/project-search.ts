import { z } from "zod";
import { projectStatuses } from "./project-types";

export const projectSearchSchema = z.object({
  q: z.string().catch(""),
  status: z.enum(["all", ...projectStatuses]).catch("all"),
  sort: z.enum(["name", "dueDate", "updatedAt"]).catch("dueDate"),
  page: z.coerce.number().int().min(1).max(10000).catch(1),
});
