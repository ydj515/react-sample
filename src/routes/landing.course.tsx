import { createFileRoute } from "@tanstack/react-router";
import { CourseLandingPage } from "@/features/landing/pages/course/CourseLandingPage";
export const Route = createFileRoute("/landing/course")({
  component: CourseLandingPage,
});
