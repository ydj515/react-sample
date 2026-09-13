import { createFileRoute } from "@tanstack/react-router";
import { CmsDetailPage } from "@/features/cms/pages/cms-detail";
import { postOptions } from "@/features/cms/queries";

export const Route = createFileRoute("/_dashboard/cms/$postId/")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(postOptions(params.postId)),
  component: CmsDetailPage,
});
