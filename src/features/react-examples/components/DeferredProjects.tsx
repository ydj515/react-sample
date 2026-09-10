import { use } from "react";
import type { Project } from "@/features/projects/model";

export function DeferredProjects({
  visible,
  projectsPromise,
}: {
  visible: boolean;
  projectsPromise: Promise<Project[]>;
}) {
  if (!visible)
    return (
      <p className="text-ink-subtle text-sm">
        버튼을 누르면 준비 중인 프로젝트 데이터를 표시합니다.
      </p>
    );
  const projects = use(projectsPromise);
  return (
    <ul className="grid gap-3" aria-label="지연 로딩 프로젝트">
      {projects.map((project) => (
        <li key={project.id} className="border-line rounded-control border p-3">
          <strong>{project.name}</strong>
          <p className="text-ink-subtle text-sm">{project.description}</p>
        </li>
      ))}
    </ul>
  );
}
