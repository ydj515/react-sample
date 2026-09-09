import { createFileRoute } from "@tanstack/react-router";
import { SaasLandingPage } from "@/features/landing/pages/saas";

export const Route = createFileRoute("/landing/saas")({
  component: SaasLandingPage,
});
