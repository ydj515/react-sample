import { validateSearch } from "@/shared/lib/validate-search";
import { eventSearchSchema } from "@/features/landing/model";
import { createFileRoute } from "@tanstack/react-router";
import { EventLandingPage } from "@/features/landing/pages/event";

export const Route = createFileRoute("/landing/event")({
  validateSearch: validateSearch(eventSearchSchema),
  component: EventLandingPage,
});
