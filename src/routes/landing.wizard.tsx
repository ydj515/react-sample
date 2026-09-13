import { createFileRoute } from "@tanstack/react-router";
import { WizardLandingPage } from "@/features/landing/pages/wizard";

export const Route = createFileRoute("/landing/wizard")({
  component: WizardLandingPage,
});
