import { useParams } from "@tanstack/react-router";

export function ProjectDetailPage() {
  const { projectId } = useParams({
    from: "/_dashboard/projects/$projectId",
  });

  return (
    <section className="grid gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">프로젝트 상세</h1>
      <p className="text-sm text-slate-500">{projectId}</p>
    </section>
  );
}
