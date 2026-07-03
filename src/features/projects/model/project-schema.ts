import { z } from "zod";

import { projectStatuses } from "@/features/projects/model/project-types";

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "프로젝트 이름은 2자 이상이어야 합니다."),
  owner: z.string().trim().min(1, "담당자를 입력해주세요."),
  status: z.enum(projectStatuses),
  dueDate: z.iso.date("마감일을 YYYY-MM-DD 형식으로 입력해주세요."),
  description: z.string().trim().min(1, "설명을 입력해주세요.").max(120),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
