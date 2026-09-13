import { createFileRoute } from "@tanstack/react-router";
import { MediaPage } from "@/features/media/pages/media";
import { libraryOptions } from "@/features/media/queries";
import { mediaSearchSchema } from "@/features/media/model";

export const Route = createFileRoute("/_dashboard/files/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(libraryOptions()),
  validateSearch: (search) => mediaSearchSchema.parse(search),
  component: MediaPage,
});
