import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { projectsQueryOptions, projectKeys } from "@/features/projects/queries";
import { ReactExamplesPage } from "@/features/react-examples/pages/examples";

export const Route = createFileRoute("/_dashboard/react-19")({
  loader: ({ context }) => {
    const projectsPromise = context.queryClient.fetchQuery(
      projectsQueryOptions(),
    );
    // The panel may stay closed. Observe rejection without replacing the original Promise.
    void projectsPromise.catch(() => undefined);
    return { projectsPromise, requestId: crypto.randomUUID() };
  },
  component: function ExamplesRoute() {
    const data = Route.useLoaderData();
    const router = useRouter();
    const client = useQueryClient();
    const [refreshing, startTransition] = useTransition();
    return (
      <ReactExamplesPage
        {...data}
        refreshing={refreshing}
        onRefresh={() =>
          startTransition(async () => {
            await client.invalidateQueries({
              queryKey: projectKeys.lists(),
              refetchType: "none",
            });
            await router.invalidate();
          })
        }
      />
    );
  },
});
