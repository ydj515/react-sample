import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/features/shop/pages/CartPage";

export const Route = createFileRoute("/shop/cart")({ component: CartPage });
