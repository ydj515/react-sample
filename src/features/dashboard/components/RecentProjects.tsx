import { ProjectStatusBadge } from "@/features/projects/components";
import type { Project } from "@/features/projects/model";
import { Card } from "@/shared/ui/card";

export function RecentProjects({ projects }: { projects: Project[] }) {
  const recentProjects = [...projects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);

  return (
    <Card className="p-5">
      <h2 className="text-base font-semibold">최근 프로젝트</h2>
      <div className="mt-4 grid gap-3">
        {recentProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-control border-line flex items-center justify-between gap-4 border p-3"
          >
            <div>
              <p className="text-ink font-medium">{project.name}</p>
              <p className="text-ink-subtle text-sm">{project.owner}</p>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        ))}
      </div>
    </Card>
  );
}
