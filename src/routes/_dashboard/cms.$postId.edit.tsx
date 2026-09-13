import { createFileRoute } from "@tanstack/react-router";
import { CmsEditorPage } from "@/features/cms/pages/cms-editor";
import { postOptions } from "@/features/cms/queries";

export const Route = createFileRoute("/_dashboard/cms/$postId/edit")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(postOptions(params.postId)),
  component: CmsEditorPage,
});
