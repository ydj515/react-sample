import { createFileRoute } from "@tanstack/react-router";
import { LandingIndexPage } from "@/features/landing/pages/landing-index";

export const Route = createFileRoute("/landing/")({
  component: LandingIndexPage,
});
