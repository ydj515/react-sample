import { createFileRoute } from "@tanstack/react-router";
import { ShopLayout } from "@/features/shop/components/ShopLayout";
export const Route = createFileRoute("/shop")({ component: ShopLayout });
