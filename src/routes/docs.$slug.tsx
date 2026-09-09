import { validateSearch } from "@/shared/lib/validate-search";
import { docsSearchSchema } from "@/features/docs/model/search";
import { createFileRoute } from "@tanstack/react-router";
import { DocsPage } from "@/features/docs/pages/DocsPage";

export const Route = createFileRoute("/docs/$slug")({
  validateSearch: validateSearch(docsSearchSchema),
  component: function DocumentRoute() {
    const { slug } = Route.useParams();
    return <DocsPage slug={slug} />;
  },
});
