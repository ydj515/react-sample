import { createFileRoute } from "@tanstack/react-router";
import { CmsListPage } from "@/features/cms/pages/cms-list";
import { postsOptions } from "@/features/cms/queries";
import { cmsSearchSchema } from "@/features/cms/model";

export const Route = createFileRoute("/_dashboard/cms/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsOptions()),
  validateSearch: (search) => cmsSearchSchema.parse(search),
  component: CmsListPage,
});
