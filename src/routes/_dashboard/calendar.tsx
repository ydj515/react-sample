import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/features/calendar/pages/calendar";

export const Route = createFileRoute("/_dashboard/calendar")({
  component: CalendarPage,
});
