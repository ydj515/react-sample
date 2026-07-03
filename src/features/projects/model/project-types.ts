import type { CreateProjectFormValues } from "@/features/projects/model/project-schema";

export const projectStatuses = ["active", "paused", "completed"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export type Project = {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  dueDate: string;
  description: string;
  updatedAt: string;
};

export type CreateProjectInput = CreateProjectFormValues;

export type ProjectFilters = {
  search: string;
  status: ProjectStatus | "all";
};

export type ProjectSortKey = "name" | "dueDate" | "updatedAt";
