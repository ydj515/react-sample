import { createFileRoute } from "@tanstack/react-router";
import { EventLandingPage } from "@/features/landing/pages/event/EventLandingPage";

export const Route = createFileRoute("/landing/event")({
  component: EventLandingPage,
});
