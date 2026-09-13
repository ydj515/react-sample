import { createFileRoute } from "@tanstack/react-router";
import { CrmPage } from "@/features/crm/pages/crm";
import { crmOptions } from "@/features/crm/queries";
import { crmSearchSchema } from "@/features/crm/model";

export const Route = createFileRoute("/_dashboard/crm/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(crmOptions()),
  component: CrmPage,
  validateSearch: (search) => crmSearchSchema.parse(search),
});
