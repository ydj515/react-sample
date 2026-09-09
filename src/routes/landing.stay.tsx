import { createFileRoute } from "@tanstack/react-router";
import { StayLandingPage } from "@/features/landing/pages/stay";

export const Route = createFileRoute("/landing/stay")({
  component: StayLandingPage,
});
