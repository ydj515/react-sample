import { createFileRoute } from "@tanstack/react-router";
import { AgencyLandingPage } from "@/features/landing/pages/agency/AgencyLandingPage";

export const Route = createFileRoute("/landing/agency")({
  component: AgencyLandingPage,
});
