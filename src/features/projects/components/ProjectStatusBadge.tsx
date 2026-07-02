import type { ProjectStatus } from "@/features/projects/model/project-types";
import { Badge } from "@/shared/ui/badge";

const statusMeta: Record<
  ProjectStatus,
  { label: string; variant: "info" | "warning" | "success" }
> = {
  active: { label: "진행 중", variant: "info" },
  paused: { label: "일시 중지", variant: "warning" },
  completed: { label: "완료", variant: "success" },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const meta = statusMeta[status];

  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
