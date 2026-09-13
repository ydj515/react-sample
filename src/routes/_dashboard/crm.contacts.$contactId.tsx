import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/features/crm/pages/contact";
import { crmOptions } from "@/features/crm/queries";

export const Route = createFileRoute("/_dashboard/crm/contacts/$contactId")({
  loader: ({ context }) => context.queryClient.ensureQueryData(crmOptions()),
  component: ContactPage,
});
