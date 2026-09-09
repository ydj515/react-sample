import { docsSearchSchema } from "@/features/docs/model/search";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/docs/$slug",
      params: { slug: "getting-started" },
      search: docsSearchSchema.parse(location.search),
      replace: true,
    });
  },
});
