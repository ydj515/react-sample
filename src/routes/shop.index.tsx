import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/features/shop/pages/ShopPage";
import { shopSearchSchema } from "@/features/shop/model/shop";

export const Route = createFileRoute("/shop/")({
  component: ShopPage,
  validateSearch: shopSearchSchema,
});
