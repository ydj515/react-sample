import { createFileRoute } from "@tanstack/react-router";
import { DocsPage } from "@/features/docs/pages/DocsPage";
export const Route = createFileRoute("/docs/$slug")({
  component: function DocumentRoute() {
    const { slug } = Route.useParams();
    return <DocsPage slug={slug} />;
  },
});
