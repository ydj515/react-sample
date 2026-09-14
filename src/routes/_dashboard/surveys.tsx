import { createFileRoute } from "@tanstack/react-router";
import { SurveysPage } from "@/features/surveys/pages/surveys";

export const Route = createFileRoute("/_dashboard/surveys")({
  component: SurveysPage,
});
