import { createFileRoute } from "@tanstack/react-router";
import { BillingPage } from "@/features/billing/pages/billing";

export const Route = createFileRoute("/_dashboard/billing/$invoiceId")({
  component: BillingPage,
});
