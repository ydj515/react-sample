import { createFileRoute } from "@tanstack/react-router";
import { CourseLandingPage } from "@/features/landing/pages/course";

export const Route = createFileRoute("/landing/course")({
  component: CourseLandingPage,
});
