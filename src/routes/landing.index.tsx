import { createFileRoute } from "@tanstack/react-router";
import { LandingIndexPage } from "@/features/landing/pages/LandingIndexPage";

export const Route = createFileRoute("/landing/")({
  component: LandingIndexPage,
});
