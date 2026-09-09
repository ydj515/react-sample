import { validateSearch } from "@/shared/lib/validate-search";
import { agencySearchSchema } from "@/features/landing/model";
import { createFileRoute } from "@tanstack/react-router";
import { AgencyLandingPage } from "@/features/landing/pages/agency";

export const Route = createFileRoute("/landing/agency")({
  validateSearch: validateSearch(agencySearchSchema),
  component: AgencyLandingPage,
});
