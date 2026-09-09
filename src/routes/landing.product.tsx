import { createFileRoute } from "@tanstack/react-router";
import { ProductLandingPage } from "@/features/landing/pages/product";

export const Route = createFileRoute("/landing/product")({
  component: ProductLandingPage,
});
