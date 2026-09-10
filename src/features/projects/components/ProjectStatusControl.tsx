import { useOptimistic, useRef, useState, useTransition } from "react";
import type {
  Project,
  ProjectStatus,
} from "@/features/projects/model/project-types";
import { useUpdateProjectStatusMutation } from "@/features/projects/queries/project-queries";
import { Select } from "@/shared/ui/select";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export function ProjectStatusControl({ project }: { project: Project }) {
  const [status, setOptimisticStatus] = useOptimistic(project.status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const mutation = useUpdateProjectStatusMutation(project.id);
  const change = (next: ProjectStatus) => {
    if (inFlight.current || next === project.status) return;
    inFlight.current = true;
    startTransition(async () => {
      setOptimisticStatus(next);
      setError(null);
      try {
        await mutation.mutateAsync(next);
      } catch {
        setError("상태를 변경하지 못했습니다. 다시 선택해 주세요.");
      } finally {
        inFlight.current = false;
      }
    });
  };
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3">
        <ProjectStatusBadge status={status} />
        <Select
          aria-label="프로젝트 상태 변경"
          value={status}
          disabled={pending}
          onChange={(event) => change(event.target.value as ProjectStatus)}
        >
          <option value="active">진행 중</option>
          <option value="paused">일시 중지</option>
          <option value="completed">완료</option>
        </Select>
      </div>
      {pending && (
        <p role="status" className="text-ink-subtle text-xs">
          상태 저장 중…
        </p>
      )}
      {error && (
        <p role="alert" className="text-negative text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
