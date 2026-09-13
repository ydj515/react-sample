import { createFileRoute } from "@tanstack/react-router";
import { CmsEditorPage } from "@/features/cms/pages/cms-editor";

export const Route = createFileRoute("/_dashboard/cms/new")({
  component: CmsEditorPage,
});
