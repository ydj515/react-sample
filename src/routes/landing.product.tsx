import { createFileRoute } from "@tanstack/react-router";
import { ProductLandingPage } from "@/features/landing/pages/product/ProductLandingPage";
export const Route = createFileRoute("/landing/product")({
  component: ProductLandingPage,
});
