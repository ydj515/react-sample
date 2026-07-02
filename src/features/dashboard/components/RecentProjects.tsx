import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import type { Project } from "@/features/projects/model/project-types";
import { Card } from "@/shared/ui/card";

export function RecentProjects({ projects }: { projects: Project[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-base font-semibold">최근 프로젝트</h2>
      <div className="mt-4 grid gap-3">
        {projects.slice(0, 3).map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-4 rounded-md border border-slate-100 p-3"
          >
            <div>
              <p className="font-medium text-slate-950">{project.name}</p>
              <p className="text-sm text-slate-500">{project.owner}</p>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        ))}
      </div>
    </Card>
  );
}
