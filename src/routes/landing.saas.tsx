import { createFileRoute } from "@tanstack/react-router";
import { SaasLandingPage } from "@/features/landing/pages/saas/SaasLandingPage";
export const Route = createFileRoute("/landing/saas")({
  component: SaasLandingPage,
});
