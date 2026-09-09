import { validateSearch } from "@/shared/lib/validate-search";
import { agencySearchSchema } from "@/features/landing/model/search";
import { createFileRoute } from "@tanstack/react-router";
import { AgencyLandingPage } from "@/features/landing/pages/agency/AgencyLandingPage";

export const Route = createFileRoute("/landing/agency")({
  validateSearch: validateSearch(agencySearchSchema),
  component: AgencyLandingPage,
});
