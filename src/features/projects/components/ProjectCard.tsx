import { Link } from "@tanstack/react-router";

import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import type { Project } from "@/features/projects/model/project-types";
import { formatDate } from "@/shared/lib/format-date";
import { Card } from "@/shared/ui/card";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            className="text-base font-semibold text-slate-950 hover:underline"
          >
            {project.name}
          </Link>
          <p className="mt-1 text-sm text-slate-500">{project.description}</p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">담당자</dt>
          <dd className="font-medium text-slate-900">{project.owner}</dd>
        </div>
        <div>
          <dt className="text-slate-500">마감일</dt>
          <dd className="font-medium text-slate-900">
            {formatDate(project.dueDate)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
